'use strict';

const services = {
  speech: { category: 'Communication', title: 'Speech & language therapy', concern: 'Speech & language therapy', intro: 'Communication is more than spoken words. We look at how your child understands, expresses needs and connects with the people around them.', areas: ['Understanding language and following everyday directions', 'Expressing needs, ideas and feelings', 'Speech sounds, clarity and social communication', 'Communication during play and daily routines'], note: 'Assessment helps identify the relevant communication goals. The approach and ways for parents to support practice are discussed with your family.' },
  ot: { category: 'Everyday skills', title: 'Occupational therapy', concern: 'Occupational therapy', intro: 'For a child, everyday occupations include playing, learning, getting dressed and taking part in family life. Occupational therapy supports participation in these meaningful activities.', areas: ['Fine and gross motor skills and coordination', 'Sensory processing and comfort in everyday settings', 'Play, attention and participation in activities', 'Self-care skills and daily independence'], note: "We begin with your child's abilities, interests and daily routines. Activities and goals are tailored to their needs rather than chosen from a fixed programme." },
  behaviour: { category: 'Regulation & connection', title: 'Behaviour therapy', concern: 'Behaviour therapy', intro: 'Behaviour can tell us something about a child’s needs, environment or communication. We work to understand that context and build practical skills with respectful support.', areas: ['Understanding patterns around behaviour and transitions', 'Communication and useful everyday skills', 'Emotional regulation and participation in routines', 'Consistent strategies that caregivers can understand and use'], note: 'Behaviour support, including ABA-informed approaches where appropriate, is discussed after assessment. Ask us about the goals, methods and how your child’s comfort is considered.' },
  education: { category: 'Learning', title: 'Special education', concern: 'Special education', intro: 'Learning support should start where a child is today. We use structured, accessible activities to develop understanding and participation at their own pace.', areas: ['Early learning concepts and foundational skills', 'Attention, task engagement and learning routines', 'School readiness and classroom participation', 'Learning support and practical independence'], note: 'The plan reflects your child’s current learning profile and family priorities. Existing school observations and reports can help inform the discussion.' },
  early: { category: 'Early development', title: 'Early intervention', concern: 'Early intervention', intro: 'Early support brings developmental skills into play and everyday routines. The aim is to understand a child’s emerging abilities and help families find useful ways to support them.', areas: ['Communication, connection and shared play', 'Movement and early sensory-motor skills', 'Participation in everyday routines', 'Parent guidance and coordination across relevant therapies'], note: 'There is no single pathway for every young child. We discuss assessment needs and support options with your family before planning intervention.' },
  psychology: { category: 'Emotional wellbeing', title: 'Psychological support', concern: 'Psychological support', intro: 'A clinical psychologist consultation provides space to explore emotional, behavioural and developmental concerns and discuss appropriate support.', areas: ['Understanding emotional and behavioural concerns', 'Discussion of developmental and family observations', 'Guidance on assessment needs and next steps', 'Parent and caregiver support'], note: 'Contact the center to confirm the clinical psychologist’s availability and the scope of consultation before booking.' },
  parents: { category: 'Family partnership', title: 'Parent & caregiver counselling', concern: 'Parent & caregiver counselling', intro: 'Supporting a child also means supporting the people around them. We make room for questions, shared observations and guidance that fits your family’s life.', areas: ['Understanding your child’s support needs', 'Making sense of therapy goals and progress', 'Practical strategies for routines at home', 'Caregiver questions, concerns and family priorities'], note: 'Guidance is shaped around your family’s circumstances. We discuss what is manageable, review what is working and adapt together.' }
};
const journey = [
  { label: 'Step 01 / A conversation', heading: "Let's start with what you're noticing.", description: "Perhaps communication feels difficult, everyday routines are a struggle, or you have questions about learning and development. You don't need to have all the answers before getting in touch.", points: ["A conversation about your concerns and your child's strengths", 'Clarity on which professional or assessment may be useful', 'Time to ask questions before deciding how to proceed'], note: 'Share what life is like at home. Your observations help us see the whole child.' },
  { label: 'Step 02 / Assessment & observation', heading: 'Get to know the whole child.', description: "We explore the skills relevant to your concerns, alongside your child's interests, comfort and everyday experiences. Assessment gives us a starting point for a useful conversation about support.", points: ['Discussion of developmental history and relevant observations', 'Assessment of the skills connected to your concerns', 'An explanation of findings and appropriate next steps'], note: 'Bring relevant reports if you have them, and tell us what your child enjoys and what feels difficult.' },
  { label: 'Step 03 / A shared plan', heading: 'Choose goals that matter in real life.', description: "We discuss practical priorities with you and build an individual plan. The goals should connect to daily life, whether that means asking for help, joining in play or managing a routine more comfortably.", points: ['Clear goals based on assessment and family priorities', 'Discussion of recommended therapies, frequency and scheduling', 'Practical guidance for supporting skills beyond the session'], note: 'Tell us what matters most to your family and what is realistic within your everyday routine.' },
  { label: 'Step 04 / Review & adapt', heading: 'Make progress a shared conversation.', description: 'We look at what is changing, what is proving difficult and whether the goals still fit. Your observations from home add an important perspective to what we see during sessions.', points: ['Discussion of progress against the agreed goals', 'Shared observations from sessions and home', 'Adjustments to goals and support when appropriate'], note: 'Share small changes, questions and difficulties. Progress is personal, and the plan should remain useful.' }
];

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
const menuToggle = $('.menu-toggle');
const navigation = $('#main-nav');
function closeMenu(restoreFocus = false) {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
  navigation.classList.remove('open');
  if (restoreFocus) menuToggle.focus();
}
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  navigation.classList.toggle('open', open);
});
navigation.addEventListener('click', event => {
  const link = event.target.closest('a');
  if (!link) return;
  const wasOpen = navigation.classList.contains('open');
  closeMenu();
  if (wasOpen && link.hash) {
    const target = document.getElementById(link.hash.slice(1));
    if (target) { target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); }
  }
});
document.addEventListener('click', event => {
  if (navigation.classList.contains('open') && !event.target.closest('.header-inner')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('open')) closeMenu(true);
});
const navQuery = window.matchMedia('(max-width: 900px)');
navQuery.addEventListener('change', () => closeMenu());

