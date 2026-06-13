import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, Copy, CheckCircle2 } from 'lucide-react';
import { toast, Toaster } from 'sonner';

export const AdminPage: React.FC = () => {
  const [prefix, setPrefix] = useState('Mr. & Mrs.');
  const [guestName, setGuestName] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);

  const prefixes = [
    'Mr. & Mrs.',
    'Mr.',
    'Mrs.',
    'Ms.',
    'Miss',
    'Dr.',
    'Prof.',
    'Rev.',
    'Hon.',
    'Family',
  ];

  const handleGenerate = () => {
    if (!guestName.trim()) {
      toast.error('Please enter a guest name');
      return;
    }

    const baseUrl = window.location.origin;
    const url = new URL(baseUrl);
    url.searchParams.set('prefix', prefix);
    url.searchParams.set('name', guestName.trim());

    setGeneratedLink(url.toString());
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!generatedLink) return;
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  return (
    <div className="min-h-screen bg-brand-ivory flex items-center justify-center p-4 font-sans">
      <Toaster position="top-center" />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-brand-beige/30"
      >
        <div className="bg-brand-champagne/30 p-6 border-b border-brand-beige/20 flex flex-col items-center">
          <Link className="w-8 h-8 text-brand-beige-deep mb-3" />
          <h1 className="text-2xl font-serif text-stone-800">Link Generator</h1>
          <p className="text-stone-500 text-sm mt-1">Generate personalized invitation links</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-stone-700">Prefix</label>
            <select
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-brand-beige focus:ring-2 focus:ring-brand-beige/20 outline-none transition-all bg-white text-stone-700"
            >
              {prefixes.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-stone-700">Guest Name</label>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-brand-beige focus:ring-2 focus:ring-brand-beige/20 outline-none transition-all text-stone-700"
            />
          </div>

          <button
            onClick={handleGenerate}
            className="w-full py-3 bg-stone-800 text-white rounded-xl hover:bg-stone-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            Generate Link
          </button>

          {generatedLink && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="pt-4 border-t border-stone-100"
            >
              <label className="block text-sm font-medium text-stone-700 mb-2">Generated Link</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={generatedLink}
                  className="flex-1 px-4 py-3 rounded-xl border border-brand-beige/30 bg-brand-champagne/10 text-stone-600 text-sm outline-none"
                />
                <button
                  onClick={handleCopy}
                  className="p-3 bg-brand-beige-deep text-white rounded-xl hover:bg-brand-beige-deep/90 transition-colors flex items-center justify-center min-w-[52px]"
                  title="Copy link"
                >
                  {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
