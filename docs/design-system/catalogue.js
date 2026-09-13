const catalogue = JSON.parse(document.querySelector('#catalogue-data').textContent);
const theme = document.querySelector('#theme');
const width = document.querySelector('#width');
const root = new URL('../../', location.href);
const frames = [];
function applyTheme(doc) { doc.documentElement.dataset.theme = theme.value; }
function tokens() {
  applyTheme(document);
  const container = document.querySelector('#tokens'); container.replaceChildren();
  for (const token of ['ink','muted','paper','white','line','green','green-soft','clay']) {
    const value = getComputedStyle(document.documentElement).getPropertyValue('--'+token).trim();
    const tile = document.createElement('div'); tile.className = 'ds-token';
    const swatch = document.createElement('i'); swatch.style.background = value;
    const label = document.createElement('span'); label.textContent = token+' · '+value;
    tile.append(swatch,label); container.append(tile);
  }
}
function position(frame, component, status) {
  try {
    const doc = frame.contentDocument;
    applyTheme(doc);
    doc.addEventListener("submit", event => { event.preventDefault(); event.stopImmediatePropagation(); }, true);
    const element = doc.querySelector(component.selector);
    if (!element) throw new Error('Onderdeel niet gevonden');
    frame.contentWindow.scrollTo({top: Math.max(0, element.getBoundingClientRect().top + frame.contentWindow.scrollY - 100), behavior: 'instant'});
    status.textContent = 'Actueel lokaal voorbeeld geladen.';
  } catch (error) { status.className='ds-error'; status.textContent='Voorbeeld niet geladen. Open deze stijlgids via de lokale webserver. '+error.message; }
}
for (const component of catalogue.components) {
  const section=document.createElement('section');section.className='ds-example';section.id=component.id;
  const heading=document.createElement('h2');heading.textContent=component.name;
  const rule=document.createElement('p');rule.textContent=component.rule;
  const link=document.createElement('a');link.href=new URL(component.source,root);link.textContent='Open bronpagina';link.target='_blank';link.rel='noopener';
  const status=document.createElement('p');status.textContent='Voorbeeld laden…';status.setAttribute('role','status');
  const wrap=document.createElement('div');wrap.className='ds-frame-wrap';
  const frame=document.createElement('iframe');frame.title=component.name+' — echte lokale pagina';frame.width=width.value;
  frame.setAttribute('sandbox','allow-scripts allow-same-origin');frame.src=new URL(component.source,root);
  frame.addEventListener('load',()=>position(frame,component,status));wrap.append(frame);
  const details=document.createElement('details');const summary=document.createElement('summary');summary.textContent='Gebruik op '+component.pages.length+' pagina’s';details.append(summary);
  const list=document.createElement('ul');for(const page of component.pages){const li=document.createElement('li');const a=document.createElement('a');a.href=new URL(page.path,root);a.textContent=page.path+' ('+page.scope+')';li.append(a);list.append(li);}details.append(list);
  section.append(heading,rule,link,status,wrap,details);document.querySelector('#examples').append(section);frames.push({frame,component,status});
}
width.addEventListener('change',()=>frames.forEach(({frame,component,status})=>{frame.width=width.value;requestAnimationFrame(()=>position(frame,component,status));}));
theme.addEventListener('change',()=>{tokens();frames.forEach(({frame,component,status})=>position(frame,component,status));});
tokens();
