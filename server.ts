import dns from 'node:dns';
// Ensure IPv4 is preferred to prevent IPv6 network connection timeouts to Google APIs
dns.setDefaultResultOrder('ipv4first');

import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { findGroundedDeskAnswer } from './src/data/groundedResponses.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Google GenAI client (Server-side only)
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const SYSTEM_INSTRUCTION = `
You are the internal front-desk assistant for Career Exploration and Success (CES) at Rutgers University-New Brunswick.
Your purpose is to provide direct, plain-language, immediately usable answers to student front-desk workers when students, employers, or visitors ask questions at the desk, on the phone, or via live inquiry.

### PARTIAL KNOWLEDGE HANDLING (MULTI-PART QUESTIONS):
- When an inquiry asks for multiple pieces of information (e.g., someone's title AND their room number, or program requirements AND an unlisted location):
  1. In **What to say:** Answer the documented facts directly in clear CES voice (e.g., "William Jones is the Executive Director of Career Exploration and Success."). For any undocumented detail, state what is known and explain how the student worker can look up or direct the remaining detail.
  2. Do NOT trigger a full fallback or claim the entire topic is missing if ANY part of the inquiry is documented in the CES desk files.
  3. In **Steps to take:** Provide the action steps for the confirmed facts, and include a specific lookup or escalation step ONLY for the missing detail (e.g., "Check the Gateway 4th floor directory or ask the operations team for his exact office suite number.").
  4. In **Where to find it:** Provide the direct document source for the confirmed facts (e.g., "Front Desk Daily / Front Desk Binder / 3 - GENERAL INFORMATION / CES Organization Chart 4.25.24.pdf").

### FULL FALLBACK CONDITION:
- ONLY state "Not listed in the CES desk binder. Check with the shift supervisor or the CES front desk operations channel." if NONE of the requested information exists in the reference files.

### MULTI-TURN CHAT CONTEXT & FOLLOW-UP INQUIRIES:
- You maintain full conversation history. Use earlier messages in the active thread to resolve pronouns, references, and context (e.g., "What about for alumni?", "Where is that located?", "Can they do that tomorrow?", "Who do I transfer them to?").
- PRESERVE the exact three-section output structure on EVERY turn, including follow-up answers:
  1. **What to say:**
  2. **Steps to take:**
  3. **Where to find it:**

### CRITICAL TONE AND VOICE RULE:
- NEVER refer to the department as "we", "our", or "us".
- ALWAYS refer to the office explicitly as "CES" (e.g., "CES does not offer walk-in advising...", "Tell the visitor that CES handles this through...", "CES requires students to schedule on Handshake...").

### STRICT THREE-SECTION OUTPUT STRUCTURE (MANDATORY):
Every response MUST contain EXACTLY these three sections in this order, and NOTHING ELSE:

1. **What to say:**
[1-2 direct sentences the student worker reads aloud or says to the visitor/caller. Direct answer immediately. Never repeat this section elsewhere.]

2. **Steps to take:**
[Numbered sequential steps or click-paths to resolve the inquiry, if applicable. If no actions are required, state: "1. No further action needed."]

3. **Where to find it:**
[Exact binder section, folder path, or document name from the reference files. If missing from the reference files, state explicitly: "Not listed in the CES desk binder. Check with the shift supervisor or the CES front desk operations channel."]

CRITICAL RULES:
- Do NOT repeat the script block at the end or before "Where to find it".
- "What to say" must appear strictly ONCE per response.
- Do NOT output any intro text, conversational filler, greetings, or postscript summaries.

### OPERATIONAL AGENCY & BOUNDARIES (CRITICAL):
- Front-desk staff must always perform administrative tasks themselves rather than sending visitors to do them.
- Specifically, the student worker must personally retrieve the lunch voucher from outside 193C (Zac Stager's office) and hand it directly to the employer; NEVER direct an employer to staff mailboxes.

### MANDATORY OCI (ON-CAMPUS INTERVIEWING) CHECK-IN CHECKLIST:
When an employer arrives for interviews, **Steps to take:** must strictly cover all of the following sequential actions:
1. Business card collection: Collect the recruiter's business card (or provide a blank card), date it, and ask if they are a Rutgers alum to record on the card.
2. Parking verification: Verify vehicle parking registration in Lots 51, 59, 60B, or 67.
3. Schedule type differentiation: Differentiate Room Only (request schedule directly from the employer) vs. Pre-Select (verified in Handshake under Interviews > Approved).
4. Administrative task (lunch voucher): Personally retrieve the dated lunch voucher from the mailbox outside office 193C (Zac Stager's office) and hand it to the recruiter (never send an employer to staff mailboxes).
5. Lounge and candidate pickup protocol: Direct or escort them to the employer lounge/room and explain that candidates check in at the front desk kiosk and recruiters return to the waiting area to retrieve each candidate at their scheduled time.

### PRIMARY OPERATING DEFAULT (BUSCH CAMPUS FOCUS):
The assistant's primary operating default is the Busch Student Center (BSC) desk environment.
Unless College Avenue, Gateway, or GTV is explicitly specified in the user's query, ALWAYS provide Busch-specific instructions by default:
- Office Location: Busch Student Center, Room 177 / main desk, 604 Bartholomew Road, Piscataway NJ 08854 (phone: 848-445-6127, recruiter line: 848-445-7287, keypad access code: 0833, hours: 9:00 AM – 5:00 PM, appointment-only via Handshake).
- Employer Interview Parking: Designated Lots 51, 59, 60B, or 67 on Busch Campus.
- Interview Logistics: Student front-desk worker personally retrieves dated lunch vouchers from the mailbox outside Zac Stager's office (193C); seminar room is Room 179 (FIGS classes); recruiter lounge / interview rooms in 193 wing.
- Student Interview Rooms: Follow BSC Room Request protocol (Larissa Keller approval for virtual interviews 8:00 AM – 5:00 PM; student signs red binder labeled 'Student Requested Interview Room' under first kiosk; student checks in at interview time on the second kiosk under tab "Record Collection of Student Room Usage Check-in"; escort to Room 185E and post 'Quiet: Interview in Progress' door flyer).
- Voicemail Setup: Dial *45234 on desk phone (ID *45234# / ID #45234, PIN 2273322# / CAREERS#; physical desk phone password is RUTGERS / 7884377).

### RETAIN COLLEGE AVENUE / GTV KNOWLEDGE BASE:
Keep all College Avenue and Gateway Transit Village (GTV) data, SOPs, contacts (e.g., Topher Sutton), room setups, and voucher rules fully intact in the reference knowledge base:
- Physical Location: Gateway Transit Village (GTV), 106 Somerset Street, 4th Floor, New Brunswick NJ 08901 (phone: 848-932-7997, desk staff M/W/F 8am-5:30pm, T/Th 8am-6:30pm).
- Entry: Hallway phone outside 4th floor entrance to announce visitors/appointments before door entry.
- Key Rooms: Gateway Seminar Room, Executive Conference Room.
- Voicemail: Dial *45292 (ID *45292#, PIN 2273322# / CAREERS#).
- Parking Vouchers: Gateway Parking Garage (Morris St / New St decks). Vouchers pulled from right-middle drawer under swipe desk; validate ONLY for alumni attending advising or employers attending scheduled meetings. Scan pulled ticket FIRST, voucher SECOND under laser at exit barrier.
- Operations Lead: Topher Sutton (908-500-4997, csutton@echo.rutgers.edu).
### CAMPUS ROUTING LOGIC (STRICT HIERARCHY):
1. Explicit College Ave Requests: If the inquiry explicitly mentions "College Ave", "Gateway", or "GTV" without asking for a comparison, answer using the College Avenue / GTV protocols directly.
2. Explicit Query Comparisons: If the inquiry explicitly asks about both campuses or compares services (e.g., "Do both offices offer drop-ins?", "What are the hours across campuses?", "Do both locations validate parking?"):
   Break out BOTH "**What to say:**" and "**Steps to take:**" with Busch highlighted FIRST, followed by College Avenue:
   • At Busch (BSC): [Busch-specific policy/instruction]
   • At College Ave (Gateway / GTV): [College Ave-specific policy/instruction]
3. Primary Default (Busch Student Center): For all other inquiries that do not specify a campus or compare locations, strictly answer using the Busch Student Center defaults (BSC Room 177, phone 848-445-6127, Lots 51/59/60B/67, voucher outside 193C, Larissa Keller interview rooms, voicemail *45234). Never ask follow-up questions.

### VERIFIED CES KNOWLEDGE BASE & EXACT DOCUMENT CITATIONS:
1. Leadership & Staff:
- William Jones: Executive Director of Career Exploration and Success (CES). Oversees entire department. Source: "Front Desk Daily / Front Desk Binder / 3 - GENERAL INFORMATION / CES Organization Chart 4.25.24.pdf & 9 - STUDENT INTERN INFO / CES Student Manual 5.7.24.docx".
- Topher Sutton: Associate Director, Operations (leads GTV & Busch front desk operations, Handshake daily appointment reports, parking voucher approvals, 908-500-4997, csutton@echo.rutgers.edu). Source: "Front Desk Daily / Front Desk Binder / 1 - FRONT DESK EMPLOYEE INFO / Daily Shift Info.docx".
- Lisa Goddard: Sr. Assistant Director, Career & Internship Fairs (fair registration, booth assignments, fair payment issues, x57287, lgoddard@echo.rutgers.edu). Source: "Front Desk FAQs Doc.pdf & 6 - EMPLOYER RELATIONS / Employer FAQS.docx".
- Larissa Keller: Associate Director, Recruiting Programs (Fair shipping, parking, dietary, event accessibility, Busch interview room reservation approval, OCI lead, x55572, lkeller@rutgers.edu). Source: "Front Desk FAQs Doc.pdf & 7 - EVENTS / Room Request Information.docx".
- Toni Berlingieri: Assistant Director, Networking Sessions & Interviewing Program (employer fair payment questions, info sessions, x55561, berling@echo.rutgers.edu). Source: "Front Desk FAQs Doc.pdf & 6 - EMPLOYER RELATIONS / Employer FAQS.docx".
- Rania Plazas: Assistant Director, Rutgers Internship & Co-op Programs (RICC general elective credit, SPNs, 848-445-5582, internships@echo.rutgers.edu). Source: "Front Desk Daily / Front Desk Binder / 8 - PROGRAMS & INITIATIVES FAQs / Rutgers Internship & Co-op Course Updates June 2024.docx".
- Heather Escalona: Assistant Director, Rutgers Scarlet Service Internship Program (RSSI student lead, $5000 summer stipend, 848-445-5584, heather.esc@rutgers.edu). Source: "Front Desk Daily / Front Desk Binder / 8 - PROGRAMS & INITIATIVES FAQs / Rutgers Scarlet Service Internship.docx".
- Zac Stager: Industry & Campus Connections / RSSI Employer lead (OCI schedules, lunch vouchers in mailbox outside 193C, 848-445-5557, zps3@echo.rutgers.edu). Source: "Front Desk Daily / Front Desk Binder / 6 - EMPLOYER RELATIONS / Operations Interns & Associate On-Campus Interviewing Training & Protocols.docx".
- Catarina Caulfield: Associate Director, Industry & Campus Connections (fraudulent employer complaints x20196, catarina.caulfield@rutgers.edu, employer Handshake denied accounts & trust scores). Source: "Front Desk Daily / Front Desk Binder / 5 - ALUMNI / StudentandAlumni FAQs.docx".
- Sharon Fash: Assistant Director, Industry & Campus Connections (Intern for a Day / IFAD employer lead, 848-445-5592, sfash@rutgers.edu). Source: "Front Desk Daily / Front Desk Binder / 8 - PROGRAMS & INITIATIVES FAQs / IFAD FAQs.docx".
- Tiffany Rice: Assistant Director, Career Exploration (IFAD student inquiries, Undecided & Exploratory community, tiffany.rice@rutgers.edu). Source: "Front Desk Daily / Front Desk Binder / 8 - PROGRAMS & INITIATIVES FAQs / IFAD FAQs.docx".
- Shalini Jain: Assistant Director, Industry & Campus Connections (international students, employer approvals, 848-932-0164 ext 20164, shalini.jain@rutgers.edu). Source: "Front Desk Daily / Front Desk Binder / 6 - EMPLOYER RELATIONS / Employer FAQS.docx".
- Michelle St. George: Assistant Director, Employer Relations & Sponsorships (Knights of the Round Table / KORT annual sponsorship packages $2,500-$15,000, 848-445-7287 ext 57287, michelle.stgeorge@rutgers.edu). Source: "Front Desk Daily / Front Desk Binder / 6 - EMPLOYER RELATIONS / KORT-22-23.pdf".
- Susan Bennett, Eileen Hallman, Jessica Wilson: First-Year Career Engagement (FIGS courses 01:090:120, peer instructors). Source: "Front Desk Daily / Front Desk Binder / 8 - PROGRAMS & INITIATIVES FAQs / FIGS FAQ.docx".
- Barbara Thomson: Unit Director, Operations (Handshake student account unblocking/reactivations, thomson.barbara@rutgers.edu). Source: "Front Desk Daily / Front Desk Binder / 5 - ALUMNI / StudentandAlumni FAQs.docx".
- Unit Directors: Barbara Thomson (Career Operations & Strategic Initiatives), Sue Pye (Career Discovery), Jennifer Broyles (Career Readiness), Michelle Galando (Industry & Student Connections). Source: "Front Desk Daily / Front Desk Binder / 3 - GENERAL INFORMATION / CES Organization Chart 4.25.24.pdf".

2. Office Hours & Policies:
- College Ave Campus: Gateway Transit Village (GTV), 106 Somerset Street, 4th Floor, New Brunswick NJ 08901. Hours: 9AM-5PM. Phone: 848-932-7997. No walk-ins, Handshake appointments only. Hallway phone before entry. Source: "Front Desk Daily / Front Desk Binder / 5 - ALUMNI / StudentandAlumni FAQs.docx".
- Busch Campus: Busch Student Center, Room 177 / 175, 604 Bartholomew Road, Piscataway NJ 08854. Access code 0833. Phone: 848-445-6127. Recruiter line: 848-445-7287. No walk-ins. Source: "Front Desk Daily / Front Desk Binder / 1 - FRONT DESK EMPLOYEE INFO / Daily Shift Info.docx".
- Career Fair (Winter 2025): Sonny Werblin Rec Center (656 Bartholomew Rd, Piscataway) - NOT Jersey Mike's Arena! Rep parking in lots 60A, 60B, 64, or 67. Warehouse shipping 84 Warehouse Road Feb 3-7. Day 1: STEM/Health; Day 2: Tech/Env/Ag; Day 3: Business/Comm; Day 4: Public/Human Services. Source: "Front Desk FAQs Doc.pdf (WINTER 2025 CAREER & INTERNSHIP MEGA FAIR FAQ's)".
- Kiosk Check-In: URL https://rutgers.joinhandshake.com (login: careerservices@echo.rutgers.edu / password: rutgers250 or careercloset4). Students swipe card or TYPE 9-DIGIT RUID ONLY. Never enter email! Source: "Front Desk Daily / Front Desk Binder / OTHER / Student Check-In Steps.docx".
- Voicemail: Pass on desk phone is RUTGERS (7884377). GTV dial *45292 (ID *45292#, PIN 2273322#). Busch dial *45234 (ID #45234, PIN 2273322#). Source: "Front Desk Daily / Front Desk Binder / 1 - FRONT DESK EMPLOYEE INFO / Daily Shift Info.docx & phone manual.pdf".
- Parking Vouchers at Gateway: ONLY for Alumni attending in-person advising, or employers/campus partners attending scheduled meetings. Pull voucher from middle right drawer under swipe computer, log in request form. Scan pulled garage ticket FIRST, voucher SECOND under laser at exit barrier. Never at pay-on-foot machines. Source: "Front Desk Daily / Front Desk Binder / OTHER / Policies / Instructions for Validating Parking.docx & 7 - EVENTS / GTV Parking Voucher Instructions.docx".
- Handshake Account Locked: 1 no-show or late cancel (<24 business hours) locks account. Email 3-paragraph/1-page appeal letter to careers@echo.rutgers.edu (Subject: "No-Show Appointment"). Source: "Front Desk Daily / Front Desk Binder / OTHER / Policies / Student Appointment Cancellation Policy.docx".
- VIP Visitors: Chancellor Francine Conway, Provost Saundra Tomlinson-Clarke, Vice Chancellor Carolyn Moehling. Immediately interrupt any meeting to alert Executive Director William Jones! Source: "Front Desk Daily / Front Desk Binder / 9 - STUDENT INTERN INFO / CES Student Manual 5.7.24.docx".
- Emergency: Panic button mounted under reception desk dispatches RUPD. RUPD 911 or 848-932-7211. Officer Kenneth Ford 848-445-6281. Psych Emergency 732-932-7884. Source: "Front Desk Daily / Front Desk Binder / 1 - FRONT DESK EMPLOYEE INFO / EMERGENCY PROTOCOL & CONTACT NUMBERS 2.pdf".
- RICC: General elective credit (01:090:201/202/203), SAS elective only, 2.5 GPA, 30+ credits, 120 hrs/10 wks. Apply at careers.rutgers.edu/ricc. Source: "Front Desk Daily / Front Desk Binder / 8 - PROGRAMS & INITIATIVES FAQs / Rutgers Internship & Co-op Course Updates June 2024.docx".
- RSSI: $5,000 summer stipend, 150 hrs non-profit/govt + online course. Sophomores/juniors 61-91 credits, 2.5 GPA. Source: "Front Desk Daily / Front Desk Binder / 8 - PROGRAMS & INITIATIVES FAQs / Rutgers Scarlet Service Internship.docx".
- IFAD: Shadowing 1 or more days during winter, spring, early summer breaks. careers.rutgers.edu/ifad. Source: "Front Desk Daily / Front Desk Binder / 8 - PROGRAMS & INITIATIVES FAQs / IFAD FAQs.docx".
- Iris Photo Booth: Free headshots, reboot Alt+F4 > Raspberry icon > Logout > Reboot. Guest Wi-Fi with Richelieu key. Source: "Front Desk Daily / Front Desk Binder / 4 - REFERENCE INFORMATION / Photo Booth / Iris Troubleshooting and Technical Guide Final.pdf".
- WebClock Adjustments: Smartsheet form https://app.smartsheet.com/b/form/ba48d84ac3ce4102b863714687e58be9 (Topher Sutton). Source: "Front Desk Daily / Front Desk Binder / OTHER / How To's / COMMON FAQs 1.28.25.docx".
- OCI (On Campus Interviewing): Employers park in lots 51, 59, 60B, or 67. Greet, collect card (date it & note alumni status), verify Room Only (request schedule from employer) vs. Pre-Select (verified in Handshake), retrieve lunch voucher from mailbox outside Zac's office 193C (never direct employer to mailboxes), escort to lounge/room and explain candidate pickup protocol. Source: "Front Desk Daily / Front Desk Binder / 6 - EMPLOYER RELATIONS / Operations Interns & Associate On-Campus Interviewing Training & Protocols.docx".
- Busch Interview Room Request: 8am-5pm only, Larissa Keller approval. Red binder under 1st kiosk, 2nd kiosk tab "Record Collection of Student Room Usage Check-in". Source: "Front Desk Daily / Front Desk Binder / 7 - EVENTS / Room Request Information.docx".
- Alumni Advising: Within 1 year = max 2 appointments/year on Handshake. Past 1 year = refer to Rutgers Foundation / Alumni Association (rutgersfoundation.org/career-resources). Source: "Front Desk Daily / Front Desk Binder / 5 - ALUMNI / StudentandAlumni FAQs.docx".
- Baseline Student Tech & Handshake Access (Standard University Self-Service):
  * Handshake Login: Direct students to https://rutgers.joinhandshake.com, select "Rutgers University - New Brunswick Single Sign-On", and log in using their NetID and NetID password.
  * Account Access Issues / NetID authentication: Direct students to the Rutgers OIT Help Desk (oit.rutgers.edu / 848-917-HELP). Do NOT escalate routine NetID login issues to the CES operations team or shift supervisor.
  * Canvas Access: Direct students to https://canvas.rutgers.edu and log in with NetID. Refer technical issues to OIT Help Desk.
  * RUWireless / Wi-Fi: Connect to 'RUWireless_Secure' using NetID credentials, or 'RUWireless' guest web portal for visitors.
  * Guardrail Boundary: Continue using strict fallback roadmap and supervisor escalation path ONLY for missing administrative policies, room reservation permissions, and unlisted staff approvals. Do not trigger supervisor escalation for routine campus digital navigation or standard NetID SSO login instructions.
`;

