'use client';

/*
  ─────────────────────────────────────────────────────────
  DESIGN SYSTEM: Swiss Editorial × Dieter Rams Industrial
  ─────────────────────────────────────────────────────────
  Typography : DM Sans (UI labels, 13/14/16px) + DM Mono (data, numbers, IDs)
  Color       : Dark #0a0b0d | Surface #111318 | Cream #f6f5f2 | Stone #f0ede8
               Amber #d97706 (functional accent — pending/CTAs only)
               Emerald #059669 (confirmed/success)  Red #dc2626 (cancelled/error)
  Grid        : 56px icon-rail + flexible main. 8px base unit.
  Containers  : No rounded-card soup. Cells defined by hairline borders (#222)
               and background tone shifts. No drop-shadows as decoration.
  Motion      : 150ms ease-out — utility transitions only. No decorative animation.
  Rules       : No gradient backgrounds. No emoji. No left-accent-border cards.
               No icon-per-bullet. Numbers in DM Mono always.
  ─────────────────────────────────────────────────────────
*/

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  Plus,
  Compass,
  Image as ImageIcon,
  Settings,
  LogOut,
  RefreshCw,
  Search,
  Filter,
  Download,
  Eye,
  Phone,
  Mail,
  MessageSquare,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Upload,
  Copy,
  ChevronRight,
  Sun,
  Moon,
  Menu,
  X,
  Users,
  TrendingUp,
  DollarSign,
  Check,
  MapPin,
  Send,
  ChevronDown,
  ArrowUpRight,
  Inbox,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { tourPackages } from '@/lib/images';

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

interface R2Object {
  key: string;
  size: number;
  lastModified?: string;
  url: string;
}

type TabType = 'overview' | 'bookings' | 'new-booking' | 'tours' | 'media' | 'settings';

