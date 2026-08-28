'use client';

/*
  ─────────────────────────────────────────────────────────
  DESIGN SYSTEM: Swiss Editorial × Dieter Rams Industrial
  ─────────────────────────────────────────────────────────
  Typography : DM Sans (UI labels, 13/14/16px) + DM Mono (data, numbers, IDs)
  Color       : Dark #0a0b0d | Surface #111318 | Cream #f6f5f2 | Stone #f0ede8
               Amber #d97706 (functional accent — pending/CTAs only)
               Emerald #059669 (confirmed/published)  Red #dc2626 (cancelled/delete)
  Grid        : 56px icon-rail + flexible main. 8px base unit.
  Containers  : Minimalist tables, hairline borders.
               Centered modals for all detail/add/edit/upload operations.
  Features    :
               - Reservations Management (Status change, WhatsApp quick contact, CSV)
               - Tour Packages Management (Add, Edit, Delete, Live DB sync)
               - Reviews & Testimonials Management (Add, Edit, 1-Click Publish/Hide, Delete)
               - Cloudflare R2 Media Photo Studio (Upload, Category filter, Copy CDN link)
  ─────────────────────────────────────────────────────────
*/

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  Compass,
  Star,
  Image as ImageIcon,
  Settings,
  LogOut,
  RefreshCw,
  Search,
  Download,
  Phone,
  Mail,
  MessageSquare,
  Trash2,
  Upload,
  Copy,
  Sun,
  Moon,
  Menu,
  X,
  Check,
  ArrowUpRight,
  Inbox,
  ExternalLink,
  Plus,
  Edit2,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { useTheme } from 'next-themes';

// ─── Types ───────────────────────────────────────────────
interface Booking {
  id: string;
  packageName: string;
  customerName: string;
  email: string;
  phone?: string | null;
  date: string;
  guests: number;
  message?: string | null;
  totalPrice?: number | null;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  createdAt: string;
}

interface TourPackageData {
  id: string;
  slug?: string;
  title: string;
  subtitle?: string | null;
  price: number;
  duration: string;
  difficulty?: string | null;
  groupSize?: string | null;
  highlight?: boolean;
  signature?: boolean;
  description: string;
  mainImage?: string | null;
  gallery?: string[];
  features?: string[];
  createdAt?: string;
}

interface ReviewData {
  id: string;
  author: string;
  location: string;
  rating: number;
  tour: string;
  text: string;
  avatar?: string | null;
  published: boolean;
  createdAt: string;
}

interface R2Object {
  key: string;
  size: number;
  lastModified?: string;
  url: string;
  category?: string;
}

type TabType = 'overview' | 'bookings' | 'tours' | 'reviews' | 'media' | 'settings';

