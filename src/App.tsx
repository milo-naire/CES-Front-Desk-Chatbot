import React, { useState, useRef, useEffect } from 'react';
import { FileText, Send, AlertTriangle, RotateCcw, BookOpen, Download, X } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  userText?: string;
  whatToSay?: string;
  stepsToTake?: string;
  whereToFindIt?: string;
  isEscalation?: boolean;
  timestamp: string;
}

const STARTER_CHIPS = [
  {
    label: 'Drop-in Advising Hours',
    query: 'What are the CES drop-in advising hours and how does a student schedule an appointment with a CES advisor?',
  },
  {
    label: 'Handshake SSO Login',
    query: 'How do students log into Handshake using Rutgers NetID Single Sign-On?',
  },
  {
    label: 'Handshake Locked / No-Show',
    query: 'A student says their Handshake account was disabled or locked due to a missed appointment. How does CES handle account reactivation?',
  },
  {
    label: 'Wi-Fi & Canvas Access',
    query: 'How do students log into Canvas and connect to RUWireless campus Wi-Fi?',
  },
  {
    label: 'Career Closet & Headshots',
    query: 'Where is the CES Career Closet and how do students access the Iris Photo Booth for headshots?',
  },
  {
    label: 'Employer Fair Check-In',
    query: 'An employer arrived for the CES Career Fair. Where is check-in, booth lookup, and parking located?',
  },
];

const INITIAL_WELCOME: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  whatToSay:
    'Thank you for contacting Career Exploration and Success at the Busch Student Center. How may CES assist you today?',
  stepsToTake:
    '1. Greet the visitor or caller with the CES front desk greeting.\n2. Ask for the 9-digit RUID (if student) or organization name (if employer).\n3. Enter the inquiry below for instant direct guidance.',
  whereToFindIt:
    'Front Desk Daily / Front Desk Binder / 1 - FRONT DESK EMPLOYEE INFO / Daily Shift Info.docx',
  isEscalation: false,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

