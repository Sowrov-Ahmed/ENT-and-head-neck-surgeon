/*
 * js/data/chambers.js — Chamber DETAIL records (extra fields only; name, address, phone, schedule, fees, image and coordinates come from SITE.chambersIndex)
 * Path: js/data/chambers.js · Owner: Part 4 · Purpose: about text, facilities, directions, tips and map query per chamber
 * Depends on: nothing at load time (merged with SITE.chambersIndex by js/pages/chambers.js) · Exposes: window.CHAMBERS
 */
window.CHAMBERS = [
  {
    id: 'ch-001', slug: 'zindabazar',
    about: [
      'The Zindabazar chamber sits inside Surma Valley Specialized Hospital, the hospital where Dr. Ashfaq Talukder performs his surgeries. That makes it the natural place to start if you may need an operation, because your consultation, your tests and any admission planning happen under one roof.',
      'Sessions run on Saturday, Monday and Wednesday evenings, so many patients come straight after work or school. Each patient gets a twenty-minute slot, which leaves time for a camera examination of the ear, nose or throat and an unhurried explanation of the findings.'
    ],
    landmark: 'A short walk from Zindabazar Point, on the main road beside the row of pharmacies',
    facilities: [
      { icon: 'video', title: 'Video-endoscopy room', description: 'A thin camera shows your nose, throat or ear on a screen, so you can see what the doctor sees.' },
      { icon: 'activity', title: 'Microscope ear care', description: 'Safe ear cleaning and wax removal under a microscope, instead of poking at home with cotton buds.' },
      { icon: 'heart', title: 'Child-friendly waiting area', description: 'A soft seating corner with picture books and toys helps frightened children settle before their turn.' },
      { icon: 'shield', title: 'Hospital pharmacy', description: 'Prescribed medicines and dressings can be collected on the ground floor before you leave.' },
      { icon: 'wheelchair', title: 'Step-free access', description: 'A ramp and a lift reach the chamber floor, with wheelchairs available at the entrance.' },
      { icon: 'building', title: 'Surgery planning desk', description: 'Operations are done on Sunday to Wednesday mornings in this hospital, and the desk explains dates, admission and costs.' }
    ],
    howToReach: {
      byRoad: 'From the Zindabazar crossing, walk along the main road towards the pharmacy row. House 14 is on the same side as the hospital gate, about two minutes on foot.',
      byRideshare: 'Ask your ride-hailing driver for Surma Valley Specialized Hospital, Zindabazar. Drivers know the hospital well, so use its name rather than the house number.',
      byBus: 'City buses and CNG autorickshaws stop at Zindabazar Point. From the railway station or the long-distance bus stand, a CNG autorickshaw usually takes twenty to thirty minutes, depending on traffic.',
      parking: 'The hospital has a small car park behind the building, and it fills quickly on Saturday evenings. Motorcycles can use the covered bay beside the gate, and the main road offers limited roadside parking.'
    },
    patientTips: [
      'Arrive fifteen minutes before your slot so that the desk can open your file without rushing you.',
      'Bring every previous ear, nose or throat report, scan and prescription, and your current medicines in their strips.',
      'Saturday evenings are the busiest. Mondays and Wednesdays usually have shorter waits.',
      'If surgery is discussed, ask for the written cost estimate and bring a family member to listen with you.'
    ],
    mapQuery: 'House 14, Zindabazar Main Road, Sylhet 3100'
  },
  {
    id: 'ch-002', slug: 'upashahar',
    about: [
      'The Upashahar chamber is a quiet clinic in a residential block, built around hearing and balance. It is the only chamber with an in-house audiometry booth and a balance assessment room, so hearing tests, tympanometry and dizziness assessments are done here.',
      'Sessions run on Sunday and Tuesday mornings. The calmer setting suits older patients, parents with small children and anyone who finds hospitals tiring, and the short gaps between slots mean that you are rarely kept waiting.'
    ],
    landmark: 'Beside the playground of Block C, in a cream-coloured building with a green entrance canopy',
    facilities: [
      { icon: 'activity', title: 'In-house audiometry booth', description: 'A sound-treated room for pure-tone hearing tests, so you do not need to visit a separate laboratory.' },
      { icon: 'target', title: 'Balance assessment room', description: 'Simple bedside and positional tests for dizziness, including the repositioning manoeuvre when it is suitable.' },
      { icon: 'video', title: 'Video-endoscopy room', description: 'Camera examination of the ear, nose and throat with the pictures explained on screen.' },
      { icon: 'users', title: 'Quiet waiting lounge', description: 'Comfortable seating and a calm space, with a separate corner where children can play.' },
      { icon: 'wheelchair', title: 'Step-free entrance', description: 'The clinic is on the ground floor with a flat entrance and wide doors for wheelchairs and walking frames.' },
      { icon: 'car', title: 'Street parking', description: 'Wide residential roads allow easy parking for cars and motorcycles on most mornings.' }
    ],
    howToReach: {
      byRoad: 'Enter Upashahar and follow Road 5 to Block C. The clinic faces the playground, and the green canopy over the entrance is visible from the corner of the road.',
      byRideshare: 'Share the pin for Block C, Road 5, Upashahar with your driver. If the app places you on the wrong road, ask the driver to head for the Block C playground.',
      byBus: 'Take a CNG autorickshaw or rickshaw from the Upashahar main road. Local buses run along the main road, and the clinic is a short rickshaw ride inside the block.',
      parking: 'Residential streets around Block C allow parking for cars and motorcycles. Please keep the gate of neighbouring houses clear, and ask the clinic desk if you need help with a wheelchair.'
    },
    patientTips: [
      'Come with clean, dry ears and do not put drops, oil or cotton buds in your ear before a hearing test.',
      'A full hearing test takes about thirty to forty minutes, so book the consultation and test together.',
      'Bring any old hearing graphs. Comparing them with today’s result shows whether your hearing has changed.',
      'If you have a hearing aid, wear it to the clinic and bring its charger or spare batteries.'
    ],
    mapQuery: 'Block C, Road 5, Upashahar, Sylhet 3100'
  },
  {
    id: 'ch-003', slug: 'uttara',
    about: [
      'The Dhaka Uttara chamber serves patients from the capital and from towns around it who prefer to see Dr. Ashfaq Talukder without travelling to Sylhet. It is based in Crescent Head & Neck Centre in Sector 7 and meets on Thursday evenings and Friday mornings.',
      'It is well suited to second opinions and follow-up visits. If your care needs an operation, the team will plan the dates with you and the surgery is performed in Sylhet. Follow-up reviews afterwards can be done here to save you the journey.'
    ],
    landmark: 'Sector 7, Uttara, close to the Road 9 crossing and a short rickshaw ride from the main Uttara roads',
    facilities: [
      { icon: 'video', title: 'Video-endoscopy room', description: 'Clear camera pictures of the nose, throat and voice box, saved with your file for comparison at later visits.' },
      { icon: 'heart', title: 'Child-friendly waiting area', description: 'A bright corner with books and soft toys, and parents are welcome to stay beside the child.' },
      { icon: 'shield', title: 'Pharmacy beside the centre', description: 'A pharmacy next door stocks prescribed medicines and nasal-care supplies.' },
      { icon: 'wheelchair', title: 'Lift and step-free access', description: 'A lift serves every floor, and the entrance has a ramp for wheelchairs and prams.' },
      { icon: 'car', title: 'Basement parking', description: 'Basement parking is available for patients on a first-come basis, with a guard at the gate.' },
      { icon: 'file-text', title: 'Reports on WhatsApp', description: 'The desk can share your visit summary and prescription on WhatsApp so you always have a copy.' }
    ],
    howToReach: {
      byRoad: 'From the main Uttara road, turn into Sector 7 and follow Road 9. Plot 22 is marked by the Crescent Head & Neck Centre signboard above the ground-floor entrance.',
      byRideshare: 'Ride-hailing cars and motorcycles reach Plot 22, Road 9, Sector 7 easily. Share your live location with the driver if the app shows more than one Road 9.',
      byBus: 'Local buses along the Uttara main road stop within a short rickshaw ride of Sector 7. The Uttara stations of the Dhaka Metro Rail are also a rickshaw or CNG ride away.',
      parking: 'The centre has basement parking for cars and motorcycles. On Thursday evenings it can be full, so allow extra time or use a ride-hailing service.'
    },
    patientTips: [
      'Traffic in Uttara is heaviest on Thursday evenings, so leave early and allow at least forty-five minutes of margin.',
      'For a second opinion, bring your scans on a disc or phone, along with the written radiology reports.',
      'Friday morning sessions are shorter, so book early if you want to be seen before noon.',
      'Surgery is performed in Sylhet. Ask the desk about dates, travel and follow-up visits in Dhaka before you decide.'
    ],
    mapQuery: 'Plot 22, Road 9, Sector 7, Uttara, Dhaka 1230'
  }
];