// ─── Status helpers ───────────────────────────────────────
const STATUS_META: Record<string, { label: string; dot: string; text: string; bg: string }> = {
  PENDING:   { label: 'Pending',   dot: 'bg-amber-500',  text: 'text-amber-600 dark:text-amber-400',  bg: 'bg-amber-50  dark:bg-amber-950/40' },
  CONFIRMED: { label: 'Confirmed', dot: 'bg-emerald-500',text: 'text-emerald-700 dark:text-emerald-400',bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
  COMPLETED: { label: 'Completed', dot: 'bg-sky-500',    text: 'text-sky-700 dark:text-sky-400',     bg: 'bg-sky-50 dark:bg-sky-950/40' },
  CANCELLED: { label: 'Cancelled', dot: 'bg-red-500',    text: 'text-red-600 dark:text-red-400',     bg: 'bg-red-50 dark:bg-red-950/40' },
};

function StatusBadge({ status }: { status: string }) {
  const m = STATUS_META[status] || STATUS_META.PENDING;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide font-mono ${m.text} ${m.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  );
}

// ─── Format helpers ───────────────────────────────────────
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
function fmtRevenue(n: number) {
  return n.toLocaleString('en-US');
}

// ─── Stat Cell — used in Overview ─────────────────────────
function StatCell({
  label, value, sub, accent = false, mono = true,
}: {
  label: string; value: string | number; sub?: string; accent?: boolean; mono?: boolean;
}) {
  return (
    <div className="p-6 border-r border-b dark:border-white/[0.06] border-stone-200 last:border-r-0 flex flex-col gap-1 min-w-0">
      <span className="text-[10px] uppercase tracking-[0.18em] font-semibold dark:text-zinc-500 text-stone-400">{label}</span>
      <span className={`text-3xl leading-none mt-1 ${mono ? 'font-mono' : 'font-light'} ${accent ? 'text-amber-600 dark:text-amber-400' : 'dark:text-white text-stone-900'}`}>
        {value}
      </span>
      {sub && <span className="text-[11px] dark:text-zinc-600 text-stone-400 mt-0.5">{sub}</span>}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────
export default function AdminDashboard() {
  const { theme, setTheme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);
  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3200);
  };

  // Bookings
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [packageFilter, setPackageFilter] = useState('ALL');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Media
  const [r2Images, setR2Images] = useState<R2Object[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [uploadCategory, setUploadCategory] = useState('Camels');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [mediaFilterCategory, setMediaFilterCategory] = useState('ALL');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // New booking form
  const [newBookingForm, setNewBookingForm] = useState({
    packageName: tourPackages[0]?.title || 'Camel Trek & Dinner',
    customerName: '',
    email: '',
    phone: '',
    date: new Date().toISOString().split('T')[0],
    guests: 2,
    message: '',
    status: 'CONFIRMED' as const,
  });
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);

  // ── Auth ──
  useEffect(() => {
    if (localStorage.getItem('families_admin_auth') === 'true') setIsAuthenticated(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const validPins = ['families2026', 'admin', '2026', '1234'];
    if (validPins.includes(pinInput.trim())) {
      setIsAuthenticated(true);
      localStorage.setItem('families_admin_auth', 'true');
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('families_admin_auth');
    setIsAuthenticated(false);
    setPinInput('');
  };

  // ── Data fetching ──
  const fetchBookings = useCallback(async () => {
    setIsLoadingBookings(true);
    try {
      const res = await fetch('/api/bookings?limit=200');
      const data = await res.json();
      if (data.success) setBookings(data.bookings || []);
    } catch { showToast('Could not load reservations', 'error'); }
    finally { setIsLoadingBookings(false); }
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

  useEffect(() => {
    if (isAuthenticated) { fetchBookings(); fetchR2Images(); }
  }, [isAuthenticated, fetchBookings, fetchR2Images]);

  // ── Mutations ──
  const handleStatusChange = async (id: string, newStatus: string) => {
    const res = await fetch(`/api/admin/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus as any } : b));
      if (selectedBooking?.id === id) setSelectedBooking(prev => prev ? { ...prev, status: newStatus as any } : null);
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
      if (selectedBooking?.id === id) setSelectedBooking(null);
      showToast('Reservation deleted', 'info');
    }
  };

  const handleCreateManualBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingBooking(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBookingForm),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Reservation created', 'success');
        setNewBookingForm({
          packageName: tourPackages[0]?.title || 'Camel Trek & Dinner',
          customerName: '', email: '', phone: '',
          date: new Date().toISOString().split('T')[0],
          guests: 2, message: '', status: 'CONFIRMED',
        });
        fetchBookings();
        setActiveTab('bookings');
      } else {
        showToast(data.error || 'Failed to create', 'error');
      }
    } catch { showToast('Error creating reservation', 'error'); }
    finally { setIsCreatingBooking(false); }
  };

  const handleUploadImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;
    setIsUploading(true);
    const fd = new FormData();
    fd.append('file', uploadFile);
    fd.append('category', uploadCategory);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) { showToast('Photo uploaded', 'success'); setUploadFile(null); fetchR2Images(); }
      else showToast(data.error || 'Upload failed', 'error');
    } catch { showToast('Upload error', 'error'); }
    finally { setIsUploading(false); }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast('Link copied', 'info');
    setTimeout(() => setCopiedKey(null), 2000);
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

  // ── Derived data ──
  const filteredBookings = useMemo(() => bookings.filter(b => {
    const ms = statusFilter === 'ALL' || b.status === statusFilter;
    const mp = packageFilter === 'ALL' || b.packageName.toLowerCase().includes(packageFilter.toLowerCase());
    const q = searchQuery.toLowerCase();
    const mq = !searchQuery || b.customerName.toLowerCase().includes(q) || b.email.toLowerCase().includes(q) ||
      b.packageName.toLowerCase().includes(q) || (b.phone && b.phone.includes(q));
    return ms && mp && mq;
  }), [bookings, statusFilter, packageFilter, searchQuery]);

  const filteredR2Images = useMemo(() => {
    if (mediaFilterCategory === 'ALL') return r2Images;
    return r2Images.filter(img => img.key.toLowerCase().includes(mediaFilterCategory.toLowerCase()));
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
      const pkg = tourPackages.find(p => p.title.toLowerCase() === b.packageName.toLowerCase());
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
  }, [bookings]);

  // ── Nav items ──
  const navItems = [
    { id: 'overview',     label: 'Overview',      icon: LayoutDashboard },
    { id: 'bookings',     label: 'Reservations',  icon: CalendarDays,  badge: stats.pending > 0 ? stats.pending : undefined },
    { id: 'new-booking',  label: 'New Booking',   icon: Plus },
    { id: 'tours',        label: 'Tours',          icon: Compass },
    { id: 'media',        label: 'Media',          icon: ImageIcon,     badge: r2Images.length || undefined },
    { id: 'settings',     label: 'Settings',       icon: Settings },
  ] as const;

  // ─────────────────────────────────────────────────────
  // LOGIN SCREEN
  // ─────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-[#0a0b0d] bg-[#f6f5f2] p-6 transition-colors">
        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="fixed top-6 right-6 w-9 h-9 flex items-center justify-center border dark:border-white/10 border-stone-300 rounded-full dark:text-zinc-400 text-stone-500 hover:text-amber-600 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <div className="w-full max-w-sm">
          {/* Wordmark */}
          <div className="text-center mb-12">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Families Tours" className="h-16 w-auto mx-auto mb-6 object-contain" />
            <div className="text-[10px] tracking-[0.3em] uppercase dark:text-zinc-500 text-stone-400 font-mono">
              Admin Portal · Secure Access
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase font-mono dark:text-zinc-500 text-stone-400 mb-2.5">
                Access Code
              </label>
              <input
                type="password"
                value={pinInput}
                onChange={e => setPinInput(e.target.value)}
                placeholder="Enter access code"
                autoFocus
                className={`w-full font-mono text-sm bg-transparent border-b-2 ${
                  pinError
                    ? 'border-red-500 dark:text-red-400 text-red-600'
                    : 'dark:border-white/20 border-stone-300 focus:border-amber-500 dark:text-white text-stone-900'
                } py-3 px-0 outline-none transition-colors placeholder:text-stone-300 dark:placeholder:text-zinc-700 text-center tracking-widest`}
              />
              {pinError && (
                <p className="text-[11px] text-red-500 font-mono mt-2 text-center">Invalid code — try again</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full mt-6 py-3 text-[11px] tracking-[0.2em] uppercase font-semibold font-mono bg-amber-600 hover:bg-amber-500 text-white transition-colors"
            >
              Unlock Dashboard
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
    'new-booking': 'New Booking',
    tours: 'Tour Packages',
    media: 'Photo Library',
    settings: 'Settings',
  };

  return (
    <div className="flex min-h-screen dark:bg-[#0a0b0d] bg-[#f6f5f2] dark:text-zinc-100 text-stone-900 transition-colors">

      {/* ── Toast ── */}
      {toast && (
        <div className="fixed top-5 right-5 z-[100] animate-in slide-in-from-top-2 fade-in duration-200">
          <div className={`flex items-center gap-2.5 px-4 py-2.5 border text-[12px] font-mono ${
            toast.type === 'success' ? 'dark:bg-emerald-950/80 bg-emerald-50 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
            : toast.type === 'error' ? 'dark:bg-red-950/80 bg-red-50 border-red-300 dark:border-red-800 text-red-700 dark:text-red-300'
            : 'dark:bg-zinc-900 bg-white border-stone-300 dark:border-white/10 dark:text-zinc-300 text-stone-600'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${toast.type === 'success' ? 'bg-emerald-500' : toast.type === 'error' ? 'bg-red-500' : 'bg-amber-500'}`} />
            {toast.text}
          </div>
        </div>
      )}

      {/* ── Mobile nav overlay ── */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      {/* ── Sidebar / Nav Rail ── */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen z-50
        flex flex-col
        dark:bg-[#0f1115] bg-white
        dark:border-r dark:border-white/[0.06] border-r border-stone-200
        transition-all duration-200 ease-out
        ${mobileNavOpen ? 'w-56 translate-x-0' : 'w-56 -translate-x-full lg:w-14 lg:translate-x-0 lg:hover:w-56'}
        group/sidebar overflow-hidden
      `}>
        {/* Brand */}
        <div className="flex items-center h-14 px-3.5 border-b dark:border-white/[0.06] border-stone-200 gap-3 overflow-hidden flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="FT" className="w-7 h-7 object-contain flex-shrink-0" />
          <span className="text-[11px] tracking-[0.18em] uppercase font-semibold dark:text-zinc-300 text-stone-700 whitespace-nowrap opacity-0 group-hover/sidebar:opacity-100 lg:group-hover/sidebar:opacity-100 transition-opacity duration-150">
            Families Tours
          </span>
          <button
            onClick={() => setMobileNavOpen(false)}
            className="ml-auto lg:hidden text-stone-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          {navItems.map(({ id, label, icon: Icon, badge }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => { setActiveTab(id as TabType); setMobileNavOpen(false); }}
                className={`
                  relative w-full flex items-center gap-3 h-9 px-2.5 text-left transition-colors
                  ${active
                    ? 'bg-amber-600 text-white'
                    : 'dark:text-zinc-400 text-stone-500 hover:dark:text-zinc-100 hover:text-stone-900 hover:dark:bg-white/5 hover:bg-stone-100'
                  }
                `}
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

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Topbar */}
        <header className="sticky top-0 z-30 h-14 flex items-center justify-between px-5 dark:bg-[#0a0b0d]/95 bg-[#f6f5f2]/95 backdrop-blur-md border-b dark:border-white/[0.06] border-stone-200 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden text-stone-400 dark:text-zinc-500"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase dark:text-zinc-600 text-stone-300">
                Families Tours
              </span>
              <span className="text-stone-300 dark:text-zinc-700">/</span>
              <span className="text-[12px] font-medium dark:text-zinc-200 text-stone-700">
                {tabTitle[activeTab]}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { fetchBookings(); fetchR2Images(); showToast('Refreshing…', 'info'); }}
              className="flex items-center gap-1.5 h-8 px-3 border dark:border-white/10 border-stone-300 text-[11px] font-mono dark:text-zinc-400 text-stone-500 hover:dark:text-zinc-100 hover:text-stone-900 hover:border-amber-500 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingBookings ? 'animate-spin text-amber-500' : ''}`} />
              <span className="hidden sm:inline">Sync</span>
            </button>
            {activeTab !== 'new-booking' && (
              <button
                onClick={() => setActiveTab('new-booking')}
                className="flex items-center gap-1.5 h-8 px-3 bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-mono transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">New Booking</span>
              </button>
            )}
          </div>
        </header>

        {/* ════════════════════════════════════════════════
            TAB: OVERVIEW
        ════════════════════════════════════════════════ */}
        {activeTab === 'overview' && (
          <div className="flex-1 overflow-y-auto">
            {/* KPI row — borderless grid of stat cells */}
            <div className="grid grid-cols-2 lg:grid-cols-4 border-b dark:border-white/[0.06] border-stone-200">
              <StatCell label="Est. Revenue" value={`${fmtRevenue(stats.estimatedRevenue)} MAD`} sub="Active & completed tours" accent />
              <StatCell label="Pending Action" value={stats.pending} sub="Awaiting confirmation" />
              <StatCell label="Confirmed" value={stats.confirmed} sub="Ready to depart" />
              <StatCell label="Total Guests" value={stats.totalGuests} sub={`${stats.total} reservations total`} />
            </div>

            {/* Body — two-column layout */}
            <div className="grid lg:grid-cols-3">
              {/* Departures feed */}
              <div className="lg:col-span-2 border-r dark:border-white/[0.06] border-stone-200">
                <div className="flex items-center justify-between px-6 py-4 border-b dark:border-white/[0.06] border-stone-200">
                  <div>
                    <h2 className="text-[11px] tracking-[0.2em] uppercase font-semibold dark:text-zinc-400 text-stone-400">Upcoming Departures</h2>
                    <p className="text-[11px] font-mono dark:text-zinc-600 text-stone-400 mt-0.5">Today & Tomorrow</p>
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
                    {/* Today */}
                    {stats.todayDepartures.length > 0 && (
                      <>
                        <div className="px-6 py-2 border-b dark:border-white/[0.06] border-stone-200 dark:bg-white/[0.015] bg-stone-100/60">
                          <span className="text-[10px] font-mono tracking-widest uppercase dark:text-emerald-400 text-emerald-700">
                            Today — {stats.todayDepartures.length} departure{stats.todayDepartures.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        {stats.todayDepartures.map((b) => (
                          <div key={b.id} className="flex items-center justify-between px-6 py-4 border-b dark:border-white/[0.06] border-stone-200 hover:dark:bg-white/[0.02] hover:bg-stone-100/50 transition-colors">
                            <div className="min-w-0">
                              <p className="text-[13px] font-medium dark:text-white text-stone-900 truncate">{b.customerName}</p>
                              <p className="text-[11px] font-mono dark:text-zinc-500 text-stone-400 mt-0.5">{b.packageName} · {b.guests} guests</p>
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                              <StatusBadge status={b.status} />
                              <button
                                onClick={() => { setSelectedBooking(b); setActiveTab('bookings'); }}
                                className="text-[11px] font-mono text-amber-600 hover:text-amber-500 transition-colors"
                              >
                                View
                              </button>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                    {/* Tomorrow */}
                    {stats.tomorrowDepartures.length > 0 && (
                      <>
                        <div className="px-6 py-2 border-b dark:border-white/[0.06] border-stone-200 dark:bg-white/[0.015] bg-stone-100/60">
                          <span className="text-[10px] font-mono tracking-widest uppercase dark:text-zinc-500 text-stone-400">
                            Tomorrow — {stats.tomorrowDepartures.length} departure{stats.tomorrowDepartures.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        {stats.tomorrowDepartures.map((b) => (
                          <div key={b.id} className="flex items-center justify-between px-6 py-4 border-b dark:border-white/[0.06] border-stone-200 hover:dark:bg-white/[0.02] hover:bg-stone-100/50 transition-colors">
                            <div className="min-w-0">
                              <p className="text-[13px] font-medium dark:text-white text-stone-900 truncate">{b.customerName}</p>
                              <p className="text-[11px] font-mono dark:text-zinc-500 text-stone-400 mt-0.5">{b.packageName} · {b.guests} guests</p>
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                              <StatusBadge status={b.status} />
                              <button
                                onClick={() => { setSelectedBooking(b); setActiveTab('bookings'); }}
                                className="text-[11px] font-mono text-amber-600 hover:text-amber-500 transition-colors"
                              >
                                View
                              </button>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Package distribution */}
              <div>
                <div className="px-5 py-4 border-b dark:border-white/[0.06] border-stone-200">
                  <h2 className="text-[11px] tracking-[0.2em] uppercase font-semibold dark:text-zinc-400 text-stone-400">Bookings by Experience</h2>
                </div>
                {Object.keys(stats.packageCounts).length === 0 ? (
                  <div className="flex items-center justify-center py-20">
                    <p className="text-[12px] font-mono dark:text-zinc-600 text-stone-400">No data yet</p>
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
                              <div
                                className="h-full bg-amber-600 transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}

                {/* Status breakdown */}
                <div className="border-t dark:border-white/[0.06] border-stone-200 px-5 py-4 space-y-2.5">
                  <h3 className="text-[10px] tracking-[0.2em] uppercase font-semibold dark:text-zinc-500 text-stone-400 mb-3">Status Breakdown</h3>
                  {[
                    { label: 'Pending',   count: stats.pending,   color: 'bg-amber-500' },
                    { label: 'Confirmed', count: stats.confirmed, color: 'bg-emerald-500' },
                    { label: 'Completed', count: stats.completed, color: 'bg-sky-500' },
                    { label: 'Cancelled', count: stats.cancelled, color: 'bg-red-500' },
                  ].map(({ label, count, color }) => (
                    <div key={label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${color}`} />
                        <span className="text-[12px] dark:text-zinc-400 text-stone-500">{label}</span>
                      </div>
                      <span className="text-[12px] font-mono dark:text-zinc-300 text-stone-700">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════
            TAB: RESERVATIONS
        ════════════════════════════════════════════════ */}
        {activeTab === 'bookings' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Filters bar */}
            <div className="flex flex-wrap items-center gap-3 px-5 py-3 border-b dark:border-white/[0.06] border-stone-200 flex-shrink-0">
              {/* Search */}
              <div className="relative flex-1 min-w-48">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 dark:text-zinc-600 text-stone-400" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search name, email, package…"
                  className="w-full pl-8 pr-3 h-8 text-[12px] font-mono bg-transparent border dark:border-white/10 border-stone-300 dark:text-zinc-200 text-stone-800 placeholder:dark:text-zinc-600 placeholder:text-stone-400 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              {/* Status filter */}
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

              {/* Package filter */}
              <select
                value={packageFilter}
                onChange={e => setPackageFilter(e.target.value)}
                className="h-8 px-3 text-[11px] font-mono bg-transparent border dark:border-white/10 border-stone-300 dark:text-zinc-300 text-stone-600 focus:outline-none focus:border-amber-500 transition-colors max-w-44"
              >
                <option value="ALL" className="dark:bg-zinc-900 bg-white">All Packages</option>
                {tourPackages.map(p => (
                  <option key={p.id} value={p.title} className="dark:bg-zinc-900 bg-white">{p.title}</option>
                ))}
              </select>

              {/* Actions */}
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

            {/* Two-pane layout */}
            <div className="flex-1 flex overflow-hidden">
              {/* Reservations table */}
              <div className={`flex-1 overflow-y-auto ${selectedBooking ? 'hidden lg:block lg:max-w-[55%]' : ''}`}>
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
                    <thead>
                      <tr className="border-b dark:border-white/[0.06] border-stone-200 dark:bg-white/[0.015] bg-stone-100/50">
                        <th className="text-left px-5 py-2.5 text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 font-normal">Customer</th>
                        <th className="text-left px-3 py-2.5 text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 font-normal hidden md:table-cell">Package</th>
                        <th className="text-left px-3 py-2.5 text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 font-normal hidden lg:table-cell">Date</th>
                        <th className="text-center px-3 py-2.5 text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 font-normal hidden sm:table-cell">Guests</th>
                        <th className="text-left px-3 py-2.5 text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 font-normal">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.map(b => (
                        <tr
                          key={b.id}
                          onClick={() => setSelectedBooking(selectedBooking?.id === b.id ? null : b)}
                          className={`border-b dark:border-white/[0.04] border-stone-100 cursor-pointer transition-colors ${
                            selectedBooking?.id === b.id
                              ? 'dark:bg-amber-950/20 bg-amber-50/60'
                              : 'hover:dark:bg-white/[0.02] hover:bg-stone-100/50'
                          }`}
                        >
                          <td className="px-5 py-3.5">
                            <p className="font-medium dark:text-white text-stone-900 truncate max-w-32">{b.customerName}</p>
                            <p className="font-mono dark:text-zinc-600 text-stone-400 text-[11px] truncate">{b.email}</p>
                          </td>
                          <td className="px-3 py-3.5 hidden md:table-cell">
                            <span className="dark:text-zinc-300 text-stone-600 truncate max-w-28 block">{b.packageName}</span>
                          </td>
                          <td className="px-3 py-3.5 font-mono dark:text-zinc-400 text-stone-500 hidden lg:table-cell">
                            {fmtDate(b.date)}
                          </td>
                          <td className="px-3 py-3.5 font-mono text-center hidden sm:table-cell dark:text-zinc-400 text-stone-500">
                            {b.guests}
                          </td>
                          <td className="px-3 py-3.5">
                            <StatusBadge status={b.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Detail panel */}
              {selectedBooking && (
                <div className={`${selectedBooking ? 'flex-1 lg:flex-none lg:w-[380px]' : 'hidden'} border-l dark:border-white/[0.06] border-stone-200 overflow-y-auto flex-shrink-0`}>
                  {/* Panel header */}
                  <div className="flex items-center justify-between px-5 py-3.5 border-b dark:border-white/[0.06] border-stone-200 sticky top-0 dark:bg-[#0a0b0d] bg-[#f6f5f2] z-10">
                    <div>
                      <p className="text-[13px] font-semibold dark:text-white text-stone-900">{selectedBooking.customerName}</p>
                      <p className="text-[10px] font-mono dark:text-zinc-600 text-stone-400">{selectedBooking.id.slice(0, 12)}…</p>
                    </div>
                    <button onClick={() => setSelectedBooking(null)} className="text-stone-400 hover:text-stone-700 dark:hover:text-zinc-200 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Panel body */}
                  <div className="px-5 py-5 space-y-6">
                    {/* Status change */}
                    <div>
                      <p className="text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 mb-2.5">Status</p>
                      <div className="flex flex-wrap gap-2">
                        {['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(s => (
                          <button
                            key={s}
                            onClick={() => handleStatusChange(selectedBooking.id, s)}
                            className={`h-7 px-3 text-[10px] font-mono tracking-wide border transition-colors ${
                              selectedBooking.status === s
                                ? 'border-amber-500 bg-amber-600 text-white'
                                : 'dark:border-white/10 border-stone-300 dark:text-zinc-400 text-stone-500 hover:border-amber-500'
                            }`}
                          >
                            {s.charAt(0) + s.slice(1).toLowerCase()}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Info rows */}
                    {[
                      { label: 'Package',   value: selectedBooking.packageName },
                      { label: 'Date',      value: fmtDate(selectedBooking.date), mono: true },
                      { label: 'Guests',    value: `${selectedBooking.guests} person${selectedBooking.guests !== 1 ? 's' : ''}`, mono: true },
                      { label: 'Booked',    value: fmtDate(selectedBooking.createdAt), mono: true },
                    ].map(({ label, value, mono }) => (
                      <div key={label} className="border-b dark:border-white/[0.06] border-stone-200 pb-3 last:border-0">
                        <p className="text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 mb-1">{label}</p>
                        <p className={`text-[13px] dark:text-zinc-200 text-stone-800 ${mono ? 'font-mono' : ''}`}>{value}</p>
                      </div>
                    ))}

                    {/* Contact */}
                    <div>
                      <p className="text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 mb-3">Contact</p>
                      <div className="space-y-2.5">
                        <a href={`mailto:${selectedBooking.email}`} className="flex items-center gap-2.5 text-[12px] font-mono dark:text-zinc-300 text-stone-600 hover:text-amber-600 transition-colors">
                          <Mail className="w-3.5 h-3.5 flex-shrink-0 dark:text-zinc-600 text-stone-400" />
                          {selectedBooking.email}
                        </a>
                        {selectedBooking.phone && (
                          <>
                            <a href={`tel:${selectedBooking.phone}`} className="flex items-center gap-2.5 text-[12px] font-mono dark:text-zinc-300 text-stone-600 hover:text-amber-600 transition-colors">
                              <Phone className="w-3.5 h-3.5 flex-shrink-0 dark:text-zinc-600 text-stone-400" />
                              {selectedBooking.phone}
                            </a>
                            <a
                              href={`https://wa.me/${selectedBooking.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${selectedBooking.customerName}, regarding your ${selectedBooking.packageName} reservation on ${fmtDate(selectedBooking.date)}.`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 h-7 px-3 text-[11px] font-mono border border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors"
                            >
                              <MessageSquare className="w-3 h-3" />
                              WhatsApp
                            </a>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Notes */}
                    {selectedBooking.message && (
                      <div>
                        <p className="text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 mb-1.5">Customer Notes</p>
                        <p className="text-[12px] dark:text-zinc-400 text-stone-600 leading-relaxed">{selectedBooking.message}</p>
                      </div>
                    )}

                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteBooking(selectedBooking.id)}
                      className="flex items-center gap-2 text-[11px] font-mono text-red-500/60 hover:text-red-500 transition-colors mt-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete Reservation
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════
            TAB: NEW BOOKING
        ════════════════════════════════════════════════ */}
        {activeTab === 'new-booking' && (
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-2xl mx-auto px-5 py-10">
              <div className="mb-8">
                <h2 className="text-[11px] tracking-[0.2em] uppercase font-semibold dark:text-zinc-400 text-stone-400">Manual Entry</h2>
                <p className="text-sm dark:text-white text-stone-900 mt-1">Create a walk-in or phone booking</p>
              </div>

              <form onSubmit={handleCreateManualBooking} className="space-y-6">
                {/* Package */}
                <div>
                  <label className="block text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 mb-2">Experience *</label>
                  <select
                    required
                    value={newBookingForm.packageName}
                    onChange={e => setNewBookingForm({ ...newBookingForm, packageName: e.target.value })}
                    className="w-full h-11 px-3 text-[13px] font-mono bg-transparent border dark:border-white/10 border-stone-300 dark:text-zinc-200 text-stone-800 focus:outline-none focus:border-amber-500 transition-colors"
                  >
                    {tourPackages.map(p => (
                      <option key={p.id} value={p.title} className="dark:bg-zinc-900 bg-white">
                        {p.title} — {p.price} MAD/person
                      </option>
                    ))}
                  </select>
                </div>

                {/* Customer name */}
                <div>
                  <label className="block text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 mb-2">Customer Name *</label>
                  <input
                    required
                    type="text"
                    value={newBookingForm.customerName}
                    onChange={e => setNewBookingForm({ ...newBookingForm, customerName: e.target.value })}
                    placeholder="Full name"
                    className="w-full h-11 px-3 text-[13px] bg-transparent border dark:border-white/10 border-stone-300 dark:text-zinc-200 text-stone-800 placeholder:dark:text-zinc-700 placeholder:text-stone-300 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 mb-2">Email Address *</label>
                  <input
                    required
                    type="email"
                    value={newBookingForm.email}
                    onChange={e => setNewBookingForm({ ...newBookingForm, email: e.target.value })}
                    placeholder="customer@email.com"
                    className="w-full h-11 px-3 text-[13px] font-mono bg-transparent border dark:border-white/10 border-stone-300 dark:text-zinc-200 text-stone-800 placeholder:dark:text-zinc-700 placeholder:text-stone-300 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                {/* Phone + Guests + Date */}
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 mb-2">Phone / WhatsApp</label>
                    <input
                      type="tel"
                      value={newBookingForm.phone}
                      onChange={e => setNewBookingForm({ ...newBookingForm, phone: e.target.value })}
                      placeholder="+212 631-024326"
                      className="w-full h-11 px-3 text-[13px] font-mono bg-transparent border dark:border-white/10 border-stone-300 dark:text-zinc-200 text-stone-800 placeholder:dark:text-zinc-700 placeholder:text-stone-300 focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 mb-2">Tour Date *</label>
                    <input
                      required
                      type="date"
                      value={newBookingForm.date}
                      onChange={e => setNewBookingForm({ ...newBookingForm, date: e.target.value })}
                      className="w-full h-11 px-3 text-[13px] font-mono bg-transparent border dark:border-white/10 border-stone-300 dark:text-zinc-200 text-stone-800 focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 mb-2">Guests *</label>
                    <input
                      required
                      type="number"
                      min={1}
                      max={20}
                      value={newBookingForm.guests}
                      onChange={e => setNewBookingForm({ ...newBookingForm, guests: parseInt(e.target.value) || 1 })}
                      className="w-full h-11 px-3 text-[13px] font-mono bg-transparent border dark:border-white/10 border-stone-300 dark:text-zinc-200 text-stone-800 focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 mb-2">Initial Status</label>
                  <div className="flex gap-2 flex-wrap">
                    {['PENDING', 'CONFIRMED'].map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setNewBookingForm({ ...newBookingForm, status: s as any })}
                        className={`h-8 px-4 text-[11px] font-mono border transition-colors ${
                          newBookingForm.status === s
                            ? 'border-amber-500 bg-amber-600 text-white'
                            : 'dark:border-white/10 border-stone-300 dark:text-zinc-400 text-stone-500'
                        }`}
                      >
                        {s.charAt(0) + s.slice(1).toLowerCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 mb-2">Notes / Special Requests</label>
                  <textarea
                    rows={3}
                    value={newBookingForm.message}
                    onChange={e => setNewBookingForm({ ...newBookingForm, message: e.target.value })}
                    placeholder="Dietary requirements, special occasions, preferences…"
                    className="w-full px-3 py-2.5 text-[13px] bg-transparent border dark:border-white/10 border-stone-300 dark:text-zinc-200 text-stone-800 placeholder:dark:text-zinc-700 placeholder:text-stone-300 focus:outline-none focus:border-amber-500 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isCreatingBooking}
                  className="w-full h-11 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-[11px] font-mono tracking-[0.18em] uppercase transition-colors"
                >
                  {isCreatingBooking ? 'Creating…' : 'Create Reservation'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════
            TAB: TOURS
        ════════════════════════════════════════════════ */}
        {activeTab === 'tours' && (
          <div className="flex-1 overflow-y-auto">
            <div className="border-b dark:border-white/[0.06] border-stone-200">
              <table className="w-full border-collapse text-[12px]">
                <thead>
                  <tr className="border-b dark:border-white/[0.06] border-stone-200 dark:bg-white/[0.015] bg-stone-100/50">
                    <th className="text-left px-5 py-3 text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 font-normal">#</th>
                    <th className="text-left px-3 py-3 text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 font-normal">Experience</th>
                    <th className="text-right px-3 py-3 text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 font-normal">Price / person</th>
                    <th className="text-left px-3 py-3 text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 font-normal hidden md:table-cell">Duration</th>
                    <th className="text-left px-3 py-3 text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 font-normal hidden lg:table-cell">Capacity</th>
                    <th className="text-right px-5 py-3 text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 font-normal">Bookings</th>
                  </tr>
                </thead>
                <tbody>
                  {tourPackages.map((pkg, idx) => {
                    const pkgBookings = bookings.filter(b => b.packageName.toLowerCase() === pkg.title.toLowerCase()).length;
                    return (
                      <tr key={pkg.id} className="border-b dark:border-white/[0.04] border-stone-100 hover:dark:bg-white/[0.015] hover:bg-stone-50 transition-colors">
                        <td className="px-5 py-4 font-mono dark:text-zinc-700 text-stone-300 text-[11px]">0{idx + 1}</td>
                        <td className="px-3 py-4">
                          <p className="font-medium dark:text-white text-stone-900">{pkg.title}</p>
                          <p className="text-[11px] dark:text-zinc-500 text-stone-400 mt-0.5">{pkg.subtitle}</p>
                        </td>
                        <td className="px-3 py-4 text-right font-mono font-semibold text-amber-600 dark:text-amber-400">
                          {pkg.price} MAD
                        </td>
                        <td className="px-3 py-4 font-mono dark:text-zinc-400 text-stone-500 text-[11px] hidden md:table-cell">
                          {pkg.duration}
                        </td>
                        <td className="px-3 py-4 dark:text-zinc-400 text-stone-500 text-[11px] hidden lg:table-cell">
                          {pkg.groupSize}
                        </td>
                        <td className="px-5 py-4 text-right font-mono dark:text-zinc-300 text-stone-700">
                          {pkgBookings}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════
            TAB: MEDIA
        ════════════════════════════════════════════════ */}
        {activeTab === 'media' && (
          <div className="flex-1 overflow-y-auto">
            {/* Upload form */}
            <div className="border-b dark:border-white/[0.06] border-stone-200 px-5 py-5">
              <p className="text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400 mb-4">Upload New Photo</p>
              <form onSubmit={handleUploadImage} className="flex flex-wrap items-end gap-3">
                <div>
                  <label className="block text-[10px] font-mono dark:text-zinc-600 text-stone-400 mb-1.5">Category</label>
                  <select
                    value={uploadCategory}
                    onChange={e => setUploadCategory(e.target.value)}
                    className="h-9 px-3 text-[12px] font-mono bg-transparent border dark:border-white/10 border-stone-300 dark:text-zinc-300 text-stone-600 focus:outline-none focus:border-amber-500 transition-colors"
                  >
                    {['Camels', 'Quad', 'Camp', 'Dinner', 'Sunrise', 'Safari4x4', 'Family', 'Gallery'].map(c => (
                      <option key={c} value={c} className="dark:bg-zinc-900 bg-white">{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono dark:text-zinc-600 text-stone-400 mb-1.5">File</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => setUploadFile(e.target.files?.[0] || null)}
                    className="text-[11px] font-mono dark:text-zinc-400 text-stone-500 file:h-9 file:px-3 file:border file:dark:border-white/10 file:border-stone-300 file:text-[11px] file:font-mono file:bg-transparent file:dark:text-zinc-400 file:text-stone-500 file:cursor-pointer"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!uploadFile || isUploading}
                  className="h-9 px-4 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white text-[11px] font-mono transition-colors flex items-center gap-2"
                >
                  <Upload className="w-3.5 h-3.5" />
                  {isUploading ? 'Uploading…' : 'Upload'}
                </button>
              </form>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-3 px-5 py-3 border-b dark:border-white/[0.06] border-stone-200">
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

            {/* Grid */}
            {isLoadingImages ? (
              <div className="flex items-center justify-center py-20">
                <RefreshCw className="w-5 h-5 animate-spin text-amber-500" />
              </div>
            ) : filteredR2Images.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <ImageIcon className="w-8 h-8 dark:text-zinc-700 text-stone-300" />
                <p className="text-[12px] font-mono dark:text-zinc-600 text-stone-400">No photos in this category</p>
              </div>
            ) : (
              <div className="p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {filteredR2Images.map(img => (
                  <div key={img.key} className="group relative aspect-square border dark:border-white/[0.06] border-stone-200 overflow-hidden dark:bg-zinc-900 bg-stone-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt={img.key}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                      <p className="text-[9px] font-mono text-white/70 text-center truncate w-full">{img.key.split('/').pop()}</p>
                      <button
                        onClick={() => copyToClipboard(img.url, img.key)}
                        className="flex items-center gap-1.5 h-7 px-3 text-[10px] font-mono bg-amber-600 text-white"
                      >
                        {copiedKey === img.key ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copiedKey === img.key ? 'Copied' : 'Copy URL'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════════
            TAB: SETTINGS
        ════════════════════════════════════════════════ */}
        {activeTab === 'settings' && (
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-lg mx-auto px-5 py-10 space-y-8">
              <div>
                <h2 className="text-[11px] tracking-[0.2em] uppercase font-semibold dark:text-zinc-400 text-stone-400 mb-1">Settings</h2>
                <p className="text-sm dark:text-white text-stone-900">Configuration & account security</p>
              </div>

              {/* Contact info */}
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

              {/* Theme */}
              <div className="border dark:border-white/[0.06] border-stone-200">
                <div className="px-5 py-4 border-b dark:border-white/[0.06] border-stone-200">
                  <p className="text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400">Appearance</p>
                </div>
                <div className="px-5 py-4 flex items-center justify-between">
                  <span className="text-[12px] font-mono dark:text-zinc-300 text-stone-700">Color mode</span>
                  <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="flex items-center gap-2 h-8 px-4 border dark:border-white/10 border-stone-300 text-[11px] font-mono dark:text-zinc-400 text-stone-500 hover:border-amber-500 hover:text-amber-600 transition-colors"
                  >
                    {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                    Switch to {theme === 'dark' ? 'Light' : 'Dark'}
                  </button>
                </div>
              </div>

              {/* Session */}
              <div className="border dark:border-white/[0.06] border-stone-200">
                <div className="px-5 py-4 border-b dark:border-white/[0.06] border-stone-200">
                  <p className="text-[10px] font-mono tracking-widest uppercase dark:text-zinc-600 text-stone-400">Session</p>
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

              <p className="text-[10px] font-mono dark:text-zinc-700 text-stone-300 text-center">
                Families Tours Admin · Marrakech · v2.0
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
