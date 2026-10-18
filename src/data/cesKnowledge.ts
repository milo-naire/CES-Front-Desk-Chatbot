export interface StaffMember {
  name: string;
  role: string;
  unit: string;
  email: string;
  phone?: string;
  extension?: string;
  responsibilities: string[];
  communities?: string[];
}

export interface QuickScript {
  id: string;
  title: string;
  category: 'Student' | 'Employer' | 'Alumni' | 'Phone' | 'Protocol' | 'Tech';
  scenario: string;
  script: string;
  action: string;
  note?: string;
}

export const STAFF_DIRECTORY: StaffMember[] = [
  {
    name: 'William Jones',
    role: 'Executive Director',
    unit: 'Senior Leadership',
    email: 'careers@echo.rutgers.edu',
    phone: '848-932-7997',
    responsibilities: ['Overall CES Leadership', 'Departmental Strategy'],
  },
  {
    name: 'Topher Sutton',
    role: 'Associate Director, Operations',
    unit: 'Career Operations & Strategic Initiatives',
    email: 'csutton@echo.rutgers.edu',
    phone: '908-500-4997',
    responsibilities: [
      'Front desk operations (GTV & Busch)',
      'Handshake daily appointment reports',
      'Parking voucher supervisor',
      'Schedule adjustments & attendance',
      'CRI & CRM supervisor escalation',
    ],
  },
  {
    name: 'Lisa Goddard',
    role: 'Sr. Assistant Director, Career & Internship Fairs',
    unit: 'Industry & Student Connections (Recruiting Programs)',
    email: 'lgoddard@echo.rutgers.edu',
    phone: '848-445-7287',
    extension: '57287',
    responsibilities: [
      'Career Fair Registration',
      'Career Fair Booth Assignments',
      'Career Fair Invoicing & Payment issues',
    ],
  },
  {
    name: 'Larissa Keller',
    role: 'Associate Director, Recruiting Programs',
    unit: 'Industry & Student Connections (Recruiting Programs)',
    email: 'lkeller@rutgers.edu',
    phone: '848-445-5572',
    responsibilities: [
      'Career Fair Shipping logistics',
      'Career Fair Parking permits',
      'Fair dietary concerns & event accessibility',
      'Busch interview room reservation approval',
      'On Campus Interviewing (OCI) program lead',
    ],
    communities: ['Doctoral Students', 'Student Organizations', 'Military-Affiliated', 'Student Athletes'],
  },
  {
    name: 'Toni Berlingieri',
    role: 'Assistant Director, Networking Sessions & Interviewing Program',
    unit: 'Industry & Student Connections (Recruiting Programs)',
    email: 'berling@echo.rutgers.edu',
    phone: '848-445-5561',
    extension: '55561',
    responsibilities: [
      'Career fair payment questions from employers',
      'Networking sessions & information sessions',
      'Employer interview scheduling',
    ],
  },
  {
    name: 'Rania Plazas',
    role: 'Assistant Director, Rutgers Internship & Co-op Programs (RICP / RICC)',
    unit: 'Career Readiness (Internships & Professional Development)',
    email: 'internships@echo.rutgers.edu',
    phone: '848-445-5582',
    extension: '55582',
    responsibilities: [
      'Rutgers Internship & Co-op Course (RICC)',
      'Academic internship credit questions & SPNs',
      'Employer internship requirements for credit',
    ],
  },
  {
    name: 'Heather Escalona',
    role: 'Assistant Director, Rutgers Scarlet Service Internship (RSSI) Program',
    unit: 'Career Readiness (Internships & Professional Development)',
    email: 'heather.esc@rutgers.edu',
    phone: '848-445-5584',
    extension: '55584',
    responsibilities: [
      'Rutgers Scarlet Service Internship (RSSI) student questions',
      'Summer $5,000 stipend program for non-profit/government roles',
    ],
  },
  {
    name: 'Zac Stager',
    role: 'Industry & Campus Connections / RSSI Employer Lead',
    unit: 'Industry & Student Connections',
    email: 'zps3@echo.rutgers.edu',
    phone: '848-445-5557',
    extension: '55557',
    responsibilities: [
      'Busch front desk escalation',
      'RSSI employer lead',
      'On-Campus Interviewing (OCI) schedules & lunch vouchers (193C)',
      'Industry connector for Food, Ag, Environment, Education, Policy, Law',
    ],
  },
  {
    name: 'Catarina Caulfield',
    role: 'Associate Director, Industry & Campus Connections',
    unit: 'Industry & Student Connections',
    email: 'catarina.caulfield@rutgers.edu',
    phone: '848-932-0196',
    extension: '20196',
    responsibilities: [
      'Fraudulent employer complaints and reports from students',
      'Employer Handshake denied accounts & trust scores',
      'Industry connector: Tech, Engineering, Physical Sciences, Arts, Media',
    ],
    communities: ['Arts, Media', 'Hospitality', 'Tech & Engineering', 'Physical Sciences'],
  },
  {
    name: 'Sharon Fash',
    role: 'Assistant Director, Industry & Campus Connections',
    unit: 'Industry & Student Connections',
    email: 'sfash@rutgers.edu',
    phone: '848-445-5592',
    extension: '55592',
    responsibilities: [
      'Intern for a Day (IFAD) employer outreach & matching',
      'Undecided & Exploratory community employer lead',
      'Environment & Sustainability, Food & Natural Resources',
    ],
  },
  {
    name: 'Tiffany Rice',
    role: 'Assistant Director, Career Exploration',
    unit: 'Career Discovery',
    email: 'tiffany.rice@rutgers.edu',
    responsibilities: [
      'Intern for a Day (IFAD) student program details',
      'Undecided & Exploratory Career Community advising',
    ],
  },
  {
    name: 'Shalini Jain',
    role: 'Assistant Director, Industry & Campus Connections',
    unit: 'Industry & Student Connections',
    email: 'shalini.jain@rutgers.edu',
    phone: '848-932-0164',
    extension: '20164',
    responsibilities: [
      'International student employer relations',
      'Life & Health Sciences, Medical Professions',
      'Handshake employer approvals',
    ],
  },
  {
    name: 'Barbara Thomson',
    role: 'Unit Director, Career Operations & Strategic Initiatives',
    unit: 'Senior Leadership',
    email: 'thomson.barbara@rutgers.edu',
    responsibilities: [
      'Handshake student account unblocking/reactivation',
      'Student-Alumni Career Connect (SACC) policy',
      'Departmental operations',
    ],
  },
  {
    name: 'Michelle St. George',
    role: 'Assistant Director, Employer Relations & Sponsorships',
    unit: 'Industry & Student Connections',
    email: 'michelle.stgeorge@rutgers.edu',
    phone: '848-445-7287',
    extension: '57287',
    responsibilities: [
      'Knights of the Round Table (KORT) sponsorship packages ($2,500-$15,000)',
      'Panelist and guest speaker inquiries from employers',
      'Business, Sales, Marketing, HR, Finance employer connections',
    ],
  },
  {
    name: 'Susan Bennett / Eileen Hallman / Jessica Wilson',
    role: 'First-Year Career Engagement Directors',
    unit: 'Career Discovery',
    email: 'careers@echo.rutgers.edu',
    responsibilities: [
      'FIGS (First-Year Interest Group Seminars) courses (01:090:120)',
      'Peer Instructor (PI) selection & supply requests',
    ],
  },
  {
    name: 'Madeline Giordana',
    role: 'Sr. Assistant Director, Career Outcomes & Assessment',
    unit: 'Career Operations & Strategic Initiatives',
    email: 'careers@echo.rutgers.edu',
    responsibilities: [
      'Post-Graduation Survey (PGS) phone campaigns & data',
    ],
  },
];

