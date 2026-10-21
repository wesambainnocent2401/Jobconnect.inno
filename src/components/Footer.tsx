/**
 * JobConnect Kenya - Footer Component
 */

import React from 'react';
import { Logo } from './Logo';
import { Shield, Phone, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#0b0a0e] border-t border-[#d4af37]/25 text-[#b9b09a] text-sm pt-12 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1: Brand & Mission */}
          <div className="space-y-4 md:col-span-1">
            <Logo size="md" />
            <p className="text-xs text-[#b9b09a] leading-relaxed">
              Kenya's premier merit-based job platform. Connecting skilled workers with leading employers through transparent, automated qualification matching.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#d4af37]">
              <Shield className="w-4 h-4 text-[#d4af37]" />
              <span>Compliant with Kenya Data Protection Act 2019</span>
            </div>
          </div>

          {/* Col 2: For Job Seekers */}
          <div className="space-y-3">
            <h4 className="font-serif text-[#f5d77a] font-semibold text-base">For Job Seekers</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#f5d77a] transition-colors"
                >
                  Browse Open Jobs in Kenya
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('my-applications')}
                  className="hover:text-[#f5d77a] transition-colors"
                >
                  Track My Applications
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('profile')}
                  className="hover:text-[#f5d77a] transition-colors"
                >
                  Update Candidate Profile
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: For Employers */}
          <div className="space-y-3">
            <h4 className="font-serif text-[#f5d77a] font-semibold text-base">For Employers</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('post-job')}
                  className="hover:text-[#f5d77a] transition-colors"
                >
                  Post a Job Listing
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('my-jobs')}
                  className="hover:text-[#f5d77a] transition-colors"
                >
                  Manage Job Listings
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('employer-dashboard')}
                  className="hover:text-[#f5d77a] transition-colors"
                >
                  Automated Candidate Selection
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Nairobi Hub */}
          <div className="space-y-3">
            <h4 className="font-serif text-[#f5d77a] font-semibold text-base">Support & Contact</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Nairobi, Kenya</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>support@jobconnect.co.ke</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
                <a href="tel:0710800205" className="hover:text-[#f5d77a] transition-colors">
                  0710800205 (Safaricom M-Pesa Support)
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Legal & Copyright */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} JobConnect Kenya. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate('terms')}
              className="hover:text-[#f5d77a] transition-colors"
            >
              Terms of Use
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => onNavigate('privacy')}
              className="hover:text-[#f5d77a] transition-colors"
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
