/**
 * WhatsApp Share Button for Kenyan Job Seekers & Employers
 */

import React from 'react';
import { Share2 } from 'lucide-react';
import { Job } from '../types';

interface WhatsAppShareButtonProps {
  job: Job;
}

export const WhatsAppShareButton: React.FC<WhatsAppShareButtonProps> = ({ job }) => {
  const handleShare = () => {
    const currentUrl = window.location.href;
    const text = `🚨 *Job Opportunity on JobConnect Kenya* 🚨\n\n📌 *Position:* ${job.title}\n🏢 *Company:* ${job.company_name}\n📍 *Location:* ${job.location}\n💼 *Type:* ${job.employment_type}\n💰 *Salary:* ${job.salary || 'Negotiable'}\n⏳ *Apply before:* ${job.deadline || 'Open until filled'}\n\n👉 Apply now on JobConnect:\n${currentUrl}`;

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    // Using direct location href or a link to avoid popup blockers in iframes
    window.location.href = whatsappUrl;
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] font-medium text-sm transition-all hover:scale-[1.02] shadow-sm min-h-[44px]"
      title="Share this job opportunity with friends on WhatsApp"
    >
      <Share2 className="w-4 h-4" />
      <span>Share on WhatsApp</span>
    </button>
  );
};
