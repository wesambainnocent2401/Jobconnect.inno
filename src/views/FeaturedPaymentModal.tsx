/**
 * Featured Job M-Pesa Payment Modal
 * Supports both Step A (Till/Paybill confirmation code) and Step B (Lipa na M-Pesa STK Push)
 */

import React, { useState } from 'react';
import { X, Star, Smartphone, Check, AlertCircle, ShieldCheck } from 'lucide-react';
import { store } from '../lib/storage';
import { formatKSh } from '../lib/kenyaData';

interface FeaturedPaymentModalProps {
  jobId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const FeaturedPaymentModal: React.FC<FeaturedPaymentModalProps> = ({
  jobId,
  onClose,
  onSuccess
}) => {
  const job = store.getJobById(jobId);
  const settings = store.getSettings();

  const [durationDays, setDurationDays] = useState<number>(7);
  const [phone, setPhone] = useState('07');
  const [mpesaCode, setMpesaCode] = useState('');
  const [method, setMethod] = useState<'till_manual' | 'daraja_stk'>('till_manual');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!job) return null;

  const amount = durationDays === 7 ? settings.featuredPrice7Days : settings.featuredPrice30Days;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (method === 'till_manual') {
      if (!mpesaCode.trim() || mpesaCode.trim().length < 8) {
        setError('Please enter a valid M-Pesa transaction code (e.g. QKJ49X82ZZ).');
        return;
      }
    }

    if (!phone || phone.length < 10) {
      setError('Please enter a valid Safaricom phone number (e.g. 0712345678).');
      return;
    }

    setLoading(true);

    // If STK, simulate STK push delay
    setTimeout(() => {
      const codeToUse = method === 'daraja_stk' 
        ? `STK${Date.now().toString().slice(-6)}${Math.random().toString(36).slice(2, 4).toUpperCase()}`
        : mpesaCode;

      const res = store.submitFeaturedPayment({
        job_id: job.id,
        duration_days: durationDays,
        amount,
        mpesa_code: codeToUse,
        phone_number: phone,
        payment_method: method
      });

      setLoading(false);

      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1800);
      } else {
        setError(res.message);
      }
    }, method === 'daraja_stk' ? 1200 : 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#141318] border border-[#d4af37]/50 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <Star className="w-5 h-5 text-[#d4af37] fill-[#d4af37]" />
          <h3 className="font-serif text-xl font-bold text-[#f5d77a]">
            Promote to Featured Job
          </h3>
        </div>
        <p className="text-xs text-[#b9b09a] mb-5">
          Featured jobs appear prominently at the very top of search results with a shiny gold badge.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-rose-950/40 border border-rose-500/50 rounded-lg flex items-start gap-2 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-950/40 border border-emerald-500/50 rounded-lg flex items-start gap-2 text-xs text-emerald-300">
            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Duration Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#f5d77a] mb-2">
              Select Promotion Duration:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDurationDays(7)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  durationDays === 7
                    ? 'border-[#d4af37] bg-[#d4af37]/15 ring-1 ring-[#d4af37]'
                    : 'border-white/10 bg-neutral-900/60'
                }`}
              >
                <div className="text-xs font-bold text-[#f3eee0]">7 Days Featured</div>
                <div className="text-lg font-bold text-[#f5d77a] mt-0.5">
                  {formatKSh(settings.featuredPrice7Days)}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDurationDays(30)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  durationDays === 30
                    ? 'border-[#d4af37] bg-[#d4af37]/15 ring-1 ring-[#d4af37]'
                    : 'border-white/10 bg-neutral-900/60'
                }`}
              >
                <div className="text-xs font-bold text-[#f3eee0]">30 Days Featured</div>
                <div className="text-lg font-bold text-[#f5d77a] mt-0.5">
                  {formatKSh(settings.featuredPrice30Days)}
                </div>
              </button>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#f5d77a] mb-2">
              Payment Method:
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setMethod('till_manual')}
                className={`p-2.5 rounded-lg border text-center font-medium ${
                  method === 'till_manual'
                    ? 'border-[#d4af37] bg-[#d4af37]/15 text-[#f5d77a]'
                    : 'border-white/10 bg-neutral-900 text-neutral-400'
                }`}
              >
                M-Pesa Buy Goods / Till
              </button>

              <button
                type="button"
                onClick={() => setMethod('daraja_stk')}
                className={`p-2.5 rounded-lg border text-center font-medium flex items-center justify-center gap-1.5 ${
                  method === 'daraja_stk'
                    ? 'border-[#d4af37] bg-[#d4af37]/15 text-[#f5d77a]'
                    : 'border-white/10 bg-neutral-900 text-neutral-400'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                Lipa na M-Pesa STK
              </button>
            </div>
          </div>

          {/* Instructions Box */}
          {method === 'till_manual' ? (
            <div className="p-3.5 bg-neutral-900/80 border border-[#d4af37]/30 rounded-xl text-xs space-y-1.5 text-neutral-300">
              <p className="font-semibold text-[#f5d77a]">Payment Instructions:</p>
              <ol className="list-decimal pl-4 space-y-1 text-neutral-400">
                <li>Go to M-Pesa menu &gt; <strong>Lipa na M-Pesa</strong> &gt; <strong>Buy Goods and Services</strong></li>
                <li>Enter Till Number: <strong className="text-[#f5d77a] font-mono text-sm">{settings.mpesaTillNumber}</strong></li>
                <li>Enter Amount: <strong className="text-[#f5d77a]">{formatKSh(amount)}</strong></li>
                <li>Enter M-Pesa PIN &amp; confirm.</li>
                <li>Enter the 10-character confirmation code below:</li>
              </ol>
            </div>
          ) : (
            <div className="p-3.5 bg-emerald-950/20 border border-emerald-500/30 rounded-xl text-xs space-y-1 text-emerald-300">
              <p className="font-semibold text-emerald-400">Lipa na M-Pesa Online (STK Push):</p>
              <p className="text-neutral-300">
                Enter your Safaricom number. You will receive an instant push prompt on your handset to enter your M-Pesa PIN.
              </p>
            </div>
          )}

          {/* Inputs */}
          <div>
            <label className="block text-xs font-medium text-[#f5d77a] mb-1">
              Safaricom Phone Number *
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="0712345678"
              className="input-gold w-full px-3 py-2 text-sm"
            />
          </div>

          {method === 'till_manual' && (
            <div>
              <label className="block text-xs font-medium text-[#f5d77a] mb-1">
                M-Pesa Confirmation Code *
              </label>
              <input
                type="text"
                required
                value={mpesaCode}
                onChange={e => setMpesaCode(e.target.value.toUpperCase())}
                placeholder="e.g. QKJ49X82ZZ"
                className="input-gold w-full px-3 py-2 text-sm font-mono tracking-wider uppercase"
              />
            </div>
          )}

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-gold-outline flex-1 py-2.5 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || Boolean(successMsg)}
              className="btn-gold flex-1 py-2.5 text-xs font-semibold"
            >
              {loading ? 'Processing...' : method === 'daraja_stk' ? 'Send STK Prompt' : 'Submit for Verification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