// ─── Status meta ──────────────────────────────────────────
const STATUS_META: Record<string, { label: string; dot: string; text: string; bg: string }> = {
  PENDING:   { label: 'Pending',   dot: 'bg-amber-500',   text: 'text-amber-600 dark:text-amber-400',   bg: 'bg-amber-50 dark:bg-amber-950/40' },
  CONFIRMED: { label: 'Confirmed', dot: 'bg-emerald-500', text: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
  COMPLETED: { label: 'Completed', dot: 'bg-sky-500',     text: 'text-sky-700 dark:text-sky-400',       bg: 'bg-sky-50 dark:bg-sky-950/40' },
  CANCELLED: { label: 'Cancelled', dot: 'bg-red-500',     text: 'text-red-600 dark:text-red-400',       bg: 'bg-red-50 dark:bg-red-950/40' },
};

function StatusBadge({ status }: { status: string }) {
  const m = STATUS_META[status] || STATUS_META.PENDING;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide font-mono ${m.text} ${m.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${m.dot}`} />
      {m.label}
    </span>
  );
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
function fmtRevenue(n: number) {
  return n.toLocaleString('en-US');
}

// ─── Stat Cell ────────────────────────────────────────────
function StatCell({ label, value, sub, accent = false }: {
  label: string; value: string | number; sub?: string; accent?: boolean;
}) {
  return (
    <div className="p-6 border-r border-b dark:border-white/[0.06] border-stone-200 last:border-r-0 flex flex-col gap-1 min-w-0">
      <span className="text-[10px] uppercase tracking-[0.18em] font-semibold dark:text-zinc-500 text-stone-400">{label}</span>
      <span className={`text-3xl leading-none mt-1 font-mono ${accent ? 'text-amber-600 dark:text-amber-400' : 'dark:text-white text-stone-900'}`}>
        {value}
      </span>
      {sub && <span className="text-[11px] dark:text-zinc-600 text-stone-400 mt-0.5">{sub}</span>}
    </div>
  );
}

// ─── Modal Backdrop ───────────────────────────────────────
function Modal({ onClose, children, maxWidth = 'max-w-lg' }: { onClose: () => void; children: React.ReactNode; maxWidth?: string }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      <div
        className={`relative z-10 w-full ${maxWidth} dark:bg-[#0f1115] bg-white border dark:border-white/[0.08] border-stone-200 shadow-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150`}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

// ─── 1. Booking Detail Modal ──────────────────────────────
function BookingModal({
  booking,
  onClose,
  onStatusChange,
  onDelete,
}: {
  booking: Booking;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}) {
  const waMsg = encodeURIComponent(
    `Hello ${booking.customerName}, regarding your ${booking.packageName} reservation with Families Tours on ${fmtDate(booking.date)}.`
  );
  const waPhone = (booking.phone || '').replace(/[^0-9]/g, '');

  return (
    <Modal onClose={onClose}>
      <div className="flex items-start justify-between px-6 py-5 border-b dark:border-white/[0.06] border-stone-200">
        <div>
          <p className="text-[15px] font-semibold dark:text-white text-stone-900 leading-tight">{booking.customerName}</p>
          <p className="text-[10px] font-mono dark:text-zinc-600 text-stone-400 mt-1">{booking.id.slice(0, 16)}…</p>
        </div>
        <button onClick={onClose} className="p-1 dark:text-zinc-500 text-stone-400 hover:dark:text-zinc-100 hover:text-stone-900 transition-colors flex-shrink-0 ml-4">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="px-6 py-5 space-y-6">
        <div>
          <p className="text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 mb-3">Change Status</p>
          <div className="flex flex-wrap gap-2">
            {['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(s => (
              <button
                key={s}
                onClick={() => onStatusChange(booking.id, s)}
                className={`h-8 px-4 text-[11px] font-mono tracking-wide border transition-colors ${
                  booking.status === s
                    ? s === 'CANCELLED'
                      ? 'border-red-500 bg-red-600 text-white'
                      : s === 'CONFIRMED' || s === 'COMPLETED'
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-amber-500 bg-amber-600 text-white'
                    : 'dark:border-white/10 border-stone-300 dark:text-zinc-400 text-stone-500 hover:border-amber-500 dark:hover:text-zinc-100'
                }`}
              >
                {s.charAt(0) + s.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-0 border dark:border-white/[0.06] border-stone-200">
          {[
            { label: 'Experience',  value: booking.packageName, mono: false },
            { label: 'Tour Date',   value: fmtDate(booking.date), mono: true },
            { label: 'Guests',      value: `${booking.guests} person${booking.guests !== 1 ? 's' : ''}`, mono: true },
            { label: 'Status',      value: null },
            { label: 'Booked On',   value: fmtDate(booking.createdAt), mono: true },
          ].map(({ label, value, mono }) => (
            <div key={label} className="flex items-center justify-between px-4 py-3 border-b dark:border-white/[0.06] border-stone-200 last:border-0 gap-4">
              <span className="text-[11px] font-mono dark:text-zinc-600 text-stone-400 flex-shrink-0">{label}</span>
              {label === 'Status'
                ? <StatusBadge status={booking.status} />
                : <span className={`text-[13px] dark:text-zinc-200 text-stone-800 text-right ${mono ? 'font-mono' : ''}`}>{value}</span>
              }
            </div>
          ))}
        </div>

        <div>
          <p className="text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 mb-3">Contact Customer</p>
          <div className="space-y-2.5">
            <a
              href={`mailto:${booking.email}`}
              className="flex items-center gap-3 h-9 px-4 border dark:border-white/10 border-stone-300 text-[12px] font-mono dark:text-zinc-300 text-stone-700 hover:border-amber-500 hover:dark:text-zinc-100 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 dark:text-zinc-500 text-stone-400 flex-shrink-0" />
              {booking.email}
            </a>
            {booking.phone && (
              <>
                <a
                  href={`tel:${booking.phone}`}
                  className="flex items-center gap-3 h-9 px-4 border dark:border-white/10 border-stone-300 text-[12px] font-mono dark:text-zinc-300 text-stone-700 hover:border-amber-500 hover:dark:text-zinc-100 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 dark:text-zinc-500 text-stone-400 flex-shrink-0" />
                  {booking.phone}
                </a>
                {waPhone && (
                  <a
                    href={`https://wa.me/${waPhone}?text=${waMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 h-9 px-4 border border-emerald-600/60 text-[12px] font-mono text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Message on WhatsApp
                    <ExternalLink className="w-3 h-3 ml-auto opacity-60" />
                  </a>
                )}
              </>
            )}
          </div>
        </div>

        {booking.message && (
          <div>
            <p className="text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 mb-2">Customer Notes</p>
            <p className="text-[13px] dark:text-zinc-400 text-stone-600 leading-relaxed border dark:border-white/[0.06] border-stone-200 px-4 py-3">
              {booking.message}
            </p>
          </div>
        )}

        <div className="pt-2 border-t dark:border-white/[0.06] border-stone-200">
          <button
            onClick={() => { onDelete(booking.id); onClose(); }}
            className="flex items-center gap-2 text-[11px] font-mono text-red-500/50 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete this reservation permanently
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─── 2. Tour Package Create/Edit Modal ─────────────────────
function TourModal({
  tour,
  onClose,
  onSave,
}: {
  tour: TourPackageData | null;
  onClose: () => void;
  onSave: (data: Partial<TourPackageData>) => Promise<void>;
}) {
  const isEditing = Boolean(tour);
  const [formData, setFormData] = useState({
    title: tour?.title || '',
    subtitle: tour?.subtitle || '',
    price: tour?.price || 200,
    duration: tour?.duration || '4-5 hours',
    difficulty: tour?.difficulty || 'Easy',
    groupSize: tour?.groupSize || 'Up to 12 guests',
    description: tour?.description || '',
    mainImage: tour?.mainImage || '',
    features: (tour?.features || []).join('\n'),
    highlight: tour?.highlight || false,
    signature: tour?.signature || false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleImageUpload = async (file: File) => {
    setImageFile(file);
    setIsUploadingImage(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('category', 'Tours');
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success && data.url) {
        setFormData(prev => ({ ...prev, mainImage: data.url }));
      }
    } catch {
      // silent — user can retry
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) handleImageUpload(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave({
        ...formData,
        price: parseFloat(formData.price as any) || 0,
        features: formData.features.split('\n').map(f => f.trim()).filter(Boolean),
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal onClose={onClose} maxWidth="max-w-xl">
      <div className="flex items-center justify-between px-6 py-5 border-b dark:border-white/[0.06] border-stone-200">
        <div>
          <p className="text-[14px] font-semibold dark:text-white text-stone-900">
            {isEditing ? 'Edit Tour Package' : 'Add New Tour Package'}
          </p>
          <p className="text-[10px] font-mono dark:text-zinc-500 text-stone-400 mt-0.5">
            {isEditing ? `ID: ${tour?.id}` : 'Create a new experience for the website'}
          </p>
        </div>
        <button onClick={onClose} className="p-1 dark:text-zinc-500 text-stone-400 hover:dark:text-zinc-100 hover:text-stone-900 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
        <div>
          <label className="block text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 mb-1.5">Package Title *</label>
          <input
            required
            type="text"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Camel Trek & Sunset Dinner"
            className="w-full h-10 px-3 text-[13px] bg-transparent border dark:border-white/10 border-stone-300 dark:text-zinc-200 text-stone-800 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 mb-1.5">Subtitle / Tagline</label>
          <input
            type="text"
            value={formData.subtitle || ''}
            onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
            placeholder="e.g. The Classic Agafay Desert Immersion"
            className="w-full h-10 px-3 text-[13px] bg-transparent border dark:border-white/10 border-stone-300 dark:text-zinc-200 text-stone-800 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 mb-1.5">Price (MAD) *</label>
            <input
              required
              type="number"
              min={0}
              value={formData.price}
              onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              className="w-full h-10 px-3 text-[13px] font-mono bg-transparent border dark:border-white/10 border-stone-300 dark:text-zinc-200 text-stone-800 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 mb-1.5">Duration</label>
            <input
              type="text"
              value={formData.duration}
              onChange={e => setFormData({ ...formData, duration: e.target.value })}
              placeholder="4-5 hours"
              className="w-full h-10 px-3 text-[13px] font-mono bg-transparent border dark:border-white/10 border-stone-300 dark:text-zinc-200 text-stone-800 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 mb-1.5">Difficulty</label>
            <select
              value={formData.difficulty || 'Easy'}
              onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
              className="w-full h-10 px-3 text-[12px] font-mono bg-transparent border dark:border-white/10 border-stone-300 dark:text-zinc-200 text-stone-800 focus:outline-none focus:border-amber-500 transition-colors"
            >
              <option value="Easy" className="dark:bg-zinc-900 bg-white">Easy</option>
              <option value="Moderate" className="dark:bg-zinc-900 bg-white">Moderate</option>
              <option value="Challenging" className="dark:bg-zinc-900 bg-white">Challenging</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 mb-1.5">Group Size</label>
            <input
              type="text"
              value={formData.groupSize || ''}
              onChange={e => setFormData({ ...formData, groupSize: e.target.value })}
              placeholder="Up to 12 guests"
              className="w-full h-10 px-3 text-[12px] font-mono bg-transparent border dark:border-white/10 border-stone-300 dark:text-zinc-200 text-stone-800 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </div>

        {/* Cover Image — Drag & Drop Upload */}
        <div>
          <label className="block text-[10px] font-mono tracking-widests uppercase dark:text-zinc-600 text-stone-400 mb-1.5">Cover Image</label>

          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setIsDraggingOver(true); }}
            onDragLeave={() => setIsDraggingOver(false)}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed transition-colors ${
              isDraggingOver
                ? 'border-amber-500 dark:bg-amber-950/10 bg-amber-50/50'
                : formData.mainImage
                ? 'border-emerald-600/40 dark:border-emerald-600/40'
                : 'dark:border-white/10 border-stone-300 hover:dark:border-white/25 hover:border-stone-400'
            }`}
          >
            {/* Preview when image is set */}
            {formData.mainImage ? (
              <div className="relative group h-36">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={formData.mainImage}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <label className="cursor-pointer flex items-center gap-2 h-8 px-4 bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-mono transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    {isUploadingImage ? 'Uploading…' : 'Replace Image'}
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => { setImageFile(null); setFormData(prev => ({ ...prev, mainImage: '' })); }}
                    className="text-[10px] font-mono text-white/60 hover:text-white transition-colors"
                  >
                    Remove
                  </button>
                </div>
                {isUploadingImage && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <RefreshCw className="w-6 h-6 text-amber-400 animate-spin" />
                  </div>
                )}
              </div>
            ) : (
              /* Empty drop zone */
              <label className="flex flex-col items-center justify-center h-36 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }}
                />
                {isUploadingImage ? (
                  <>
                    <RefreshCw className="w-6 h-6 text-amber-500 animate-spin mb-2" />
                    <p className="text-[12px] font-mono dark:text-zinc-400 text-stone-500">{imageFile?.name || 'Uploading…'}</p>
                  </>
                ) : (
                  <>
                    <Upload className="w-6 h-6 dark:text-zinc-600 text-stone-400 mb-2" />
                    <p className="text-[12px] font-mono dark:text-zinc-500 text-stone-400">Drop image here or click to browse</p>
                    <p className="text-[10px] font-mono dark:text-zinc-700 text-stone-300 mt-1">JPG, PNG, WebP — uploaded to CDN</p>
                  </>
                )}
              </label>
            )}
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 mb-1.5">Description</label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            placeholder="Detailed description of the experience..."
            className="w-full px-3 py-2 text-[13px] bg-transparent border dark:border-white/10 border-stone-300 dark:text-zinc-200 text-stone-800 focus:outline-none focus:border-amber-500 transition-colors resize-none"
          />
        </div>

        <div>
          <label className="block text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 mb-1.5">Included Features (1 per line)</label>
          <textarea
            rows={3}
            value={formData.features}
            onChange={e => setFormData({ ...formData, features: e.target.value })}
            placeholder="Sunset camel trek (1 hour)&#10;Traditional Moroccan dinner&#10;Live Berber music & entertainment&#10;Free hotel pickup in Marrakech"
            className="w-full px-3 py-2 text-[12px] font-mono bg-transparent border dark:border-white/10 border-stone-300 dark:text-zinc-200 text-stone-800 focus:outline-none focus:border-amber-500 transition-colors resize-none"
          />
        </div>

        <div className="flex items-center gap-6 pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-[12px] font-mono dark:text-zinc-300 text-stone-700">
            <input
              type="checkbox"
              checked={formData.highlight}
              onChange={e => setFormData({ ...formData, highlight: e.target.checked })}
              className="accent-amber-600 w-4 h-4"
            />
            <span>Highlight on Home Page</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-[12px] font-mono dark:text-zinc-300 text-stone-700">
            <input
              type="checkbox"
              checked={formData.signature}
              onChange={e => setFormData({ ...formData, signature: e.target.checked })}
              className="accent-amber-600 w-4 h-4"
            />
            <span>Signature Experience Badge</span>
          </label>
        </div>

        <div className="flex gap-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-10 border dark:border-white/10 border-stone-300 text-[12px] font-mono dark:text-zinc-400 text-stone-500 hover:dark:border-white/20 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 h-10 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white text-[12px] font-mono tracking-wide transition-colors"
          >
            {isSubmitting ? 'Saving…' : isEditing ? 'Update Tour Package' : 'Create Package'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ─── 3. Review Create/Edit Modal ──────────────────────────
function ReviewModal({
  review,
  onClose,
  onSave,
}: {
  review: ReviewData | null;
  onClose: () => void;
  onSave: (data: Partial<ReviewData>) => Promise<void>;
}) {
  const isEditing = Boolean(review);
  const [formData, setFormData] = useState({
    author: review?.author || '',
    location: review?.location || '',
    rating: review?.rating || 5,
    tour: review?.tour || 'Camel Trek & Dinner',
    text: review?.text || '',
    published: review?.published !== undefined ? review.published : true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="flex items-center justify-between px-6 py-5 border-b dark:border-white/[0.06] border-stone-200">
        <div>
          <p className="text-[14px] font-semibold dark:text-white text-stone-900">
            {isEditing ? 'Edit Customer Review' : 'Add New Customer Review'}
          </p>
          <p className="text-[10px] font-mono dark:text-zinc-500 text-stone-400 mt-0.5">
            {isEditing ? `Review by ${review?.author}` : 'Add a verified guest testimonial'}
          </p>
        </div>
        <button onClick={onClose} className="p-1 dark:text-zinc-500 text-stone-400 hover:dark:text-zinc-100 hover:text-stone-900 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
        <div>
          <label className="block text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 mb-1.5">Guest / Family Name *</label>
          <input
            required
            type="text"
            value={formData.author}
            onChange={e => setFormData({ ...formData, author: e.target.value })}
            placeholder="e.g. Sarah & James Wellington"
            className="w-full h-10 px-3 text-[13px] bg-transparent border dark:border-white/10 border-stone-300 dark:text-zinc-200 text-stone-800 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 mb-1.5">Guest Location *</label>
            <input
              required
              type="text"
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. London, United Kingdom"
              className="w-full h-10 px-3 text-[13px] bg-transparent border dark:border-white/10 border-stone-300 dark:text-zinc-200 text-stone-800 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 mb-1.5">Rating (1 - 5 Stars) *</label>
            <select
              value={formData.rating}
              onChange={e => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })}
              className="w-full h-10 px-3 text-[12px] font-mono bg-transparent border dark:border-white/10 border-stone-300 dark:text-zinc-200 text-stone-800 focus:outline-none focus:border-amber-500 transition-colors"
            >
              <option value="5" className="dark:bg-zinc-900 bg-white">★★★★★ (5 Stars)</option>
              <option value="4" className="dark:bg-zinc-900 bg-white">★★★★☆ (4 Stars)</option>
              <option value="3" className="dark:bg-zinc-900 bg-white">★★★☆☆ (3 Stars)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 mb-1.5">Experience Taken</label>
          <input
            type="text"
            value={formData.tour}
            onChange={e => setFormData({ ...formData, tour: e.target.value })}
            placeholder="e.g. Ultimate Desert Combo"
            className="w-full h-10 px-3 text-[13px] bg-transparent border dark:border-white/10 border-stone-300 dark:text-zinc-200 text-stone-800 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 mb-1.5">Review Testimonial Text *</label>
          <textarea
            required
            rows={4}
            value={formData.text}
            onChange={e => setFormData({ ...formData, text: e.target.value })}
            placeholder="Write the guest review feedback here..."
            className="w-full px-3 py-2.5 text-[13px] bg-transparent border dark:border-white/10 border-stone-300 dark:text-zinc-200 text-stone-800 focus:outline-none focus:border-amber-500 transition-colors resize-none"
          />
        </div>

        <div className="pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-[12px] font-mono dark:text-zinc-300 text-stone-700">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={e => setFormData({ ...formData, published: e.target.checked })}
              className="accent-amber-600 w-4 h-4"
            />
            <span>Publish live on the website immediately</span>
          </label>
        </div>

        <div className="flex gap-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-10 border dark:border-white/10 border-stone-300 text-[12px] font-mono dark:text-zinc-400 text-stone-500 hover:dark:border-white/20 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 h-10 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white text-[12px] font-mono tracking-wide transition-colors"
          >
            {isSubmitting ? 'Saving…' : isEditing ? 'Update Review' : 'Add Review'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ─── 4. Photo Upload Modal ────────────────────────────────
function UploadModal({
  onClose,
  onUploaded,
  showToast,
}: {
  onClose: () => void;
  onUploaded: () => void;
  showToast: (text: string, type?: 'success' | 'info' | 'error') => void;
}) {
  const [category, setCategory] = useState('Camels');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setIsUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('category', category);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) {
        showToast('Photo uploaded successfully', 'success');
        onUploaded();
        onClose();
      } else {
        showToast(data.error || 'Upload failed', 'error');
      }
    } catch {
      showToast('Upload error', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const CATS = ['Camels', 'Quad', 'Camp', 'Dinner', 'Sunrise', 'Safari4x4', 'Family', 'Gallery'];

  return (
    <Modal onClose={onClose}>
      <div className="flex items-center justify-between px-6 py-5 border-b dark:border-white/[0.06] border-stone-200">
        <p className="text-[14px] font-semibold dark:text-white text-stone-900">Upload Photo to Cloudflare R2</p>
        <button onClick={onClose} className="p-1 dark:text-zinc-500 text-stone-400 hover:dark:text-zinc-100 hover:text-stone-900 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
        <div>
          <label className="block text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 mb-2">Category Tag</label>
          <div className="grid grid-cols-4 gap-2">
            {CATS.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`h-8 text-[11px] font-mono border transition-colors ${
                  category === c
                    ? 'border-amber-500 bg-amber-600 text-white'
                    : 'dark:border-white/10 border-stone-300 dark:text-zinc-400 text-stone-500 hover:border-amber-500'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 mb-2">Select Image</label>
          <label
            className={`flex flex-col items-center justify-center h-32 border-2 border-dashed cursor-pointer transition-colors ${
              file
                ? 'dark:border-amber-600/50 border-amber-400/50 dark:bg-amber-950/10 bg-amber-50/50'
                : 'dark:border-white/10 border-stone-300 hover:dark:border-white/20 hover:border-stone-400'
            }`}
          >
            <input
              type="file"
              accept="image/*"
              onChange={e => setFile(e.target.files?.[0] || null)}
              className="sr-only"
            />
            {file ? (
              <>
                <Check className="w-5 h-5 text-amber-500 mb-2" />
                <p className="text-[12px] font-mono dark:text-zinc-300 text-stone-700 text-center px-4 truncate max-w-full">{file.name}</p>
                <p className="text-[11px] font-mono dark:text-zinc-600 text-stone-400 mt-1">{(file.size / 1024).toFixed(0)} KB</p>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 dark:text-zinc-600 text-stone-400 mb-2" />
                <p className="text-[12px] font-mono dark:text-zinc-500 text-stone-400">Click to choose a photo</p>
                <p className="text-[10px] font-mono dark:text-zinc-700 text-stone-300 mt-1">JPG, PNG, WebP</p>
              </>
            )}
          </label>
        </div>

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-10 border dark:border-white/10 border-stone-300 text-[12px] font-mono dark:text-zinc-400 text-stone-500 hover:dark:border-white/20 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!file || isUploading}
            className="flex-1 h-10 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white text-[12px] font-mono tracking-wide transition-colors"
          >
            {isUploading ? 'Uploading…' : 'Upload Photo'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ─── Main Admin Dashboard Component ──────────────────────
export default function AdminDashboard() {
  const { theme, setTheme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);
  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3200);
  };

  // Data States
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [tours, setTours] = useState<TourPackageData[]>([]);
  const [isLoadingTours, setIsLoadingTours] = useState(false);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [r2Images, setR2Images] = useState<R2Object[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [packageFilter, setPackageFilter] = useState('ALL');
  const [reviewSearch, setReviewSearch] = useState('');
  const [mediaFilterCategory, setMediaFilterCategory] = useState('ALL');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Modals States
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [tourModalState, setTourModalState] = useState<{ isOpen: boolean; tour: TourPackageData | null }>({
    isOpen: false,
    tour: null,
  });
  const [reviewModalState, setReviewModalState] = useState<{ isOpen: boolean; review: ReviewData | null }>({
    isOpen: false,
    review: null,
  });
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Change Password state
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [isChangingPw, setIsChangingPw] = useState(false);

  // ── Authentication ──
  useEffect(() => {
    // Check if already logged in via cookie
    fetch('/api/admin/me')
      .then(res => res.json())
      .then(data => { if (data.success) setIsAuthenticated(true); })
      .catch(() => {})
      .finally(() => setIsCheckingAuth(false));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        setLoginEmail('');
        setLoginPassword('');
      } else {
        setLoginError(data.error || 'Invalid credentials');
      }
    } catch {
      setLoginError('Connection error — please try again');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    setIsAuthenticated(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.newPw !== pwForm.confirm) {
      showToast('New passwords do not match', 'error');
      return;
    }
    if (pwForm.newPw.length < 6) {
      showToast('New password must be at least 6 characters', 'error');
      return;
    }
    setIsChangingPw(true);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.newPw }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Password changed successfully', 'success');
        setPwForm({ current: '', newPw: '', confirm: '' });
      } else {
        showToast(data.error || 'Failed to change password', 'error');
      }
    } catch {
      showToast('Connection error', 'error');
    } finally {
      setIsChangingPw(false);
    }
  };

  // ── Data Fetching ──
  const fetchBookings = useCallback(async () => {
    setIsLoadingBookings(true);
    try {
      const res = await fetch('/api/bookings?limit=200');
      const data = await res.json();
      if (data.success) setBookings(data.bookings || []);
    } catch { showToast('Could not load reservations', 'error'); }
    finally { setIsLoadingBookings(false); }
  }, []);

  const fetchTours = useCallback(async () => {
    setIsLoadingTours(true);
    try {
      const res = await fetch('/api/tours');
      const data = await res.json();
      if (data.success) setTours(data.tours || []);
    } catch { showToast('Could not load tours', 'error'); }
    finally { setIsLoadingTours(false); }
  }, []);

  const fetchReviews = useCallback(async () => {
    setIsLoadingReviews(true);
    try {
      const res = await fetch('/api/reviews');
      const data = await res.json();
      if (data.success) setReviews(data.reviews || []);
    } catch { showToast('Could not load reviews', 'error'); }
    finally { setIsLoadingReviews(false); }
  }, []);

  const fetchR2Images = useCallback(async () => {
    setIsLoadingImages(true);
    try {
      const res = await fetch('/api/upload');
      const data = await res.json();
      if (data.success) setR2Images(data.objects || []);
    } catch { /* silent */ }
    finally { setIsLoadingImages(false); }
  }, []);

  const fetchAllData = useCallback(() => {
    fetchBookings();
    fetchTours();
    fetchReviews();
    fetchR2Images();
  }, [fetchBookings, fetchTours, fetchReviews, fetchR2Images]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated, fetchAllData]);

  // ── Booking Mutations ──
  const handleStatusChange = async (id: string, newStatus: string) => {
    const res = await fetch(`/api/admin/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus as any } : b));
      setSelectedBooking(prev => prev?.id === id ? { ...prev, status: newStatus as any } : prev);
      showToast(`Marked as ${newStatus}`, 'success');
    } else {
      showToast('Update failed', 'error');
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm('Permanently delete this reservation?')) return;
    const res = await fetch(`/api/admin/bookings/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setBookings(prev => prev.filter(b => b.id !== id));
      showToast('Reservation deleted', 'info');
    }
  };

  // ── Tour Mutations ──
  const handleSaveTour = async (tourData: Partial<TourPackageData>) => {
    const isEdit = Boolean(tourModalState.tour);
    const url = isEdit ? `/api/tours/${tourModalState.tour?.id}` : '/api/tours';
    const method = isEdit ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tourData),
      });
      const data = await res.json();
      if (data.success) {
        showToast(isEdit ? 'Tour package updated' : 'New tour package created', 'success');
        fetchTours();
      } else {
        showToast(data.error || 'Failed to save tour package', 'error');
      }
    } catch {
      showToast('Network error saving tour', 'error');
    }
  };

  const handleDeleteTour = async (id: string, title: string) => {
    if (!confirm(`Permanently delete "${title}" package?`)) return;
    try {
      const res = await fetch(`/api/tours/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast(`"${title}" deleted`, 'info');
        fetchTours();
      } else {
        showToast(data.error || 'Failed to delete tour', 'error');
      }
    } catch {
      showToast('Error deleting tour', 'error');
    }
  };

  // ── Review Mutations ──
  const handleSaveReview = async (reviewData: Partial<ReviewData>) => {
    const isEdit = Boolean(reviewModalState.review);
    const url = isEdit ? `/api/reviews/${reviewModalState.review?.id}` : '/api/reviews';
    const method = isEdit ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });
      const data = await res.json();
      if (data.success) {
        showToast(isEdit ? 'Review updated' : 'New review added', 'success');
        fetchReviews();
      } else {
        showToast(data.error || 'Failed to save review', 'error');
      }
    } catch {
      showToast('Network error saving review', 'error');
    }
  };

  const handleTogglePublishReview = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !currentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setReviews(prev => prev.map(r => r.id === id ? { ...r, published: !currentStatus } : r));
        showToast(!currentStatus ? 'Review published live on site' : 'Review hidden from site', 'info');
      }
    } catch {
      showToast('Failed to toggle review status', 'error');
    }
  };

  const handleDeleteReview = async (id: string, author: string) => {
    if (!confirm(`Permanently delete review by "${author}"?`)) return;
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Review deleted', 'info');
        fetchReviews();
      }
    } catch {
      showToast('Error deleting review', 'error');
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast('Link copied', 'info');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDeleteImage = async (key: string) => {
    if (!confirm('Are you sure you want to delete this image permanently?')) return;
    try {
      const res = await fetch('/api/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Image deleted', 'success');
        fetchR2Images();
      } else {
        showToast(data.error || 'Failed to delete image', 'error');
      }
    } catch {
      showToast('Error deleting image', 'error');
    }
  };

  const exportToCSV = () => {
    if (!bookings.length) { showToast('No bookings to export', 'info'); return; }
    const headers = ['ID', 'Customer', 'Email', 'Phone', 'Package', 'Date', 'Guests', 'Status', 'Created', 'Notes'];
    const rows = bookings.map(b => [
      b.id,
      `"${b.customerName.replace(/"/g, '""')}"`,
      b.email,
      b.phone || '',
      `"${b.packageName.replace(/"/g, '""')}"`,
      b.date.split('T')[0],
      b.guests,
      b.status,
      b.createdAt.split('T')[0],
      `"${(b.message || '').replace(/"/g, '""')}"`,
    ]);
    const csv = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const a = document.createElement('a');
    a.href = encodeURI(csv);
    a.download = `families_tours_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('CSV exported', 'success');
  };

  // ── Derived Data ──
  const filteredBookings = useMemo(() => bookings.filter(b => {
    const ms = statusFilter === 'ALL' || b.status === statusFilter;
    const mp = packageFilter === 'ALL' || b.packageName.toLowerCase().includes(packageFilter.toLowerCase());
    const q = searchQuery.toLowerCase();
    const mq = !searchQuery || b.customerName.toLowerCase().includes(q) || b.email.toLowerCase().includes(q) ||
      b.packageName.toLowerCase().includes(q) || (b.phone && b.phone.includes(q));
    return ms && mp && mq;
  }), [bookings, statusFilter, packageFilter, searchQuery]);

  const filteredReviews = useMemo(() => reviews.filter(r => {
    const q = reviewSearch.toLowerCase();
    return !reviewSearch || r.author.toLowerCase().includes(q) || r.location.toLowerCase().includes(q) ||
      r.tour.toLowerCase().includes(q) || r.text.toLowerCase().includes(q);
  }), [reviews, reviewSearch]);

  const filteredR2Images = useMemo(() => {
    if (mediaFilterCategory === 'ALL') return r2Images;
    return r2Images.filter(img => 
      img.category 
        ? img.category.toLowerCase() === mediaFilterCategory.toLowerCase()
        : img.key.toLowerCase().includes(mediaFilterCategory.toLowerCase())
    );
  }, [r2Images, mediaFilterCategory]);

  const stats = useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter(b => b.status === 'PENDING').length;
    const confirmed = bookings.filter(b => b.status === 'CONFIRMED').length;
    const completed = bookings.filter(b => b.status === 'COMPLETED').length;
    const cancelled = bookings.filter(b => b.status === 'CANCELLED').length;
    const totalGuests = bookings.reduce((s, b) => s + (b.guests || 1), 0);
    const estimatedRevenue = bookings.reduce((s, b) => {
      if (b.status === 'CANCELLED') return s;
      const pkg = tours.find(p => p.title.toLowerCase() === b.packageName.toLowerCase());
      return s + (pkg ? pkg.price : 200) * (b.guests || 1);
    }, 0);
    const todayStr = new Date().toISOString().split('T')[0];
    const tmrw = new Date(); tmrw.setDate(tmrw.getDate() + 1);
    const tmrwStr = tmrw.toISOString().split('T')[0];
    const todayDepartures = bookings.filter(b => b.date.startsWith(todayStr) && b.status !== 'CANCELLED');
    const tomorrowDepartures = bookings.filter(b => b.date.startsWith(tmrwStr) && b.status !== 'CANCELLED');
    const packageCounts: Record<string, number> = {};
    bookings.forEach(b => { packageCounts[b.packageName] = (packageCounts[b.packageName] || 0) + 1; });
    return { total, pending, confirmed, completed, cancelled, totalGuests, estimatedRevenue, todayDepartures, tomorrowDepartures, packageCounts };
  }, [bookings, tours]);

  // ── Nav items ──
  const navItems = [
    { id: 'overview',  label: 'Overview',     icon: LayoutDashboard },
    { id: 'bookings',  label: 'Reservations', icon: CalendarDays,    badge: stats.pending > 0 ? stats.pending : undefined },
    { id: 'tours',     label: 'Tours',        icon: Compass,         badge: tours.length || undefined },
    { id: 'reviews',   label: 'Reviews',      icon: Star,            badge: reviews.length || undefined },
    { id: 'media',     label: 'Media',        icon: ImageIcon,       badge: r2Images.length || undefined },
    { id: 'settings',  label: 'Settings',     icon: Settings },
  ] as const;

  // ─────────────────────────────────────────────────────
  // LOGIN SCREEN
  // ─────────────────────────────────────────────────────
  // Show loading spinner while checking cookie auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-[#0a0b0d] bg-[#f6f5f2]">
        <RefreshCw className="w-6 h-6 text-amber-500 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-[#0a0b0d] bg-[#f6f5f2] transition-colors">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="fixed top-6 right-6 w-9 h-9 flex items-center justify-center border dark:border-white/10 border-stone-300 rounded-full dark:text-zinc-400 text-stone-500 hover:text-amber-600 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <div className="w-full max-w-sm px-4">
          <div className="text-center mb-12">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Families Tours" className="h-16 w-auto mx-auto mb-6 object-contain block dark:hidden" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-dark.jpg" alt="Families Tours" className="h-16 w-auto mx-auto mb-6 object-contain hidden dark:block" />
            <div className="text-[10px] tracking-[0.3em] uppercase dark:text-zinc-500 text-stone-400 font-mono">
              Admin Portal · Secure Access
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase font-mono dark:text-zinc-500 text-stone-400 mb-2.5">
                Email Address
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                placeholder="admin@familiestours.com"
                required
                autoFocus
                className="w-full font-mono text-sm bg-transparent border-b-2 dark:border-white/20 border-stone-300 focus:border-amber-500 dark:text-white text-stone-900 py-3 px-0 outline-none transition-colors placeholder:text-stone-300 dark:placeholder:text-zinc-700"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase font-mono dark:text-zinc-500 text-stone-400 mb-2.5">
                Password
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full font-mono text-sm bg-transparent border-b-2 dark:border-white/20 border-stone-300 focus:border-amber-500 dark:text-white text-stone-900 py-3 px-0 outline-none transition-colors placeholder:text-stone-300 dark:placeholder:text-zinc-700"
              />
            </div>

            {loginError && (
              <p className="text-[11px] text-red-500 font-mono text-center">{loginError}</p>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full mt-2 py-3 text-[11px] tracking-[0.2em] uppercase font-semibold font-mono bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white transition-colors flex items-center justify-center gap-2"
            >
              {isLoggingIn ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
              {isLoggingIn ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-[10px] font-mono dark:text-zinc-700 text-stone-300 mt-10 tracking-wider">
            Families Tours · Marrakech, Morocco
          </p>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────
  // MAIN DASHBOARD
  // ─────────────────────────────────────────────────────
  const tabTitle: Record<TabType, string> = {
    overview: 'Overview',
    bookings: 'Reservations',
    tours: 'Tour Packages Management',
    reviews: 'Reviews & Testimonials',
    media: 'Photo Library',
    settings: 'Settings',
  };

  return (
    <div className="flex min-h-screen dark:bg-[#0a0b0d] bg-[#f6f5f2] dark:text-zinc-100 text-stone-900 transition-colors">

      {/* ── Modals ── */}
      {selectedBooking && (
        <BookingModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onStatusChange={handleStatusChange}
          onDelete={handleDeleteBooking}
        />
      )}
      {tourModalState.isOpen && (
        <TourModal
          tour={tourModalState.tour}
          onClose={() => setTourModalState({ isOpen: false, tour: null })}
          onSave={handleSaveTour}
        />
      )}
      {reviewModalState.isOpen && (
        <ReviewModal
          review={reviewModalState.review}
          onClose={() => setReviewModalState({ isOpen: false, review: null })}
          onSave={handleSaveReview}
        />
      )}
      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onUploaded={fetchR2Images}
          showToast={showToast}
        />
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className="fixed top-5 right-5 z-[210] animate-in slide-in-from-top-2 fade-in duration-200">
          <div className={`flex items-center gap-2.5 px-4 py-2.5 border text-[12px] font-mono ${
            toast.type === 'success' ? 'dark:bg-emerald-950/80 bg-emerald-50 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
            : toast.type === 'error' ? 'dark:bg-red-950/80 bg-red-50 border-red-300 dark:border-red-800 text-red-700 dark:text-red-300'
            : 'dark:bg-zinc-900 bg-white border-stone-300 dark:border-white/10 dark:text-zinc-300 text-stone-600'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${toast.type === 'success' ? 'bg-emerald-500' : toast.type === 'error' ? 'bg-red-500' : 'bg-amber-500'}`} />
            {toast.text}
          </div>
        </div>
      )}

      {/* ── Mobile overlay ── */}
      {mobileNavOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setMobileNavOpen(false)} />
      )}

      {/* ── Sidebar / Nav Rail ── */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen z-50 flex flex-col
        dark:bg-[#0f1115] bg-white
        dark:border-r dark:border-white/[0.06] border-r border-stone-200
        transition-all duration-200 ease-out
        ${mobileNavOpen ? 'w-56 translate-x-0' : 'w-56 -translate-x-full lg:w-14 lg:translate-x-0 lg:hover:w-56'}
        group/sidebar overflow-hidden
      `}>
        {/* Brand */}
        <div className="flex items-center h-14 px-3.5 border-b dark:border-white/[0.06] border-stone-200 gap-3 overflow-hidden flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="FT" className="w-7 h-7 object-contain flex-shrink-0 block dark:hidden" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-dark.jpg" alt="FT" className="w-7 h-7 object-contain flex-shrink-0 hidden dark:block" />
          <span className="text-[11px] tracking-[0.18em] uppercase font-semibold dark:text-zinc-300 text-stone-700 whitespace-nowrap opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-150">
            Families Tours
          </span>
          <button onClick={() => setMobileNavOpen(false)} className="ml-auto lg:hidden text-stone-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          {navItems.map(({ id, label, icon: Icon, badge }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => { setActiveTab(id as TabType); setMobileNavOpen(false); }}
                className={`relative w-full flex items-center gap-3 h-9 px-2.5 text-left transition-colors ${
                  active
                    ? 'bg-amber-600 text-white'
                    : 'dark:text-zinc-400 text-stone-500 hover:dark:text-zinc-100 hover:text-stone-900 hover:dark:bg-white/5 hover:bg-stone-100'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-[12px] font-medium whitespace-nowrap opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-150 overflow-hidden">
                  {label}
                </span>
                {badge !== undefined && badge > 0 && (
                  <span className={`ml-auto mr-1 text-[10px] font-mono font-bold px-1.5 py-0.5 opacity-0 group-hover/sidebar:opacity-100 transition-opacity ${
                    active ? 'bg-white/20 text-white' : id === 'bookings' ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400' : 'dark:bg-zinc-700 bg-stone-200 dark:text-zinc-300 text-stone-600'
                  }`}>
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom controls */}
        <div className="px-2 py-3 border-t dark:border-white/[0.06] border-stone-200 space-y-0.5 flex-shrink-0">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-full flex items-center gap-3 h-9 px-2.5 dark:text-zinc-500 text-stone-400 hover:dark:text-zinc-100 hover:text-stone-900 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 flex-shrink-0" /> : <Moon className="w-4 h-4 flex-shrink-0" />}
            <span className="text-[12px] font-medium whitespace-nowrap opacity-0 group-hover/sidebar:opacity-100 transition-opacity">
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 h-9 px-2.5 text-red-500/70 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span className="text-[12px] font-medium whitespace-nowrap opacity-0 group-hover/sidebar:opacity-100 transition-opacity">
              Sign Out
            </span>
          </button>
        </div>
      </aside>

      {/* ── Main Workspace ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Topbar */}
        <header className="sticky top-0 z-30 h-14 flex items-center justify-between px-5 dark:bg-[#0a0b0d]/95 bg-[#f6f5f2]/95 backdrop-blur-md border-b dark:border-white/[0.06] border-stone-200 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileNavOpen(true)} className="lg:hidden text-stone-400 dark:text-zinc-500">
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase dark:text-zinc-600 text-stone-300">Families Tours</span>
              <span className="text-stone-300 dark:text-zinc-700">/</span>
              <span className="text-[12px] font-medium dark:text-zinc-200 text-stone-700">{tabTitle[activeTab]}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { fetchAllData(); showToast('Refreshing all data…', 'info'); }}
              className="flex items-center gap-1.5 h-8 px-3 border dark:border-white/10 border-stone-300 text-[11px] font-mono dark:text-zinc-400 text-stone-500 hover:dark:text-zinc-100 hover:text-stone-900 hover:border-amber-500 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingBookings || isLoadingTours || isLoadingReviews ? 'animate-spin text-amber-500' : ''}`} />
              <span className="hidden sm:inline">Sync</span>
            </button>

            {activeTab === 'tours' && (
              <button
                onClick={() => setTourModalState({ isOpen: true, tour: null })}
                className="flex items-center gap-1.5 h-8 px-3 bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-mono transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Tour</span>
              </button>
            )}

            {activeTab === 'reviews' && (
              <button
                onClick={() => setReviewModalState({ isOpen: true, review: null })}
                className="flex items-center gap-1.5 h-8 px-3 bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-mono transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Review</span>
              </button>
            )}

            {activeTab === 'media' && (
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-1.5 h-8 px-3 bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-mono transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload</span>
              </button>
            )}
          </div>
        </header>

        {/* ════════════════════════════════════════════════
            TAB 1: OVERVIEW
        ════════════════════════════════════════════════ */}
        {activeTab === 'overview' && (
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 border-b dark:border-white/[0.06] border-stone-200">
              <StatCell label="Est. Revenue" value={`${fmtRevenue(stats.estimatedRevenue)} MAD`} sub="Active & completed tours" accent />
              <StatCell label="Pending Action" value={stats.pending} sub="Awaiting confirmation" />
              <StatCell label="Confirmed" value={stats.confirmed} sub="Ready to depart" />
              <StatCell label="Total Guests" value={stats.totalGuests} sub={`${stats.total} reservations total`} />
            </div>

            <div className="grid lg:grid-cols-3">
              <div className="lg:col-span-2 border-r dark:border-white/[0.06] border-stone-200">
                <div className="flex items-center justify-between px-6 py-4 border-b dark:border-white/[0.06] border-stone-200">
                  <div>
                    <h2 className="text-[11px] tracking-[0.2em] uppercase font-semibold dark:text-zinc-400 text-stone-400">Upcoming Departures</h2>
                    <p className="text-[11px] font-mono dark:text-zinc-600 text-stone-400 mt-0.5">Today & Tomorrow Schedule</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className="flex items-center gap-1 text-[11px] font-mono text-amber-600 hover:text-amber-500 transition-colors"
                  >
                    All {bookings.length} <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>

                {stats.todayDepartures.length === 0 && stats.tomorrowDepartures.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <Inbox className="w-8 h-8 dark:text-zinc-700 text-stone-300" />
                    <p className="text-[12px] font-mono dark:text-zinc-600 text-stone-400">No departures today or tomorrow</p>
                  </div>
                ) : (
                  <div>
                    {stats.todayDepartures.length > 0 && (
                      <>
                        <div className="px-6 py-2 border-b dark:border-white/[0.06] border-stone-200 dark:bg-white/[0.015] bg-stone-100/60">
                          <span className="text-[10px] font-mono tracking-widest uppercase dark:text-emerald-400 text-emerald-700">
                            Today — {stats.todayDepartures.length} departure{stats.todayDepartures.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        {stats.todayDepartures.map(b => (
                          <div
                            key={b.id}
                            onClick={() => setSelectedBooking(b)}
                            className="flex items-center justify-between px-6 py-4 border-b dark:border-white/[0.06] border-stone-200 hover:dark:bg-white/[0.02] hover:bg-stone-100/50 transition-colors cursor-pointer"
                          >
                            <div className="min-w-0">
                              <p className="text-[13px] font-medium dark:text-white text-stone-900 truncate">{b.customerName}</p>
                              <p className="text-[11px] font-mono dark:text-zinc-500 text-stone-400 mt-0.5">{b.packageName} · {b.guests} guests</p>
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                              <StatusBadge status={b.status} />
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                    {stats.tomorrowDepartures.length > 0 && (
                      <>
                        <div className="px-6 py-2 border-b dark:border-white/[0.06] border-stone-200 dark:bg-white/[0.015] bg-stone-100/60">
                          <span className="text-[10px] font-mono tracking-widest uppercase dark:text-zinc-500 text-stone-400">
                            Tomorrow — {stats.tomorrowDepartures.length} departure{stats.tomorrowDepartures.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        {stats.tomorrowDepartures.map(b => (
                          <div
                            key={b.id}
                            onClick={() => setSelectedBooking(b)}
                            className="flex items-center justify-between px-6 py-4 border-b dark:border-white/[0.06] border-stone-200 hover:dark:bg-white/[0.02] hover:bg-stone-100/50 transition-colors cursor-pointer"
                          >
                            <div className="min-w-0">
                              <p className="text-[13px] font-medium dark:text-white text-stone-900 truncate">{b.customerName}</p>
                              <p className="text-[11px] font-mono dark:text-zinc-500 text-stone-400 mt-0.5">{b.packageName} · {b.guests} guests</p>
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                              <StatusBadge status={b.status} />
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Status and summary breakdown */}
              <div>
                <div className="px-5 py-4 border-b dark:border-white/[0.06] border-stone-200">
                  <h2 className="text-[11px] tracking-[0.2em] uppercase font-semibold dark:text-zinc-400 text-stone-400">Experience Popularity</h2>
                </div>
                {Object.keys(stats.packageCounts).length === 0 ? (
                  <div className="flex items-center justify-center py-20">
                    <p className="text-[12px] font-mono dark:text-zinc-600 text-stone-400">No bookings yet</p>
                  </div>
                ) : (
                  <div className="p-5 space-y-4">
                    {Object.entries(stats.packageCounts)
                      .sort(([, a], [, b]) => b - a)
                      .map(([name, count]) => {
                        const pct = Math.round((count / stats.total) * 100);
                        const shortName = name.length > 22 ? name.slice(0, 22) + '…' : name;
                        return (
                          <div key={name}>
                            <div className="flex justify-between items-baseline mb-1.5">
                              <span className="text-[12px] dark:text-zinc-300 text-stone-700" title={name}>{shortName}</span>
                              <span className="text-[11px] font-mono dark:text-zinc-500 text-stone-400">{count} · {pct}%</span>
                            </div>
                            <div className="h-1 dark:bg-white/[0.06] bg-stone-200">
                              <div className="h-full bg-amber-600 transition-all duration-500" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}

                <div className="border-t dark:border-white/[0.06] border-stone-200 px-5 py-4 space-y-2.5">
                  <h3 className="text-[10px] tracking-[0.2em] uppercase font-semibold dark:text-zinc-500 text-stone-400 mb-3">Live System Status</h3>
                  <div className="space-y-2 text-[11px] font-mono">
                    <div className="flex items-center justify-between">
                      <span className="dark:text-zinc-400 text-stone-500 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Tours in Catalog
                      </span>
                      <span className="dark:text-zinc-300 text-stone-700 font-bold">{tours.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="dark:text-zinc-400 text-stone-500 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Published Reviews
                      </span>
                      <span className="dark:text-zinc-300 text-stone-700 font-bold">{reviews.filter(r => r.published).length} / {reviews.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════
            TAB 2: RESERVATIONS
        ════════════════════════════════════════════════ */}
        {activeTab === 'bookings' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex flex-wrap items-center gap-3 px-5 py-3 border-b dark:border-white/[0.06] border-stone-200 flex-shrink-0">
              <div className="relative flex-1 min-w-48">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 dark:text-zinc-600 text-stone-400" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search name, email, package…"
                  className="w-full pl-8 pr-3 h-8 text-[12px] font-mono bg-transparent border dark:border-white/10 border-stone-300 dark:text-zinc-200 text-stone-800 placeholder:dark:text-zinc-600 placeholder:text-stone-400 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="h-8 px-3 text-[11px] font-mono bg-transparent border dark:border-white/10 border-stone-300 dark:text-zinc-300 text-stone-600 focus:outline-none focus:border-amber-500 transition-colors"
              >
                {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(s => (
                  <option key={s} value={s} className="dark:bg-zinc-900 bg-white">
                    {s === 'ALL' ? 'All Status' : s.charAt(0) + s.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
              <select
                value={packageFilter}
                onChange={e => setPackageFilter(e.target.value)}
                className="h-8 px-3 text-[11px] font-mono bg-transparent border dark:border-white/10 border-stone-300 dark:text-zinc-300 text-stone-600 focus:outline-none focus:border-amber-500 transition-colors max-w-44"
              >
                <option value="ALL" className="dark:bg-zinc-900 bg-white">All Packages</option>
                {tours.map(p => (
                  <option key={p.id} value={p.title} className="dark:bg-zinc-900 bg-white">{p.title}</option>
                ))}
              </select>
              <button
                onClick={exportToCSV}
                className="flex items-center gap-1.5 h-8 px-3 border dark:border-white/10 border-stone-300 text-[11px] font-mono dark:text-zinc-400 text-stone-500 hover:border-amber-500 hover:text-amber-600 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
              <span className="text-[11px] font-mono dark:text-zinc-600 text-stone-400 ml-auto">
                {filteredBookings.length} of {bookings.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto">
              {isLoadingBookings ? (
                <div className="flex items-center justify-center h-full">
                  <RefreshCw className="w-5 h-5 animate-spin text-amber-500" />
                </div>
              ) : filteredBookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3">
                  <Inbox className="w-8 h-8 dark:text-zinc-700 text-stone-300" />
                  <p className="text-[12px] font-mono dark:text-zinc-600 text-stone-400">No reservations found</p>
                </div>
              ) : (
                <table className="w-full border-collapse text-[12px]">
                  <thead className="sticky top-0 z-10">
                    <tr className="border-b dark:border-white/[0.06] border-stone-200 dark:bg-[#0a0b0d] bg-[#f6f5f2]">
                      <th className="text-left px-5 py-3 text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 font-normal">Customer</th>
                      <th className="text-left px-3 py-3 text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 font-normal hidden md:table-cell">Package</th>
                      <th className="text-left px-3 py-3 text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 font-normal hidden lg:table-cell">Tour Date</th>
                      <th className="text-center px-3 py-3 text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 font-normal hidden sm:table-cell">Guests</th>
                      <th className="text-left px-3 py-3 text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 font-normal">Status</th>
                      <th className="text-right px-5 py-3 text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 font-normal">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map(b => (
                      <tr
                        key={b.id}
                        onClick={() => setSelectedBooking(b)}
                        className="border-b dark:border-white/[0.04] border-stone-100 cursor-pointer hover:dark:bg-white/[0.025] hover:bg-stone-50/80 transition-colors"
                      >
                        <td className="px-5 py-3.5">
                          <p className="font-medium dark:text-white text-stone-900 truncate max-w-36">{b.customerName}</p>
                          <p className="font-mono dark:text-zinc-600 text-stone-400 text-[11px] truncate">{b.email}</p>
                        </td>
                        <td className="px-3 py-3.5 hidden md:table-cell">
                          <span className="dark:text-zinc-300 text-stone-600 truncate max-w-28 block">{b.packageName}</span>
                        </td>
                        <td className="px-3 py-3.5 font-mono dark:text-zinc-400 text-stone-500 hidden lg:table-cell whitespace-nowrap">
                          {fmtDate(b.date)}
                        </td>
                        <td className="px-3 py-3.5 font-mono text-center hidden sm:table-cell dark:text-zinc-400 text-stone-500">
                          {b.guests}
                        </td>
                        <td className="px-3 py-3.5">
                          <StatusBadge status={b.status} />
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <span className="text-[11px] font-mono text-amber-600 dark:text-amber-500">Open →</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════
            TAB 3: TOURS MANAGEMENT
        ════════════════════════════════════════════════ */}
        {activeTab === 'tours' && (
          <div className="flex-1 overflow-y-auto">
            {isLoadingTours ? (
              <div className="flex items-center justify-center py-20">
                <RefreshCw className="w-5 h-5 animate-spin text-amber-500" />
              </div>
            ) : tours.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <Compass className="w-8 h-8 dark:text-zinc-700 text-stone-300" />
                <p className="text-[12px] font-mono dark:text-zinc-600 text-stone-400">No tour packages found</p>
                <button
                  onClick={() => setTourModalState({ isOpen: true, tour: null })}
                  className="flex items-center gap-1.5 h-8 px-4 bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-mono transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add First Package
                </button>
              </div>
            ) : (
              <table className="w-full border-collapse text-[12px]">
                <thead>
                  <tr className="border-b dark:border-white/[0.06] border-stone-200 dark:bg-white/[0.015] bg-stone-100/50">
                    <th className="text-left px-5 py-3 text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 font-normal">#</th>
                    <th className="text-left px-3 py-3 text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 font-normal">Experience</th>
                    <th className="text-right px-3 py-3 text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 font-normal">Price</th>
                    <th className="text-left px-3 py-3 text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 font-normal hidden md:table-cell">Duration</th>
                    <th className="text-left px-3 py-3 text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 font-normal hidden lg:table-cell">Badges</th>
                    <th className="text-right px-5 py-3 text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 font-normal">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tours.map((pkg, idx) => (
                    <tr key={pkg.id || idx} className="border-b dark:border-white/[0.04] border-stone-100 hover:dark:bg-white/[0.015] hover:bg-stone-50 transition-colors">
                      <td className="px-5 py-4 font-mono dark:text-zinc-700 text-stone-300 text-[11px]">
                        0{idx + 1}
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-3">
                          {pkg.mainImage && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={pkg.mainImage} alt={pkg.title} className="w-10 h-10 object-cover rounded border dark:border-white/10 border-stone-200 flex-shrink-0" />
                          )}
                          <div>
                            <p className="font-medium dark:text-white text-stone-900">{pkg.title}</p>
                            <p className="text-[11px] dark:text-zinc-500 text-stone-400 mt-0.5 line-clamp-1">{pkg.subtitle || pkg.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-right font-mono font-semibold text-amber-600 dark:text-amber-400 whitespace-nowrap">
                        {pkg.price} MAD
                      </td>
                      <td className="px-3 py-4 font-mono dark:text-zinc-400 text-stone-500 text-[11px] hidden md:table-cell">
                        {pkg.duration}
                      </td>
                      <td className="px-3 py-4 hidden lg:table-cell">
                        <div className="flex gap-1.5">
                          {pkg.highlight && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                              Highlight
                            </span>
                          )}
                          {pkg.signature && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                              Signature
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setTourModalState({ isOpen: true, tour: pkg })}
                            className="p-1.5 text-stone-500 dark:text-zinc-400 hover:text-amber-600 transition-colors"
                            title="Edit Tour Package"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTour(pkg.id, pkg.title)}
                            className="p-1.5 text-red-500/60 hover:text-red-500 transition-colors"
                            title="Delete Tour Package"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════════
            TAB 4: REVIEWS MANAGEMENT
        ════════════════════════════════════════════════ */}
        {activeTab === 'reviews' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex flex-wrap items-center gap-3 px-5 py-3 border-b dark:border-white/[0.06] border-stone-200 flex-shrink-0">
              <div className="relative flex-1 min-w-48">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 dark:text-zinc-600 text-stone-400" />
                <input
                  value={reviewSearch}
                  onChange={e => setReviewSearch(e.target.value)}
                  placeholder="Search reviewer name, location, tour, text…"
                  className="w-full pl-8 pr-3 h-8 text-[12px] font-mono bg-transparent border dark:border-white/10 border-stone-300 dark:text-zinc-200 text-stone-800 placeholder:dark:text-zinc-600 placeholder:text-stone-400 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <span className="text-[11px] font-mono dark:text-zinc-600 text-stone-400 ml-auto">
                {filteredReviews.length} reviews ({reviews.filter(r => r.published).length} published on site)
              </span>
            </div>

            <div className="flex-1 overflow-y-auto">
              {isLoadingReviews ? (
                <div className="flex items-center justify-center h-full">
                  <RefreshCw className="w-5 h-5 animate-spin text-amber-500" />
                </div>
              ) : filteredReviews.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3">
                  <Star className="w-8 h-8 dark:text-zinc-700 text-stone-300" />
                  <p className="text-[12px] font-mono dark:text-zinc-600 text-stone-400">No reviews found</p>
                  <button
                    onClick={() => setReviewModalState({ isOpen: true, review: null })}
                    className="flex items-center gap-1.5 h-8 px-4 bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-mono transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add First Review
                  </button>
                </div>
              ) : (
                <table className="w-full border-collapse text-[12px]">
                  <thead className="sticky top-0 z-10">
                    <tr className="border-b dark:border-white/[0.06] border-stone-200 dark:bg-[#0a0b0d] bg-[#f6f5f2]">
                      <th className="text-left px-5 py-3 text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 font-normal">Guest</th>
                      <th className="text-left px-3 py-3 text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 font-normal">Rating & Tour</th>
                      <th className="text-left px-3 py-3 text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 font-normal">Review Text</th>
                      <th className="text-center px-3 py-3 text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 font-normal">Visibility</th>
                      <th className="text-right px-5 py-3 text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 font-normal">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReviews.map(r => (
                      <tr key={r.id} className="border-b dark:border-white/[0.04] border-stone-100 hover:dark:bg-white/[0.015] hover:bg-stone-50 transition-colors">
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-bold text-[10px] text-amber-500">
                              {r.avatar || r.author.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium dark:text-white text-stone-900">{r.author}</p>
                              <p className="text-[11px] font-mono dark:text-zinc-500 text-stone-400">{r.location}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          <div className="flex text-amber-400 text-xs mb-1">
                            {[...Array(r.rating || 5)].map((_, i) => (
                              <span key={i}>★</span>
                            ))}
                          </div>
                          <p className="text-[11px] font-mono dark:text-zinc-400 text-stone-500 truncate max-w-32">{r.tour}</p>
                        </td>
                        <td className="px-3 py-4">
                          <p className="dark:text-zinc-300 text-stone-700 italic line-clamp-2 max-w-lg">&ldquo;{r.text}&rdquo;</p>
                        </td>
                        <td className="px-3 py-4 text-center whitespace-nowrap">
                          <button
                            onClick={() => handleTogglePublishReview(r.id, r.published)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-mono font-medium transition-colors ${
                              r.published
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                                : 'bg-stone-100 dark:bg-zinc-800 text-stone-500 dark:text-zinc-500 border border-stone-300 dark:border-white/10'
                            }`}
                            title={r.published ? 'Click to hide from website' : 'Click to publish on website'}
                          >
                            {r.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            {r.published ? 'Published' : 'Hidden'}
                          </button>
                        </td>
                        <td className="px-5 py-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setReviewModalState({ isOpen: true, review: r })}
                              className="p-1.5 text-stone-500 dark:text-zinc-400 hover:text-amber-600 transition-colors"
                              title="Edit Review"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteReview(r.id, r.author)}
                              className="p-1.5 text-red-500/60 hover:text-red-500 transition-colors"
                              title="Delete Review"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════
            TAB 5: MEDIA / PHOTO STUDIO
        ════════════════════════════════════════════════ */}
        {activeTab === 'media' && (
          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-wrap items-center gap-2 px-5 py-3 border-b dark:border-white/[0.06] border-stone-200">
              {['ALL', 'Camels', 'Quad', 'Camp', 'Dinner', 'Sunrise', 'Safari', 'Gallery'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setMediaFilterCategory(cat)}
                  className={`text-[11px] font-mono h-7 px-3 transition-colors ${
                    mediaFilterCategory === cat
                      ? 'bg-amber-600 text-white'
                      : 'dark:text-zinc-500 text-stone-400 hover:dark:text-zinc-100 hover:text-stone-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
              <span className="ml-auto text-[11px] font-mono dark:text-zinc-600 text-stone-400">
                {filteredR2Images.length} files
              </span>
            </div>

            {isLoadingImages ? (
              <div className="flex items-center justify-center py-20">
                <RefreshCw className="w-5 h-5 animate-spin text-amber-500" />
              </div>
            ) : filteredR2Images.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <ImageIcon className="w-8 h-8 dark:text-zinc-700 text-stone-300" />
                <p className="text-[12px] font-mono dark:text-zinc-600 text-stone-400">No photos in this category</p>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="flex items-center gap-2 h-8 px-4 bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-mono transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload First Photo
                </button>
              </div>
            ) : (
              <div className="p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="aspect-square border-2 border-dashed dark:border-white/10 border-stone-300 flex flex-col items-center justify-center gap-2 hover:border-amber-500 hover:dark:text-zinc-100 hover:text-stone-900 dark:text-zinc-600 text-stone-400 transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  <span className="text-[10px] font-mono">Upload</span>
                </button>

                {filteredR2Images.map(img => (
                  <div key={img.key} className="group relative aspect-square border dark:border-white/[0.06] border-stone-200 overflow-hidden dark:bg-zinc-900 bg-stone-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt={img.key} className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                      <p className="text-[9px] font-mono text-white/70 text-center truncate w-full">{img.key.split('/').pop()}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => copyToClipboard(img.url, img.key)}
                          className="flex items-center gap-1.5 h-7 px-3 text-[10px] font-mono bg-amber-600 text-white"
                        >
                          {copiedKey === img.key ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          {copiedKey === img.key ? 'Copied' : 'Copy'}
                        </button>
                        <button
                          onClick={() => handleDeleteImage(img.key)}
                          className="flex items-center justify-center w-7 h-7 bg-red-600/80 hover:bg-red-600 text-white transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════════
            TAB 6: SETTINGS
        ════════════════════════════════════════════════ */}
        {activeTab === 'settings' && (
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-lg mx-auto px-5 py-10 space-y-8">
              <div>
                <h2 className="text-[11px] tracking-[0.2em] uppercase font-semibold dark:text-zinc-400 text-stone-400 mb-1">Settings & Information</h2>
                <p className="text-sm dark:text-white text-stone-900">Configuration & live platform management</p>
              </div>

              <div className="border dark:border-white/[0.06] border-stone-200">
                <div className="px-5 py-4 border-b dark:border-white/[0.06] border-stone-200">
                  <p className="text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400">Agency Contact</p>
                </div>
                {[
                  { label: 'Phone / WhatsApp', value: '+212 631-024326' },
                  { label: 'Email', value: 'info@familiestours.com' },
                  { label: 'Location', value: 'Agafay Desert, Marrakech, Morocco' },
                ].map(({ label, value }) => (
                  <div key={label} className="px-5 py-4 border-b dark:border-white/[0.06] border-stone-200 last:border-0 flex justify-between items-center">
                    <span className="text-[11px] font-mono dark:text-zinc-600 text-stone-400">{label}</span>
                    <span className="text-[12px] font-mono dark:text-zinc-300 text-stone-700">{value}</span>
                  </div>
                ))}
              </div>

              <div className="border dark:border-white/[0.06] border-stone-200">
                <div className="px-5 py-4 border-b dark:border-white/[0.06] border-stone-200">
                  <p className="text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400">Appearance</p>
                </div>
                <div className="px-5 py-4 flex items-center justify-between">
                  <span className="text-[12px] font-mono dark:text-zinc-300 text-stone-700">Theme Mode</span>
                  <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="flex items-center gap-2 h-8 px-4 border dark:border-white/10 border-stone-300 text-[11px] font-mono dark:text-zinc-400 text-stone-500 hover:border-amber-500 hover:text-amber-600 transition-colors"
                  >
                    {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                    Switch to {theme === 'dark' ? 'Light' : 'Dark'}
                  </button>
                </div>
              </div>

              <div className="border dark:border-white/[0.06] border-stone-200">
                <div className="px-5 py-4 border-b dark:border-white/[0.06] border-stone-200">
                  <p className="text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400">Admin Session</p>
                </div>
                <div className="px-5 py-4 flex items-center justify-between">
                  <span className="text-[12px] font-mono dark:text-zinc-300 text-stone-700">Currently signed in</span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 h-8 px-4 border border-red-500/30 text-[11px] font-mono text-red-500/70 hover:border-red-500 hover:text-red-500 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              </div>

              {/* Change Password */}
              <div className="border dark:border-white/[0.06] border-stone-200">
                <div className="px-5 py-4 border-b dark:border-white/[0.06] border-stone-200">
                  <p className="text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400">Change Password</p>
                </div>
                <form onSubmit={handleChangePassword} className="px-5 py-4 space-y-4">
                  <div>
                    <label className="block text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 mb-1.5">Current Password</label>
                    <input
                      type="password"
                      required
                      value={pwForm.current}
                      onChange={e => setPwForm(f => ({ ...f, current: e.target.value }))}
                      placeholder="••••••••"
                      className="w-full h-9 px-3 text-[13px] bg-transparent border dark:border-white/10 border-stone-300 dark:text-zinc-200 text-stone-800 focus:outline-none focus:border-amber-500 transition-colors font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono tracking-widests uppercase dark:text-zinc-600 text-stone-400 mb-1.5">New Password</label>
                    <input
                      type="password"
                      required
                      value={pwForm.newPw}
                      onChange={e => setPwForm(f => ({ ...f, newPw: e.target.value }))}
                      placeholder="Min. 6 characters"
                      className="w-full h-9 px-3 text-[13px] bg-transparent border dark:border-white/10 border-stone-300 dark:text-zinc-200 text-stone-800 focus:outline-none focus:border-amber-500 transition-colors font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono tracking-widests uppercase dark:text-zinc-600 text-stone-400 mb-1.5">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={pwForm.confirm}
                      onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))}
                      placeholder="Repeat new password"
                      className="w-full h-9 px-3 text-[13px] bg-transparent border dark:border-white/10 border-stone-300 dark:text-zinc-200 text-stone-800 focus:outline-none focus:border-amber-500 transition-colors font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isChangingPw}
                    className="flex items-center justify-center gap-2 h-9 px-6 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-[11px] font-mono tracking-wide transition-colors"
                  >
                    {isChangingPw ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                    {isChangingPw ? 'Saving…' : 'Update Password'}
                  </button>
                </form>
              </div>

              <p className="text-[10px] font-mono dark:text-zinc-700 text-stone-300 text-center">
                Families Tours Management Platform · Marrakech · v2.3
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
