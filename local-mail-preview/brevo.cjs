'use strict';
// Transport only. Not a public endpoint. Spam control and deployment are separate release gates.
const {validate} = require('./core.cjs');
function createBrevo({apiKey, sender, recipient, listIds, templateId, redirectUrl, doiVerified=false, enabled=false}, fetchImpl=fetch) {
  async function request(endpoint, data) {
    if (!enabled || !apiKey) throw new Error('Mailkoppeling staat uit.');
    let res;
    try {
      res=await fetchImpl('https://api.brevo.com/v3/'+endpoint,{method:'POST',headers:{'api-key':apiKey,'Content-Type':'application/json'},body:JSON.stringify(data),signal:AbortSignal.timeout(8000)});
    } catch { throw new Error('Verzendstatus onzeker. Niet automatisch opnieuw verzenden.'); }
    if (!res.ok) throw new Error(res.status===429?'Verzendlimiet bereikt.':'Maildienst heeft het verzoek niet geaccepteerd.');
    return {accepted:true}; // Accepted by provider does not prove delivery.
  }
  return {
    async contact(body) {
      const b=validate('contact',body,[]);
      if (!sender || !recipient) throw new Error('Afzender of ontvanger ontbreekt.');
      return request('smtp/email',{sender:{email:sender,name:'Matthijs van Dam'},to:[{email:recipient}],replyTo:{email:b.email,name:b.naam},subject:'Websitecontact: '+b.onderwerp,textContent:['Professioneel contact via matthijsvandam.nl',b.naam,b.email,b.type,'',b.bericht].join('\n')});
    },
    async subscribe(body,streams) {
      const b=validate('subscribe',body,streams);
      throw new Error('De Brevo-bevestigingsroute is afgekeurd en niet vrijgegeven. Gebruik de aanvraaggebonden lokale route.');
    }
  };
}
module.exports={createBrevo};