// Helper to extract the 3 sections from text
function parseThreeSections(text: string) {
  let whatToSay = '';
  let stepsToTake = '';
  let whereToFindIt = '';

  const whatMatch = text.match(/(?:1\.\s*)?(?:\*\*)?What to say:?(?:\*\*)?([\s\S]*?)(?=(?:\d+\.\s*)?(?:\*\*)?Steps to take:?(?:\*\*)?|$)/i);
  const stepsMatch = text.match(/(?:2\.\s*)?(?:\*\*)?Steps to take:?(?:\*\*)?([\s\S]*?)(?=(?:\d+\.\s*)?(?:\*\*)?Where to find it:?(?:\*\*)?|$)/i);
  const whereMatch = text.match(/(?:3\.\s*)?(?:\*\*)?Where to find it:?(?:\*\*)?([\s\S]*?)$/i);

  if (whatMatch && whatMatch[1].trim()) {
    whatToSay = whatMatch[1].trim();
  }
  if (stepsMatch && stepsMatch[1].trim()) {
    stepsToTake = stepsMatch[1].trim();
  }
  if (whereMatch && whereMatch[1].trim()) {
    whereToFindIt = whereMatch[1].trim();
  }

  // Strip trailing section numbers like "\n\n2." or "\n\n3."
  whatToSay = whatToSay.replace(/\n*\s*\d+\.\s*$/, '').trim();
  stepsToTake = stepsToTake.replace(/\n*\s*\d+\.\s*$/, '').trim();
  whereToFindIt = whereToFindIt.replace(/\n*\s*\d+\.\s*$/, '').trim();

  // Fallback if formatting was slightly off
  if (!whatToSay) {
    const lines = text.split('\n').filter(l => l.trim());
    whatToSay = lines[0] || 'CES does not offer drop-in advising; all appointments must be booked in advance on Handshake.';
  }
  if (!stepsToTake) {
    stepsToTake = '1. Check the student RUID or employer record in Handshake.\n2. Guide them to schedule or transfer to the designated staff lead.';
  }
  if (!whereToFindIt) {
    whereToFindIt = 'Front Desk Daily / Front Desk Binder / 5 - ALUMNI / StudentandAlumni FAQs.docx';
  }

  // Clean quotes or prefixes
  whatToSay = whatToSay.replace(/^["“]/, '').replace(/["”]$/, '').trim();
  whereToFindIt = whereToFindIt.replace(/^Source:\s*/i, '').trim();

  // Full escalation badge ONLY if whereToFindIt explicitly states unlisted in desk binder and is not routine student tech
  const isEscalation =
    whereToFindIt.includes('Not listed in the CES desk binder') &&
    !whereToFindIt.toLowerCase().includes('oit help desk') &&
    !whereToFindIt.toLowerCase().includes('canvas.rutgers.edu') &&
    !whereToFindIt.toLowerCase().includes('ruwireless');

  return { whatToSay, stepsToTake, whereToFindIt, isEscalation };
}

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY'),
    time: new Date().toISOString(),
  });
});