$$('[data-filter]').forEach(button => button.addEventListener('click', () => {
  const category = button.dataset.filter;
  $$('[data-filter]').forEach(filter => {
    const selected = filter === button;
    filter.classList.toggle('active', selected);
    filter.setAttribute('aria-pressed', String(selected));
  });
  let count = 0;
  $$('.service-card').forEach(card => {
    const visible = category === 'all' || card.dataset.categories.split(' ').includes(category);
    card.hidden = !visible;
    if (visible) count++;
  });
  $('#filter-status').textContent = `Showing ${count} ${count === 1 ? 'service' : 'services'}${category === 'all' ? '.' : ` for ${button.textContent}.`}`;
}));

let currentStep = 0;
function setStep(index, focus = false) {
  currentStep = Math.max(0, Math.min(journey.length - 1, index));
  const step = journey[currentStep];
  $$('.journey-tab').forEach((tab, i) => {
    const selected = i === currentStep;
    tab.classList.toggle('active', selected);
    tab.setAttribute('aria-selected', String(selected));
    tab.setAttribute('tabindex', selected ? '0' : '-1');
    if (selected && focus) tab.focus();
  });
  $('#journey-panel').setAttribute('aria-labelledby', `step-tab-${currentStep}`);
  $('#journey-label').textContent = step.label;
  $('#journey-count').textContent = `${String(currentStep + 1).padStart(2, '0')} / 04`;
  $('#journey-heading').textContent = step.heading;
  $('#journey-description').textContent = step.description;
  $('#journey-list').replaceChildren(...step.points.map(text => { const li = document.createElement('li'); li.textContent = text; return li; }));
  $('#journey-note').replaceChildren();
  const strong = document.createElement('strong'); strong.textContent = 'Your part: ';
  $('#journey-note').append(strong, step.note);
  $('#journey-prev').disabled = currentStep === 0;
  $('#journey-next').disabled = currentStep === journey.length - 1;
}
$$('.journey-tab').forEach(tab => {
  tab.addEventListener('click', () => setStep(Number(tab.dataset.step)));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (currentStep + 1) % journey.length;
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (currentStep + journey.length - 1) % journey.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = journey.length - 1;
    if (next !== undefined) { event.preventDefault(); setStep(next, true); }
  });
});
$('#journey-prev').addEventListener('click', () => { setStep(currentStep - 1); $('#journey-panel').focus({ preventScroll: true }); });
$('#journey-next').addEventListener('click', () => { setStep(currentStep + 1); $('#journey-panel').focus({ preventScroll: true }); });