export const QUICK_SCRIPTS: QuickScript[] = [
  {
    id: 'student-no-appointment',
    title: 'Student Walk-In (No Appointment)',
    category: 'Student',
    scenario: 'A student arrives in the office asking to speak with a career advisor right now.',
    script: 'Tell the visitor: "Unfortunately, we do not offer walk-in or drop-in appointments at this time. You can schedule an appointment on Handshake at rutgers.joinhandshake.com to meet with an advisor or peer coach."',
    action: '1. Keep office door closed; verify if they have an existing appointment on Handshake.\\n2. If not, guide them on their own phone or laptop to Handshake > Appointments to book an upcoming slot.\\n3. Explain that College Ave and Busch offices are strictly appointment-only.',
  },
  {
    id: 'handshake-account-locked',
    title: 'Handshake Account Locked / Suspended',
    category: 'Student',
    scenario: 'A student calls or visits stating their Handshake account is disabled or blocked after missing an interview or appointment.',
    script: 'Tell the visitor: "Your Handshake privileges are blocked due to a missed appointment or cancellation policy. You can submit an appeal letter to careers@echo.rutgers.edu with the subject line \'No-Show Appointment\' to request reactivation."',
    action: '1. Ask the student for their RUID to confirm their record.\\n2. Instruct them to email a three-paragraph/one-page letter to careers@echo.rutgers.edu (attention Barbara Thomson: thomson.barbara@rutgers.edu).\\n3. For additional technical support, they can reach 848-445-4357.',
  },
  {
    id: 'employer-fair-payment',
    title: 'Employer Asking About Career Fair Payment',
    category: 'Employer',
    scenario: 'An employer calls the front desk asking about an invoice, fee, or payment for the Career Fair.',
    script: 'Tell the visitor: "I can connect you directly with Toni Berlingieri, who handles our career fair payment and invoice questions."',
    action: '1. Press the black transfer button on the phone.\\n2. Dial Toni Berlingieri at x55561 (848-445-5561) or Lisa Goddard at x57287.\\n3. Introduce the caller. If neither answers, log caller name, company, email, and phone in the MS Teams Phone Log.',
  },
  {
    id: 'fair-location-werblin',
    title: 'Career Fair Location & Parking (Winter 2025)',
    category: 'Employer',
    scenario: 'An employer or student asks where the upcoming Career Fair is taking place and where to park.',
    script: 'Tell the visitor: "The Winter 2025 Mega Fair is at the Sonny Werblin Recreation Center (656 Bartholomew Rd, Piscataway), NOT Jersey Mike\'s Arena. Employers should park in adjacent lots 60A, 60B, 64, or 67."',
    action: '1. Confirm reps pre-register for parking via their email link or register on-site at check-in.\\n2. For booth lookups, refer to the printed Mega Fair booth assignment sheet for the specific fair day.\\n3. Remind reps staff will greet and escort them to their booth upon arrival.',
  },
  {
    id: 'parking-voucher-alumni-employer',
    title: 'Validating Parking Vouchers at Gateway (GTV)',
    category: 'Protocol',
    scenario: 'An alumnus or visiting employer asks for parking validation at the Gateway Desk.',
    script: 'Tell the visitor: "Parking validation is available for alumni attending in-person advising and employers attending scheduled meetings. Please take this voucher, and remember to scan your pulled garage ticket first at the exit gate, followed by this voucher second under the laser."',
    action: '1. Verify eligibility: ONLY Alumni attending in-person advising or employers/campus partners attending meetings (NEVER current students for classes).\\n2. Pull a voucher from the right-middle drawer under the swipe computer.\\n3. Fill out the Parking Voucher Request form: record Voucher #, Name, Date, and Reason.\\n4. Warn them: DO NOT scan at pay machines (doing so voids the voucher); scan at exit lanes ONLY.',
  },
  {
    id: 'kiosk-swipe-broken',
    title: 'Kiosk Swipe or Tap Not Working',
    category: 'Tech',
    scenario: 'A student arrives for an appointment, but the card swiper or tap reader is not registering their card.',
    script: 'Tell the visitor: "Please type in your 9-digit RUID number directly into the box. Do not enter your email address even though the screen prompts for an email."',
    action: '1. Click into the input box on the kiosk screen to ensure it has focus.\\n2. Have the student type their 9-digit RUID number and hit Submit/Go.\\n3. Entering an email address will cause an error on the Rutgers Handshake kiosk.',
  },
  {
    id: 'phone-answering-transfer',
    title: 'Standard Phone Greeting & Transfer Steps',
    category: 'Phone',
    scenario: 'A student intern needs to answer the incoming desk phone and transfer a call.',
    script: 'Tell the caller: "Thank you for calling the Office of Career Exploration and Success, this is [Your Name] speaking. How may I help you?"',
    action: '1. Greet politely and request RUID (student) or Organization Name (employer).\\n2. To place on hold, hit the Pause button (max 2 minutes).\\n3. To transfer: Press the black Transfer button, enter extension/number (or press "2" to see page 2), wait for recipient to pick up, announce caller. If no answer, drop transfer and log caller info.',
  },
  {
    id: 'ricc-internship-credit',
    title: 'Rutgers Internship & Co-op Course (RICC)',
    category: 'Student',
    scenario: 'A student asks how to earn academic credit for an internship or co-op they just landed.',
    script: 'Tell the visitor: "You can apply for academic credit through the Rutgers Internship & Co-op Course (RICC) on our website at careers.rutgers.edu/ricc once you have a confirmed offer. RICC provides general elective credit, requires at least 30 completed credits, a 2.5 GPA, and a minimum of 120 internship hours."',
    action: '1. Note that employers cannot award credit; students must register for the course via WebReg using an issued SPN.\\n2. The student must submit their online application, and their supervisor must complete the employer section before it is reviewed (2-7 business days).\\n3. Direct remaining questions to internships@echo.rutgers.edu (Rania Plazas, 848-445-5582).',
  },
  {
    id: 'alumni-advising-limits',
    title: 'Alumni Advising Limits & Referrals',
    category: 'Alumni',
    scenario: 'A Rutgers alumnus calls asking for career counseling and resume reviews.',
    script: 'Tell the visitor: "Rutgers–New Brunswick alumni within 1 year of graduation can schedule up to two career advising appointments per calendar year through Handshake. If you graduated more than 1 year ago, we refer you to the Rutgers Alumni Association and Foundation career resources at rutgersfoundation.org/career-resources."',
    action: '1. Check graduation year in Handshake or via Rutgers ID Query (identityservices.rutgers.edu/ruidquery/query.html).\\n2. If within 1 year: book via Handshake (max 2 sessions/year).\\n3. If 1+ years: refer to rutgersfoundation.org/career-resources and Student-Alumni Career Connect (SACC) at rutgers.peoplegrove.com.',
  },
  {
    id: 'iris-booth-freeze',
    title: 'Iris Photo Booth Frozen or Unresponsive',
    category: 'Tech',
    scenario: 'The Iris Headshot Photo Booth screen is stuck, black, or not advancing.',
    script: 'Tell the visitor: "We will reboot the photo booth system now; it will take about 2 to 3 minutes to restart."',
    action: '1. Plug the keyboard into an available USB port on the unit.\\n2. Press Alt + F4 to exit to the desktop.\\n3. Click the Raspberry icon at top-left > Log out > Reboot.\\n4. Do NOT touch the monitor while it reboots. If the camera disconnected: turn camera off, reboot system, turn camera back on during reboot.',
  },
  {
    id: 'visitor-refuses-to-leave',
    title: 'Disruptive Visitor Refusing to Leave',
    category: 'Protocol',
    scenario: 'A non-client or agitated visitor without an appointment refuses to leave the reception area.',
    script: 'Tell the visitor: "Unfortunately, only visitors utilizing our scheduled services are permitted in the office. If you do not leave, I will be required to notify campus police."',
    action: '1. Remain calm, do not raise your voice, and set firm boundaries.\\n2. Immediately alert full-time staff (Topher Sutton or another staff member).\\n3. IF CONCERNED ABOUT SAFETY: Immediately press the panic button under the front desk to summon RUPD, or dial 911 / 848-932-7211.',
  },
  {
    id: 'webclock-missed-punch',
    title: 'Forgot to Clock In/Out on WebClock',
    category: 'Protocol',
    scenario: 'A student employee forgot to punch in or out on Cornerstone Web Clock.',
    script: 'Tell the worker: "You must submit the official Smartsheet time adjustment form at https://go.rutgers.edu/CESTimeAdjust (or the Smartsheet adjustment link). Adjustments are no longer accepted via text, email, or GroupMe."',
    action: '1. Fill out form: https://app.smartsheet.com/b/form/ba48d84ac3ce4102b863714687e58be9\\n2. Provide date, scheduled shift, actual time worked, and supervisor name.\\n3. Topher Sutton will review and update payroll.',
  },
];

