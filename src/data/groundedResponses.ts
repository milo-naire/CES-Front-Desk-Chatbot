export interface DeskResponse {
  answer: string;
  script?: string;
  actionSteps?: string[];
  recencyNote?: string;
  sourceLocation: string;
  fallbackRoadmap?: {
    locationToCheck: string;
    systemOrTab: string;
    escalateTo: string;
  };
  relatedStaff?: {
    name: string;
    role: string;
    contact: string;
  };
}

export function findGroundedDeskAnswer(query: string, campus?: string): DeskResponse | null {
  const q = query.toLowerCase();

  // Check if user specifically asked about College Ave
  const askedCollegeAve = q.includes('college ave') || q.includes('gateway') || q.includes('gtv') || q.includes('somerset');
  // Check if user specifically asked about Busch
  const askedBusch = q.includes('busch') || q.includes('bsc') || q.includes('student center') || q.includes('177');
  const isComparison = (askedCollegeAve && askedBusch) || q.includes('both') || q.includes('across campuses') || q.includes('compare');

  // Specific Office Hours / Location queries
  if (
    (q.includes('office hour') || q.includes('hours') || q.includes('open') || q.includes('where is the office') || q.includes('where are you located') || q.includes('address')) &&
    !q.includes('closet') &&
    !q.includes('fair') &&
    !q.includes('booth')
  ) {
    if (askedCollegeAve && !askedBusch && !isComparison) {
      return {
        answer: 'The CES College Ave office is located at Gateway Transit Village, 106 Somerset Street, 4th Floor, New Brunswick, NJ 08901. Office hours are 9:00 AM to 5:00 PM, appointment-only via Handshake.',
        script: 'The CES College Avenue office is on the 4th floor of Gateway Transit Village at 106 Somerset Street. Hours are 9:00 AM to 5:00 PM by appointment on Handshake, and visitors use the hallway phone outside the entrance prior to entering.',
        actionSteps: [
          'Inform the visitor that College Ave operates strictly by appointment on Handshake (no walk-ins).',
          'Note the hallway wall phone outside the 4th floor entrance to announce appointments before entry.',
          'Front desk staff shifts: M/W/F 8:00 AM – 5:30 PM, T/Th 8:00 AM – 6:30 PM; office phone: 848-932-7997.',
        ],
        sourceLocation: 'Front Desk Daily / Front Desk Binder / 5 - ALUMNI / StudentandAlumni FAQs.docx (Section: Student FAQs - Office Hours and Locations)',
      };
    }

    if (isComparison) {
      return {
        answer: 'CES operates two appointment-only office locations: Busch (Busch Student Center Room 177) and College Ave (Gateway Transit Village 4th Floor), open 9:00 AM to 5:00 PM.',
        script: 'CES operates offices on both campuses from 9:00 AM to 5:00 PM by appointment only: • At Busch (BSC): Busch Student Center, Room 177 (848-445-6127) • At College Ave (GTV): 106 Somerset Street, 4th Floor (848-932-7997).',
        actionSteps: [
          '• At Busch (BSC): Busch Student Center Room 177 (604 Bartholomew Rd), phone 848-445-6127, access code 0833.',
          '• At College Ave (GTV): Gateway Transit Village 4th Floor (106 Somerset St), phone 848-932-7997; use hallway phone before entry.',
          'Advise the visitor to book appointments in advance on Handshake for their preferred location.',
        ],
        sourceLocation: 'Front Desk Daily / Front Desk Binder / 1 - FRONT DESK EMPLOYEE INFO / Daily Shift Info.docx & 5 - ALUMNI / StudentandAlumni FAQs.docx',
      };
    }

    // PRIMARY OPERATING DEFAULT: Busch Student Center
    return {
      answer: 'The CES Busch office is located at the Busch Student Center, Room 177, 604 Bartholomew Road, Piscataway, NJ 08854. Hours are 9:00 AM to 5:00 PM, appointment-only via Handshake.',
      script: 'The CES Busch office is located in the Busch Student Center, Room 177. Hours are 9:00 AM to 5:00 PM by appointment on Handshake.',
      actionSteps: [
        'Inform the visitor that CES at Busch operates strictly by appointment on Handshake (no walk-ins).',
        'Front desk phone: 848-445-6127; recruiter line: 848-445-7287; staff door access code: 0833.',
        'Rooms include Room 177 (Reception/Kiosks), Room 179 (Seminar Room for FIGS classes), and Room 185E (Student Virtual Interview Room).',
      ],
      sourceLocation: 'Front Desk Daily / Front Desk Binder / 1 - FRONT DESK EMPLOYEE INFO / Daily Shift Info.docx',
    };
  }

  // Seminar Room queries
  if (q.includes('seminar room') || (q.includes('seminar') && q.includes('room'))) {
    if (askedCollegeAve && !askedBusch && !isComparison) {
      return {
        answer: 'The College Avenue Seminar Room is located on the 4th floor of Gateway Transit Village, 106 Somerset Street.',
        script: 'The CES Gateway Seminar Room is located on the 4th floor of Gateway Transit Village at 106 Somerset Street.',
        actionSteps: [
          'Direct the visitor to the 4th floor of Gateway Transit Village.',
          'Verify if the event is in the Gateway Seminar Room or the Executive Conference Room.',
          'Contact Topher Sutton (Operations Lead) if room access or setup is required.',
        ],
        sourceLocation: 'Front Desk Daily / Front Desk Binder / 5 - ALUMNI / StudentandAlumni FAQs.docx',
      };
    }

    if (isComparison) {
      return {
        answer: 'CES seminar rooms are located at both campuses: Room 179 at the Busch Student Center, and the Gateway Seminar Room on the 4th floor of Gateway Transit Village.',
        script: 'CES has seminar rooms on both campuses: • At Busch (BSC): Room 179 in the Busch Student Center. • At College Ave (Gateway): Gateway Seminar Room on the 4th floor of Gateway Transit Village.',
        actionSteps: [
          '• At Busch (BSC): Seminar Room is Room 179 (used for FIGS classes and presentations).',
          '• At College Ave (Gateway): Gateway Seminar Room on the 4th floor of 106 Somerset St.',
          'Verify the visitor\'s scheduled session or interview location in Handshake.',
        ],
        sourceLocation: 'Front Desk Daily / Front Desk Binder / 1 - FRONT DESK EMPLOYEE INFO / Daily Shift Info.docx & 8 - PROGRAMS & INITIATIVES FAQs / FIGS FAQ.docx',
      };
    }

    // Default: Busch Seminar Room 179
    return {
      answer: 'The CES Seminar Room at the Busch Student Center is Room 179, used for FIGS classes and presentations.',
      script: 'The CES Seminar Room in the Busch Student Center is Room 179.',
      actionSteps: [
        'Direct the visitor or class attendees to Room 179 in the Busch Student Center.',
        'FIGS (First-Year Interest Group Seminars) classes meet in Room 179.',
        'Ensure the room is tidy and unlock with master key if required before scheduled sessions.',
      ],
      sourceLocation: 'Front Desk Daily / Front Desk Binder / 1 - FRONT DESK EMPLOYEE INFO / Daily Shift Info.docx & 8 - PROGRAMS & INITIATIVES FAQs / FIGS FAQ.docx',
    };
  }

  // 0. William Jones / Executive Director / Leadership Multi-Part Queries
  if (q.includes('william jones') || q.includes('executive director') || q.includes('wil jones')) {
    return {
      answer: 'William Jones is the Executive Director of Career Exploration and Success (CES). His office is located on the 4th floor of Gateway Transit Village, while his exact office suite number is not published in the desk binder.',
      script: 'William Jones is the Executive Director of Career Exploration and Success. His office is on the 4th floor of Gateway Transit Village, and CES front desk staff can check the floor directory or contact operations for his specific suite.',
      actionSteps: [
        'Confirm if the visitor has a scheduled appointment with Executive Director William Jones.',
        'Check the Gateway 4th floor suite directory or contact Topher Sutton (Operations Lead) for his exact office suite.',
        'If the visitor is an executive administrator (Chancellor, Provost, or Vice Chancellor), interrupt any meeting immediately to notify William Jones.',
      ],
      sourceLocation: 'Front Desk Daily / Front Desk Binder / 3 - GENERAL INFORMATION / CES Organization Chart 4.25.24.pdf & 9 - STUDENT INTERN INFO / CES Student Manual 5.7.24.docx',
    };
  }

  // 1. Walk-in / Drop-in / No Appointment / Drop-in Advising Hours
  if (
    q.includes('walk-in') ||
    q.includes('walk in') ||
    q.includes('drop in') ||
    q.includes('drop-in') ||
    (q.includes('no appointment') && !q.includes('cancel')) ||
    q.includes('see an advisor right now') ||
    q.includes('visit without appointment') ||
    q.includes('advising hours')
  ) {
    if (isComparison) {
      return {
        answer: 'Neither CES office offers drop-in advising; all career advising sessions across both Busch and College Avenue must be booked in advance on Handshake.',
        script: 'Neither CES office offers drop-in advising at this time: • At Busch (BSC): Room 177 operates strictly by appointment on Handshake. • At College Ave (Gateway): Gateway 4th Floor operates strictly by appointment on Handshake.',
        actionSteps: [
          '• At Busch (BSC): Busch Student Center Room 177 operates strictly by appointment on Handshake; no walk-in advising.',
          '• At College Ave (Gateway): Gateway Transit Village 4th Floor operates strictly by appointment on Handshake; no walk-in advising.',
          'Direct the student to log into Handshake (rutgers.joinhandshake.com) with NetID to book an available advising slot.',
        ],
        sourceLocation: 'Front Desk Daily / Front Desk Binder / 5 - ALUMNI / StudentandAlumni FAQs.docx (Section: Student FAQs - Office Hours and Locations)',
      };
    }

    if (askedCollegeAve && !askedBusch) {
      return {
        answer: 'CES does not offer walk-in or drop-in appointments at the College Avenue office; all career advising sessions must be scheduled in advance on Handshake.',
        script: 'Tell the visitor: "CES does not offer walk-in appointments at the College Avenue office. You can schedule an appointment with a CES advisor on Handshake at rutgers.joinhandshake.com."',
        actionSteps: [
          'Ask the student to log into Handshake on their phone or laptop using their NetID.',
          'Navigate to Appointments > Schedule A New Appointment and select an open advising slot.',
          'Inform the student that the College Ave office (Gateway Transit Village 4th Floor) operates strictly by appointment.',
        ],
        sourceLocation: 'Front Desk Daily / Front Desk Binder / 5 - ALUMNI / StudentandAlumni FAQs.docx (Section: Student FAQs - Office Hours and Locations)',
      };
    }

    // Default to Busch Student Center
    return {
      answer: 'CES does not offer walk-in or drop-in appointments; all career advising sessions at the Busch Student Center must be scheduled in advance on Handshake.',
      script: 'Tell the visitor: "CES does not offer walk-in appointments at this time. You can schedule an appointment with a CES advisor on Handshake at rutgers.joinhandshake.com."',
      actionSteps: [
        'Ask the student to log into Handshake on their phone or laptop using their NetID.',
        'Navigate to Appointments > Schedule A New Appointment and select an open advising slot.',
        'Inform the student that the Busch Student Center office (Room 177) operates strictly by appointment.',
      ],
      sourceLocation: 'Front Desk Daily / Front Desk Binder / 5 - ALUMNI / StudentandAlumni FAQs.docx (Section: Student FAQs - Office Hours and Locations)',
    };
  }

  // 2. Career Fair Payment / Invoicing / Fees
  if (
    (q.includes('fair') || q.includes('mega fair')) &&
    (q.includes('pay') || q.includes('invoice') || q.includes('fee') || q.includes('cost') || q.includes('pricing'))
  ) {
    return {
      answer: 'Career Fair payment inquiries must be transferred directly to Toni Berlingieri or Lisa Goddard in the CES recruiting programs team.',
      script: 'Tell the caller: "CES will connect you directly with Toni Berlingieri, who handles career fair payments and billing for CES."',
      actionSteps: [
        'Press the black transfer button on the desk phone.',
        'Dial Toni Berlingieri at x55561 (848-445-5561) or Lisa Goddard at x57287 (848-445-7287).',
        'If neither answers, log the employer name, organization, email, and phone into the CES MS Teams Phone Log.',
      ],
      sourceLocation: 'Front Desk FAQs Doc.pdf & Front Desk Daily / Front Desk Binder / 6 - EMPLOYER RELATIONS / Employer FAQS.docx',
      relatedStaff: {
        name: 'Toni Berlingieri / Lisa Goddard',
        role: 'Recruiting Programs Leads',
        contact: 'Toni: x55561 (berling@echo.rutgers.edu) | Lisa: x57287 (lgoddard@echo.rutgers.edu)',
      },
    };
  }

  // 3. Career Fair Location & Parking (Winter 2025) / Employer Fair Check-in
  if (
    q.includes('where is the fair') ||
    q.includes('fair location') ||
    q.includes('fair check-in') ||
    q.includes('fair check in') ||
    (q.includes('mega fair') && (q.includes('where') || q.includes('park') || q.includes('werblin') || q.includes('jersey mike') || q.includes('check')))
  ) {
    return {
      answer: 'The Winter 2025 Career & Internship Mega Fair is held at the Sonny Werblin Recreation Center on Busch Campus (656 Bartholomew Rd, Piscataway), not at Jersey Mike’s Arena.',
      script: 'Tell the visitor: "The CES Career Fair is taking place at the Sonny Werblin Recreation Center. Employer representatives can park in adjacent lots 60A, 60B, 64, or 67 and proceed directly to check-in."',
      actionSteps: [
        'Inform employers that parking is permitted in lots 60A, 60B, 64, and 67.',
        'Explain that reps can pre-register their license plate via email or register at the check-in table upon arrival.',
        'CES staff members will greet reps at the entrance and personally escort them to their assigned booth.',
      ],
      recencyNote: 'Current Winter 2025 procedure. Note: older Fall 2024 fairs were held at Jersey Mike’s Arena.',
      sourceLocation: 'Front Desk FAQs Doc.pdf (WINTER 2025 CAREER & INTERNSHIP MEGA FAIR FAQ\'s - Venue & Parking)',
      relatedStaff: {
        name: 'Larissa Keller (Logistics) & Lisa Goddard (Booths)',
        role: 'CES Mega Fair Coordinators',
        contact: 'Larissa: lkeller@rutgers.edu | Lisa: lgoddard@echo.rutgers.edu',
      },
    };
  }

  // 4. Booth Number Lookup
  if (q.includes('booth number') || q.includes('booth #') || q.includes('find my booth')) {
    return {
      answer: 'Look up the employer\'s booth number in the printed Mega Fair Booth Assignments binder reference sheet for the corresponding day of the fair.',
      script: 'Tell the visitor: "CES front desk staff can look up the booth number on the reference roster right now, and CES greeters at Werblin will personally escort representatives to the booth."',
      actionSteps: [
        'Check the printed Mega Fair booth assignment sheet at the front desk.',
        'Verify the exact day of the fair (Day 1: STEM/Health, Day 2: Tech/Ag/Env, Day 3: Business/Comm, Day 4: Public/Human Services).',
        'If the employer requested changes that are not reflected, transfer them to Lisa Goddard at x57287.',
      ],
      sourceLocation: 'Front Desk Daily / Front Desk Binder / 8 - PROGRAMS & INITIATIVES FAQs / Fair FAQs / Fall 24 Mega Fair FAQs / Booth Assignments Reference Sheet.pdf',
      relatedStaff: {
        name: 'Lisa Goddard',
        role: 'Sr. Assistant Director, Career & Internship Fairs',
        contact: 'lgoddard@echo.rutgers.edu | 848-445-7287 ext 57287',
      },
    };
  }

  // 5. Handshake Account Blocked / Disabled / Unlock / No-show
  if (
    q.includes('handshake account is locked') ||
    q.includes('handshake blocked') ||
    q.includes('account disabled') ||
    q.includes('unlock') ||
    q.includes('no show policy') ||
    q.includes('no-show') ||
    q.includes('missed appointment')
  ) {
    return {
      answer: 'CES suspends Handshake privileges when a student misses an appointment or cancels with less than 24 business hours notice.',
      script: 'Tell the visitor: "Handshake privileges have been blocked under the CES cancellation policy. To request account reactivation, email a three-paragraph appeal letter to careers@echo.rutgers.edu with the subject line \'No-Show Appointment\'."',
      actionSteps: [
        'Ask the student for their 9-digit RUID to verify their record in Handshake.',
        'Explain that CES requires cancellation through Handshake by 5:00 PM the business day prior to avoid a block.',
        'Direct them to send their appeal letter to careers@echo.rutgers.edu (attention Barbara Thomson at thomson.barbara@rutgers.edu) or call 848-445-4357.',
      ],
      sourceLocation: 'Front Desk Daily / Front Desk Binder / OTHER / Policies / Student Appointment Cancellation Policy.docx & 5 - ALUMNI / StudentandAlumni FAQs.docx',
      relatedStaff: {
        name: 'Barbara Thomson',
        role: 'Unit Director, Operations',
        contact: 'thomson.barbara@rutgers.edu | careers@echo.rutgers.edu | 848-445-4357',
      },
    };
  }

  // 5.5 Handshake Student Login & NetID SSO
  if (
    (q.includes('handshake') && (q.includes('login') || q.includes('log in') || q.includes('access') || q.includes('sign in') || q.includes('how do i log') || q.includes('how to log') || q.includes('how do students log'))) ||
    q.includes('handshake sso')
  ) {
    return {
      answer: 'Students log into Handshake by visiting rutgers.joinhandshake.com, selecting Rutgers University - New Brunswick Single Sign-On, and entering their NetID credentials.',
      script: 'Tell the student: "Go to rutgers.joinhandshake.com, select \'Rutgers University - New Brunswick Single Sign-On\', and log in using your NetID and password. If your NetID authentication fails, the Rutgers OIT Help Desk can assist you at oit.rutgers.edu or 848-917-HELP."',
      actionSteps: [
        'Direct the student to open a browser and go to https://rutgers.joinhandshake.com.',
        'Instruct them to select the "Rutgers University - New Brunswick Single Sign-On" option.',
        'Enter their Rutgers NetID and NetID password.',
        'If they cannot authenticate their NetID credentials, refer them directly to the Rutgers OIT Help Desk (oit.rutgers.edu | 848-917-HELP). Do not escalate to CES operations.',
      ],
      sourceLocation: 'Standard University Digital Services & Handshake Single Sign-On Guidelines (oit.rutgers.edu)',
    };
  }

  // 5.6 NetID Authentication Failure / Campus Tech Support
  if (
    (q.includes('netid') || q.includes('net id') || q.includes('oit')) &&
    (q.includes('authenticate') || q.includes('cannot log') || q.includes('cant log') || q.includes('locked out') || q.includes('password') || q.includes('reset') || q.includes('help desk') || q.includes('credentials'))
  ) {
    return {
      answer: 'For NetID authentication failures and Rutgers account access issues, direct students to the Rutgers OIT Help Desk at oit.rutgers.edu or 848-917-HELP.',
      script: 'Tell the student: "CES does not manage university NetID credentials. Please contact the Rutgers OIT Help Desk at oit.rutgers.edu or call 848-917-HELP (4357) for immediate password resets and NetID support."',
      actionSteps: [
        'Confirm whether the issue is university NetID authentication vs. a CES Handshake no-show policy suspension.',
        'For NetID authentication failures, direct them to oit.rutgers.edu or call 848-917-4357 (848-917-HELP).',
        'In-person OIT Help Desk support is also available at campus computer labs (e.g., Busch Student Center Computer Lab).',
        'Do not submit a ticket or escalate to CES operations staff for NetID password or SSO authentication issues.',
      ],
      sourceLocation: 'Rutgers Office of Information Technology (OIT) Self-Service & Help Desk Directory (oit.rutgers.edu)',
    };
  }

  // 5.7 Canvas Course Management Access
  if (q.includes('canvas') && (q.includes('login') || q.includes('access') || q.includes('course') || q.includes('log in') || q.includes('how to log') || q.includes('how do'))) {
    return {
      answer: 'Students access Canvas by visiting canvas.rutgers.edu and logging in with their NetID and password.',
      script: 'Tell the student: "Go to canvas.rutgers.edu and click \'NetID Login\' using your Rutgers credentials. If you cannot access a course or have authentication issues, contact the OIT Help Desk at oit.rutgers.edu or 848-917-HELP."',
      actionSteps: [
        'Direct the student to navigate to https://canvas.rutgers.edu in their browser.',
        'Click the red "NetID Login" button and authenticate with NetID and password.',
        'If enrolled courses are missing, advise them to check WebReg registration status or contact their instructor.',
        'For technical or login errors, direct them to the Rutgers OIT Help Desk (oit.rutgers.edu | 848-917-4357).',
      ],
      sourceLocation: 'Rutgers Canvas Learning Management Portal & Student Access Guide (canvas.rutgers.edu)',
    };
  }

  // 5.8 RUWireless Campus Wi-Fi Connection
  if (
    q.includes('ruwireless') ||
    q.includes('wifi') ||
    q.includes('wi-fi') ||
    (q.includes('internet') && (q.includes('connect') || q.includes('network')))
  ) {
    return {
      answer: 'Students and staff connect to RUWireless_Secure using their NetID and NetID password; visitors connect to RUWireless and accept the guest terms.',
      script: 'Tell the visitor: "To connect your device to Rutgers Wi-Fi, select \'RUWireless_Secure\' and log in with your NetID and password. Campus visitors can connect to \'RUWireless\' and open a browser to accept the guest access portal."',
      actionSteps: [
        'For Rutgers students/faculty/staff: Select the "RUWireless_Secure" SSID network.',
        'Enter Rutgers NetID username and NetID password to authenticate securely.',
        'For guests and visitors: Connect to "RUWireless" SSID, open a web browser, and follow the guest registration prompt.',
        'If the device fails to configure, direct them to ruwireless.rutgers.edu or the Busch Student Center computer lab OIT desk.',
      ],
      sourceLocation: 'Rutgers OIT Wireless Networking Standards & Portal (ruwireless.rutgers.edu)',
    };
  }

  // 6. Kiosk Swipe Failure
  if (
    q.includes('kiosk') && (q.includes('swipe') || q.includes('tap') || q.includes('not working') || q.includes('email') || q.includes('fail') || q.includes('card reader'))
  ) {
    return {
      answer: 'If the kiosk card reader fails, have the student manually enter their 9-digit RUID number into the box, never their email address.',
      script: 'Tell the student: "Please type your 9-digit RUID number directly into the box on the CES kiosk instead of your email address."',
      actionSteps: [
        'Ensure the text cursor has focus inside the input box on the kiosk monitor.',
        'Have the student type their 9-digit RUID and click Go or Submit.',
        'Do not allow entry of an email address even though the screen label says "email", as this causes an error on the Rutgers Handshake kiosk.',
      ],
      sourceLocation: 'Front Desk Daily / Front Desk Binder / OTHER / Student Check-In Steps.docx & How To\'s / COMMON FAQs 1.28.25.docx',
    };
  }

  // 7. Parking Vouchers at Gateway
  if (
    q.includes('parking voucher') ||
    q.includes('validate parking') ||
    q.includes('parking validation') ||
    q.includes('garage ticket')
  ) {
    return {
      answer: 'Parking validation at the Gateway desk is strictly limited to alumni attending in-person career advising and visiting employers attending scheduled meetings with CES.',
      script: 'Tell the visitor: "CES provides parking validation for alumni attending advising and employers attending scheduled meetings. When leaving the garage, scan the entry ticket first, followed by this voucher second under the laser."',
      actionSteps: [
        'Verify eligibility: Alumni with in-person advising or employers with meetings (never current students attending classes).',
        'Retrieve a voucher from the right-middle drawer under the swipe desk.',
        'Log the Voucher Number, Recipient Name, Date, and Reason in the CES Parking Voucher Request form.',
        'Remind the visitor never to scan the voucher at pay-on-foot machines (which voids the voucher); scan at the exit gate.',
      ],
      sourceLocation: 'Front Desk Daily / Front Desk Binder / OTHER / Policies / Instructions for Validating Parking.docx & 7 - EVENTS / GTV Parking Voucher Instructions.docx',
      relatedStaff: {
        name: 'Topher Sutton',
        role: 'Associate Director, Operations',
        contact: 'csutton@echo.rutgers.edu | 908-500-4997',
      },
    };
  }

  // 8. Voicemail Access
  if (q.includes('voicemail') || q.includes('check voicemail') || q.includes('voicemail pin') || q.includes('voicemail password')) {
    if (askedCollegeAve && !askedBusch && !isComparison) {
      return {
        answer: 'Access College Ave (Gateway) voicemail by dialing *45292, pressing *, entering ID *45292#, and entering PIN 2273322# (CAREERS#).',
        script: 'Tell the worker: "To access Gateway voicemail, dial *45292 on the desk phone, enter ID *45292#, and enter PIN 2273322# (CAREERS#); physical desk phone password is RUTGERS (7884377)."',
        actionSteps: [
          'Dial *45292 on the Gateway desk phone.',
          'Press * immediately when answered, then enter ID *45292#.',
          'Enter PIN 2273322# (CAREERS#) to access mailbox messages (physical desk password is RUTGERS / 7884377).',
        ],
        sourceLocation: 'Front Desk Daily / Front Desk Binder / 1 - FRONT DESK EMPLOYEE INFO / Daily Shift Info.docx & phone manual.pdf',
      };
    }

    if (isComparison) {
      return {
        answer: 'Access CES voicemail using campus-specific credentials: Busch dials *45234 (ID #45234) and College Ave dials *45292 (ID *45292#), both using PIN 2273322#.',
        script: 'Tell the worker: "• At Busch (BSC): Dial *45234 (ID #45234, PIN 2273322#). • At College Ave (Gateway): Dial *45292 (ID *45292#, PIN 2273322#). Physical desk phone password is RUTGERS (7884377)."',
        actionSteps: [
          '• At Busch (BSC): Dial *45234, press *, ID #45234, PIN 2273322#.',
          '• At College Ave (Gateway): Dial *45292, press *, ID *45292#, PIN 2273322#.',
          'Listen to voicemails, return all calls promptly, and delete resolved messages.',
        ],
        sourceLocation: 'Front Desk Daily / Front Desk Binder / 1 - FRONT DESK EMPLOYEE INFO / Daily Shift Info.docx & phone manual.pdf',
      };
    }

    // Default: Busch Student Center voicemail (*45234)
    return {
      answer: 'Access Busch Student Center voicemail by dialing *45234, pressing *, entering ID #45234, and entering PIN 2273322# (CAREERS#).',
      script: 'Tell the worker: "Dial *45234 on the Busch desk phone, enter ID #45234, and enter PIN 2273322# (CAREERS#) to access voicemail; physical desk phone password is RUTGERS (7884377)."',
      actionSteps: [
        'Lift handset on the Busch desk phone and dial *45234 (extension 56127).',
        'Press * immediately when answered, then enter ID #45234.',
        'Enter PIN 2273322# (CAREERS#) to access and listen to messages (physical desk password is RUTGERS / 7884377).',
      ],
      sourceLocation: 'Front Desk Daily / Front Desk Binder / 1 - FRONT DESK EMPLOYEE INFO / Daily Shift Info.docx & phone manual.pdf',
    };
  }

  // 9. Phone Answering & Transferring
  if (
    q.includes('answer the phone') ||
    q.includes('phone greeting') ||
    q.includes('how to transfer') ||
    q.includes('phone etiquette')
  ) {
    return {
      answer: 'Answer incoming calls using the official CES greeting, take caller information, and use the phone transfer button to connect the caller.',
      script: 'Say into phone: "Thank you for calling the Office of Career Exploration and Success, this is [Name] speaking. How may I help you?"',
      actionSteps: [
        'Ask for the student RUID or employer organization name to search in Handshake.',
        'To hold, press the Pause button (do not leave on hold for more than 2 minutes).',
        'To transfer, press the black Transfer button, enter the extension, announce the caller, and complete the transfer. If no answer, log details in the MS Teams Phone Log.',
      ],
      sourceLocation: 'phone manual.pdf & Front Desk Daily / Front Desk Binder / 1 - FRONT DESK EMPLOYEE INFO / Daily Shift Info.docx',
    };
  }

  // 10. RICC (Rutgers Internship & Co-op Course)
  if (
    q.includes('ricc') ||
    q.includes('academic credit for internship') ||
    q.includes('internship course') ||
    q.includes('co-op credit') ||
    q.includes('internship credit')
  ) {
    return {
      answer: 'The Rutgers Internship and Co-op Course (RICC) allows undergraduate students with a secured internship to earn general elective credit through CES.',
      script: 'Tell the visitor: "CES manages the RICC program at careers.rutgers.edu/ricc for students with secured internships. Eligibility requires at least 30 completed credits, a 2.5 GPA, and a minimum of 120 internship hours."',
      actionSteps: [
        'Direct the student to careers.rutgers.edu/ricc to submit the student application.',
        'Explain that the employer supervisor must complete the employer portion before review (2 to 7 business days).',
        'Once approved, an SPN is issued to register via WebReg (RICC provides SAS general elective credit, not major credit).',
      ],
      sourceLocation: 'Front Desk Daily / Front Desk Binder / 8 - PROGRAMS & INITIATIVES FAQs / Rutgers Internship & Co-op Course Updates June 2024.docx',
      relatedStaff: {
        name: 'Rania Plazas',
        role: 'Assistant Director, Rutgers Internship & Co-op Programs',
        contact: 'internships@echo.rutgers.edu | 848-445-5582',
      },
    };
  }

  // 11. RSSI (Rutgers Scarlet Service Internship)
  if (q.includes('rssi') || q.includes('scarlet service') || q.includes('5000 stipend') || q.includes('$5000')) {
    return {
      answer: 'The Rutgers Scarlet Service Internship (RSSI) awards a $5,000 stipend for summer public service or non-profit internships alongside a virtual course.',
      script: 'Tell the visitor: "The CES RSSI program provides a $5,000 stipend for summer internships with non-profit or government offices for sophomores and juniors with 61-91 credits and a 2.5+ GPA."',
      actionSteps: [
        'Eligible students: Rutgers New Brunswick, Camden, and Newark sophomores/juniors with 61-91 credits and 2.5+ GPA.',
        'Requirement: 150 internship hours over 10-12 weeks in summer + concurrent 3-credit virtual course (tuition covered).',
        'Student questions: contact Heather Escalona (heather.esc@rutgers.edu / 848-445-5584). Employer questions: contact Zac Stager (zps3@echo.rutgers.edu / 848-445-5557).',
      ],
      sourceLocation: 'Front Desk Daily / Front Desk Binder / 8 - PROGRAMS & INITIATIVES FAQs / Rutgers Scarlet Service Internship.docx',
      relatedStaff: {
        name: 'Heather Escalona (Students) / Zac Stager (Employers)',
        role: 'RSSI Program Leads',
        contact: 'Heather: heather.esc@rutgers.edu | Zac: zps3@echo.rutgers.edu',
      },
    };
  }

  // 12. IFAD (Intern For A Day)
  if (q.includes('ifad') || q.includes('intern for a day') || q.includes('shadowing')) {
    return {
      answer: 'The Intern For A Day (IFAD) program connects students to shadow industry professionals for 1 to several days during academic breaks.',
      script: 'Tell the visitor: "CES coordinates the Intern for a Day program to provide short-term shadowing during academic breaks. Applications open at the beginning of each semester at careers.rutgers.edu/ifad."',
      actionSteps: [
        'Direct students to careers.rutgers.edu/ifad for application dates.',
        'Students are matched with participating employers based on industry preferences.',
        'Contact Tiffany Rice (tiffany.rice@rutgers.edu) for student queries or Sharon Fash (sfash@rutgers.edu / 848-445-5592) for employers.',
      ],
      sourceLocation: 'Front Desk Daily / Front Desk Binder / 8 - PROGRAMS & INITIATIVES FAQs / IFAD FAQs.docx',
      relatedStaff: {
        name: 'Tiffany Rice (Students) & Sharon Fash (Employers)',
        role: 'IFAD Coordinators',
        contact: 'Tiffany: tiffany.rice@rutgers.edu | Sharon: sfash@rutgers.edu (848-445-5592)',
      },
    };
  }

  // 13. FIGS (First-Year Interest Group Seminars)
  if (q.includes('figs') || q.includes('peer instructor') || q.includes('01:090:120')) {
    return {
      answer: 'FIGS are 10-week, 1-credit seminars taught by upperclass peer instructors for first-year SAS, SEBS, RBS, and MGSA students during the fall semester.',
      script: 'Tell the visitor: "FIGS classes meet in CES seminar rooms (Room 179 at Busch and the Gateway Seminar Room). Peer instructors can retrieve classroom supplies in the Gateway mailbox corridor."',
      actionSteps: [
        'FIGS courses appear under course codes 01:090:120 or 11:090:120.',
        'Busch FIGS classes meet in Seminar Room 179 (even though listed as 175 on WebReg).',
        'Direct inquiries to Susan Bennett, Eileen Hallman, or Jessica Wilson.',
      ],
      sourceLocation: 'Front Desk Daily / Front Desk Binder / 8 - PROGRAMS & INITIATIVES FAQs / FIGS FAQ.docx',
      relatedStaff: {
        name: 'Susan Bennett / Eileen Hallman / Jessica Wilson',
        role: 'First-Year Career Engagement Team',
        contact: 'careers@echo.rutgers.edu',
      },
    };
  }

  // 14. Alumni Advising & SACC
  if (q.includes('alumni') || q.includes('alumnus') || q.includes('graduated')) {
    return {
      answer: 'CES provides up to two career advising appointments per calendar year for Rutgers–New Brunswick alumni within one year of graduation.',
      script: 'Tell the caller: "CES serves alumni within one year of graduation for up to two advising appointments per calendar year through Handshake. Alumni past one year are supported by the Rutgers Alumni Association at rutgersfoundation.org/career-resources."',
      actionSteps: [
        'Check the graduation year in Handshake or via the Rutgers ID Query tool.',
        'If within 12 months: schedule through Handshake (limit 2 sessions per calendar year).',
        'If more than 1 year: refer to rutgersfoundation.org/career-resources and Student-Alumni Career Connect (SACC) at rutgers.peoplegrove.com.',
      ],
      sourceLocation: 'Front Desk Daily / Front Desk Binder / 5 - ALUMNI / StudentandAlumni FAQs.docx & How to refer Alumni.docx',
    };
  }

  // 15. Photo Booth (Iris Booth) & Career Closet
  if (
    q.includes('iris') ||
    q.includes('photo booth') ||
    q.includes('headshot') ||
    q.includes('camera') ||
    q.includes('headshots') ||
    q.includes('career closet') ||
    q.includes('closet')
  ) {
    return {
      answer: 'CES provides the Career Closet and Iris Professional Photo Booth free of charge to Rutgers students during regular office hours (9:00 AM – 5:00 PM).',
      script: 'Tell the visitor: "The CES Career Closet and Iris Photo Booth are free for all Rutgers students during office hours. CES staff will walk you right over to the booth."',
      actionSteps: [
        'To reboot Iris Booth: Plug a USB keyboard into the booth, press Alt + F4, select the Raspberry icon > Log Out > Reboot (takes 2-3 mins).',
        'Camera disconnected: Turn camera off, reboot system, and turn camera back on during reboot.',
        'Wi-Fi guest reconnect: Use the black "Richelieu" key to unlock, press Raspberry + F4, open browser, accept Rutgers guest Wi-Fi, and re-launch Iris.',
        'Support line: David Gonzales at 650-464-7700 or +1 (902) 210-0206.',
      ],
      sourceLocation: 'Front Desk Daily / Front Desk Binder / 4 - REFERENCE INFORMATION / Photo Booth / Iris Troubleshooting and Technical Guide Final.pdf & Iris Booth FAQs.pdf',
    };
  }

  // 16. WebClock / Forgot to Clock In or Out
  if (q.includes('clock in') || q.includes('clock out') || q.includes('webclock') || q.includes('cornerstone') || q.includes('time adjust')) {
    return {
      answer: 'CES student employees who forget to clock in or out must complete the official Smartsheet time adjustment form; text or GroupMe messages are not accepted.',
      script: 'Tell the worker: "Please complete the CES WebClock time adjustment form at https://go.rutgers.edu/CESTimeAdjust right away so Topher Sutton can update payroll."',
      actionSteps: [
        'Open Smartsheet: https://app.smartsheet.com/b/form/ba48d84ac3ce4102b863714687e58be9',
        'Enter date, scheduled shift, actual time worked, and explanation.',
        'Submit for Topher Sutton’s review prior to payroll closing.',
      ],
      sourceLocation: 'Front Desk Daily / Front Desk Binder / OTHER / How To\'s / COMMON FAQs 1.28.25.docx & 3 - GENERAL INFORMATION / Front Staff Expectations AY25_26.docx',
      relatedStaff: {
        name: 'Topher Sutton',
        role: 'Associate Director, Operations',
        contact: 'csutton@echo.rutgers.edu | 908-500-4997',
      },
    };
  }

  // 17. Calling Out / Absence Procedure
  if (q.includes('call out') || q.includes('miss a shift') || q.includes('sick shift') || q.includes('coverage')) {
    return {
      answer: 'CES student interns must seek shift coverage in the team GroupMe and submit the official CES call-out form at least 24 hours in advance.',
      script: 'Tell the worker: "Post in GroupMe to find coverage and submit the CES call-out form at go.rutgers.edu/cescallout. If within 24 hours, email Topher and your campus lead directly."',
      actionSteps: [
        '24+ hours in advance: Request coverage in GroupMe and submit the call-out form at https://go.rutgers.edu/cescallout.',
        'Within 24 hours: Email Topher Sutton (csutton@echo.rutgers.edu) AND your graduate coordinator (Shiv/Devan) immediately.',
      ],
      sourceLocation: 'Front Desk Daily / Front Desk Binder / OTHER / Policies / CRI Call Out Procedure.docx',
      relatedStaff: {
        name: 'Topher Sutton',
        role: 'Operations Lead',
        contact: 'csutton@echo.rutgers.edu | 908-500-4997',
      },
    };
  }

  // 18. Fraudulent Employer Warning / Complaint
  if (q.includes('fraudulent') || q.includes('scam') || q.includes('fake job') || q.includes('suspicious employer')) {
    return {
      answer: 'Direct all student complaints regarding fraudulent employers or scam jobs immediately to Catarina Caulfield in CES Industry & Campus Connections.',
      script: 'Tell the student: "CES will connect you with Catarina Caulfield, Associate Director, who investigates fraudulent employer reports to protect Rutgers students."',
      actionSteps: [
        'Option 1: Transfer the student directly to Catarina Caulfield at x20196 (848-932-0196).',
        'Option 2: Gather student name, contact info, employer organization name, and job details into the Phone Log and email Catarina at catarina.caulfield@rutgers.edu.',
      ],
      sourceLocation: 'Front Desk Daily / Front Desk Binder / 5 - ALUMNI / StudentandAlumni FAQs.docx (Section: For Students reporting Fraudulent Employers)',
      relatedStaff: {
        name: 'Catarina Caulfield',
        role: 'Associate Director, Industry & Campus Connections',
        contact: 'catarina.caulfield@rutgers.edu | 848-932-0196 (x20196)',
      },
    };
  }

  // 19. Employer Handshake Denied / Trust Score
  if (
    (q.includes('denied') || q.includes('rejected') || q.includes('trust score')) &&
    (q.includes('employer') || q.includes('company') || q.includes('posting'))
  ) {
    return {
      answer: 'CES requires a Handshake Trust Score of 50% or higher, corporate email domains matching the organization website, and a physical commercial address to approve accounts.',
      script: 'Tell the employer: "CES requires a minimum 50% Handshake trust score, permanent commercial business address, and corporate email domain matching your company website to approve accounts."',
      actionSteps: [
        'Verify if the account uses a generic domain (Gmail and Yahoo are rejected).',
        'CES only approves unpaid internships if they are connected to an academic credit course (such as RICC).',
        'Escalate review to the CES recruiting team at recruiting@rutgers.edu or Catarina Caulfield / Zac Stager.',
      ],
      sourceLocation: 'Front Desk Daily / Front Desk Binder / 6 - EMPLOYER RELATIONS / Employer FAQS.docx (Section: My Company/application was denied on Handshake)',
      relatedStaff: {
        name: 'Catarina Caulfield / Zac Stager',
        role: 'Industry & Campus Connections',
        contact: 'recruiting@echo.rutgers.edu',
      },
    };
  }

  // 19.5 Employer / Recruiter Parking
  if (
    (q.includes('employer') || q.includes('recruiter')) &&
    (q.includes('park') || q.includes('parking') || q.includes('lot')) &&
    !q.includes('fair') &&
    !q.includes('booth') &&
    !q.includes('werblin')
  ) {
    if (askedCollegeAve && !askedBusch && !isComparison) {
      return {
        answer: 'Employer parking at College Ave (Gateway) is in the Gateway Parking Garage (Morris St or New St decks), validated with a voucher from the front desk.',
        script: 'Tell the employer: "Employer parking for meetings at Gateway is in the Gateway Parking Garage; please take this voucher and scan your pulled ticket first, followed by the voucher second at the exit barrier."',
        actionSteps: [
          'Verify that the employer is attending a scheduled meeting with CES.',
          'Retrieve a parking voucher from the right-middle drawer under the swipe desk.',
          'Record the voucher number, employer name, date, and company in the Parking Voucher Request form.',
          'Remind them not to scan at pay-on-foot machines; scan at the exit gate under the laser.',
        ],
        sourceLocation: 'Front Desk Daily / Front Desk Binder / OTHER / Policies / Instructions for Validating Parking.docx & 7 - EVENTS / GTV Parking Voucher Instructions.docx',
        relatedStaff: {
          name: 'Topher Sutton',
          role: 'Associate Director, Operations',
          contact: 'csutton@echo.rutgers.edu | 908-500-4997',
        },
      };
    }

    if (isComparison) {
      return {
        answer: 'Employer parking differs by campus: Busch uses designated surface Lots 51, 59, 60B, or 67, while College Ave validates Gateway Parking Garage tickets.',
        script: 'Employer parking: • At Busch (BSC): Park in designated Lots 51, 59, 60B, or 67. • At College Ave (Gateway): Park in the Gateway Garage and obtain a voucher from the front desk.',
        actionSteps: [
          '• At Busch (BSC): Confirm vehicle registration for Lots 51, 59, 60B, or 67 for on-campus interviews.',
          '• At College Ave (Gateway): Validate Gateway Garage ticket with voucher from the right-middle drawer under the swipe desk.',
          'Confirm visitor meeting type and schedule in Handshake.',
        ],
        sourceLocation: 'Front Desk Daily / Front Desk Binder / 6 - EMPLOYER RELATIONS / Operations Interns & Associate On-Campus Interviewing Training & Protocols.docx & 7 - EVENTS / GTV Parking Voucher Instructions.docx',
      };
    }

    // Default: Busch Campus Employer Interview Parking
    return {
      answer: 'Employer interview parking is located in designated Lots 51, 59, 60B, or 67 on Busch Campus.',
      script: 'Tell the employer: "Employer interview parking is located in designated Lots 51, 59, 60B, or 67 on Busch Campus."',
      actionSteps: [
        'Confirm the employer has registered their vehicle license plate for Busch parking in Lots 51, 59, 60B, or 67.',
        'Collect their business card (or provide a blank card), date it, and note alumni status.',
        'Verify schedule type in Handshake (Room Only vs. Pre-Select) and personally retrieve the lunch voucher from outside 193C.',
      ],
      sourceLocation: 'Front Desk Daily / Front Desk Binder / 6 - EMPLOYER RELATIONS / Operations Interns & Associate On-Campus Interviewing Training & Protocols.docx',
      relatedStaff: {
        name: 'Zac Stager / Larissa Keller',
        role: 'Recruiting Programs Team',
        contact: 'Zac: zps3@echo.rutgers.edu | Larissa: lkeller@rutgers.edu',
      },
    };
  }

  // 20. On Campus Interviewing (OCI)
  if (
    q.includes('oci') ||
    q.includes('on campus interview') ||
    q.includes('on-campus interview') ||
    q.includes('interview schedule') ||
    q.includes('lunch voucher') ||
    q.includes('recruiter') ||
    (q.includes('employer') && (q.includes('interview') || q.includes('arrived for interview') || q.includes('interviews')))
  ) {
    return {
      answer: 'When an employer arrives for on-campus interviews, the student worker must greet them, collect and date their business card with alumni status, verify parking, check their schedule type, retrieve their lunch voucher from outside 193C, and escort them to the employer lounge.',
      script: 'Welcome to CES! Please have a seat in the employer lounge while the front desk checks your interview schedule and retrieves your lunch voucher.',
      actionSteps: [
        'Collect the recruiter\'s business card (or provide a blank card), date it, and ask if they are a Rutgers alum to record on the card.',
        'Verify vehicle parking registration and confirm they are parked in designated Lots 51, 59, 60B, or 67.',
        'Differentiate schedule type: If Room Only, request the interview schedule directly from the employer; if Pre-Select, verify the schedule in Handshake under Interviews > Approved.',
        'Personally retrieve their dated lunch voucher from the mailbox outside office 193C (Zac Stager\'s office) and hand it to the recruiter (never send an employer to staff mailboxes).',
        'Direct or escort the recruiter to the employer lounge/interview room, and explain that student candidates check in at the front desk kiosk and recruiters return to the waiting area to retrieve each candidate at their scheduled time.',
      ],
      sourceLocation: 'Front Desk Daily / Front Desk Binder / 6 - EMPLOYER RELATIONS / Operations Interns & Associate On-Campus Interviewing Training & Protocols.docx',
      relatedStaff: {
        name: 'Zac Stager / Larissa Keller',
        role: 'Recruiting Programs Team',
        contact: 'Zac: zps3@echo.rutgers.edu | Larissa: lkeller@rutgers.edu',
      },
    };
  }

  // 21. Emergency / Panic Button / Disruptive Visitor
  if (
    q.includes('emergency') ||
    q.includes('panic button') ||
    q.includes('threat') ||
    q.includes('police') ||
    q.includes('rupd') ||
    q.includes('won\'t leave') ||
    q.includes('yelling')
  ) {
    return {
      answer: 'In any threatening or emergency situation, press the panic button under the CES reception desk immediately to summon RUPD, or call 911 / 848-932-7211.',
      script: 'Tell the visitor: "I will not be able to continue this conversation while you are yelling. I am going to have a full-time staff member step in to assist."',
      actionSteps: [
        'If in immediate physical danger, push the panic button under the desk.',
        'Call RUPD Emergency at 911 or 848-932-7211.',
        'Officer Kenneth Ford: Office 848-445-6281 | Pager 848-613-6405.',
        'Psychiatric Emergency (8:30am-5pm): 732-932-7884; Acute Psychiatric Services (after 5pm): 732-235-5700.',
        'Immediately alert full-time staff (Topher Sutton or another professional staff member).',
      ],
      sourceLocation: 'Front Desk Daily / Front Desk Binder / 1 - FRONT DESK EMPLOYEE INFO / EMERGENCY PROTOCOL & CONTACT NUMBERS 2.pdf & OTHER / Scripts / General de-escalation.docx',
    };
  }

  // 22. VIP Visitors (Chancellor / Provost / Vice Chancellor)
  if (
    q.includes('chancellor') ||
    q.includes('provost') ||
    q.includes('francine conway') ||
    q.includes('saundra tomlinson') ||
    q.includes('carolyn moehling') ||
    q.includes('vip')
  ) {
    return {
      answer: 'Senior university leadership (Chancellor Conway, Provost Tomlinson-Clarke, Vice Chancellor Moehling) oversee the department; immediately interrupt any meeting to inform Executive Director William Jones.',
      script: 'Tell the visitor: "Welcome to Career Exploration and Success! Please let me notify Executive Director William Jones immediately."',
      actionSteps: [
        'Greet warmly with high professionalism and offer coffee or water.',
        'Immediately notify Executive Director William Jones, even if he is in a meeting.',
        'Alert Topher Sutton or the senior staff member present in the office.',
      ],
      sourceLocation: 'Front Desk Daily / Front Desk Binder / 9 - STUDENT INTERN INFO / CES Student Manual 5.7.24.docx (Section: Telephone Etiquette - VIP Administrators)',
      relatedStaff: {
        name: 'William Jones',
        role: 'Executive Director, CES',
        contact: 'Office of the Executive Director (GTV / Busch)',
      },
    };
  }

  // 23. Room Reservation for Busch Interview Room
  if (q.includes('room request') || q.includes('interview room') || q.includes('quiet room') || q.includes('reserve a room')) {
    return {
      answer: 'Busch interview rooms can be reserved for student virtual interviews between 8:00 AM and 5:00 PM with Larissa Keller’s approval.',
      script: 'Tell the student: "CES interview rooms are available between 8:00 AM and 5:00 PM for virtual interviews. Please sign in on the schedule binder while room availability is confirmed."',
      actionSteps: [
        'Confirm room availability with Larissa Keller or inspect the room schedule folder in her office.',
        'Have student sign the red binder labeled "Student Requested Interview Room" in the cabinet under the first kiosk.',
        'At interview time, have student check in at the second kiosk under the tab "Record Collection of Student Room Usage Check-in".',
        'Escort student to the room, post the "Quiet: Interview in Progress" flyer onto the door, and remind them to keep it clean.',
      ],
      sourceLocation: 'Front Desk Daily / Front Desk Binder / 7 - EVENTS / Room Request Information.docx',
      relatedStaff: {
        name: 'Larissa Keller',
        role: 'Associate Director, Recruiting Programs',
        contact: 'lkeller@rutgers.edu | 848-445-5572',
      },
    };
  }

  // 24. Free Tuition Challenge (#RutgersWorks)
  if (q.includes('free tuition') || q.includes('rutgersworks') || q.includes('tuition challenge')) {
    return {
      answer: 'The #RutgersWorks Free Tuition Challenge awards SAS in-state semester tuition for completing 10 challenge stamps by the semester deadline.',
      script: 'Tell the student: "Log in with your NetID at careers.rutgers.edu/challenge to earn stamps by swiping into CES events, using online tools, and booking advising. 5 stamps qualify for monthly drawings, and 10 stamps enter the tuition grand prize drawing."',
      actionSteps: [
        'All enrolled Rutgers-NB undergraduate and graduate students with valid RUID are eligible.',
        'Winner receives amount equal to SAS undergraduate in-state tuition for one semester.',
        'Direct inquiries to careers@echo.rutgers.edu or 848-932-0144.',
      ],
      sourceLocation: 'Front Desk Daily / Front Desk Binder / 3 - GENERAL INFORMATION / #RutgersWorks Free Tuition Challenge Info.docx',
    };
  }

  return null;
}