const serviceDialog = $('#service-dialog');
const photoDialog = $('#photo-dialog');
const legalDialog = $('#legal-dialog');
let currentService = '';
let hashReturn = '#services';
function showDialog(dialog) {
  if (dialog.open) return;
  closeMenu();
  dialog.showModal();
  document.body.classList.add('modal-open');
}
function openService(key, updateHash = true) {
  const service = services[key];
  if (!service) return;
  currentService = key;
  $('#service-dialog-category').textContent = service.category;
  $('#service-dialog-title').textContent = service.title;
  $('#service-dialog-intro').textContent = service.intro;
  $('#service-dialog-note').textContent = service.note;
  $('#service-dialog-list').replaceChildren(...service.areas.map(text => { const li = document.createElement('li'); li.textContent = text; return li; }));
  if (updateHash) { hashReturn = location.hash || '#services'; history.pushState(null, '', `#service-${key}`); }
  showDialog(serviceDialog);
}
$$('[data-service]').forEach(button => button.addEventListener('click', () => openService(button.dataset.service)));
function resetMessage() { $('#enquiry-form').hidden = false; $('#message-ready').hidden = true; }
function setConcern(value) { $('#concern').value = value; resetMessage(); }
$$('[data-concern]').forEach(link => link.addEventListener('click', () => setConcern(link.dataset.concern)));
$('#service-enquire').addEventListener('click', () => {
  setConcern(services[currentService].concern);
  serviceDialog.close();
});

$$('[data-photo]').forEach(button => button.addEventListener('click', () => {
  $('#large-photo').src = `assets/${button.dataset.photo}`;
  $('#large-photo').alt = $('img', button).alt;
  $('#photo-caption').textContent = button.dataset.caption;
  showDialog(photoDialog);
}));

