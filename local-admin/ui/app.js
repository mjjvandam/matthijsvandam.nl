/* Local editor: all content changes go through versioned, authenticated API calls. */
(() => {
  'use strict';
  const main = document.getElementById('main');
  const banner = document.getElementById('message');
  const dialog = document.getElementById('action-dialog');
  const state = { csrf: '', route: 'overzicht', articles: [], dashboard: null, article: null, draft: null, saved: '', dirty: false, busy: false, tab: 'edit', previewWidth: '100%', conflict: null, package: null, taskSearch: '', taskFilter: 'open', taskCategory: 'all', medicalExpanded: false, articleSearch: '', articleFilter: 'all', ideaId: null, ideaPerspective: 'all', ideaKind: 'all', ideaFilter: 'new', ideaBusy: false, ideaNotice: null };
  const labels = { title: 'Titel', lead: 'Inleiding', meta_title: 'Titel in zoekmachines', meta_description: 'Omschrijving in zoekmachines', card_title: 'Titel op artikelkaarten', card_summary: 'Omschrijving op artikelkaarten', image_alt: 'Afbeeldingsbeschrijving', social_title: 'Titel bij delen', social_description: 'Omschrijving bij delen' };
  const clone = value => JSON.parse(JSON.stringify(value));
  const asText = value => value == null ? '' : typeof value === 'object' ? JSON.stringify(value) : String(value);
  const fmt = value => {
    if (!value) return 'Niet bekend';
    const date = new Date(typeof value === 'number' && value < 1e12 ? value * 1000 : value);
    return Number.isNaN(date.getTime()) ? asText(value) : date.toLocaleString('nl-NL', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Europe/Amsterdam' });
  };
  function el(tag, props = {}, ...children) {
    const node = document.createElement(tag);
    Object.entries(props).forEach(([key, value]) => {
      if (value == null || value === false) return;
      if (key === 'class') node.className = value;
      else if (key === 'text') node.textContent = value;
      else if (key.startsWith('on') && typeof value === 'function') node.addEventListener(key.slice(2).toLowerCase(), value);
      else if (key === 'value') node.value = value;
      else if (key === 'checked' || key === 'disabled' || key === 'hidden') node[key] = value;
      else node.setAttribute(key, value === true ? '' : value);
    });
    children.flat(Infinity).forEach(child => { if (child != null && child !== false) node.append(child instanceof Node ? child : document.createTextNode(asText(child))); });
    return node;
  }
  const button = (text, fn, kind = '', props = {}) => el('button', { type: 'button', class: `button ${kind}`, onClick: fn, ...props }, text);
  function link(text, url, kind = '') {
    const safe = safeURL(url);
    return safe ? el('a', { class: `button ${kind}`, href: safe, target: '_blank', rel: 'noopener noreferrer' }, text) : null;
  }
  function safeURL(value) {
    if (!value) return null;
    try { const u = new URL(value, location.origin); return ['http:', 'https:'].includes(u.protocol) ? u.href : null; } catch { return null; }
  }
  function badge(text) {
    const s = asText(text);
    const kind = /review|beoord|wacht|aandacht|concept|vervallen|niet bevestigd/i.test(s) ? 'amber' : /fout|mislukt|error/i.test(s) ? 'red' : /pauze|onbekend|niet actief|niet geladen/i.test(s) ? 'neutral' : '';
    return el('span', { class: `badge ${kind}` }, s || 'Niet bekend');
  }
  function notify(text, kind = '') { banner.className = `message ${kind}`; banner.textContent = text; banner.hidden = !text; }
  function heading(title, description, action, eyebrow = 'Websitebeheer') {
    return el('div', { class: 'page-heading' }, el('div', {}, el('p', { class: 'eyebrow' }, eyebrow), el('h1', {}, title), description && el('p', {}, description)), action);
  }
  function empty(title, text) { return el('div', { class: 'empty' }, el('strong', {}, title), text); }
  const taskGroups = ['Contact & nieuwsbrief', 'Inhoud & redactie', 'Techniek & vindbaarheid', 'Beheer & routines'];
  const workflowLabels = { open: 'Openstaand', waiting: 'Wachten', later: 'Later', done: 'Afgerond' };
  function taskGroup(task) {
    if (taskGroups.includes(task.category)) return task.category;
    if (task.category === 'Sitekwaliteit') return 'Techniek & vindbaarheid';
    if (task.category === 'Routines') return 'Beheer & routines';
    return 'Inhoud & redactie';
  }
  function isOpenTask(task) { return ['work', 'idea'].includes(task.kind) ? task.workflow_status !== 'done' : Boolean(task.can_check && !task.checked); }
  function taskStatus(task) { return task.status || (task.kind === 'work' ? workflowLabels[task.workflow_status] : '') || 'Niet bekend'; }
  function sortTasks(tasks) {
    return [...tasks].sort((a, b) => {
      const order = task => task.kind === 'work' ? 0 : task.kind === 'idea' ? 1 : 2;
      if (order(a) !== order(b)) return order(a) - order(b);
      if (['work', 'idea'].includes(a.kind) && (a.priority || 3) !== (b.priority || 3)) return (a.priority || 3) - (b.priority || 3);
      return asText(a.title).localeCompare(asText(b.title), 'nl');
    });
  }
  function representativeTasks(tasks) {
    const sorted = sortTasks(tasks), chosen = taskGroups.map(group => sorted.find(task => taskGroup(task) === group)).filter(Boolean);
    for (const task of sorted) { if (chosen.length >= 4) break; if (!chosen.includes(task)) chosen.push(task); }
    return chosen.slice(0, 4);
  }
  function viewTasks({ search = '', filter = 'open', category = 'all' } = {}) {
    state.taskSearch = search; state.taskFilter = filter; state.taskCategory = category; navigate('taken');
  }
  function publishedArticle(article) { return article?.publication?.state === 'published'; }
  function unchangedPublishedArticle(article, dirty = false) { return publishedArticle(article) && article?.working_copy?.state === 'unchanged' && !dirty; }
  function publicationLabel(article) { return publishedArticle(article) ? 'Gepubliceerd' : article?.publication?.state === 'unpublished' ? 'Nieuw concept' : 'Publicatiestatus onbekend'; }
  function workingCopyLabel(article, dirty = false) {
    if (dirty) return 'Niet-opgeslagen wijzigingen';
    if (article?.working_copy?.state === 'source_changed' || article?.source_drift) return 'Vergelijking nodig';
    if (article?.working_copy?.state === 'unchanged') return publishedArticle(article) ? 'Werkversie ongewijzigd' : 'Lokale werkversie';
    if (article?.working_copy?.state === 'changed') return 'Lokale wijzigingen · nog niet gepubliceerd';
    return article?.working_copy?.label || 'Werkversie nog niet vergeleken';
  }
  function workingReviewLabel(article, dirty = false) {
    if (dirty || unchangedPublishedArticle(article)) return '';
    const subject = publishedArticle(article) ? 'Wijzigingen' : article?.publication?.state === 'unpublished' ? 'Concept' : 'Werkversie';
    if (article?.status === 'Ter beoordeling') return `${subject} ter beoordeling`;
    if (article?.status === 'Goedgekeurd') return `${subject} goedgekeurd · nog niet gepubliceerd`;
    if (article?.status === 'Akkoord vervallen') return 'Akkoord op de werkversie vervallen';
    return '';
  }
  function workingCopyBadge(article) {
    const element = badge(workingCopyLabel(article));
    if (['changed', 'source_changed', 'unknown'].includes(article?.working_copy?.state)) element.classList.add('amber');
    return element;
  }
  function publicationEvidence(article) {
    return article?.publication?.detail ? el('details', { class: 'publication-evidence' }, el('summary', {}, 'Over deze publicatiestatus'), el('p', {}, article.publication.detail)) : null;
  }
  function articleFilterLabel(article) {
    if (article?.working_copy?.state === 'source_changed' || article?.source_drift) return 'Vergelijking nodig';
    if (unchangedPublishedArticle(article)) return 'Gepubliceerd · werkversie ongewijzigd';
    return workingReviewLabel(article) || (publishedArticle(article) ? workingCopyLabel(article) : publicationLabel(article));
  }
  async function api(path, method = 'GET', body) {
    const headers = { Accept: 'application/json' };
    if (method !== 'GET') { headers['Content-Type'] = 'application/json'; headers['X-CSRF-Token'] = state.csrf; }
    let response;
    try { response = await fetch(path, { method, headers, body: body === undefined ? undefined : JSON.stringify(body), credentials: 'same-origin', cache: 'no-store' }); }
    catch { throw new Error('Geen verbinding met de lokale beheeromgeving. Je invoer staat nog in dit scherm.'); }
    let data;
    try { data = await response.json(); } catch { throw new Error('De beheeromgeving gaf geen leesbaar antwoord. Je invoer is behouden.'); }
    if (!response.ok) { const error = new Error(asText(data.error || data.message || `Verzoek mislukt (${response.status}).`)); error.status = response.status; error.data = data; throw error; }
    return data;
  }
  async function modal({ title, text, choices, note = false, checkbox = '', fieldLabel = 'Toelichting', fieldPlaceholder = 'Schrijf je toelichting…', fieldValue = '' }) {
    if (dialog.open) return null;
    const content = document.getElementById('dialog-content');
    const actions = document.getElementById('dialog-actions');
    const noteInput = note ? el('textarea', { rows: 3, 'aria-label': fieldLabel, placeholder: fieldPlaceholder, value: fieldValue }) : null;
    const check = checkbox ? el('input', { type: 'checkbox' }) : null;
    content.replaceChildren(el('h2', { id: 'dialog-title' }, title), el('p', {}, text));
    if (noteInput) content.append(el('label', { class: 'field' }, el('span', { class: 'field-label' }, fieldLabel), noteInput));
    if (check) content.append(el('label', { class: 'modal-check' }, check, el('span', {}, checkbox)));
    actions.replaceChildren();
    return new Promise(resolve => {
      let result = null;
      choices.forEach(choice => {
        const control = button(choice.label, () => { result = { choice: choice.value, note: noteInput ? noteInput.value.trim() : '' }; dialog.close(); }, choice.kind || '', { disabled: Boolean(choice.requireCheck || choice.requireNote) });
        const update = () => { control.disabled = Boolean((choice.requireCheck && !check?.checked) || (choice.requireNote && !noteInput?.value.trim())); };
        check?.addEventListener('change', update); noteInput?.addEventListener('input', update); update(); actions.append(control);
      });
      dialog.addEventListener('close', () => resolve(result), { once: true });
      dialog.showModal();
    });
  }
  async function canLeave() {
    if (state.busy) { notify('Wacht tot de huidige actie is afgerond.'); return false; }
    if (!state.dirty) return true;
    const answer = await modal({ title: 'Je hebt nog niet opgeslagen', text: 'Bewaar je wijzigingen voordat je naar een ander onderdeel gaat.', choices: [{ label: 'Blijf hier', value: 'cancel' }, { label: 'Wijzigingen laten vervallen', value: 'discard', kind: 'danger' }, { label: 'Opslaan en verder', value: 'save', kind: 'primary' }] });
    if (answer?.choice === 'save') return save();
    if (answer?.choice === 'discard') { if (state.article) state.draft = clone(state.article.document); state.dirty = false; updateEditorControls(); return true; }
    return false;
  }
  async function navigate(route) {
    if (!(await canLeave())) return;
    state.route = route; state.article = null; state.draft = null; state.conflict = null; state.package = null; state.dirty = false; notify('');
    history.replaceState(null, '', `#${route}`); render(); main.focus({ preventScroll: true }); window.scrollTo({ top: 0 });
  }
  function setNav() { document.querySelectorAll('[data-route]').forEach(node => { const active = node.dataset.route === (state.article ? 'artikelen' : state.route); active ? node.setAttribute('aria-current', 'page') : node.removeAttribute('aria-current'); }); }
  function render() {
    setNav(); main.replaceChildren();
    if (state.article) return renderEditor();
    ({ overzicht: renderOverview, artikelen: renderArticles, taken: renderTasks, routines: renderRoutines, bezoekers: renderAnalytics, ideeen: renderIdeas }[state.route] || renderOverview)();
  }
  async function refresh() {
    if (state.busy) return;
    state.busy = true;
    try { const [articles, dashboard] = await Promise.all([api('/api/articles'), api('/api/dashboard')]); state.articles = articles.articles || []; state.dashboard = dashboard; render(); notify(state.route === 'bezoekers' ? 'De opgeslagen cijfers zijn opnieuw geladen. Er zijn geen nieuwe cijfers uit Vercel of Google opgehaald.' : 'Overzicht bijgewerkt met de beschikbare gegevens.'); }
    catch (error) { notify(error.message, 'error'); }
    finally { state.busy = false; }
  }
  function renderOverview() {
    const d = state.dashboard || {}, tasks = d.tasks || [], routines = d.routines || [];
    const open = tasks.filter(isOpenTask);
    const review = state.articles.filter(article => article.status === 'Ter beoordeling' && !unchangedPublishedArticle(article));
    main.append(heading('Goed om weer verder te gaan.', 'Een plek voor je teksten, openstaande beoordelingen en het werk dat voor deze website wordt gedaan.', button('Vernieuwen', refresh)));
    main.append(el('div', { class: 'stats-grid' }, stat('Nog te doen', open.length, 'Bekijk de openstaande punten', 'taken'), stat('Werkversies ter beoordeling', review.length, 'Controleer de voorgestelde wijzigingen', 'artikelen'), stat('Ingerichte routines', routines.length, 'Bekijk planning en laatste bevindingen', 'routines')));
    main.append(renderIdeaSpotlight());
    const taskList = el('div', { class: 'list' });
    representativeTasks(open).forEach(task => taskList.append(el('div', { class: 'list-row' }, el('div', { class: 'list-main' }, el('h3', {}, task.title), el('div', { class: 'row-meta' }, badge(taskStatus(task)), taskGroup(task)), task.next_action && el('p', { class: 'overview-next' }, task.next_action)), button('Bekijken', () => viewTasks({ search: task.title, category: taskGroup(task) }), 'compact'))));
    if (!open.length) taskList.append(empty('Geen open punten in dit overzicht', 'Dit is gebaseerd op de aangesloten bronnen; je kunt alle taken bekijken.'));
    const routineList = el('div', { class: 'list' });
    routines.slice(0, 4).forEach(routine => routineList.append(el('div', { class: 'list-row' }, el('div', { class: 'list-main' }, el('h3', {}, routine.name), el('p', { class: 'subtle' }, routine.schedule || 'Planning niet bekend'), routineOverviewRecap(routine)), badge(routine.status))));
    if (!routines.length) routineList.append(empty('Nog geen routines ingelezen', 'Vernieuw het overzicht om beschikbare routines te laden.'));
    main.append(el('div', { class: 'two-column' }, el('section', { class: 'panel' }, el('div', { class: 'panel-header' }, el('div', {}, el('h2', {}, 'Waar je verder kunt'), el('p', { class: 'subtle' }, 'Taken en inhoudelijke controles')), button('Alle taken', () => viewTasks({ filter: 'all' }), 'compact')), taskList), el('section', { class: 'panel' }, el('div', { class: 'panel-header' }, el('div', {}, el('h2', {}, 'Voor deze website'), el('p', { class: 'subtle' }, 'Planning en laatste verslagen')), button('Routines', () => navigate('routines'), 'compact')), routineList, el('p', { class: 'routine-overview-note' }, 'Een terugblik beschrijft dat verslag. Actuele vervolgacties staan bij Nog te doen.'))));
    main.append(analyticsRanking(d.analytics || {}, true));
    main.append(searchConsolePanel(true));
    main.append(el('section', { class: 'panel section-spacing' }, el('div', { class: 'panel-header' }, el('div', {}, el('h2', {}, 'Een tekst aanpassen'), el('p', { class: 'subtle' }, 'Bewerk een artikel, sla op en bekijk het in de websitevormgeving.')), button('Naar artikelen', () => navigate('artikelen'), 'primary')), el('p', { class: 'small subtle' }, 'Je kunt wijzigingen ook aan Codex vragen. Codex en dit scherm gebruiken dezelfde lokale artikelbron en versiegeschiedenis.')));
  }
  function stat(label, value, hint, route) { return el('button', { type: 'button', class: 'stat-card', onClick: () => route === 'taken' ? viewTasks() : navigate(route) }, el('span', { class: 'stat-label' }, label), el('span', { class: 'stat-value' }, value), el('span', { class: 'stat-hint' }, hint)); }
  function searchField(label, value, onInput, placeholder = 'Zoeken…') { const input = el('input', { type: 'search', value, placeholder, onInput: event => onInput(event.target.value) }); return el('label', { class: 'field' }, el('span', { class: 'field-label' }, label), input); }
  function selectField(label, value, options, onChange) { const select = el('select', { onChange: event => onChange(event.target.value) }, options.map(([id, text]) => el('option', { value: id }, text))); select.value = value; return el('label', { class: 'field select-filter' }, el('span', { class: 'field-label' }, label), select); }
  function renderArticles() {
    main.append(heading('Artikelen', 'Bekijk wat al gepubliceerd is en bewerk de werkversie van dezelfde pagina. Lokaal opslaan verandert de gepubliceerde pagina niet.'));
    const list = el('div', { class: 'article-grid' }), count = el('p', { class: 'search-count', 'aria-live': 'polite' });
    const draw = () => {
      const matches = state.articles.filter(a => (!state.articleSearch || a.title.toLowerCase().includes(state.articleSearch.toLowerCase())) && (state.articleFilter === 'all' || articleFilterLabel(a) === state.articleFilter));
      count.textContent = `${matches.length} van ${state.articles.length} artikelen`; list.replaceChildren();
      matches.forEach(article => list.append(el('article', { class: 'panel article-card' }, el('div', {}, el('div', { class: 'row-meta' }, badge(publicationLabel(article)), workingCopyBadge(article), workingReviewLabel(article) && badge(workingReviewLabel(article))), el('h2', { class: 'spaced' }, article.title), el('p', { class: 'article-publication-note' }, publishedArticle(article) ? 'Dit artikel is al gepubliceerd. Hier bewerk je de werkversie van dezelfde pagina.' : article.publication?.state === 'unpublished' ? 'Dit is een nieuw concept. Het is nog niet gepubliceerd.' : 'De publicatiestatus van deze pagina moet nog worden vastgesteld.'), article.working_copy?.detail && el('p', { class: 'subtle' }, article.working_copy.detail), el('p', { class: 'subtle' }, `Lokale versie ${article.revision} · laatst bewaard ${fmt(article.updated_at)}`), publicationEvidence(article)), el('div', { class: 'article-card-actions' }, button('Werkversie bewerken', () => openArticle(article.id), 'primary'), publishedArticle(article) && link('Gepubliceerde pagina bekijken', article.publication?.url || article.url, 'compact')))));
      if (!matches.length) list.append(empty('Geen artikelen gevonden', state.articles.length ? 'Pas je zoekterm of filter aan.' : 'Er zijn nog geen artikelen in de lokale beheerbron beschikbaar.'));
    };
    const statuses = [...new Set(state.articles.map(articleFilterLabel).filter(Boolean))];
    if (state.articleFilter !== 'all' && !statuses.includes(state.articleFilter)) state.articleFilter = 'all';
    main.append(el('div', { class: 'filter-bar' }, searchField('Zoek een artikel', state.articleSearch, value => { state.articleSearch = value; draw(); }, 'Titel van het artikel'), selectField('Status', state.articleFilter, [['all', 'Alle statussen'], ...statuses.map(s => [s, s])], value => { state.articleFilter = value; draw(); })), count, list); draw();
  }
  function renderTasks() {
    main.append(heading('Nog te doen', 'Contact, nieuwsbrief, inhoud en onderhoud bij elkaar. Kies een onderwerp om gericht verder te werken.', button('Vernieuwen', refresh)));
    const feedback = ideaFeedback(); if (feedback) main.append(feedback);
    const all = state.dashboard?.tasks || [], list = el('div', { class: 'task-groups' }), count = el('p', { class: 'search-count', 'aria-live': 'polite' });
    const categories = el('div', { class: 'task-categories', role: 'group', 'aria-label': 'Hoofdonderwerp' });
    const categoryButtons = [];
    function matchesProgress(task) {
      if (state.taskFilter === 'all') return true;
      if (state.taskFilter === 'open') return isOpenTask(task);
      if (state.taskFilter === 'checked') return Boolean(task.checked);
      return ['work', 'idea'].includes(task.kind) && task.workflow_status === state.taskFilter;
    }
    function taskRow(task) {
      const actions = el('div', { class: 'task-actions' });
      if (task.url) actions.append(link('Pagina bekijken', task.url, 'compact'));
      if (task.kind === 'idea') {
        const idea = ideaItems().find(item => item.id === task.idea_id);
        actions.append(button('Bekijk idee', () => viewIdea(task.idea_id), 'compact', { disabled: !idea }), button('Uit Nog te doen halen', () => idea && chooseIdea(idea, 'saved'), 'text-button compact', { 'data-idea-action': 'remove', disabled: !idea || state.ideaBusy }));
      }
      if (task.can_check) {
        const input = el('input', { type: 'checkbox', checked: Boolean(task.checked), 'aria-label': `${task.checked ? 'Markeer als nog te bekijken' : 'Markeer als bekeken'}: ${task.title}`, onChange: async event => {
          const desired = event.target.checked; event.target.disabled = true;
          try {
            const result = await api(`/api/tasks/${encodeURIComponent(task.id)}/check`, 'POST', { checked: desired }); Object.assign(task, result);
            notify(task.kind === 'work' ? 'Leesmarkering bewaard. De voortgang van dit werkpunt blijft gebaseerd op de gecontroleerde bron.' : desired ? 'Als bekeken gemarkeerd. Publicatiestatus en medisch akkoord zijn niet gewijzigd.' : 'Opnieuw gemarkeerd als nog te bekijken.'); draw();
          } catch (error) { event.target.checked = !desired; notify(error.message, 'error'); }
          finally { event.target.disabled = false; }
        } });
        actions.append(el('label', { class: 'task-check' }, input, 'Bekeken'));
        actions.append(button(task.note ? 'Notitie aanpassen' : 'Notitie toevoegen', async () => {
          const answer = await modal({ title: 'Notitie bij deze taak', text: task.title, note: true, fieldLabel: 'Je notitie', fieldValue: task.note || '', choices: [{ label: 'Annuleren', value: 'cancel' }, { label: 'Notitie opslaan', value: 'save', kind: 'primary' }] });
          if (answer?.choice !== 'save') return;
          try { const result = await api(`/api/tasks/${encodeURIComponent(task.id)}/check`, 'POST', { checked: Boolean(task.checked), note: answer.note }); Object.assign(task, result); draw(); notify('Je notitie is lokaal bewaard.'); }
          catch (error) { notify(error.message, 'error'); }
        }, 'text-button compact'));
      }
      const meta = el('div', { class: 'row-meta' }, badge(taskStatus(task)), task.kind !== 'work' && task.category, task.kind === 'work' && el('span', {}, `Peildatum: ${fmt(task.reviewed_at)}`), task.evidence_changed && el('span', { class: 'badge amber' }, 'Bron gewijzigd · opnieuw controleren'));
      const sourceDetails = task.kind === 'work' && (task.detail || task.source) ? el('details', { class: 'disclosure task-source' }, el('summary', {}, 'Toelichting en bron'), task.detail && el('p', { class: 'task-detail' }, task.detail), task.source && el('span', { class: 'source-label' }, `Bron: ${task.source}`)) : null;
      return el('article', { class: 'list-row task-row' }, el('div', { class: 'list-main' }, el('h3', {}, task.title), meta, task.kind !== 'work' && task.detail && el('p', { class: 'task-detail' }, task.detail), task.next_action && el('div', { class: 'task-next' }, el('span', {}, 'Volgende stap'), el('p', {}, task.next_action)), task.note && el('p', { class: 'task-detail' }, el('strong', {}, 'Je notitie: '), task.note), sourceDetails, task.kind !== 'work' && task.source && el('span', { class: 'source-label' }, `Bron: ${task.source}`)), actions);
    }
    const draw = () => {
      const matching = all.filter(task => matchesProgress(task) && `${task.title} ${task.detail || ''} ${task.next_action || ''} ${task.note || ''}`.toLowerCase().includes(state.taskSearch.toLowerCase()));
      const tasks = matching.filter(task => state.taskCategory === 'all' || taskGroup(task) === state.taskCategory);
      count.textContent = `${tasks.length} van ${all.length} punten · ${state.taskCategory === 'all' ? 'alle categorieën' : state.taskCategory}`;
      categoryButtons.forEach(({ key, control, counter }) => {
        const number = matching.filter(task => key === 'all' || taskGroup(task) === key).length;
        counter.textContent = number;
        control.setAttribute('aria-pressed', String(state.taskCategory === key));
        control.setAttribute('aria-label', `${key === 'all' ? 'Alle categorieën' : key}: ${number} ${number === 1 ? 'punt' : 'punten'}`);
      });
      list.replaceChildren();
      taskGroups.forEach(group => {
        const groupTasks = sortTasks(tasks.filter(task => taskGroup(task) === group));
        if (!groupTasks.length) return;
        const section = el('section', { class: 'panel task-group' }, el('div', { class: 'panel-header' }, el('h2', {}, group), el('span', { class: 'subtle' }, `${groupTasks.length} ${groupTasks.length === 1 ? 'punt' : 'punten'}`)));
        const mainTasks = el('div', { class: 'list' });
        const medical = group === 'Inhoud & redactie' ? groupTasks.filter(task => !['work', 'idea'].includes(task.kind)) : [];
        groupTasks.filter(task => !medical.includes(task)).forEach(task => mainTasks.append(taskRow(task)));
        if (mainTasks.childElementCount) section.append(mainTasks);
        if (medical.length) {
          const medicalList = el('div', { class: 'list' }, medical.map(taskRow));
          const disclosure = el('details', { class: 'task-medical', open: state.taskCategory !== 'all' || state.medicalExpanded || Boolean(state.taskSearch.trim()) }, el('summary', {}, `Aandoeningen en behandelpagina’s (${medical.length})`), el('p', { class: 'subtle' }, 'Alfabetisch gerangschikt. Bekeken bijhouden verandert de medische beoordeling en publicatiestatus niet.'), medicalList);
          disclosure.addEventListener('toggle', () => { if (state.taskCategory === 'all' && !state.taskSearch.trim()) state.medicalExpanded = disclosure.open; }); section.append(disclosure);
        }
        list.append(section);
      });
      if (!tasks.length) list.append(empty('Geen taken binnen dit filter', 'Kies een andere status, categorie of zoekterm.'));
    };
    [['all', 'Alle categorieën'], ...taskGroups.map(group => [group, group])].forEach(([key, label]) => {
      const counter = el('strong', { class: 'task-category-count' }, '0');
      const control = el('button', { type: 'button', class: 'task-category', onClick: () => { state.taskCategory = key; draw(); } }, el('span', {}, label), counter);
      categoryButtons.push({ key, control, counter }); categories.append(control);
    });
    main.append(categories, el('div', { class: 'filter-bar task-filters' }, searchField('Zoeken', state.taskSearch, value => { state.taskSearch = value; draw(); }, 'Bijvoorbeeld nieuwsbrief of enkel'), selectField('Voortgang', state.taskFilter, [['open', 'Openstaande punten'], ['waiting', 'Wachten'], ['later', 'Later'], ['done', 'Afgerond'], ['checked', 'Bekeken'], ['all', 'Alles']], value => { state.taskFilter = value; draw(); }), button('Filters wissen', () => { state.taskSearch = ''; state.taskFilter = 'open'; state.taskCategory = 'all'; render(); }, 'text-button')),
      el('p', { class: 'snapshot-note' }, 'Bekeken is een leesmarkering. Werkpunten blijven open totdat de gecontroleerde bron aangeeft dat ze zijn afgerond. De peildatum geeft de laatste controle aan, geen actuele livecheck.'), count, list); draw();
  }
  const ideaChoices = { new: 'Nieuw voorstel', saved: 'Bewaard als idee', todo: 'In Nog te doen', dismissed: 'Past niet bij mij' };
  const ideaKinds = { tool: 'Geavanceerde hulpmiddelen', growth: 'Bereik & groei', content: 'Inhoud', experience: 'Gebruiksgemak', agent: 'Agents & routines', skill: 'Skills & werkwijzen', simplify: 'Vereenvoudigen' };
  const ideaPerspectives = ['Ondernemer', 'ICT’er', 'Arts / verwijzer', 'Patiënt', 'Redacteur / ontwerper'];
  function ideaItems() { return Array.isArray(state.dashboard?.ideas?.items) ? state.dashboard.ideas.items : []; }
  function matchingIdeas(choice = state.ideaFilter, applyFilters = true) {
    return ideaItems().filter(idea => (choice === 'all' || (idea.choice || 'new') === choice) && (!applyFilters || state.ideaPerspective === 'all' || (idea.perspectives || []).includes(state.ideaPerspective)) && (!applyFilters || state.ideaKind === 'all' || (state.ideaKind === 'advanced' ? ['tool', 'growth'].includes(idea.kind) : idea.kind === state.ideaKind))).sort((a, b) => (a.priority || 3) - (b.priority || 3));
  }
  function viewIdea(id) {
    state.ideaId = id; state.ideaFilter = 'all'; state.ideaPerspective = 'all'; state.ideaKind = 'all'; navigate('ideeen');
  }
  function openIdeaCollection(choice = 'all') {
    state.ideaFilter = choice; state.ideaId = null; state.ideaPerspective = 'all'; state.ideaKind = 'all'; navigate('ideeen');
  }
  function ideaDate(value) {
    if (!value) return 'Peildatum niet bekend';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? 'Peildatum niet bekend' : `Peildatum ${date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Amsterdam' })}`;
  }
  function nextIdea(pool) {
    const index = pool.findIndex(idea => idea.id === state.ideaId);
    state.ideaId = pool[(index + 1) % pool.length]?.id || null; render();
  }
  async function chooseIdea(idea, choice, undo = false) {
    if (state.ideaBusy) return;
    const current = ideaItems().find(item => item.id === idea.id);
    if (!current) { notify('Het idee is niet beschikbaar. Herlaad de ideeën voordat je een keuze bewaart.', 'warning'); return; }
    const previous = current.choice || 'new'; state.ideaBusy = true;
    document.querySelectorAll('[data-idea-action]').forEach(control => { control.disabled = true; });
    try {
      const result = await api(`/api/ideas/${encodeURIComponent(current.id)}/choice`, 'POST', { choice, version: current.version, choice_version: current.choice_version });
      state.dashboard.ideas = result.ideas;
      state.ideaNotice = undo ? null : { id: current.id, title: current.title, previous, choice };
      if (state.route === 'overzicht' || (state.ideaFilter !== 'all' && choice !== state.ideaFilter)) state.ideaId = null;
      let refreshed = true;
      try { state.dashboard = await api('/api/dashboard'); } catch { refreshed = false; }
      const message = undo ? 'Je vorige keuze is hersteld.' : choice === 'todo' ? 'Als onderzoeksidee toegevoegd aan Nog te doen. Er is niets uitgevoerd.' : choice === 'saved' ? 'Bewaard bij je ideeën.' : choice === 'dismissed' ? 'Je keuze is bewaard. Je kunt het voorstel bij eerdere keuzes terugvinden.' : 'Het idee staat weer bij de nieuwe voorstellen.';
      notify(refreshed ? message : `${message} De werklijst kon nog niet worden herladen; gebruik Vernieuwen om die bij te werken.`, refreshed ? '' : 'warning');
    } catch (error) {
      if (error.status === 409 && error.data?.current?.ideas) {
        state.dashboard.ideas = error.data.current.ideas; state.ideaNotice = null;
        try { state.dashboard = await api('/api/dashboard'); } catch { /* Keep the server-provided current ideas; a later refresh can update the work list. */ }
        notify('Dit idee of je keuze is intussen gewijzigd. Je ziet nu de actuele gegevens; kies opnieuw als je de keuze wilt aanpassen.', 'warning');
      } else notify(error.message, 'error');
    } finally {
      state.ideaBusy = false;
      if (!state.article && ['overzicht', 'ideeen', 'taken'].includes(state.route)) render();
    }
  }
  function ideaFeedback() {
    const notice = state.ideaNotice;
    if (!notice) return null;
    const idea = ideaItems().find(item => item.id === notice.id);
    return el('div', { class: 'idea-feedback', role: 'status' }, el('div', {}, el('strong', {}, ideaChoices[notice.choice]), el('span', {}, notice.title)), el('div', { class: 'button-group' }, button('Bekijken', () => viewIdea(notice.id), 'text-button compact', { disabled: !idea }), button('Ongedaan maken', () => idea && chooseIdea(idea, notice.previous, true), 'compact', { 'data-idea-action': 'undo', disabled: !idea || state.ideaBusy })));
  }
  function ideaFilters() {
    return el('div', { class: 'filter-bar idea-filters' }, selectField('Kijkhoek', state.ideaPerspective, [['all', 'Alle perspectieven'], ...ideaPerspectives.map(perspective => [perspective, perspective])], value => { state.ideaPerspective = value; state.ideaId = null; render(); }), selectField('Soort idee', state.ideaKind, [['all', 'Alle soorten ideeën'], ['advanced', 'Tools & nieuwe mogelijkheden'], ...Object.entries(ideaKinds)], value => { state.ideaKind = value; state.ideaId = null; render(); }));
  }
  function ideaDetails(idea, compact = false) {
    const detail = el('details', { class: 'disclosure idea-details' }, el('summary', {}, compact ? 'Eerste stap, afweging en bronnen' : 'Inspanning, afweging en bronnen'));
    if (compact && idea.first_step) detail.append(el('div', { class: 'idea-first-step' }, el('strong', {}, 'Eerste stap'), el('p', {}, idea.first_step)));
    const fields = [['Waarom dit kan helpen', idea.why], ['Inspanning', idea.effort], ['Afweging', idea.tradeoff], ['Hoe je het effect beoordeelt', idea.success_check]];
    detail.append(el('dl', {}, fields.filter(([, text]) => text).map(([label, text]) => el('div', {}, el('dt', {}, label), el('dd', {}, text)))));
    if (idea.evidence?.length) {
      const sources = el('ul', { class: 'idea-sources' });
      idea.evidence.forEach(source => {
        const url = safeURL(source.url);
        sources.append(el('li', {}, url ? el('a', { href: url, target: '_blank', rel: 'noopener noreferrer' }, source.label || 'Bron bekijken') : el('span', {}, source.label || 'Projectbron'), source.path && el('small', {}, source.path)));
      });
      detail.append(el('h4', {}, 'Bronnen'), sources);
    }
    return detail;
  }
  function ideaCard(idea, pool, compact = false) {
    const actions = el('div', { class: 'idea-actions' });
    const selected = idea.choice || 'new';
    [['saved', 'Bewaren als idee'], ['todo', 'Naar Nog te doen'], ['dismissed', 'Past niet bij mij']].forEach(([choice, label]) => {
      if (selected === choice) return;
      actions.append(button(label, () => chooseIdea(idea, choice), choice === 'saved' ? 'primary' : choice === 'dismissed' ? 'text-button' : '', { 'data-idea-action': choice, disabled: state.ideaBusy }));
    });
    if (selected !== 'new') actions.append(button('Terug naar nieuwe voorstellen', () => chooseIdea(idea, 'new'), 'text-button', { 'data-idea-action': 'new', disabled: state.ideaBusy }));
    actions.append(button('Ander idee', () => nextIdea(pool), '', { 'data-idea-action': 'next', disabled: state.ideaBusy || pool.length < 2 }));
    return el('article', { class: 'idea-proposal' }, el('div', { class: 'idea-meta' }, el('div', { class: 'row-meta' }, (idea.perspectives || []).map(perspective => el('span', { class: 'idea-perspective' }, perspective)), el('span', { class: 'subtle' }, ideaKinds[idea.kind] || 'Voorstel')), badge(ideaChoices[selected] || 'Keuze onbekend')), el('h3', {}, idea.title), idea.choice_stale && el('p', { class: 'idea-stale', role: 'status' }, `Dit idee is aangepast. Je eerdere keuze was “${ideaChoices[idea.previous_choice] || 'nog niet vastgelegd'}”; beoordeel de nieuwe versie.`), el('p', { class: 'idea-proposal-text' }, idea.proposal), !compact && idea.first_step && el('div', { class: 'idea-first-step' }, el('strong', {}, 'Eerste stap'), el('p', {}, idea.first_step)), ideaDetails(idea, compact), actions, el('p', { class: 'idea-date' }, `Samengesteld door Codex · ${ideaDate(idea.reviewed_at)}. Ander idee toont een volgend voorstel uit deze verzameling.`));
  }
  function ideaUnavailable() {
    return el('div', {}, empty('Frisse blik is nu niet beschikbaar', 'De opgeslagen ideeën konden niet worden gelezen. Je andere beheertaken blijven beschikbaar.'), button('Opnieuw laden', refresh, 'compact'));
  }
  function renderIdeaSpotlight() {
    const panel = el('section', { class: 'panel idea-spotlight' }, el('div', { class: 'panel-header' }, el('div', {}, el('p', { class: 'eyebrow' }, 'Een andere kijk op je website'), el('h2', {}, 'Frisse blik')), button('Alle ideeën en keuzes', () => openIdeaCollection(), 'compact')));
    if (state.dashboard?.ideas?.error) { panel.append(ideaUnavailable()); return panel; }
    const feedback = ideaFeedback(); if (feedback) panel.append(feedback);
    const pool = matchingIdeas('new', false), selected = pool.find(idea => idea.id === state.ideaId) || pool[0];
    state.ideaId = selected?.id || null;
    if (selected) panel.append(ideaCard(selected, pool, true));
    else panel.append(empty('Geen nieuwe voorstellen binnen deze keuze', 'Je bewaarde ideeën en eerdere keuzes blijven beschikbaar.'), el('div', { class: 'button-group idea-empty-actions' }, button('Bewaarde ideeën bekijken', () => openIdeaCollection('saved'), 'compact'), button('Alle ideeën bekijken', () => openIdeaCollection(), 'text-button compact')));
    return panel;
  }
  function renderIdeas() {
    main.append(heading('Frisse blik', 'Ideeën vanuit verschillende perspectieven. Je bepaalt wat je bewaart, onderzoekt of terzijde legt.', button('Ideeën herladen', refresh)));
    if (state.dashboard?.ideas?.error) { main.append(el('section', { class: 'panel' }, ideaUnavailable())); return; }
    const feedback = ideaFeedback(); if (feedback) main.append(feedback);
    const choices = el('div', { class: 'idea-choice-filters', role: 'group', 'aria-label': 'Bewaarde keuzes' });
    [['new', 'Nieuw'], ['saved', 'Bewaard'], ['todo', 'In Nog te doen'], ['dismissed', 'Past niet bij mij'], ['all', 'Alle ideeën']].forEach(([choice, label]) => {
      const number = matchingIdeas(choice).length;
      choices.append(button(`${label} · ${number}`, () => { state.ideaFilter = choice; state.ideaId = null; render(); }, 'compact', { 'aria-pressed': String(state.ideaFilter === choice) }));
    });
    main.append(choices, ideaFilters());
    const pool = matchingIdeas(), selected = pool.find(idea => idea.id === state.ideaId) || pool[0]; state.ideaId = selected?.id || null;
    if (selected) {
      const selector = selectField('Voorstel bekijken', selected.id, pool.map(idea => [idea.id, idea.title]), value => { state.ideaId = value; render(); }); selector.classList.add('idea-selector');
      main.append(selector, el('section', { class: 'panel idea-browser-card' }, ideaCard(selected, pool)));
    } else main.append(empty('Geen ideeën binnen dit filter', 'Kies een andere bewaarde keuze, kijkhoek of soort idee.'), button('Alle filters wissen', () => { state.ideaFilter = 'all'; state.ideaPerspective = 'all'; state.ideaKind = 'all'; render(); }, 'compact'));
    main.append(el('p', { class: 'idea-browser-note' }, 'Dit is een samengestelde ideeënlijst. Bladeren maakt geen nieuwe voorstellen. Je keuzes worden lokaal bewaard; deze lijst verandert daardoor niet automatisch. Naar Nog te doen bewaart een onderzoeksidee en start geen uitvoering.'));
  }
  function routineReportDate(routine) {
    if (!routine.last_report) return '';
    const value = typeof routine.last_report === 'object' ? routine.last_report.date : routine.last_report;
    return value ? fmt(value) : 'Verslagdatum niet bekend';
  }
  function routineHighlights(routine) {
    return (Array.isArray(routine.recap?.highlights) ? routine.recap.highlights : []).filter(item => ['Gedaan', 'Uitkomst', 'Vervolg'].includes(item.label) && typeof item.text === 'string' && item.text.trim()).slice(0, 3);
  }
  function routineRecapFallback(routine) {
    if (routine.recap?.status === 'outdated') return 'Nieuw verslag beschikbaar; korte terugblik nog bijwerken.';
    return routine.last_report ? 'Korte terugblik nog niet beschikbaar.' : 'Nog geen uitvoeringsverslag beschikbaar.';
  }
  function routineOverviewRecap(routine) {
    const highlights = routineHighlights(routine), done = highlights.find(item => item.label === 'Gedaan') || highlights[0];
    const text = routine.recap?.status === 'current' && done ? done.text : routineRecapFallback(routine);
    return el('div', { class: 'routine-overview-recap' }, el('span', {}, routine.last_report ? `Laatste verslag · ${routineReportDate(routine)}` : 'Laatste verslag'), el('p', {}, text));
  }
  function routineRecap(routine) {
    const highlights = routineHighlights(routine), current = routine.recap?.status === 'current' && highlights.length;
    const recap = el('section', { class: 'routine-recap' }, el('div', { class: 'routine-recap-header' }, el('h3', {}, 'Laatste verslag'), routine.last_report && el('span', {}, routineReportDate(routine))));
    if (current) {
      recap.append(el('dl', { class: 'routine-highlights' }, highlights.map(item => el('div', {}, el('dt', {}, item.label), el('dd', {}, item.text)))));
    } else {
      recap.append(el('p', { class: 'routine-recap-fallback' }, routineRecapFallback(routine)));
      if (routine.last_report && routine.last_result) recap.append(el('p', { class: 'routine-recap-result' }, routine.last_result));
    }
    const reportURL = routine.recap?.report_url;
    if (reportURL && reportURL === `/reports/${encodeURIComponent(routine.id)}`) recap.append(link('Verslag lezen', reportURL, 'compact'));
    return recap;
  }
  function renderRoutines() {
    const d = state.dashboard || {};
    main.append(heading('Agents & routines', 'Welke werkzaamheden zijn ingericht, wanneer ze gepland zijn en wat de laatste beschikbare terugkoppeling zegt.', button('Vernieuwen', refresh)));
    main.append(el('p', { class: 'snapshot-note' }, `Overzicht opgehaald: ${fmt(d.generated_at)}. Een ingeschakelde routine is niet voortdurend actief. Een gepland moment bewijst niet dat een uitvoering is geslaagd.`));
    main.append(el('h2', {}, 'Vaste routines'));
    main.append(el('p', { class: 'routine-report-note' }, 'Een terugblik beschrijft dat verslag. Actuele vervolgacties staan bij Nog te doen.'));
    const routines = d.routines || [];
    routines.forEach(routine => {
      const fields = [['Planning', routine.schedule || 'Niet bekend'], ['Werkzaamheden', routine.role || 'Zie toelichting']];
      if (routine.next_run) fields.push(['Volgende geplande uitvoering', fmt(routine.next_run)]);
      const card = el('article', { class: 'panel routine-card' }, el('div', { class: 'routine-top' }, el('div', {}, el('h2', {}, routine.name)), badge(routine.status)), el('div', { class: 'routine-grid routine-planning' }, fields.map(([label, value]) => el('div', {}, el('span', { class: 'info-label' }, label), el('span', { class: 'info-value' }, value)))), routineRecap(routine));
      if (routine.detail) card.append(el('details', { class: 'disclosure' }, el('summary', {}, 'Toelichting op de planning'), el('p', {}, routine.detail)));
      main.append(card);
    });
    if (!routines.length) main.append(empty('Geen routinegegevens beschikbaar', 'De aangesloten bron levert nog geen routines aan.'));
    main.append(el('h2', { class: 'section-spacing' }, 'Agents en taken'));
    main.append(el('p', { class: 'subtle' }, 'Dit is de laatst beschikbare waarneming. Rollen zoals redactie en kwaliteitscontrole betekenen niet dat er doorlopend een agent draait.'));
    const agents = d.agents || [], list = el('section', { class: 'panel list' });
    agents.forEach(agent => list.append(el('article', { class: 'list-row task-row' }, el('div', { class: 'list-main' }, el('h3', {}, agent.name), el('p', { class: 'subtle' }, agent.role), agent.detail && el('p', { class: 'task-detail' }, agent.detail), agent.updated_at && el('span', { class: 'source-label' }, `Waargenomen: ${fmt(agent.updated_at)}`)), badge(agent.status))));
    if (!agents.length) list.append(empty('Geen actuele agentstatus aangesloten', 'De planning hierboven blijft wel beschikbaar.'));
    main.append(list);
  }
  function hasMetric(value) { return typeof value === 'number' && Number.isFinite(value) && value >= 0; }
  function rankedAnalyticsPages(analytics) {
    return (Array.isArray(analytics.pages) ? analytics.pages : []).map((page, index) => ({ ...page, originalIndex: index })).sort((a, b) => {
      if (hasMetric(a.visitors) !== hasMetric(b.visitors)) return hasMetric(a.visitors) ? -1 : 1;
      return (hasMetric(a.visitors) ? b.visitors - a.visitors : 0) || a.originalIndex - b.originalIndex;
    });
  }
  function analyticsDate(value) {
    if (!value) return 'Bijwerkdatum onbekend';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? 'Bijwerkdatum onbekend' : `Bijgewerkt ${date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Amsterdam' })}`;
  }
  function analyticsStamp(analytics) {
    const available = hasMetric(analytics.visitors) || hasMetric(analytics.views) || analytics.pages?.length || analytics.captured_at;
    return el('div', { class: 'analytics-stamp' }, el('strong', {}, analytics.period_label || analytics.period || 'Periode onbekend'), el('span', {}, available ? `${analyticsDate(analytics.captured_at)} · opgeslagen cijfers` : 'Nog geen cijfers opgeslagen'));
  }
  function analyticsPageList(analytics, limit) {
    const ranked = rankedAnalyticsPages(analytics), pages = typeof limit === 'number' ? ranked.slice(0, limit) : ranked;
    if (!pages.length) return empty('Nog geen paginacijfers beschikbaar', 'Zodra een bezoekersoverzicht is opgeslagen, verschijnen de pagina’s hier.');
    const largest = ranked.reduce((maximum, page) => hasMetric(page.visitors) ? Math.max(maximum, page.visitors) : maximum, 0);
    const list = el('ol', { class: 'analytics-ranking' });
    pages.forEach((page, index) => {
      const known = hasMetric(page.visitors), bar = el('span', { class: 'analytics-bar-fill' });
      if (known && largest > 0) bar.style.width = `${page.visitors / largest * 100}%`;
      list.append(el('li', { class: 'analytics-rank-row' }, el('span', { class: 'analytics-rank-number', 'aria-hidden': 'true' }, known ? index + 1 : '—'), el('div', { class: 'analytics-page-main' }, el('span', { class: 'analytics-page-title' }, page.title || page.path || 'Naam pagina onbekend'), known && el('span', { class: 'analytics-bar', 'aria-hidden': 'true' }, bar)), el('span', { class: `analytics-page-count${known ? '' : ' unknown'}` }, el('strong', {}, known ? page.visitors.toLocaleString('nl-NL') : 'Onbekend'), known && el('small', {}, page.visitors === 1 ? 'bezoeker' : 'bezoekers'))));
    });
    return list;
  }
  function analyticsRanking(analytics, compact = false) {
    const section = el('section', { class: `panel analytics-ranking-panel${compact ? ' analytics-overview' : ''}` }, el('div', { class: 'panel-header' }, el('div', {}, el('h2', {}, 'Best bezochte pagina’s'), el('p', { class: 'subtle' }, compact ? 'De vijf pagina’s met de meeste getelde bezoekers.' : 'Gerangschikt op het aantal getelde bezoekers.')), compact && button('Alle bezoekcijfers', () => navigate('bezoekers'), 'compact')));
    if (compact) section.append(analyticsStamp(analytics));
    section.append(analyticsPageList(analytics, compact ? 5 : undefined));
    if (!compact) {
      section.append(el('p', { class: 'analytics-footnote' }, 'Een bezoeker kan meerdere pagina’s bekijken. De aantallen per pagina tellen daarom niet op tot het totaal hierboven.'));
      const paths = (analytics.pages || []).map(page => page.path);
      if (paths.includes('/') && paths.includes('/index.html')) section.append(el('p', { class: 'analytics-footnote' }, 'De homepage is via twee adressen bezocht: / en /index.html. Vercel toont die hier afzonderlijk; de bezoekers zijn niet bij elkaar opgeteld.'));
    }
    return section;
  }
  function searchConsolePanel(compact = false) {
    const g = state.dashboard?.search_console || {};
    const panel = el('section', { class: 'panel section-spacing search-console-panel' }, el('div', { class: 'panel-header' }, el('div', {}, el('h2', {}, 'Vindbaarheid in Google'), el('p', { class: 'subtle' }, 'Google Search Console · matthijsvandam.nl')), badge(g.stale ? 'Opnieuw controleren' : g.status || 'Niet opgehaald')));
    if (!g.captured_at) { panel.append(el('p', {}, 'Er is nog geen geldige Google-momentopname beschikbaar.')); }
    else {
      panel.append(el('p', {}, `Gecontroleerd op ${fmt(g.captured_at)}. De weekcheck haalt nieuwe gegevens op als accounttoegang beschikbaar is. Dit scherm toont opgeslagen gegevens.`));
      panel.append(el('p', {}, `Eigendom geverifieerd · sitemap verwerkt · ${g.discovered} pagina’s ontdekt.`));
      panel.append(el('p', {}, `Indexeringsrapport van ${g.index_updated_at}: ${g.indexed} geïndexeerd, ${g.not_indexed} niet geïndexeerd. Ontdekt betekent nog niet geïndexeerd.`));
      if (!compact) panel.append(el('p', {}, `${g.not_found} niet gevonden (404), ${g.redirected} omleidingen en ${g.canonical_alternate} alternatief met correcte canonieke tag. Omleidingen en alternatieven zijn niet automatisch fouten.`));
      panel.append(el('p', {}, 'Vervolg: de 404-adressen herstellen en daarna de indexering opnieuw controleren. Actuele werkstatus staat bij Nog te doen.'));
    }
    panel.append(link('Open Google Search Console', g.dashboard_url), compact ? button('Meer over vindbaarheid', () => navigate('bezoekers'), 'compact') : button('Bekijk vervolgwerk', () => viewTasks({ search: 'zoekmachine', category: 'Techniek & vindbaarheid' }), 'compact'));
    return panel;
  }
  function renderAnalytics() {
    const a = state.dashboard?.analytics || {};
    main.append(heading('Bezoekers', 'Je websitebezoek in één overzicht.', button('Opgeslagen cijfers herladen', refresh)), analyticsStamp(a));
    const stats = el('div', { class: 'stats-grid analytics-stats' });
    [['Bezoekers', a.visitors, 'Bezoekers die je website hebben geopend. Terugkeer op een andere dag kan opnieuw meetellen.'], ['Paginaweergaven', a.views, 'Hoe vaak een pagina is bekeken; één bezoeker kan meerdere weergaven hebben.']].forEach(([name, number, description]) => {
      stats.append(el('div', { class: 'stat-card' }, el('span', { class: 'stat-label' }, name), el('span', { class: `stat-value${hasMetric(number) ? '' : ' unknown'}` }, hasMetric(number) ? number.toLocaleString('nl-NL') : 'Onbekend'), el('span', { class: 'stat-hint' }, description)));
    });
    main.append(stats, analyticsRanking(a), searchConsolePanel());
    main.append(el('section', { class: 'analytics-source' }, el('div', {}, el('h2', {}, 'Bron: Vercel'), el('p', {}, 'Dit zijn opgeslagen cijfers. Nieuwe cijfers uit Vercel worden niet automatisch opgehaald.'), a.dashboard_url && link('Bekijk actuele cijfers in Vercel', a.dashboard_url)), el('details', { class: 'disclosure' }, el('summary', {}, 'Hoe bezoekers worden geteld'), el('p', {}, 'Dezelfde persoon kan op verschillende dagen opnieuw worden geteld. Het aantal bezoekers is dus niet hetzelfde als het aantal verschillende personen over deze hele periode.'), el('a', { href: 'https://vercel.com/docs/analytics', target: '_blank', rel: 'noopener noreferrer' }, 'Uitleg van Vercel'))));
  }
  async function openArticle(id) {
    if (!(await canLeave())) return;
    notify(''); state.busy = true;
    try { const article = await api(`/api/articles/${encodeURIComponent(id)}`); adopt(article); state.tab = 'edit'; state.conflict = null; state.package = null; render(); main.focus({ preventScroll: true }); window.scrollTo({ top: 0 }); }
    catch (error) { notify(error.message, 'error'); }
    finally { state.busy = false; updateEditorControls(); }
  }
  function adopt(result) {
    const article = result.article || result;
    state.article = article; state.draft = clone(article.document); state.saved = JSON.stringify(state.draft); state.dirty = false;
    const i = state.articles.findIndex(a => a.id === article.id);
    const summary = { ...(i >= 0 ? state.articles[i] : {}), id: article.id, title: article.document.title, url: article.url, revision: article.revision, status: article.status, updated_at: article.updated_at, publication: article.publication, working_copy: article.working_copy, source_drift: article.source_drift };
    if (i >= 0) state.articles[i] = summary; else state.articles.push(summary);
  }
  function changed() { state.dirty = JSON.stringify(state.draft) !== state.saved; state.package = null; updateEditorControls(); }
  function updateEditorControls() {
    const saveLabel = document.getElementById('save-state');
    if (saveLabel) { saveLabel.textContent = state.busy ? 'Bezig…' : state.dirty ? 'Niet-opgeslagen wijzigingen' : `Opgeslagen · ${fmt(state.article.updated_at)}`; saveLabel.classList.toggle('dirty', state.dirty); }
    const saveButton = document.getElementById('save-article'); if (saveButton) saveButton.disabled = state.busy || !state.dirty;
    document.querySelectorAll('[data-write-action]').forEach(b => {
      const reviewAction = ['submit', 'approve', 'prepare'].includes(b.dataset.writeAction);
      b.hidden = reviewAction && unchangedPublishedArticle(state.article, state.dirty);
      b.disabled = state.busy || Boolean(state.conflict) || (b.dataset.requireClean === 'true' && state.dirty) || (reviewAction && Boolean(state.article?.source_drift || state.article?.dependency_error)) || (reviewAction && unchangedPublishedArticle(state.article, state.dirty)) || (b.dataset.writeAction === 'approve' && state.article?.status !== 'Ter beoordeling') || (b.dataset.writeAction === 'submit' && !state.dirty && ['Ter beoordeling', 'Goedgekeurd'].includes(state.article?.status));
    });
    const currentStatus = document.getElementById('editor-status');
    if (currentStatus) { currentStatus.textContent = workingCopyLabel(state.article, state.dirty); currentStatus.className = `badge ${state.dirty || ['changed', 'source_changed', 'unknown'].includes(state.article.working_copy?.state) ? 'amber' : ''}`; }
    const reviewLabel = document.getElementById('editor-review-status'); if (reviewLabel) { reviewLabel.textContent = workingReviewLabel(state.article, state.dirty); reviewLabel.hidden = !reviewLabel.textContent; }
    const approvalLabel = document.getElementById('editor-approval'); if (approvalLabel) approvalLabel.hidden = state.dirty || unchangedPublishedArticle(state.article);
    const previewButton = document.getElementById('preview-work'); if (previewButton) previewButton.textContent = state.dirty ? 'Opslaan & bekijken' : 'Werkversie bekijken';
    const previewTab = document.getElementById('tab-preview'); if (previewTab) previewTab.textContent = state.dirty ? 'Opslaan & bekijken' : 'Werkversie bekijken';
  }
  async function save() {
    if (state.busy) return false;
    if (!state.dirty) return true;
    for (const key of Object.keys(labels)) {
      if (!(key in state.draft)) continue;
      const value = asText(state.draft[key]), maximum = key === 'lead' ? 12000 : 2000;
      if (!value.trim() || value.length > maximum) {
        notify(!value.trim() ? `Vul het veld “${labels[key]}” in voordat je opslaat.` : `Het veld “${labels[key]}” is te lang. Gebruik maximaal ${maximum.toLocaleString('nl-NL')} tekens.`, 'error');
        state.tab = 'edit'; render();
        const field = main.querySelector(`[data-field="${key}"]`); if (field) { const details = field.closest('details'); if (details) details.open = true; field.focus(); }
        return false;
      }
    }
    for (const [index, block] of (state.draft.blocks || []).entries()) {
      if (!new DOMParser().parseFromString(block.html, 'text/html').body.textContent.trim()) { notify(`Tekstblok ${index + 1} is leeg. Vul de tekst aan voordat je opslaat.`, 'error'); state.tab = 'edit'; render(); main.querySelectorAll('.block-input')[index]?.focus(); return false; }
    }
    state.busy = true; updateEditorControls();
    const sent = JSON.stringify(state.draft);
    try {
      const result = await api(`/api/articles/${encodeURIComponent(state.article.id)}`, 'PUT', { base_revision: state.article.revision, document: JSON.parse(sent) });
      const currentInput = JSON.stringify(state.draft); adopt(result);
      if (currentInput !== sent) { state.draft = JSON.parse(currentInput); state.dirty = true; }
      state.conflict = null; state.package = null; render(); notify(state.dirty ? 'De verzonden versie is opgeslagen. Je nieuwere invoer moet nog worden opgeslagen.' : 'Opgeslagen op deze computer. De publieke website is niet gewijzigd.'); return !state.dirty;
    } catch (error) {
      if (error.status === 409 && error.data.current) { state.conflict = error.data.current.article || error.data.current; render(); notify('Er is intussen een andere versie opgeslagen. Je eigen invoer is behouden; vergelijk de versies hieronder.', 'warning'); }
      else notify(error.message, 'error');
      return false;
    } finally { state.busy = false; updateEditorControls(); }
  }
  async function mutate(action, extra = {}) {
    if (state.busy || state.conflict) return false;
    if (state.dirty && !(await save())) return false;
    state.busy = true; updateEditorControls();
    try {
      const result = await api(`/api/articles/${encodeURIComponent(state.article.id)}/${action}`, 'POST', { base_revision: state.article.revision, ...extra });
      adopt(result); state.package = result.package || null; state.conflict = null; render();
      const messages = { submit: 'De lokale wijzigingen staan ter beoordeling. De gepubliceerde pagina is niet gewijzigd.', approve: 'Je akkoord is vastgelegd voor de wijzigingen in deze exacte werkversie. Ze zijn nog niet gepubliceerd.', return: 'De werkversie is teruggestuurd met je toelichting.', restore: 'De eerdere inhoud is als nieuwe lokale versie bewaard. Er is geen tweede artikel aangemaakt.', prepare: 'Het lokale publicatiepakket is voorbereid. Er is niets gepubliceerd.' };
      notify(messages[action] || 'De wijziging is bewaard.'); return true;
    } catch (error) {
      if (error.status === 409 && error.data.current) { state.conflict = error.data.current.article || error.data.current; render(); notify('De opgeslagen versie is gewijzigd. Bekijk de vergelijking voordat je verdergaat.', 'warning'); }
      else notify(error.message, 'error');
      return false;
    } finally { state.busy = false; updateEditorControls(); }
  }
  async function switchTab(tab) {
    if (state.busy) return;
    if (tab === 'preview' && state.dirty && !(await save())) return;
    state.tab = tab; render();
  }
  function renderEditor() {
    const article = state.article;
    main.append(el('div', { class: 'breadcrumb' }, el('button', { type: 'button', onClick: () => navigate('artikelen') }, 'Artikelen'), el('span', { 'aria-hidden': 'true' }, '/'), el('span', {}, 'Werkversie')));
    main.append(el('div', { class: 'page-heading editor-heading' }, el('div', {}, el('p', { class: 'eyebrow' }, 'Werkversie bewerken'), el('h1', {}, article.document.title), el('div', { class: 'editor-state' }, badge(publicationLabel(article)), el('span', { id: 'editor-status', class: 'badge' }, workingCopyLabel(article)), el('span', { id: 'editor-review-status', class: 'badge amber' }, workingReviewLabel(article)), `Lokale versie ${article.revision}`, article.approval?.valid && el('span', { id: 'editor-approval' }, `Akkoord op lokale wijzigingen: ${article.approval.actor} · ${fmt(article.approval.at)}`))), publishedArticle(article) && link('Gepubliceerde pagina bekijken', article.publication?.url || article.url, 'compact')));
    main.append(el('p', { class: 'editor-local-explainer' }, publishedArticle(article) ? 'Je bewerkt de werkversie van deze gepubliceerde pagina. Opslaan bewaart je aanpassingen lokaal; de website verandert pas na afzonderlijke publicatie.' : 'Opslaan bewaart deze werkversie lokaal. Publicatie volgt als afzonderlijke stap.'));
    const evidence = publicationEvidence(article); if (evidence) main.append(evidence);
    main.append(el('div', { class: 'editor-actions' }, el('span', { class: 'save-state', id: 'save-state', role: 'status', 'aria-live': 'polite' }), el('div', { class: 'button-group' }, button('Lokaal opslaan', save, 'primary', { id: 'save-article' }), button(state.dirty ? 'Opslaan & bekijken' : 'Werkversie bekijken', () => switchTab('preview'), '', { id: 'preview-work' }), button('Wijzigingen ter beoordeling', () => mutate('submit'), '', { 'data-write-action': 'submit' }))));
    if (state.conflict) main.append(renderConflict());
    if (article.source_drift || article.dependency_error) main.append(el('section', { class: 'panel conflict-panel', role: 'alert' }, el('h2', {}, 'Eerst de bronwijziging controleren'), el('p', {}, article.source_drift ? 'Het oorspronkelijke websitebestand is buiten de beheeromgeving gewijzigd. Laat Codex de versies vergelijken voordat je deze werkversie aanbiedt, goedkeurt of voor publicatie voorbereidt.' : 'Een bestand dat bij dit artikel hoort, kan niet worden gecontroleerd. Laat Codex dit oplossen voordat je verdergaat met beoordelen.'), el('p', {}, 'Je kunt de tekst blijven bewerken en lokaal opslaan.'), article.dependency_error && el('details', { class: 'disclosure' }, el('summary', {}, 'Details voor Codex'), el('p', {}, article.dependency_error))));
    const tabs = el('div', { class: 'editor-tabs', role: 'tablist', 'aria-label': 'Artikelweergave' });
    [['edit', 'Bewerken'], ['preview', 'Werkversie bekijken'], ['review', 'Wijzigingen & beoordeling'], ['history', 'Versiegeschiedenis']].forEach(([id, title]) => tabs.append(el('button', { type: 'button', role: 'tab', id: `tab-${id}`, 'aria-controls': 'editor-tab-panel', 'aria-selected': String(state.tab === id), tabindex: state.tab === id ? 0 : -1, onClick: () => switchTab(id) }, title)));
    tabs.addEventListener('keydown', event => { if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return; const items = [...tabs.querySelectorAll('button')], current = items.indexOf(document.activeElement); if (current < 0) return; event.preventDefault(); const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : (current + (event.key === 'ArrowRight' ? 1 : -1) + items.length) % items.length; items.forEach((item, i) => { item.tabIndex = i === next ? 0 : -1; }); items[next].focus(); });
    main.append(tabs);
    const panel = el('section', { id: 'editor-tab-panel', role: 'tabpanel', 'aria-labelledby': `tab-${state.tab}` }); main.append(panel);
    ({ edit: renderForm, preview: renderPreview, review: renderReview, history: renderHistory }[state.tab])(panel);
    updateEditorControls();
  }
  function plainField(key, help = '', rows = 2, className = '') {
    const control = el('textarea', { rows, value: asText(state.draft[key]), class: className, 'data-field': key, 'aria-required': 'true', maxlength: key === 'lead' ? 12000 : 2000, onInput: event => { state.draft[key] = event.target.value; changed(); } });
    return el('label', { class: 'field' }, el('span', { class: 'field-label' }, labels[key] || key), control, help && el('span', { class: 'field-help' }, help));
  }
  function safeHTML(html) {
    const doc = new DOMParser().parseFromString(`<body>${asText(html)}</body>`, 'text/html');
    const allowed = new Set(['STRONG', 'EM', 'B', 'I', 'A', 'BR', 'SUP', 'SUB']);
    const clean = node => {
      [...node.childNodes].forEach(child => { if (child.nodeType === Node.COMMENT_NODE) child.remove(); });
      [...node.children].forEach(child => {
        if (['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'SVG', 'MATH', 'FORM', 'INPUT', 'IMG', 'VIDEO', 'AUDIO'].includes(child.tagName)) { child.remove(); return; }
        clean(child);
        if (!allowed.has(child.tagName)) { const content = [...child.childNodes]; if (['DIV', 'P', 'LI', 'BLOCKQUOTE'].includes(child.tagName)) content.push(doc.createElement('br')); child.replaceWith(...content); return; }
        const href = child.tagName === 'A' ? child.getAttribute('href') : null;
        const title = child.tagName === 'A' ? child.getAttribute('title') : null;
        const rel = child.tagName === 'A' ? child.getAttribute('rel') : null;
        [...child.attributes].forEach(attr => child.removeAttribute(attr.name));
        if (href) { try { const u = new URL(href, location.origin); if (['http:', 'https:', 'mailto:', 'tel:'].includes(u.protocol) && !href.trim().startsWith('//') && !/[\x00-\x1f\\]/.test(href)) child.setAttribute('href', href); } catch { /* Remove malformed links. */ } }
        if (child.tagName === 'A' && !child.hasAttribute('href')) { child.replaceWith(...child.childNodes); return; }
        if (title) child.setAttribute('title', title);
        if (rel) { const values = rel.split(/\s+/).filter(value => ['noopener', 'noreferrer', 'nofollow'].includes(value)); if (values.length) child.setAttribute('rel', values.join(' ')); }
      });
    };
    clean(doc.body); return doc.body.innerHTML;
  }
  function blockField(block, index) {
    const names = { h2: 'Tussenkop', h3: 'Subkop', p: 'Alinea', ul: 'Opsomming', ol: 'Genummerde lijst', blockquote: 'Citaat' };
    const label = `${names[block.tag] || 'Tekstblok'} ${index + 1}`;
    const editor = el('div', { class: 'block-input', 'data-tag': block.tag, contenteditable: 'true', role: 'textbox', 'aria-label': label, 'aria-multiline': 'true', spellcheck: 'true' });
    editor.innerHTML = safeHTML(block.html);
    editor.addEventListener('input', () => { state.draft.blocks[index].html = safeHTML(editor.innerHTML); changed(); });
    editor.addEventListener('paste', event => { event.preventDefault(); const text = event.clipboardData?.getData('text/plain') || ''; document.execCommand('insertText', false, text); });
    editor.addEventListener('keydown', event => { if (event.key === 'Enter') { event.preventDefault(); document.execCommand('insertLineBreak'); } });
    editor.addEventListener('drop', event => event.preventDefault());
    editor.addEventListener('click', event => { if (event.target.closest('a')) event.preventDefault(); });
    const format = (command, value) => { editor.focus(); document.execCommand(command, false, value); state.draft.blocks[index].html = safeHTML(editor.innerHTML); changed(); };
    const tools = el('div', { class: 'format-tools', 'aria-label': `Opmaak ${label}` });
    [['Vet', 'bold', 'B'], ['Cursief', 'italic', 'I'], ['Link verwijderen', 'unlink', '↗−']].forEach(([title, command, symbol]) => tools.append(el('button', { type: 'button', title, 'aria-label': `${title} in ${label}`, onMousedown: event => event.preventDefault(), onClick: () => format(command) }, symbol)));
    tools.append(el('button', { type: 'button', title: 'Link invoegen', 'aria-label': `Link invoegen in ${label}`, onMousedown: event => event.preventDefault(), onClick: async () => {
      const selection = window.getSelection();
      if (!selection.rangeCount || !editor.contains(selection.anchorNode) || selection.isCollapsed) { notify('Selecteer eerst de woorden die je wilt laten verwijzen.'); editor.focus(); return; }
      const range = selection.getRangeAt(0).cloneRange();
      const result = await modal({ title: 'Link invoegen', text: 'Waar moeten de geselecteerde woorden naar verwijzen?', note: true, fieldLabel: 'Webadres', fieldPlaceholder: 'https://… of /artikelen/…', choices: [{ label: 'Annuleren', value: 'cancel' }, { label: 'Link invoegen', value: 'link', kind: 'primary', requireNote: true }] });
      if (result?.choice !== 'link') return;
      if (!safeURL(result.note)) { notify('Gebruik een geldige http- of https-link.', 'error'); return; }
      editor.focus(); selection.removeAllRanges(); selection.addRange(range); format('createLink', result.note);
    } }, 'Link'));
    return el('div', { class: 'block-field' }, el('div', { class: 'block-label' }, el('span', { class: 'field-label' }, label), tools), editor);
  }
  function renderForm(panel) {
    const form = el('div', { class: 'panel editor-form' }, el('h2', {}, 'De tekst op de pagina'), plainField('title', '', 2, 'title-input'), plainField('lead', 'De opening onder de titel.', 4, 'lead-input'));
    (state.draft.blocks || []).forEach((block, i) => form.append(blockField(block, i)));
    form.append(plainField('image_alt', 'Korte beschrijving voor bezoekers die de afbeelding niet zien.', 2));
    const variants = el('details', { class: 'disclosure' }, el('summary', {}, 'Artikelkaarten, zoekmachines en delen'), el('p', {}, 'Deze teksten staan op andere plekken dan de artikelpagina. Controleer ze wanneer je titel of inhoud verandert.'));
    ['card_title', 'card_summary', 'meta_title', 'meta_description', 'social_title', 'social_description'].forEach(key => { if (key in state.draft) variants.append(plainField(key)); }); form.append(variants);
    const aside = el('aside', { class: 'editor-aside' }, el('section', { class: 'panel' }, el('h2', {}, 'Over deze werkversie'), el('p', {}, publishedArticle(state.article) ? 'De pagina is al gepubliceerd. Alleen nieuwe lokale wijzigingen doorlopen opnieuw de beoordeling en publicatie.' : 'Deze werkversie staat los van publicatie. Opslaan en inhoudelijk akkoord maken de pagina nog niet publiek.'), el('dl', {}, el('dt', {}, 'Publicatie'), el('dd', {}, publicationLabel(state.article)), el('dt', {}, 'Lokale werkversie'), el('dd', {}, `Versie ${state.article.revision}`), el('dt', {}, 'Laatst lokaal opgeslagen'), el('dd', {}, fmt(state.article.updated_at)), el('dt', {}, 'Pagina-adres'), el('dd', {}, state.article.publication?.url || state.article.url || 'Nog niet bekend'))), el('section', { class: 'panel' }, el('h2', {}, 'Ook via Codex'), el('p', {}, 'Je kunt blijven vragen: “Pas deze alinea aan op basis van mijn feedback.” Laat Codex de beheerde artikelbron gebruiken, zodat de wijziging in deze versiegeschiedenis komt.'), el('p', {}, 'Bij gelijktijdige wijzigingen verschijnt een vergelijking. Je tekst wordt niet stilzwijgend overschreven.')));
    panel.append(el('div', { class: 'editor-layout' }, form, aside));
  }
  function previewURL() { return `/preview/${encodeURIComponent(state.article.id)}?revision=${encodeURIComponent(state.article.revision)}`; }
  function renderPreview(panel) {
    const frame = el('iframe', { class: 'preview-frame', title: `Lokale werkversie van ${state.article.document.title}`, src: previewURL(), sandbox: 'allow-same-origin allow-scripts', referrerpolicy: 'same-origin' });
    frame.style.maxWidth = state.previewWidth;
    const controls = el('div', { class: 'button-group' });
    [['100%', 'Breed'], ['430px', '430 px'], ['390px', '390 px'], ['360px', '360 px']].forEach(([width, name]) => controls.append(button(name, () => { state.previewWidth = width; frame.style.maxWidth = width; [...controls.children].forEach(node => node.setAttribute('aria-pressed', String(node.textContent === name))); }, 'compact', { 'aria-pressed': String(state.previewWidth === width) })));
    panel.append(el('div', { class: 'preview-controls' }, el('span', { class: 'subtle' }, `Opgeslagen lokale werkversie ${state.article.revision}`), controls), el('p', { class: 'inline-note' }, publishedArticle(state.article) ? 'Je bekijkt de lokale werkversie van de gepubliceerde pagina. Eventuele aanpassingen hier zijn nog niet op de website gepubliceerd.' : 'Je bekijkt een lokale werkversie. Deze voorvertoning is geen publicatie.'), el('div', { class: 'preview-wrap' }, frame));
  }
  function readableBlock(block) {
    if (!block) return '(niet aanwezig)';
    const doc = new DOMParser().parseFromString(asText(block.html), 'text/html');
    const parts = node => node.nodeType === Node.TEXT_NODE ? node.textContent : [...node.childNodes].map(parts).join('') + (['BR', 'P', 'LI'].includes(node.nodeName) ? '\n' : '');
    const text = parts(doc.body).trim();
    const references = [...doc.querySelectorAll('a')].map(a => `Link: ${a.textContent} → ${a.getAttribute('href') || '(zonder adres)'}`);
    const formatting = [...doc.querySelectorAll('b,strong,i,em,sup,sub')].map(node => `${['B', 'STRONG'].includes(node.tagName) ? 'Vet' : ['I', 'EM'].includes(node.tagName) ? 'Cursief' : node.tagName === 'SUP' ? 'Boven de regel' : 'Onder de regel'}: ${node.textContent}`);
    return [text, ...references, ...formatting].filter(Boolean).join('\n\n');
  }
  function differences(before, after) {
    const rows = [];
    Object.keys(labels).forEach(key => { if (asText(before?.[key]) !== asText(after?.[key])) rows.push([labels[key], asText(before?.[key]), asText(after?.[key])]); });
    const left = before?.blocks || [], right = after?.blocks || [], ids = [...new Set([...left.map(b => b.id), ...right.map(b => b.id)])];
    ids.forEach((id, i) => { const oldBlock = left.find(b => b.id === id), newBlock = right.find(b => b.id === id); if (JSON.stringify(oldBlock) !== JSON.stringify(newBlock)) rows.push([`Tekstblok ${i + 1}`, readableBlock(oldBlock), readableBlock(newBlock)]); });
    return rows;
  }
  function diffView(before, after, oldLabel, newLabel) {
    const rows = differences(before, after), list = el('div', { class: 'diff-list' });
    if (!rows.length) return empty('Geen tekstverschillen', 'De vergeleken velden zijn gelijk.');
    rows.forEach(([name, oldValue, newValue]) => list.append(el('article', { class: 'diff-item' }, el('h3', {}, name), el('div', { class: 'diff-columns' }, el('div', { class: 'diff-column' }, el('strong', {}, oldLabel), el('p', { class: 'diff-text' }, oldValue || '(leeg)')), el('div', { class: 'diff-column' }, el('strong', {}, newLabel), el('p', { class: 'diff-text' }, newValue || '(leeg)'))))));
    return list;
  }
  function renderReview(panel) {
    if (unchangedPublishedArticle(state.article, state.dirty)) {
      panel.append(el('div', { class: 'review-box' }, el('h2', {}, 'Geen lokale wijzigingen om te beoordelen'), el('p', {}, 'Dit artikel is al gepubliceerd. De werkversie is ongewijzigd en hoeft niet opnieuw te worden goedgekeurd. Na een aanpassing kun je de lokale wijzigingen hier beoordelen.'), button('Werkversie bekijken', () => switchTab('preview'))));
      return;
    }
    const valid = Boolean(state.article.approval?.valid) && !state.dirty, review = el('div', { class: 'review-box' }, el('h2', {}, valid ? 'Lokale wijzigingen goedgekeurd' : 'Beoordeling van de lokale wijzigingen'), el('p', {}, valid ? `Het akkoord geldt voor de wijzigingen in lokale versie ${state.article.approval.revision}. Deze wijzigingen zijn nog niet gepubliceerd.` : 'Controleer de gewijzigde tekst, bronnen, kaartteksten en werkversie. Je akkoord wordt gekoppeld aan de exacte opgeslagen werkversie en bijbehorende uitvoer.'));
    if (state.dirty) review.append(el('p', {}, 'Er zijn niet-opgeslagen wijzigingen. Sla die eerst lokaal op om ze te kunnen beoordelen.'));
    if (!valid && state.article.status !== 'Ter beoordeling') review.append(el('p', {}, 'Gebruik eerst “Wijzigingen ter beoordeling” bovenaan. Daarna kun je de opgeslagen wijzigingen goedkeuren.'));
    const actions = el('div', { class: 'button-group' });
    if (!valid) actions.append(button('Keur de lokale wijzigingen goed', async () => {
      const result = await modal({ title: `Wijzigingen in lokale versie ${state.article.revision} goedkeuren`, text: 'Dit legt jouw inhoudelijk akkoord vast voor de wijzigingen in deze opgeslagen werkversie. De gepubliceerde pagina verandert hierdoor niet.', checkbox: 'Ik heb de gewijzigde inhoud, bronnen, werkversie en teksten voor kaarten en zoekmachines gecontroleerd.', choices: [{ label: 'Annuleren', value: 'cancel' }, { label: 'Akkoord op wijzigingen vastleggen', value: 'approve', kind: 'primary', requireCheck: true }] });
      if (result?.choice === 'approve') await mutate('approve');
    }, 'primary', { 'data-write-action': 'approve', 'data-require-clean': 'true' }));
    actions.append(button('Terugsturen met toelichting', async () => {
      const result = await modal({ title: 'Werkversie terugsturen voor aanpassing', text: 'Noteer wat in de lokale wijzigingen nog aandacht vraagt. De toelichting wordt in de versiegeschiedenis bewaard.', note: true, choices: [{ label: 'Annuleren', value: 'cancel' }, { label: 'Werkversie terugsturen', value: 'return', kind: 'primary', requireNote: true }] });
      if (result?.choice === 'return') await mutate('return', { note: result.note });
    }, '', { 'data-write-action': 'return', 'data-require-clean': 'true' }));
    if (valid) actions.append(button('Lokaal publicatiepakket maken', () => mutate('prepare'), 'primary', { 'data-write-action': 'prepare', 'data-require-clean': 'true' }));
    review.append(actions); panel.append(review);
    if (state.package) panel.append(el('div', { class: 'package-result' }, el('strong', {}, 'Lokaal pakket met wijzigingen gereed'), el('p', {}, `Voor lokale versie ${state.package.revision}. Deze wijzigingen zijn nog niet gepubliceerd.`), el('code', {}, state.package.directory || state.package.path || 'Pad niet meegeleverd'), state.package.files && el('p', {}, Array.isArray(state.package.files) ? state.package.files.join(' · ') : asText(state.package.files))));
    panel.append(el('h2', { class: 'spaced' }, 'Wijzigingen sinds de oorspronkelijke import'), el('p', { class: 'subtle' }, 'Links staat de oorspronkelijke bron bij import. Rechts staat je lokale werkversie. Ook veranderingen in links en tekstopmaak worden getoond.'), diffView(state.article.baseline, state.draft, 'Oorspronkelijke import', state.dirty ? 'Huidige invoer · nog niet opgeslagen' : `Opgeslagen lokale versie ${state.article.revision}`));
  }
  function renderHistory(panel) {
    panel.append(el('h2', {}, 'Geschiedenis van deze werkversie'), el('p', { class: 'subtle' }, 'Herstellen bewaart eerdere inhoud als een nieuwe lokale versie van dezelfde pagina. Het maakt geen tweede artikel, wijzigt de gepubliceerde pagina niet en herstelt geen oud akkoord.'));
    const list = el('div', { class: 'panel' }), historyItems = state.article.history || [];
    const actionLabels = { import: 'Werkversie aangemaakt', 'Import': 'Werkversie aangemaakt', 'Geïmporteerd': 'Werkversie aangemaakt', save: 'Lokaal opgeslagen', 'Opgeslagen': 'Lokaal opgeslagen', submit: 'Wijzigingen ter beoordeling aangeboden', 'Ter beoordeling': 'Wijzigingen ter beoordeling aangeboden', approve: 'Akkoord op lokale wijzigingen vastgelegd', 'Goedgekeurd': 'Akkoord op lokale wijzigingen vastgelegd', return: 'Werkversie teruggestuurd', 'Teruggestuurd': 'Werkversie teruggestuurd', restore: 'Eerdere inhoud lokaal hersteld', 'Hersteld': 'Eerdere inhoud lokaal hersteld', prepare: 'Lokaal publicatiepakket voorbereid', 'Lokaal pakket voorbereid': 'Lokaal publicatiepakket voorbereid' };
    historyItems.forEach(item => {
      const row = el('article', { class: 'history-item' }, el('div', {}, el('h3', {}, `Lokale versie ${item.revision} · ${actionLabels[item.action] || item.action}`), el('p', {}, `${fmt(item.at)} · ${item.actor || 'Niet bekend'}`), item.note && el('p', { class: 'spaced' }, item.note)));
      if (item.revision !== state.article.revision && item.revision != null) row.append(button('In werkversie herstellen', async () => {
        if (state.dirty && !(await canLeave())) return;
        const answer = await modal({ title: `Inhoud van lokale versie ${item.revision} herstellen`, text: 'De eerdere inhoud wordt als nieuwe lokale versie van dezelfde pagina opgeslagen. De huidige versie blijft in de geschiedenis staan.', choices: [{ label: 'Annuleren', value: 'cancel' }, { label: 'Als lokale werkversie bewaren', value: 'restore', kind: 'primary' }] });
        if (answer?.choice === 'restore') await mutate('restore', { restore_revision: item.revision });
      }, 'compact', { 'data-write-action': 'restore' }));
      list.append(row);
    });
    if (!historyItems.length) list.append(empty('Nog geen geschiedenis beschikbaar', 'Opgeslagen wijzigingen verschijnen hier.'));
    panel.append(list);
  }
  function renderConflict() {
    const current = state.conflict;
    const detail = el('details', { class: 'disclosure' }, el('summary', {}, `Vergelijk mijn invoer met opgeslagen versie ${current.revision}`), diffView(current.document, state.draft, `Inmiddels opgeslagen · versie ${current.revision}`, 'Mijn invoer · behouden in dit scherm'));
    return el('section', { class: 'panel conflict-panel', role: 'alert' }, el('h2', {}, 'Er is een nieuwere opgeslagen versie'), el('p', {}, 'Je invoer is bewaard in dit scherm. Vergelijk de verschillen en bewaar eventueel een kopie voordat je de nieuwste versie laadt.'), el('div', { class: 'button-group' }, button('Kopie van mijn invoer downloaden', () => {
      const blob = new Blob([JSON.stringify({ id: state.article.id, base_revision: state.article.revision, document: state.draft }, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob), a = el('a', { href: url, download: `${state.article.id}-mijn-invoer.json` }); document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 30000);
    }, 'compact'), button('Nieuwste versie laden', async () => {
      const answer = await modal({ title: 'Nieuwste versie laden', text: 'Je vervangt de invoer in dit scherm door de nieuwste opgeslagen versie. Download eerst een kopie als je je eigen tekst wilt behouden.', choices: [{ label: 'Mijn invoer behouden', value: 'cancel' }, { label: 'Nieuwste versie laden', value: 'reload', kind: 'primary' }] });
      if (answer?.choice === 'reload') { state.busy = true; try { const latest = await api(`/api/articles/${encodeURIComponent(state.article.id)}`); adopt(latest); state.conflict = null; render(); notify('De nieuwste opgeslagen versie is geladen.'); } catch (error) { notify(error.message, 'error'); } finally { state.busy = false; updateEditorControls(); } }
    }, 'compact')), detail);
  }
  window.addEventListener('beforeunload', event => { if (state.dirty || state.busy) { event.preventDefault(); event.returnValue = ''; } });
  document.querySelectorAll('[data-route]').forEach(node => node.addEventListener('click', () => navigate(node.dataset.route)));
  document.querySelector('.brand').addEventListener('click', event => { event.preventDefault(); navigate('overzicht'); });
  async function init() {
    try {
      const session = await api('/api/session'); state.csrf = session.csrf;
      document.getElementById('owner-label').textContent = session.owner || 'Matthijs'; document.getElementById('connection-status').textContent = 'Op deze computer';
      const [articles, dashboard] = await Promise.all([api('/api/articles'), api('/api/dashboard')]); state.articles = articles.articles || []; state.dashboard = dashboard;
      const initial = location.hash.slice(1); if (['overzicht', 'artikelen', 'taken', 'routines', 'bezoekers', 'ideeen'].includes(initial)) state.route = initial;
      render();
    } catch (error) {
      document.getElementById('connection-status').textContent = 'Verbinding niet beschikbaar';
      main.replaceChildren(heading('De beheeromgeving is nog niet bereikbaar', 'Start de lokale beheerserver en probeer het opnieuw.'), el('div', { class: 'panel' }, el('p', {}, error.message), button('Opnieuw proberen', init, 'primary'))); notify(error.message, 'error');
    }
  }
  init();
})();