export const OFFICE_CONFIG = {
  collegeAve: {
    name: 'College Ave Campus (Gateway Transit Village)',
    address: '106 Somerset Street, 4th Floor, New Brunswick, NJ 08901',
    phone: '848-932-7997',
    hours: '9:00 AM – 5:00 PM (Front desk staff M/W/F 8am-5:30pm, T/Th 8am-6:30pm)',
    voicemail: {
      dial: '*45292',
      id: '*45292#',
      pin: '2273322# (or CAREERS#)',
    },
    locationCode: '3178',
    notes: 'No walk-ins! Phone in hallway for appointments before entry. Panic button under reception desk.',
  },
  busch: {
    name: 'Busch Campus (Busch Student Center)',
    address: '604 Bartholomew Road, Room 177 / 175, Piscataway, NJ 08854',
    phone: '848-445-6127',
    recruitingPhone: '848-445-7287',
    accessCode: '0833',
    hours: '9:00 AM – 5:00 PM',
    voicemail: {
      dial: '*45234',
      id: '#45234',
      pin: '2273322# (or CAREERS#)',
    },
    notes: 'No walk-ins! OCI interview check-ins, Room 185E interview rooms, Seminar Room 179 for FIGS classes.',
  },
  emergencyNumbers: [
    { label: 'RUPD Emergency', number: '911 or 848-932-7211' },
    { label: 'Campus Police Officer Kenneth Ford', number: 'Office: 848-445-6281 | Pager: 848-613-6405' },
    { label: 'Psychiatric Emergency (Regular Hours 8:30-5)', number: '732-932-7884' },
    { label: 'Acute Psychiatric Services (After 5PM)', number: '732-235-5700' },
    { label: 'CES Front Desk Panic Button', number: 'Located under front desk' },
    { label: 'Facilities Emergencies', number: '848-445-1234' },
    { label: 'OIT / ITS Help Desk', number: '848-932-7248' },
    { label: 'Parking Authority', number: '848-932-7744 / 732-667-8100' },
  ],
};
