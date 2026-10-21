/**
 * JobConnect Kenya - Direct Messaging & Interview Module
 * 
 * Accessible to both Job Seekers and Employers:
 * - Conversation List with latest messages and applicant photos
 * - Real-time chat log with input and sending
 * - Integrated Interview Session Panel:
 *     - Schedule interview (Date, Time EAT, Format [In-person / Video / Phone], Venue/Link, Agenda/Notes)
 *     - Track interview status: Scheduled, Confirmed, Completed, Cancelled
 *     - Actions for candidates to Confirm Attendance
 *     - Actions for employers to Update Status or Reschedule
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Calendar,
  Send,
  Clock,
  MapPin,
  Video,
  Phone,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Building2,
  User as UserIcon,
  Plus,
  Shield,
  Briefcase
} from 'lucide-react';
import {
  Conversation,
  ChatMessage,
  Interview,
  InterviewFormat,
  InterviewStatus,
  User
} from '../types';
import { store } from '../lib/storage';
import { formatNairobiDate, getNairobiTodayString } from '../lib/kenyaData';

interface MessagesPageProps {
  currentUser: User | null;
  initialConversationId?: string | null;
  onNavigate: (view: string, param?: string) => void;
  onOpenAuth: (mode: 'login') => void;
}

export const MessagesPage: React.FC<MessagesPageProps> = ({
  currentUser,
  initialConversationId,
  onNavigate,
  onOpenAuth
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');

  // Interview modal / panel state
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('10:00 AM');
  const [interviewFormat, setInterviewFormat] = useState<InterviewFormat>('video');
  const [interviewLocation, setInterviewLocation] = useState('Google Meet: meet.google.com/jobconnect-interview');
  const [interviewNotes, setInterviewNotes] = useState('');
  const [scheduleError, setScheduleError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Sync conversations
  useEffect(() => {
    if (!currentUser) return;
    const list = store.getConversationsForUser(currentUser.id);
    setConversations(list);

    if (initialConversationId && list.some(c => c.id === initialConversationId)) {
      setActiveConvId(initialConversationId);
    } else if (list.length > 0 && !activeConvId) {
      setActiveConvId(list[0].id);
    }
  }, [currentUser, initialConversationId]);

  // Sync messages for active conversation
  useEffect(() => {
    if (!activeConvId) return;
    setMessages(store.getMessages(activeConvId));
  }, [activeConvId]);

  // Subscribe to storage changes
  useEffect(() => {
    const unsub = store.subscribe(() => {
      if (!currentUser) return;
      const list = store.getConversationsForUser(currentUser.id);
      setConversations(list);
      if (activeConvId) {
        setMessages(store.getMessages(activeConvId));
      }
    });
    return unsub;
  }, [currentUser, activeConvId]);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <MessageSquare className="w-12 h-12 text-[#d4af37] mx-auto mb-3" />
        <h2 className="font-serif text-2xl font-bold text-[#f5d77a] mb-2">Sign In Required</h2>
        <p className="text-xs text-[#b9b09a] mb-6">
          Sign in to access candidate direct messaging and scheduled interviews.
        </p>
        <button
          type="button"
          onClick={() => onOpenAuth('login')}
          className="btn-gold px-6 py-2.5 text-xs"
        >
          Sign In
        </button>
      </div>
    );
  }

  const activeConv = conversations.find(c => c.id === activeConvId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConvId) return;

    store.sendMessage(activeConvId, inputText.trim(), currentUser.id);
    setInputText('');
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setScheduleError(null);

    if (!activeConv) return;
    if (!interviewDate) {
      setScheduleError('Please specify an interview date.');
      return;
    }

    store.scheduleInterview({
      conversation_id: activeConv.id,
      job_id: activeConv.job_id,
      scheduled_date: interviewDate,
      scheduled_time: interviewTime,
      format: interviewFormat,
      location_or_link: interviewLocation,
      notes: interviewNotes.trim() || undefined
    });

    setShowScheduleModal(false);
  };

  const handleStatusChange = (status: InterviewStatus) => {
    if (!activeConv?.interview) return;
    store.updateInterviewStatus(activeConv.interview.id, status);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#d4af37]/20 pb-5 mb-6">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#d4af37] font-semibold flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-[#d4af37]" />
            Direct Communication & Interview Channel
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold shine-title">
            Messages & Interviews
          </h1>
          <p className="text-xs text-[#b9b09a] mt-1">
            Connect directly with {currentUser.role === 'jobseeker' ? 'recruiting employers' : 'shortlisted candidates'} and coordinate formal interview schedules.
          </p>
        </div>
      </div>

      {/* Main 2-Column Chat & Interview Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        {/* Left Column: Conversation Sidebar (4 cols on wide) */}
        <div className="lg:col-span-4 card-gold p-4 flex flex-col h-full max-h-[700px]">
          <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
            <h3 className="font-serif text-sm font-bold text-[#f5d77a]">
              Conversations ({conversations.length})
            </h3>
            <span className="text-[11px] text-neutral-400">
              {currentUser.role === 'jobseeker' ? 'Employers' : 'Candidates'}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {conversations.length === 0 ? (
              <div className="py-12 text-center text-xs text-neutral-500">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#d4af37]" />
                <p>No active conversations yet.</p>
                <p className="text-[10px] text-neutral-600 mt-1">
                  {currentUser.role === 'employer'
                    ? 'Shortlist a candidate and tap "Message" to start an interview session.'
                    : 'When an employer shortlists your application, messages will appear here.'}
                </p>
              </div>
            ) : (
              conversations.map(conv => {
                const isSelected = conv.id === activeConvId;
                const otherPartyName = currentUser.role === 'jobseeker' ? conv.employer_name : conv.applicant_name;

                return (
                  <div
                    key={conv.id}
                    onClick={() => setActiveConvId(conv.id)}
                    className={`p-3 rounded-xl cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-[#d4af37]/15 border-[#d4af37] ring-1 ring-[#d4af37]/40'
                        : 'bg-neutral-900/60 border-white/5 hover:bg-neutral-900 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-[#1e1c24] border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] shrink-0 overflow-hidden">
                        {conv.applicant_photo && currentUser.role === 'employer' ? (
                          <img
                            src={conv.applicant_photo}
                            alt={conv.applicant_name}
                            className="w-full h-full object-cover"
                          />
                        ) : currentUser.role === 'jobseeker' ? (
                          <Building2 className="w-5 h-5 text-[#f5d77a]" />
                        ) : (
                          <UserIcon className="w-5 h-5 text-[#d4af37]" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-xs font-bold text-[#f3eee0] truncate">
                            {otherPartyName}
                          </h4>
                          <span className="text-[10px] text-neutral-500 shrink-0">
                            {formatNairobiDate(conv.last_message_at)}
                          </span>
                        </div>

                        <p className="text-[11px] text-[#f5d77a] truncate font-medium mt-0.5">
                          {conv.job_title}
                        </p>

                        <p className="text-[11px] text-[#b9b09a] truncate mt-1">
                          {conv.last_message}
                        </p>

                        {conv.interview && (
                          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-cyan-300 bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-500/30 w-fit">
                            <Calendar className="w-3 h-3 text-cyan-400" />
                            <span>
                              Interview: {conv.interview.scheduled_date} ({conv.interview.status})
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Chat Stream & Interview Card (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {activeConv ? (
            <>
              {/* Active Conversation Top Bar */}
              <div className="card-gold p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1d1b24] border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] shrink-0 overflow-hidden">
                    {activeConv.applicant_photo && currentUser.role === 'employer' ? (
                      <img
                        src={activeConv.applicant_photo}
                        alt={activeConv.applicant_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Building2 className="w-5 h-5 text-[#f5d77a]" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#f3eee0]">
                      {currentUser.role === 'jobseeker' ? activeConv.employer_name : activeConv.applicant_name}
                    </h3>
                    <p className="text-xs text-[#f5d77a]">
                      Position: {activeConv.job_title}
                    </p>
                  </div>
                </div>

                {/* Employer Interview Action Button */}
                {currentUser.role === 'employer' && (
                  <button
                    type="button"
                    onClick={() => {
                      setInterviewDate(getNairobiTodayString());
                      setShowScheduleModal(true);
                    }}
                    className="btn-gold text-xs px-3.5 py-2 flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{activeConv.interview ? 'Reschedule Interview' : 'Schedule Interview'}</span>
                  </button>
                )}
              </div>

              {/* Scheduled Interview Session Panel (if active) */}
              {activeConv.interview && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-[#171c26] to-[#12161f] border border-cyan-500/40 shadow-lg text-xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span className="font-serif font-bold text-sm text-cyan-300">
                        Scheduled Interview Session
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                        activeConv.interview.status === 'confirmed'
                          ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40'
                          : activeConv.interview.status === 'completed'
                          ? 'bg-neutral-800 text-neutral-300 border-neutral-600'
                          : activeConv.interview.status === 'cancelled'
                          ? 'bg-rose-950/40 text-rose-300 border-rose-500/40'
                          : 'bg-amber-950/40 text-amber-300 border-amber-500/40'
                      }`}>
                        {activeConv.interview.status}
                      </span>
                    </div>

                    <span className="text-[11px] text-neutral-400">
                      Africa/Nairobi Time
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-neutral-300">
                    <div>
                      <span className="text-neutral-400 block text-[10px]">Date &amp; Time</span>
                      <strong className="text-[#f5d77a] text-xs">
                        {activeConv.interview.scheduled_date} at {activeConv.interview.scheduled_time}
                      </strong>
                    </div>

                    <div>
                      <span className="text-neutral-400 block text-[10px]">Format &amp; Mode</span>
                      <strong className="capitalize text-xs flex items-center gap-1 mt-0.5">
                        {activeConv.interview.format === 'video' ? <Video className="w-3.5 h-3.5 text-cyan-400" /> : activeConv.interview.format === 'in_person' ? <MapPin className="w-3.5 h-3.5 text-emerald-400" /> : <Phone className="w-3.5 h-3.5 text-yellow-400" />}
                        {activeConv.interview.format.replace('_', ' ')}
                      </strong>
                    </div>

                    <div>
                      <span className="text-neutral-400 block text-[10px]">Location / Access Link</span>
                      <strong className="text-xs text-neutral-200 truncate block">
                        {activeConv.interview.location_or_link}
                      </strong>
                    </div>
                  </div>

                  {activeConv.interview.notes && (
                    <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-[11px] text-neutral-300">
                      <span className="font-semibold text-neutral-400">Interview Agenda / Notes: </span>
                      {activeConv.interview.notes}
                    </div>
                  )}

                  {/* Actions according to Role */}
                  <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/10 flex-wrap">
                    {/* Job Seeker Actions */}
                    {currentUser.role === 'jobseeker' && (
                      <div className="flex items-center gap-2">
                        {activeConv.interview.status === 'scheduled' && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange('confirmed')}
                            className="btn-gold text-xs px-3.5 py-1.5 flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Confirm My Attendance</span>
                          </button>
                        )}
                        {activeConv.interview.status === 'confirmed' && (
                          <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Attendance Confirmed! See you at the scheduled time.
                          </span>
                        )}
                      </div>
                    )}

                    {/* Employer Status Update Actions */}
                    {currentUser.role === 'employer' && (
                      <div className="flex items-center gap-2">
                        {activeConv.interview.status !== 'completed' && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange('completed')}
                            className="text-xs px-3 py-1.5 rounded-lg bg-emerald-950/40 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900/50"
                          >
                            Mark as Completed
                          </button>
                        )}
                        {activeConv.interview.status !== 'cancelled' && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange('cancelled')}
                            className="text-xs px-3 py-1.5 rounded-lg bg-rose-950/40 text-rose-300 border border-rose-500/40 hover:bg-rose-900/50"
                          >
                            Cancel Session
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Chat Message Stream */}
              <div className="card-gold p-4 flex-1 flex flex-col justify-between min-h-[380px] max-h-[500px]">
                <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4">
                  {messages.map(msg => {
                    const isMe = msg.sender_id === currentUser.id;
                    const isSystem = msg.sender_role === 'admin' || msg.sender_id === 'system';

                    if (isSystem) {
                      return (
                        <div key={msg.id} className="text-center my-2">
                          <span className="inline-block px-3 py-1 rounded-full text-[11px] bg-neutral-900 text-neutral-400 border border-neutral-800">
                            {msg.text}
                          </span>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center gap-1.5 mb-0.5 text-[10px] text-neutral-500">
                          <span>{msg.sender_name}</span>
                          <span className="capitalize text-[#d4af37]">({msg.sender_role})</span>
                          <span>·</span>
                          <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>

                        <div
                          className={`max-w-[85%] sm:max-w-[70%] p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line shadow ${
                            isMe
                              ? 'bg-gradient-to-r from-[#d4af37] to-[#f5d77a] text-neutral-950 rounded-tr-none font-medium'
                              : 'bg-[#18171d] text-[#f3eee0] border border-white/10 rounded-tl-none'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input Box */}
                <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-3 border-t border-white/10">
                  <input
                    type="text"
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    placeholder={
                      currentUser.role === 'employer'
                        ? 'Type a message or interview instruction to candidate...'
                        : 'Type your reply to the employer...'
                    }
                    className="input-gold flex-1 px-4 py-2.5 text-sm"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="btn-gold px-4 py-2.5 text-xs font-semibold shrink-0"
                  >
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="card-gold p-12 text-center my-auto">
              <MessageSquare className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
              <h3 className="font-serif text-lg font-bold text-[#f3eee0] mb-1">
                Select a Conversation
              </h3>
              <p className="text-xs text-[#b9b09a] max-w-sm mx-auto">
                Choose a conversation from the sidebar to chat and review interview schedules.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Schedule Interview Modal (Employers Only) */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141318] border border-[#d4af37]/50 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#d4af37]" />
                <h3 className="font-serif text-lg font-bold text-[#f5d77a]">
                  Schedule Candidate Interview
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {scheduleError && (
              <div className="p-3 bg-rose-950/40 border border-rose-500/50 rounded-lg flex items-start gap-2 text-xs text-rose-300">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{scheduleError}</span>
              </div>
            )}

            <form onSubmit={handleScheduleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Interview Date *</label>
                  <input
                    type="date"
                    required
                    value={interviewDate}
                    onChange={e => setInterviewDate(e.target.value)}
                    className="input-gold w-full px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Interview Time (EAT) *</label>
                  <input
                    type="text"
                    required
                    value={interviewTime}
                    onChange={e => setInterviewTime(e.target.value)}
                    placeholder="e.g. 10:00 AM or 02:30 PM"
                    className="input-gold w-full px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">Interview Format *</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setInterviewFormat('video');
                      setInterviewLocation('Google Meet: meet.google.com/jobconnect-interview');
                    }}
                    className={`p-2 rounded-lg border text-center font-semibold ${
                      interviewFormat === 'video'
                        ? 'border-[#d4af37] bg-[#d4af37]/15 text-[#f5d77a]'
                        : 'border-white/10 bg-neutral-900 text-neutral-400'
                    }`}
                  >
                    Google Meet / Video
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setInterviewFormat('in_person');
                      setInterviewLocation('Company HQ, Westlands, Nairobi');
                    }}
                    className={`p-2 rounded-lg border text-center font-semibold ${
                      interviewFormat === 'in_person'
                        ? 'border-[#d4af37] bg-[#d4af37]/15 text-[#f5d77a]'
                        : 'border-white/10 bg-neutral-900 text-neutral-400'
                    }`}
                  >
                    In-Person Nairobi
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setInterviewFormat('phone');
                      setInterviewLocation('Phone call to candidate number');
                    }}
                    className={`p-2 rounded-lg border text-center font-semibold ${
                      interviewFormat === 'phone'
                        ? 'border-[#d4af37] bg-[#d4af37]/15 text-[#f5d77a]'
                        : 'border-white/10 bg-neutral-900 text-neutral-400'
                    }`}
                  >
                    Phone Call
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">
                  Location, Office Address, or Meeting Link *
                </label>
                <input
                  type="text"
                  required
                  value={interviewLocation}
                  onChange={e => setInterviewLocation(e.target.value)}
                  placeholder="e.g. 5th Floor, Delta Corner, Westlands or Google Meet link"
                  className="input-gold w-full px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">
                  Interview Agenda &amp; Requirements (Optional)
                </label>
                <textarea
                  rows={2}
                  value={interviewNotes}
                  onChange={e => setInterviewNotes(e.target.value)}
                  placeholder="e.g. Please bring original national ID and academic certificates..."
                  className="input-gold w-full px-3 py-2 text-sm"
                />
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="btn-gold-outline flex-1 py-2 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gold flex-1 py-2 text-xs font-semibold"
                >
                  Confirm &amp; Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