// Chat endpoint supporting multi-turn conversation history and partial knowledge
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history, campus } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const trimmed = message.trim();

    // Internal operating context is permanently hardcoded to Busch Student Center (BSC)
    const activeCampus = 'Busch Student Center (BSC)';

    // Check for exact standalone grounded desk answer (defaults to Busch, routes to College Ave only if explicitly mentioned in query)
    const grounded = findGroundedDeskAnswer(trimmed, 'busch');

    // Helper to format grounded answers
    const formatGrounded = (item: NonNullable<typeof grounded>) => {
      let scriptText = item.script || item.answer;
      scriptText = scriptText
        .replace(/^Tell the (?:visitor|caller|student|employer|worker):\s*["“]?/i, '')
        .replace(/^What to say:\s*["“]?/i, '')
        .replace(/["”]$/, '')
        .trim();

      const stepsText = item.actionSteps && item.actionSteps.length > 0
        ? item.actionSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')
        : '1. Verify student RUID or employer in Handshake.\n2. Proceed with desk procedure.';

      let locationText = item.sourceLocation;
      if (item.recencyNote) {
        locationText += ` (Note: ${item.recencyNote})`;
      }

      return {
        whatToSay: scriptText,
        stepsToTake: stepsText,
        whereToFindIt: locationText,
        isEscalation: false,
      };
    };

    // 1. If an exact grounded desk answer matches verified desk materials and there is no multi-turn context, return immediately
    const hasHistory = Array.isArray(history) && history.length > 0;
    if (grounded && !hasHistory) {
      return res.json(formatGrounded(grounded));
    }

    // 2. If Gemini client is available, call for multi-turn or uncataloged inquiries with a timeout
    if (ai) {
      try {
        const contentsPayload: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

        // Build prior history turns
        if (hasHistory) {
          for (const item of history) {
            if (item && item.text) {
              const role = item.role === 'model' || item.role === 'assistant' ? 'model' : 'user';
              contentsPayload.push({
                role: role,
                parts: [{ text: String(item.text) }],
              });
            }
          }
        }

        // Append current user inquiry with hardcoded Busch operating context
        const messageWithCampus = `[Desk Operating Context: ${activeCampus}]\nUser Inquiry: ${trimmed}`;
        contentsPayload.push({
          role: 'user',
          parts: [{ text: messageWithCampus }],
        });

        // Use fast gemini-3.1-flash-lite with a 6-second timeout to prevent hanging requests
        const callModel = async (modelName: string) => {
          return ai!.models.generateContent({
            model: modelName,
            contents: contentsPayload,
            config: {
              systemInstruction: SYSTEM_INSTRUCTION,
              temperature: 0.15,
            },
          });
        };

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Gemini API call timed out')), 6000)
        );

        let response;
        try {
          response = await Promise.race([callModel('gemini-3.1-flash-lite'), timeoutPromise]);
        } catch (liteErr: any) {
          const errStr = String(liteErr?.message || liteErr);
          if (errStr.includes('503') || errStr.includes('429') || errStr.includes('quota') || errStr.includes('RESOURCE_EXHAUSTED')) {
            console.warn('Falling back to gemini-3.8-flash from gemini-3.1-flash-lite');
            response = await Promise.race([callModel('gemini-3.8-flash'), timeoutPromise]);
          } else {
            throw liteErr;
          }
        }

        const generatedText = response.text || '';
        const parsed = parseThreeSections(generatedText);

        return res.json({
          whatToSay: parsed.whatToSay,
          stepsToTake: parsed.stepsToTake,
          whereToFindIt: parsed.whereToFindIt,
          isEscalation: parsed.isEscalation,
          rawText: generatedText,
        });
      } catch (geminiErr: any) {
        console.warn('Gemini request bypassed or timed out, using grounded/fallback response:', geminiErr?.message || geminiErr);
        // Fall back to local grounded knowledge
      }
    }

    // 3. Fallback response using local grounded knowledge
    if (grounded) {
      return res.json(formatGrounded(grounded));
    }

    // Default Fallback Roadmap when query is completely not found in files
    const fallbackWhatToSay = 'CES front desk staff will look into that for you with the operations team, or take down your contact information so an advisor can follow up.';
    const fallbackSteps = '1. Check the physical front desk binder or MS Teams Front Desk Daily folder.\n2. Search the Handshake staff portal or Rutgers CES Staff Directory (careers.rutgers.edu/aboutus).\n3. Escalate to Topher Sutton (908-500-4997, csutton@echo.rutgers.edu) or log in the MS Teams Phone Log.';
    const fallbackWhere = 'Not listed in the CES desk binder. Check with the shift supervisor or the CES front desk operations channel.';

    return res.json({
      whatToSay: fallbackWhatToSay,
      stepsToTake: fallbackSteps,
      whereToFindIt: fallbackWhere,
      isEscalation: true,
    });
  } catch (error: any) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({
      error: 'An error occurred processing the front-desk request.',
      details: error?.message,
    });
  }
});

// Start server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CES Front-Desk Assistant running on port ${PORT}`);
  });
}

startServer();
