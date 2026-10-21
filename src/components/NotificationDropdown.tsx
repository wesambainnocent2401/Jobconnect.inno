/**
 * JobConnect Kenya - Real-Time Notification Bell & Dropdown Component
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  Check,
  CheckCheck,
  Briefcase,
  Award,
  Calendar,
  MessageSquare,
  Clock,
  ExternalLink,
  X
} from 'lucide-react';
import { AppNotification, NotificationType, User } from '../types';
import { store } from '../lib/storage';
import { formatNairobiDate } from '../lib/kenyaData';

interface NotificationDropdownProps {
  currentUser: User | null;
  onNavigate: (view: string, param?: string) => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  currentUser,
  onNavigate
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  if (!currentUser) return null;

  const notifications = store.getNotifications(currentUser.id);
  const unreadCount = store.getUnreadNotificationCount(currentUser.id);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notif: AppNotification) => {
    store.markNotificationAsRead(notif.id);
    setIsOpen(false);
    onNavigate(notif.link_view, notif.link_param);
  };

  const handleMarkAllRead = () => {
    store.markAllNotificationsAsRead(currentUser.id);
  };

  const getIconForType = (type: NotificationType) => {
    switch (type) {
      case 'job_match':
        return <Briefcase className="w-4 h-4 text-[#f5d77a]" />;
      case 'status_update':
        return <Award className="w-4 h-4 text-emerald-400" />;
      case 'interview_invite':
        return <Calendar className="w-4 h-4 text-cyan-400" />;
      case 'new_message':
      default:
        return <MessageSquare className="w-4 h-4 text-[#d4af37]" />;
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-neutral-300 hover:text-[#f5d77a] hover:bg-white/5 transition-all focus:outline-none"
        aria-label="Notifications"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4af37] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#d4af37] text-neutral-950 font-bold text-[10px] items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </span>
        )}
      </button>

      {/* Pop-up Alert Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#131217] border border-[#d4af37]/40 rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-white/5 animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-3.5 bg-[#17161d] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-sm text-[#f5d77a]">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f5d77a] text-[10px] font-bold rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-[11px] text-[#d4af37] hover:underline flex items-center gap-1 font-medium"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Notification Items List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#b9b09a]">
                <Bell className="w-8 h-8 text-neutral-600 mx-auto mb-2 opacity-50" />
                <p>No notifications yet.</p>
                <p className="text-[10px] text-neutral-500 mt-1">
                  You will receive alerts here when applications update or jobs match your skills.
                </p>
              </div>
            ) : (
              notifications.map(notif => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3.5 hover:bg-white/[0.04] cursor-pointer transition-colors flex items-start gap-3 ${
                    !notif.is_read ? 'bg-[#d4af37]/[0.06] border-l-2 border-[#d4af37]' : ''
                  }`}
                >
                  <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 shrink-0 mt-0.5">
                    {getIconForType(notif.type)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <p className={`text-xs font-semibold truncate ${
                        !notif.is_read ? 'text-[#f5d77a]' : 'text-[#f3eee0]'
                      }`}>
                        {notif.title}
                      </p>
                      {!notif.is_read && (
                        <span className="w-2 h-2 rounded-full bg-[#d4af37] shrink-0" />
                      )}
                    </div>

                    <p className="text-[11px] text-[#b9b09a] mt-0.5 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>

                    <div className="flex items-center gap-2 mt-1.5 text-[10px] text-neutral-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#d4af37]" />
                        {formatNairobiDate(notif.created_at)}
                      </span>
                      <span>·</span>
                      <span className="text-[#d4af37] hover:underline flex items-center gap-0.5">
                        <span>View details</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