const policySections = {
  terms: [
    ['About Edelweizz', 'Edelweizz Pediatric Therapy Center provides pediatric therapy and developmental support services including speech therapy, occupational therapy, behaviour therapy, ABA-informed support, special education, early intervention, parent guidance, and related child-development support.'],
    ['Use of this website', 'The information on this website is for general awareness and parent guidance. It should not be treated as a diagnosis, medical prescription, emergency service, or replacement for an in-person professional assessment.'],
    ['Appointments and assessments', 'Appointments, assessments, therapy plans, session availability, fees, and schedules are subject to confirmation by Edelweizz. A therapy plan is created only after understanding the child’s needs, history, parent concerns, and professional observations.'],
    ['Parent and caregiver responsibility', 'Parents or caregivers are responsible for sharing accurate information about the child’s developmental history, medical background, school concerns, previous reports, allergies, behavioural concerns, and any other relevant details that may affect therapy planning or child safety.'],
    ['Therapy outcomes', 'Every child’s progress is different. Edelweizz aims to provide structured, respectful, child-centered support, but does not guarantee a specific outcome, timeline, school placement, diagnosis change, or developmental result.'],
    ['Payments, cancellation, and rescheduling', 'Fees, payment terms, cancellation rules, refunds, and rescheduling policies may be communicated separately at the time of assessment or admission. Parents are requested to confirm these details directly with the center before starting services.'],
    ['Intellectual property', 'The Edelweizz name, logo, website content, designs, therapy materials created by the center, and brand assets belong to Edelweizz Pediatric Therapy Center unless otherwise stated. They may not be copied, reused, or distributed without written permission.']
  ],
  privacy: [
    ['Information we may collect', 'We may collect parent or caregiver name, phone number, email address, child’s name and age, appointment details, developmental concerns, previous reports shared by parents, school or therapy history, and information needed to plan assessments or therapy support.'],
    ['How we use information', 'Information may be used to respond to enquiries, book appointments, plan assessments, prepare therapy goals, communicate with parents, coordinate sessions, maintain records, improve services, and support child safety and continuity of care.'],
    ['Child-related information', 'Child-related information is treated with care and shared internally only with relevant professionals involved in assessment, therapy planning, documentation, supervision, or center operations. We request parents not to share sensitive information unless it is needed for assessment or therapy support.'],
    ['Sharing of information', 'Edelweizz does not sell personal information. Information may be shared only with consent, with relevant care professionals involved in the child’s support, with service providers who help us operate the center or website, or where required by applicable law, safety concerns, or regulatory requirements.'],
    ['WhatsApp, phone, and email communication', 'When parents contact us by WhatsApp, phone, or email, the communication may include personal or child-related information. Parents should use these channels thoughtfully and avoid sending unnecessary sensitive documents unless requested by the center.'],
    ['Website data', 'Our website may collect basic technical information such as browser type, device information, general usage patterns, and pages visited if analytics or hosting tools are enabled. This helps us improve the website and understand parent needs better.'],
    ['Data protection and retention', 'We take reasonable steps to protect information shared with us. Records may be retained for service continuity, clinical documentation, legal, operational, or administrative purposes. Parents may contact us to ask about correction or deletion requests, subject to applicable requirements and professional record-keeping needs.'],
    ['Photos and testimonials', 'We will seek parent or guardian permission before using identifiable child photos, videos, testimonials, or progress stories for marketing or public communication.']
  ]
};
function openLegal(key, updateHash = true) {
  if (!policySections[key]) return;
  $('#legal-title').textContent = key === 'privacy' ? 'Privacy policy' : 'Terms & conditions';
  const body = $('#legal-body'); body.className = 'legal-text'; body.replaceChildren();
  const date = document.createElement('p'); date.textContent = 'Center policy · Last updated July 2026'; body.append(date);
  const intro = document.createElement('p');
  intro.textContent = key === 'privacy' ? 'We respect the privacy of children and families. This policy explains how Edelweizz may collect and use information shared through the website, phone, WhatsApp, email, assessments, and center interactions.' : 'These terms are written for the Edelweizz website and appointment enquiries. They do not replace clinical advice, emergency care, or a formal agreement signed with the center.';
  body.append(intro);
  if (key === 'privacy') {
    const heading = document.createElement('h3'); heading.textContent = 'About this private review site';
    const paragraph = document.createElement('p'); paragraph.textContent = 'The message builder prepares text in your browser. It does not submit the form to Edelweizz or save your entries. Choosing “Review in WhatsApp” opens WhatsApp with the prepared text; you decide whether to send it. WhatsApp, email, Maps and LinkedIn are external services with their own privacy policies. This review site uses no added analytics or advertising trackers.';
    body.append(heading, paragraph);
  }
  policySections[key].forEach(([title, text], i) => {
    const heading = document.createElement('h3'); heading.textContent = `${i + 1}. ${title}`;
    const paragraph = document.createElement('p'); paragraph.textContent = text;
    body.append(heading, paragraph);
  });
  const contact = document.createElement('h3'); contact.textContent = 'Contact';
  const line = document.createElement('p'); const link = document.createElement('a'); link.href = 'mailto:Edelweizzcenter@gmail.com'; link.textContent = 'Edelweizzcenter@gmail.com'; line.append(link);
  body.append(contact, line);
  if (updateHash) { hashReturn = location.hash || '#home'; history.pushState(null, '', `#${key}`); }
  showDialog(legalDialog);
}
$$('[data-legal]').forEach(button => button.addEventListener('click', () => openLegal(button.dataset.legal)));
$$('dialog').forEach(dialog => {
  $('.dialog-close', dialog).addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target !== dialog) return; const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); });
  dialog.addEventListener('close', () => {
    if (!$$('dialog').some(item => item.open)) document.body.classList.remove('modal-open');
    if ((dialog === serviceDialog && location.hash.startsWith('#service-')) || (dialog === legalDialog && ['#privacy', '#terms'].includes(location.hash))) history.replaceState(null, '', hashReturn);
  });
});
function routeHash() {
  const hash = location.hash;
  if (hash.startsWith('#service-') && services[hash.slice(9)]) { hashReturn = '#services'; openService(hash.slice(9), false); }
  else if (hash === '#privacy' || hash === '#terms') { hashReturn = '#home'; openLegal(hash.slice(1), false); }
  else { if (serviceDialog.open) serviceDialog.close(); if (legalDialog.open) legalDialog.close(); }
}
window.addEventListener('hashchange', routeHash);
window.addEventListener('popstate', routeHash);
routeHash();

$('#enquiry-form').addEventListener('submit', event => {
  event.preventDefault();
  const name = $('#parent-name').value.trim();
  const concern = $('#concern').value;
  const question = $('#message').value.trim();
  const greeting = name ? `Hello Edelweizz, my name is ${name}.` : 'Hello Edelweizz.';
  const interest = concern === 'Help me choose' ? "I'd like help understanding a starting point for my child." : concern === 'Visit the center' ? "I'd like to arrange a visit to the center." : concern === 'Another question' ? 'I have a question for your team.' : `I'd like to ask about ${concern.toLowerCase()}.`;
  const text = [greeting, interest, question, 'Please let me know a suitable next step.'].filter(Boolean).join('\n\n');
  $('#prepared-message').textContent = text;
  $('#send-whatsapp').setAttribute('href', `https://wa.me/919886261567?text=${encodeURIComponent(text)}`);
  $('#enquiry-form').hidden = true;
  $('#message-ready').hidden = false;
  $('#send-whatsapp').focus({ preventScroll: true });
});
$('#edit-message').addEventListener('click', () => { resetMessage(); $('#parent-name').focus({ preventScroll: true }); });

if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      $$('#main-nav a').forEach(link => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });
  $$('main>section[id], main>.journey-section').forEach(section => sectionObserver.observe(section));
}
