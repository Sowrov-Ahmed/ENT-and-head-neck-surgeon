/*
 * js/data/faqs.js
 * Path: js/data/faqs.js · Owner: Part 2 · Purpose: FAQ categories and questions (DB-shaped records) shown on faqs.html and contact.html
 * Depends on: nothing · Exposes: window.FAQS
 */
window.FAQS = {
  categories: [
    { id: 'faqc-001', slug: 'general', name: 'General', icon: 'info' },
    { id: 'faqc-002', slug: 'ears-hearing', name: 'Ears & hearing', icon: 'activity' },
    { id: 'faqc-003', slug: 'nose-sinus', name: 'Nose & sinus', icon: 'layers' },
    { id: 'faqc-004', slug: 'throat-voice', name: 'Throat & voice', icon: 'message-circle' },
    { id: 'faqc-005', slug: 'children', name: 'Children', icon: 'users' },
    { id: 'faqc-006', slug: 'fees-booking', name: 'Fees & booking', icon: 'credit-card' }
  ],
  items: [
    { id: 'faq-001', categoryId: 'faqc-001', question: 'When should I see an ENT doctor instead of a general physician?',
      answer: 'See an ENT doctor when ear, nose or throat symptoms last longer than two to three weeks, keep returning, or affect your hearing, breathing, sleep, swallowing or voice. Sudden hearing loss, a neck lump that is growing or blood in your saliva should be checked sooner, ideally within days.' },
    { id: 'faq-002', categoryId: 'faqc-001', question: 'Is the examination painful, and how long does a first visit take?',
      answer: 'The examination is gentle. A small light or a thin camera is used, and the doctor stops if anything feels uncomfortable. A first consultation usually takes about twenty minutes, because the history and the examination both need time. Please bring earlier reports, scans and a list of your medicines.' },
    { id: 'faq-003', categoryId: 'faqc-001', question: 'Will I need surgery if I come to see the doctor?',
      answer: 'Not necessarily. Many ear, nose and throat problems settle with medicines, cleaning, exercises or simple procedures in the chamber. Surgery is discussed only when it is likely to help you, and you will hear every option, including waiting, along with the likely cost before you decide anything.' },
    { id: 'faq-004', categoryId: 'faqc-002', question: 'Is it safe to clean my ears with cotton buds?',
      answer: 'No. Ear wax protects the canal, and cotton buds usually push it deeper and can scratch the skin or injure the eardrum. Clean only the outer ear with a damp cloth. If your ear feels blocked, itchy or painful, have it examined. Never use drops or oil in an ear that is discharging without medical advice.' },
    { id: 'faq-005', categoryId: 'faqc-002', question: 'I suddenly cannot hear well in one ear. Can I wait a few days?',
      answer: 'Please do not wait. Sudden hearing loss in one ear is urgent, and you should see a doctor within 72 hours, because early treatment gives the best chance of recovery. No treatment can promise a cure, but delay lowers the chances. Call the appointment desk and say clearly that your hearing dropped suddenly.' },
    { id: 'faq-006', categoryId: 'faqc-002', question: 'How do I know whether I need a hearing aid or a cochlear implant?',
      answer: 'A hearing test comes first. Hearing aids make sounds louder and suit most people with mild to severe loss. A cochlear implant is considered when hearing aids no longer give enough clarity, in children or adults. Audiometry is done at the Upashahar clinic, and the doctor explains the options after your results.' },
    { id: 'faq-007', categoryId: 'faqc-003', question: 'How can I tell whether my blocked nose is sinusitis or an allergy?',
      answer: 'Allergy often brings sneezing, itchy eyes and clear watery discharge that return with dust or seasons. Sinusitis tends to bring facial pressure, thick coloured discharge and a reduced sense of smell. Symptoms overlap, so an examination with a nasal camera is the reliable way to tell them apart. This page cannot diagnose you.' },
    { id: 'faq-008', categoryId: 'faqc-003', question: 'When is sinus surgery considered, and does it need external cuts?',
      answer: 'Surgery is considered when proper medical treatment for several months has not helped, or when polyps or a blockage keep the sinuses from draining. It is done with a thin camera through the nostrils, so there are no cuts on the face. Recovery varies, and the doctor explains the benefits and risks beforehand.' },
    { id: 'faq-009', categoryId: 'faqc-003', question: 'How do I stop a nosebleed at home?',
      answer: 'Sit up and lean forward, then pinch the soft part of your nose firmly for ten to fifteen minutes without letting go to check. Never tilt your head back. If bleeding continues after fifteen minutes, follows a heavy blow to the head, or you feel faint, go to the nearest emergency department.' },
    { id: 'faq-010', categoryId: 'faqc-004', question: 'Do I need antibiotics for a sore throat?',
      answer: 'Usually not. Most sore throats are caused by viruses, and antibiotics do not help them. They are kept for proven bacterial infections, which the doctor judges from your symptoms and examination. Warm fluids, rest and simple pain relief help meanwhile. See a doctor if you cannot swallow, or breathing is difficult.' },
    { id: 'faq-011', categoryId: 'faqc-004', question: 'My voice has been hoarse for weeks. Should I worry?',
      answer: 'Hoarseness after a cold usually settles within two weeks. If it lasts longer than three weeks, especially in smokers or people who use their voice a lot, have your voice box examined. The doctor uses a small camera to look at the vocal cords, which takes only a few minutes in the chamber.' },
    { id: 'faq-012', categoryId: 'faqc-004', question: 'Is loud snoring harmful, and when do I need a sleep study?',
      answer: 'Occasional snoring is common and harmless. Loud snoring with pauses in breathing, choking at night, morning headaches or daytime sleepiness may mean sleep apnoea, which strains the heart. In that case a sleep study is advised. Weight, sleep position, devices and, for some people, surgery can all help.' },
    { id: 'faq-013', categoryId: 'faqc-005', question: 'My child wakes at night with ear pain. What should I do?',
      answer: 'Give age-appropriate pain relief as the label advises, keep the child upright and offer fluids. Do not put drops, oil or anything in the ear if there is discharge. Many ear infections settle without antibiotics, but please have your child examined within a day, and sooner if there is high fever or swelling behind the ear.' },
    { id: 'faq-014', categoryId: 'faqc-005', question: 'Does my child need adenoid or tonsil surgery?',
      answer: 'Surgery is considered for frequent, proven tonsil infections, or for blocked adenoids that cause loud snoring, pauses in breathing, or repeated ear fluid. Many children outgrow milder problems, so watchful waiting is common. The doctor examines your child, explains the reasons for or against surgery, and you decide together.' },
    { id: 'faq-015', categoryId: 'faqc-005', question: 'What do parents need to know about consent and fasting before surgery?',
      answer: 'A parent or legal guardian signs the consent form after the doctor explains the operation, risks and recovery. Children must not eat or drink for the period the anaesthesia team specifies, so the stomach is empty and the anaesthetic is safe. The hospital gives written instructions the day before the operation.' },
    { id: 'faq-016', categoryId: 'faqc-006', question: 'What are the consultation fees at each chamber?',
      answer: 'The first visit costs ৳1,500 at Zindabazar, ৳1,200 at Upashahar and ৳2,000 at Dhaka Uttara. Follow-up visits cost ৳800, ৳600 and ৳1,000 respectively. Surgery and test costs depend on what is needed, so a written estimate is given after examination, and the final quote is always confirmed before you decide.' },
    { id: 'faq-017', categoryId: 'faqc-006', question: 'Can I pay by bKash or Nagad, and should I bring my old reports?',
      answer: 'Yes, you can pay consultation fees in cash, by bKash or by Nagad at the chamber desk. Please bring earlier hearing tests, scans, prescriptions and discharge papers. They save time, often avoid repeating tests and keep your costs lower. Photographs of reports sent on WhatsApp before the visit are also helpful.' },
    { id: 'faq-018', categoryId: 'faqc-006', question: 'How do I book, reschedule or cancel an appointment?',
      answer: 'Book online or call the appointment desk, open Saturday to Thursday from 9:00 AM to 8:00 PM. To reschedule or cancel, call or message on WhatsApp at least a few hours ahead so the slot can go to another patient. Slots last twenty minutes, and chamber days are shown on the Chambers page.' }
  ]
};