// Helper to parse inline markdown (bold, italic, code) into real HTML elements
function parseInlineMarkdown(text: string): React.ReactNode[] {
  const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={index} className="font-bold text-[#000000]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      return (
        <em key={index} className="italic text-[#000000]">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code key={index} className="bg-[#EFEFEF] px-1 py-0.5 rounded text-xs font-mono text-[#000000]">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

// Helper component that properly parses Markdown structure and symbols
function MarkdownView({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: { type: 'ol' | 'ul'; items: React.ReactNode[] } | null = null;

  const flushList = () => {
    if (currentList) {
      if (currentList.type === 'ol') {
        elements.push(
          <ol key={`ol-${elements.length}`} className="list-decimal pl-5 space-y-1 my-1.5 text-sm text-[#000000]">
            {currentList.items.map((it, idx) => (
              <li key={idx} className="leading-relaxed">
                {it}
              </li>
            ))}
          </ol>
        );
      } else {
        elements.push(
          <ul key={`ul-${elements.length}`} className="list-disc pl-5 space-y-1 my-1.5 text-sm text-[#000000]">
            {currentList.items.map((it, idx) => (
              <li key={idx} className="leading-relaxed">
                {it}
              </li>
            ))}
          </ul>
        );
      }
      currentList = null;
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      return;
    }

    // Numbered list item: 1. Text
    const olMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (olMatch) {
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(parseInlineMarkdown(olMatch[2]));
      return;
    }

    // Bullet list item: - Text or * Text
    const ulMatch = trimmed.match(/^[-*]\s+(.*)$/);
    if (ulMatch) {
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(parseInlineMarkdown(ulMatch[1]));
      return;
    }

    flushList();

    // Blockquote: > Text
    if (trimmed.startsWith('>')) {
      elements.push(
        <blockquote
          key={`quote-${idx}`}
          className="border-l-3 border-[#CC0033] pl-3 italic text-[#222222] my-1.5 bg-[#F9F9F9] py-1 rounded-r"
        >
          {parseInlineMarkdown(trimmed.replace(/^>\s*/, ''))}
        </blockquote>
      );
      return;
    }

    // Headers: ### Header or ## Header
    if (trimmed.startsWith('### ')) {
      elements.push(
        <h4 key={`h4-${idx}`} className="font-bold text-sm text-[#000000] mt-2 mb-1">
          {parseInlineMarkdown(trimmed.slice(4))}
        </h4>
      );
      return;
    }
    if (trimmed.startsWith('## ')) {
      elements.push(
        <h3 key={`h3-${idx}`} className="font-bold text-sm text-[#000000] mt-2.5 mb-1">
          {parseInlineMarkdown(trimmed.slice(3))}
        </h3>
      );
      return;
    }

    // Regular line / paragraph
    elements.push(
      <p key={`p-${idx}`} className="my-1 text-sm leading-relaxed text-[#000000]">
        {parseInlineMarkdown(trimmed)}
      </p>
    );
  });

  flushList();

  return <div className="space-y-1">{elements}</div>;
}

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_WELCOME]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleClearChat = () => {
    setMessages([INITIAL_WELCOME]);
    setInputValue('');
  };

  const handleExportLogsCSV = () => {
    const headers = ['Timestamp', 'Role', 'Inquiry / What to Say', 'Steps to Take', 'Where to Find It'];
    const rows = messages.map(msg => {
      const role = msg.role === 'user' ? 'Student Worker' : 'CES Assistant';
      const content = msg.role === 'user' ? (msg.userText || '') : (msg.whatToSay || '');
      const steps = msg.stepsToTake || '';
      const source = msg.whereToFindIt || '';
      return [
        `"${msg.timestamp}"`,
        `"${role}"`,
        `"${content.replace(/"/g, '""')}"`,
        `"${steps.replace(/"/g, '""')}"`,
        `"${source.replace(/"/g, '""')}"`,
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `CES_Front_Desk_Logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSend = async (queryText?: string) => {
    const query = (queryText || inputValue).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      userText: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Build the history payload from previous conversation turns
    const historyPayload: Array<{ role: 'user' | 'model'; text: string }> = [];
    messages.forEach(msg => {
      if (msg.role === 'user' && msg.userText) {
        historyPayload.push({
          role: 'user',
          text: msg.userText,
        });
      } else if (msg.role === 'assistant' && msg.id !== 'welcome') {
        const asstText = `1. **What to say:**\n"${msg.whatToSay || ''}"\n\n2. **Steps to take:**\n${msg.stepsToTake || ''}\n\n3. **Where to find it:**\n${msg.whereToFindIt || ''}`;
        historyPayload.push({
          role: 'model',
          text: asstText,
        });
      }
    });

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: historyPayload,
          campus: 'busch',
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      let whatToSay = data.whatToSay || '';
      let stepsToTake = data.stepsToTake || '';
      let whereToFindIt = data.whereToFindIt || '';
      let isEscalation = data.isEscalation || false;

      // Clean up any extraneous quotes or prefixes from whatToSay
      whatToSay = whatToSay
        .replace(/^Tell the (?:visitor|caller|student|employer|worker):\s*["“]?/i, '')
        .replace(/^What to say:\s*["“]?/i, '')
        .replace(/["”]$/, '')
        .trim();

      // Clean up any extraneous prefixes from whereToFindIt
      whereToFindIt = whereToFindIt
        .replace(/^Where to find it:\s*/i, '')
        .replace(/^Source:\s*/i, '')
        .trim();

      if (!whereToFindIt) {
        whereToFindIt =
          'Not listed in the CES desk binder. Check with the shift supervisor or the CES front desk operations channel.';
        isEscalation = true;
      }

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        whatToSay: whatToSay,
        stepsToTake: stepsToTake,
        whereToFindIt: whereToFindIt,
        isEscalation: isEscalation,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        whatToSay:
          'CES front desk staff will look into that for you with the operations team, or take down your contact information so an advisor can follow up.',
        stepsToTake:
          '1. Log the visitor contact details in the MS Teams Phone Log.\n2. Escalate to the shift supervisor or post in the operations channel.\n3. Follow up once verified.',
        whereToFindIt:
          'Not listed in the CES desk binder. Check with the shift supervisor or the CES front desk operations channel.',
        isEscalation: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#EFEFEF] text-[#000000] font-sans antialiased">
      {/* 1. Brand Header: Official Rutgers R + Clean Left-Aligned Title + Campus Toggle + Front Desk Guide & Action Buttons */}
      <header className="bg-[#FFFFFF] border-b border-[#EFEFEF] px-4 sm:px-6 py-3 sticky top-0 z-20 shrink-0">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Left Brand Identity: Official Block Rutgers 'R' + Divider + Title */}
          <div className="flex items-center gap-3">
            {/* Official Block Rutgers 'R' Mark (Height: 36px, clear space: at least 12px) */}
            <div className="shrink-0 flex items-center justify-center h-[36px] w-[36px] bg-[#CC0033] rounded-[4px] shadow-xs select-none p-1" title="Rutgers University">
              <span className="text-[#FFFFFF] font-serif font-black text-2xl leading-none tracking-tighter antialiased">
                R
              </span>
            </div>

            {/* Vertical Divider */}
            <div className="h-6 w-px bg-[#D8D8D8] shrink-0" />

            <div className="flex flex-col">
              <h1 className="text-[17px] sm:text-[18px] font-bold text-[#000000] tracking-tight leading-tight select-none">
                Career Exploration and Success
              </h1>
              <span className="text-[11px] text-[#666666] font-medium hidden sm:inline">
                Front-Desk Assistant & Operations Guide
              </span>
            </div>
          </div>

          {/* Right Header Navigation: Utility Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Front Desk Guide Button (left of Export Logs) */}
            <button
              onClick={() => setIsGuideOpen(true)}
              className="text-xs text-[#222222] hover:text-[#000000] border border-[#D8D8D8] hover:border-[#999999] hover:bg-[#EFEFEF] px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
              title="View Front Desk Guide"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#222222]" />
              <span className="hidden sm:inline">Front Desk Guide</span>
              <span className="sm:hidden">Guide</span>
            </button>

            {/* Export Logs (CSV) Button */}
            <button
              onClick={handleExportLogsCSV}
              className="text-xs text-[#222222] hover:text-[#000000] border border-[#D8D8D8] hover:border-[#999999] hover:bg-[#EFEFEF] px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
              title="Export shift chat log to CSV"
            >
              <Download className="w-3.5 h-3.5 text-[#222222]" />
              <span className="hidden md:inline">Export Logs (CSV)</span>
              <span className="md:hidden">Export</span>
            </button>

            {/* New Inquiry / Clear Chat button */}
            <button
              onClick={handleClearChat}
              className="text-xs text-[#666666] hover:text-[#000000] border border-[#D8D8D8] hover:border-[#999999] hover:bg-[#EFEFEF] px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
              title="Clear conversation history for a new visitor"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Inquiry</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Quick-Inquiry Starter Chips Bar (4 Subtle Minimalist Pills) */}
      <div className="bg-[#FFFFFF] border-b border-[#EFEFEF] px-4 py-2.5 shrink-0 shadow-2xs">
        <div className="max-w-4xl mx-auto flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-xs text-[#666666] font-medium shrink-0 mr-1 hidden sm:inline">
            Quick Lookup:
          </span>
          {STARTER_CHIPS.map(chip => (
            <button
              key={chip.label}
              onClick={() => handleSend(chip.query)}
              disabled={isLoading}
              className="bg-[#FFFFFF] border border-[#D8D8D8] hover:bg-[#EFEFEF] hover:border-[#CCCCCC] text-[#222222] text-xs font-medium px-3 py-1.5 rounded-full transition-colors whitespace-nowrap cursor-pointer shadow-2xs disabled:opacity-50"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Full-Height Single-Column Scrollable Chat Stream */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map(msg => {
            const isUser = msg.role === 'user';

            if (isUser) {
              return (
                <div key={msg.id} className="flex justify-end">
                  <div className="max-w-[85%] md:max-w-[70%] bg-[#222222] text-[#FFFFFF] rounded-2xl rounded-tr-xs px-4 py-3 shadow-xs">
                    <p className="text-sm font-normal leading-relaxed whitespace-pre-wrap">
                      {msg.userText}
                    </p>
                  </div>
                </div>
              );
            }

            return (
              <div key={msg.id} className="flex justify-start">
                <div className="w-full max-w-2xl bg-[#FFFFFF] border border-[#D8D8D8] rounded-2xl rounded-tl-xs p-4 md:p-5 shadow-xs space-y-3.5">
                  {/* Section 1: What to say (STRICTLY ONCE) */}
                  {msg.whatToSay && (
                    <div>
                      <div className="text-xs font-bold text-[#000000] uppercase tracking-wider mb-1">
                        What to say:
                      </div>
                      <div className="text-sm text-[#000000] font-normal leading-relaxed bg-[#F9F9F9] border-l-3 border-[#CC0033] pl-3 py-1 rounded-r">
                        <MarkdownView content={`"${msg.whatToSay}"`} />
                      </div>
                    </div>
                  )}

                  {/* Section 2: Steps to take */}
                  {msg.stepsToTake && (
                    <div>
                      <div className="text-xs font-bold text-[#000000] uppercase tracking-wider mb-1">
                        Steps to take:
                      </div>
                      <div className="text-sm text-[#000000] font-normal leading-relaxed">
                        <MarkdownView content={msg.stepsToTake} />
                      </div>
                    </div>
                  )}

                  {/* Clean Divider Line (#EFEFEF) */}
                  <hr className="border-t border-[#EFEFEF]" />

                  {/* Section 3: Where to find it */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#666666]">
                    <div className="flex items-start gap-1.5 leading-normal">
                      <FileText className="w-3.5 h-3.5 text-[#666666] shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-semibold text-[#666666]">Where to find it: </strong>
                        <span>{msg.whereToFindIt}</span>
                      </div>
                    </div>

                    {msg.isEscalation && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded shrink-0">
                        <AlertTriangle className="w-3 h-3 text-amber-700" />
                        ⚠️ Escalation / Manual Lookup Required
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#FFFFFF] border border-[#D8D8D8] rounded-2xl rounded-tl-xs px-4 py-3 text-xs text-[#666666] flex items-center gap-2 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#CC0033] animate-pulse" />
                <span>Checking desk reference files and SOPs...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* 4. Fixed Bottom Input Bar */}
      <footer className="bg-[#FFFFFF] border-t border-[#EFEFEF] p-4 shrink-0">
        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2.5"
          >
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              disabled={isLoading}
              placeholder="Ask a desk question (e.g., 'resume critique drop-in', 'employer parking')..."
              className="flex-1 bg-[#FFFFFF] border border-[#D8D8D8] rounded-lg px-4 py-2.5 text-sm text-[#000000] placeholder-[#666666] focus:outline-none focus:border-[#CC0033] focus:ring-1 focus:ring-[#CC0033] transition-colors"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="bg-[#CC0033] hover:bg-[#A30029] disabled:opacity-40 text-[#FFFFFF] px-5 py-2.5 rounded-lg font-bold text-sm tracking-wide transition-colors shrink-0 shadow-xs cursor-pointer disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </footer>

      {/* 5. Front Desk Guide Modal */}
      {isGuideOpen && (
        <div
          onClick={() => setIsGuideOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-2xs animate-in fade-in duration-150"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-[#FFFFFF] border border-[#D8D8D8] rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden text-[#000000] flex flex-col"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-[#EFEFEF]">
              <h2 className="text-base font-bold text-[#000000] tracking-tight">
                CES Front Desk Assistant — Quick Start Guide
              </h2>
              <button
                onClick={() => setIsGuideOpen(false)}
                className="text-[#666666] hover:text-[#000000] p-1 rounded-md transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-5 space-y-4 overflow-y-auto max-h-[70vh] text-sm text-[#000000]">
              {/* Section 1: Purpose */}
              <div>
                <h3 className="text-xs font-bold text-[#000000] uppercase tracking-wider mb-1.5">
                  Purpose
                </h3>
                <p className="text-sm leading-relaxed text-[#222222]">
                  This tool assists CES front-desk staff in delivering accurate, verbatim responses to visitors and callers across both College Avenue and Busch offices.
                </p>
              </div>

              <hr className="border-t border-[#EFEFEF]" />

              {/* Section 2: How Responses Work */}
              <div>
                <h3 className="text-xs font-bold text-[#000000] uppercase tracking-wider mb-2">
                  How Responses Work
                </h3>
                <ul className="space-y-2 text-sm text-[#222222]">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-[#000000] shrink-0">"WHAT TO SAY":</span>
                    <span className="leading-relaxed">Direct, professional script to speak immediately to the student, employer, or caller.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-[#000000] shrink-0">"STEPS TO TAKE":</span>
                    <span className="leading-relaxed">Actionable administrative checklist (kiosk check-ins, Handshake lookups, room assignments).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-[#000000] shrink-0">"Where to find it":</span>
                    <span className="leading-relaxed">Sourced directly from current CES standard operating procedures and front-desk binders.</span>
                  </li>
                </ul>
              </div>

              <hr className="border-t border-[#EFEFEF]" />

              {/* Section 3: Inquiries with Missing or Outdated Information */}
              <div>
                <h3 className="text-xs font-bold text-[#000000] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <span>Inquiries with Missing or Outdated Information</span>
                </h3>
                <p className="text-sm leading-relaxed text-[#222222] mb-2">
                  If policy details are unlisted or outdated in office documentation, the assistant displays an amber <span className="inline-flex items-center gap-1 font-semibold text-amber-800 bg-amber-50 border border-amber-300 px-1.5 py-0.5 rounded text-xs">⚠️ Escalation / Manual Lookup Required</span> tag and provides an immediate manual escalation path.
                </p>
              </div>

              <hr className="border-t border-[#EFEFEF]" />

              {/* Section 4: Quick Tips for Staff */}
              <div>
                <h3 className="text-xs font-bold text-[#000000] uppercase tracking-wider mb-2">
                  Quick Tips for Staff
                </h3>
                <ul className="space-y-1.5 text-sm text-[#222222] list-disc list-inside">
                  <li className="leading-relaxed">
                    Use the quick-lookup pills under the header for common walk-in questions.
                  </li>
                  <li className="leading-relaxed">
                    Click "New Inquiry" to clear context between distinct visitors.
                  </li>
                  <li className="leading-relaxed">
                    Click "Export Logs (CSV)" at the end of shifts to download inquiry logs for supervisors.
                  </li>
                </ul>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-[#FFFFFF] border-t border-[#EFEFEF] flex justify-end">
              <button
                onClick={() => setIsGuideOpen(false)}
                className="bg-[#CC0033] hover:bg-[#A30029] text-[#FFFFFF] px-5 py-2 rounded-lg font-bold text-sm tracking-wide transition-colors cursor-pointer shadow-xs"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
