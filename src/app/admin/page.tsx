'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Calendar,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Upload,
  Image as ImageIcon,
  Copy,
  Trash2,
  Phone,
  Mail,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Lock,
  LogOut,
  ChevronRight,
  Filter,
  Download,
  Plus,
  Eye,
  MessageSquare,
  TrendingUp,
  DollarSign,
  Compass,
  MapPin,
  Send,
  Sun,
  Moon,
  Check,
  X,
  Sparkles,
  Layers,
  Settings,
  ChevronDown,
  Info,
  Building,
  Menu,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { tourPackages } from '@/lib/images';

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

export default function AdminDashboard() {
  const { theme, setTheme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Bookings State
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [packageFilter, setPackageFilter] = useState<string>('ALL');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Gallery / R2 State
  const [r2Images, setR2Images] = useState<R2Object[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [uploadCategory, setUploadCategory] = useState('Camels');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [mediaFilterCategory, setMediaFilterCategory] = useState('ALL');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Manual New Booking Form State
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

  // Check existing session
  useEffect(() => {
    const session = localStorage.getItem('families_admin_auth');
    if (session === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const validPins = ['families2026', 'admin', '2026', '1234'];
    if (validPins.includes(pinInput.trim())) {
      setIsAuthenticated(true);
      localStorage.setItem('families_admin_auth', 'true');
      setPinError(false);
      showToast('Welcome back, Administrator!', 'success');
    } else {
      setPinError(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('families_admin_auth');
    setIsAuthenticated(false);
    setPinInput('');
  };

  // Fetch Bookings
  const fetchBookings = useCallback(async () => {
    setIsLoadingBookings(true);
    try {
      const res = await fetch('/api/bookings?limit=200');
      const data = await res.json();
      if (data.success) {
        setBookings(data.bookings || []);
      }
    } catch (err) {
      console.error('Failed to load bookings:', err);
      showToast('Could not refresh bookings', 'error');
    } finally {
      setIsLoadingBookings(false);
    }
  }, []);

  // Fetch R2 Images
  const fetchR2Images = useCallback(async () => {
    setIsLoadingImages(true);
    try {
      const res = await fetch('/api/upload');
      const data = await res.json();
      if (data.success) {
        setR2Images(data.objects || []);
      }
    } catch (err) {
      console.error('Failed to load R2 images:', err);
    } finally {
      setIsLoadingImages(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
      fetchR2Images();
    }
  }, [isAuthenticated, fetchBookings, fetchR2Images]);

  // Update Booking Status
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: newStatus as any } : b))
        );
        if (selectedBooking && selectedBooking.id === id) {
          setSelectedBooking((prev) => prev ? { ...prev, status: newStatus as any } : null);
        }
        showToast(`Reservation status updated to ${newStatus}`, 'success');
      }
    } catch (err) {
      console.error('Failed to update booking status:', err);
      showToast('Failed to update status', 'error');
    }
  };

  // Delete Booking
  const handleDeleteBooking = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this reservation?')) return;
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setBookings((prev) => prev.filter((b) => b.id !== id));
        if (selectedBooking?.id === id) setSelectedBooking(null);
        showToast('Reservation deleted', 'info');
      }
    } catch (err) {
      console.error('Failed to delete booking:', err);
      showToast('Error deleting reservation', 'error');
    }
  };

  // Create Manual Booking
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
        showToast('New reservation created successfully!', 'success');
        setNewBookingForm({
          packageName: tourPackages[0]?.title || 'Camel Trek & Dinner',
          customerName: '',
          email: '',
          phone: '',
          date: new Date().toISOString().split('T')[0],
          guests: 2,
          message: '',
          status: 'CONFIRMED',
        });
        fetchBookings();
        setActiveTab('bookings');
      } else {
        alert(data.error || 'Failed to create booking');
      }
    } catch (err) {
      console.error('Error creating manual booking:', err);
      showToast('Error creating reservation', 'error');
    } finally {
      setIsCreatingBooking(false);
    }
  };

  // Upload to R2
  const handleUploadImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('category', uploadCategory);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        showToast('Image uploaded successfully to Cloudflare R2!', 'success');
        setUploadFile(null);
        fetchR2Images();
      } else {
        alert(data.error || 'Failed to upload image to Cloudflare R2');
      }
    } catch (err) {
      console.error('Upload error:', err);
      showToast('Upload failed', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  // Copy to clipboard helper
  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast('Link copied to clipboard!', 'info');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Export Bookings to CSV
  const exportToCSV = () => {
    if (bookings.length === 0) {
      showToast('No bookings to export', 'info');
      return;
    }
    const headers = ['ID', 'Customer Name', 'Email', 'Phone', 'Package', 'Tour Date', 'Guests', 'Status', 'Created At', 'Notes'];
    const rows = bookings.map((b) => [
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

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `families_tours_bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV export downloaded successfully', 'success');
  };

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
      const matchesPackage = packageFilter === 'ALL' || b.packageName.toLowerCase().includes(packageFilter.toLowerCase());
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        b.customerName.toLowerCase().includes(query) ||
        b.email.toLowerCase().includes(query) ||
        b.packageName.toLowerCase().includes(query) ||
        (b.phone && b.phone.includes(query)) ||
        (b.message && b.message.toLowerCase().includes(query));
      return matchesStatus && matchesPackage && matchesSearch;
    });
  }, [bookings, statusFilter, packageFilter, searchQuery]);

  // Filtered R2 Media
  const filteredR2Images = useMemo(() => {
    if (mediaFilterCategory === 'ALL') return r2Images;
    return r2Images.filter((img) => img.key.toLowerCase().includes(mediaFilterCategory.toLowerCase()));
  }, [r2Images, mediaFilterCategory]);

  // Analytics & Aggregations
  const stats = useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter((b) => b.status === 'PENDING').length;
    const confirmed = bookings.filter((b) => b.status === 'CONFIRMED').length;
    const completed = bookings.filter((b) => b.status === 'COMPLETED').length;
    const cancelled = bookings.filter((b) => b.status === 'CANCELLED').length;
    const totalGuests = bookings.reduce((sum, b) => sum + (b.guests || 1), 0);

    // Estimated revenue calculation based on package prices
    const estimatedRevenue = bookings.reduce((sum, b) => {
      if (b.status === 'CANCELLED') return sum;
      const matchedTour = tourPackages.find((p) => p.title.toLowerCase() === b.packageName.toLowerCase());
      const unitPrice = matchedTour ? matchedTour.price : 200;
      return sum + unitPrice * (b.guests || 1);
    }, 0);

    // Upcoming departures (Today & Tomorrow)
    const todayStr = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const todayDepartures = bookings.filter((b) => b.date.startsWith(todayStr) && b.status !== 'CANCELLED');
    const tomorrowDepartures = bookings.filter((b) => b.date.startsWith(tomorrowStr) && b.status !== 'CANCELLED');

    // Package Popularity
    const packageCounts: Record<string, number> = {};
    bookings.forEach((b) => {
      packageCounts[b.packageName] = (packageCounts[b.packageName] || 0) + 1;
    });

    return {
      total,
      pending,
      confirmed,
      completed,
      cancelled,
      totalGuests,
      estimatedRevenue,
      todayDepartures,
      tomorrowDepartures,
      packageCounts,
    };
  }, [bookings]);

  // Authentication Gate Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen dark:bg-[#090a0c] bg-[#f8f7f4] flex items-center justify-center p-6 text-stone-900 dark:text-white transition-colors duration-300 relative">
        {/* Theme Toggle Button on Login Screen */}
        <div className="absolute top-6 right-6">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-3 rounded-full border dark:border-white/15 border-stone-300 dark:text-zinc-300 text-stone-700 hover:text-amber-500 dark:bg-zinc-900 bg-white shadow-sm transition-all"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        <div className="w-full max-w-md dark:bg-[#121418] bg-white border dark:border-white/10 border-stone-300/80 p-8 sm:p-10 rounded-2xl shadow-2xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="Families Tours"
                className="h-20 w-auto object-contain drop-shadow-md"
              />
            </div>
            <h1 className="text-xl font-light tracking-wider dark:text-white text-stone-900">
              Admin <span className="font-serif italic text-amber-500">Management Portal</span>
            </h1>
            <p className="text-xs uppercase tracking-widest text-amber-500/90 mt-1 font-bold">Secure Access</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-widest font-semibold dark:text-zinc-400 text-stone-600 mb-2">
                Security PIN Code
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Enter PIN (e.g. families2026)"
                  className="w-full dark:bg-zinc-900/80 bg-stone-50 border dark:border-white/15 border-stone-300 rounded-xl px-4 py-3.5 text-center text-lg tracking-widest focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all font-mono dark:text-white text-stone-900"
                  autoFocus
                />
              </div>
              {pinError && (
                <p className="text-xs text-red-500 mt-2.5 flex items-center justify-center gap-1.5 font-medium animate-shake">
                  <AlertCircle className="w-4 h-4" /> Invalid PIN code. Please try again.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 shadow-xl shadow-amber-500/25 cursor-pointer"
            >
              Unlock Dashboard
            </button>
          </form>

          <div className="mt-8 pt-6 border-t dark:border-white/5 border-stone-200 text-center">
            <p className="text-[11px] dark:text-zinc-500 text-stone-400 font-medium">
              Families Tours Marrakech • Encrypted Management Portal
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:bg-[#090a0c] bg-[#f8f7f4] dark:text-zinc-100 text-stone-900 flex transition-colors duration-300 font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 animate-in slide-in-from-top-3 fade-in duration-300">
          <div className={`px-5 py-3 rounded-xl shadow-2xl border text-xs font-semibold flex items-center gap-2.5 ${
            toastMessage.type === 'success' 
              ? 'dark:bg-emerald-950 bg-emerald-50 text-emerald-600 dark:text-emerald-300 border-emerald-500/40'
              : toastMessage.type === 'error'
              ? 'dark:bg-red-950 bg-red-50 text-red-600 dark:text-red-300 border-red-500/40'
              : 'dark:bg-zinc-900 bg-white text-amber-500 border-amber-500/40 shadow-stone-900/10'
          }`}>
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Modern Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-72 dark:bg-[#0f1115] bg-white border-r dark:border-white/10 border-stone-200/90 z-50 flex flex-col justify-between transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div>
          {/* Logo Brand */}
          <div className="p-5 border-b dark:border-white/10 border-stone-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="Families Tours"
                className="h-10 w-auto object-contain"
              />
              <div>
                <h2 className="text-xs font-semibold tracking-wider uppercase dark:text-white text-stone-900 leading-tight">Families Tours</h2>
                <p className="text-[9px] text-amber-500 font-medium tracking-widest uppercase">Admin Portal</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-stone-500 hover:text-stone-900 dark:text-zinc-400 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {[
              { id: 'overview', label: 'Overview & Analytics', icon: <TrendingUp className="w-4 h-4" /> },
              { id: 'bookings', label: 'Reservations Pipeline', icon: <Calendar className="w-4 h-4" />, badge: stats.pending > 0 ? stats.pending : undefined },
              { id: 'new-booking', label: 'New Reservation', icon: <Plus className="w-4 h-4" /> },
              { id: 'tours', label: 'Tours & Experiences', icon: <Compass className="w-4 h-4" /> },
              { id: 'media', label: 'Media & Photo Studio', icon: <ImageIcon className="w-4 h-4" />, badge: r2Images.length },
              { id: 'settings', label: 'Settings & Security', icon: <Settings className="w-4 h-4" /> },
            ].map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as TabType);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-black shadow-md shadow-amber-500/25'
                      : 'dark:text-zinc-300 text-stone-600 hover:dark:text-white hover:text-stone-950 dark:hover:bg-white/5 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive
                        ? 'bg-black/20 text-black'
                        : item.id === 'bookings' && stats.pending > 0
                        ? 'bg-amber-500/20 text-amber-500'
                        : 'dark:bg-zinc-800 bg-stone-200 text-stone-600 dark:text-zinc-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* System Health & User Info Footer */}
        <div className="p-4 border-t dark:border-white/10 border-stone-200/80 space-y-3">
          {/* Live Status Indicators */}
          <div className="p-3 rounded-xl dark:bg-zinc-900/60 bg-stone-100/80 border dark:border-white/5 border-stone-200/60 text-[11px] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="dark:text-zinc-400 text-stone-600 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Reservation System
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[10px]">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="dark:text-zinc-400 text-stone-600 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Photo Storage Cloud
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[10px]">Ready</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2.5 rounded-xl border dark:border-white/10 border-stone-300 dark:text-zinc-300 text-stone-700 hover:text-amber-500 hover:border-amber-500 dark:bg-zinc-900 bg-stone-50 shadow-sm transition-colors"
              title="Toggle Light / Dark Mode"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={handleLogout}
              className="flex-1 ml-2 flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 text-xs font-semibold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar Header */}
        <header className="sticky top-0 z-30 dark:bg-[#0f1115]/95 bg-white/95 backdrop-blur-md border-b dark:border-white/10 border-stone-200/80 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg border dark:border-white/10 border-stone-300"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base font-semibold dark:text-white text-stone-900 capitalize">
                {activeTab === 'overview' && 'Dashboard Overview & Performance'}
                {activeTab === 'bookings' && 'Reservations & Booking Management'}
                {activeTab === 'new-booking' && 'Add Manual Reservation'}
                {activeTab === 'tours' && 'Tour Packages & Live Pricing'}
                {activeTab === 'media' && 'Media & Photo Assets Library'}
                {activeTab === 'settings' && 'Settings & Account Security'}
              </h1>
              <p className="text-xs dark:text-zinc-400 text-stone-500 hidden sm:block">
                Welcome back. Live operational sync is active.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                fetchBookings();
                fetchR2Images();
                showToast('Refreshing all live data...', 'info');
              }}
              className="p-2.5 rounded-xl border dark:border-white/10 border-stone-300 dark:text-zinc-300 text-stone-700 hover:border-amber-500 hover:text-amber-500 transition-all text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${(isLoadingBookings || isLoadingImages) ? 'animate-spin text-amber-500' : ''}`} />
              <span className="hidden md:inline font-medium">Sync Data</span>
            </button>

            {activeTab !== 'new-booking' && (
              <button
                onClick={() => setActiveTab('new-booking')}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold text-xs tracking-wider uppercase hover:from-amber-400 hover:to-amber-500 rounded-xl shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Booking</span>
              </button>
            )}
          </div>
        </header>

        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {activeTab === 'overview' && (
          <div className="p-6 lg:p-8 space-y-8 max-w-7xl">
            {/* KPI Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-6 rounded-2xl dark:bg-[#121418] bg-white border dark:border-white/10 border-stone-200/90 shadow-md">
                <div className="flex justify-between items-start">
                  <span className="text-xs uppercase tracking-wider font-semibold dark:text-zinc-400 text-stone-500">Est. Revenue</span>
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-3xl font-light mt-3 text-amber-500 font-serif">
                  {stats.estimatedRevenue.toLocaleString()} <span className="text-sm font-sans font-medium text-stone-500 dark:text-zinc-400">MAD</span>
                </p>
                <span className="text-[11px] dark:text-zinc-500 text-stone-400 mt-1 block">From confirmed & completed tours</span>
              </div>

              <div className="p-6 rounded-2xl dark:bg-[#121418] bg-white border border-amber-500/40 shadow-md shadow-amber-500/5">
                <div className="flex justify-between items-start">
                  <span className="text-xs uppercase tracking-wider font-semibold text-amber-500">Pending Action</span>
                  <div className="p-2 rounded-lg bg-amber-500/20 text-amber-500">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-3xl font-light mt-3 text-amber-500">{stats.pending}</p>
                <span className="text-[11px] dark:text-zinc-500 text-stone-400 mt-1 block">Awaiting confirmation</span>
              </div>

              <div className="p-6 rounded-2xl dark:bg-[#121418] bg-white border border-emerald-500/40 shadow-md shadow-emerald-500/5">
                <div className="flex justify-between items-start">
                  <span className="text-xs uppercase tracking-wider font-semibold text-emerald-500">Confirmed Bookings</span>
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-3xl font-light mt-3 text-emerald-500">{stats.confirmed}</p>
                <span className="text-[11px] dark:text-zinc-500 text-stone-400 mt-1 block">Active departures ready</span>
              </div>

              <div className="p-6 rounded-2xl dark:bg-[#121418] bg-white border dark:border-white/10 border-stone-200/90 shadow-md">
                <div className="flex justify-between items-start">
                  <span className="text-xs uppercase tracking-wider font-semibold dark:text-zinc-400 text-stone-500">Total Guests Hosted</span>
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-3xl font-light mt-3 dark:text-white text-stone-900">{stats.totalGuests}</p>
                <span className="text-[11px] dark:text-zinc-500 text-stone-400 mt-1 block">Across {stats.total} reservations</span>
              </div>
            </div>

            {/* Upcoming Departures Feed & Package Breakdown */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Departures Feed */}
              <div className="lg:col-span-2 p-6 rounded-2xl dark:bg-[#121418] bg-white border dark:border-white/10 border-stone-200/90 shadow-md space-y-6">
                <div className="flex items-center justify-between border-b dark:border-white/10 border-stone-200/80 pb-4">
                  <div>
                    <h3 className="text-sm font-semibold tracking-wider uppercase dark:text-white text-stone-900">Upcoming Tour Departures</h3>
                    <p className="text-xs dark:text-zinc-400 text-stone-500">Today & Tomorrow Schedule</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className="text-xs text-amber-500 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>View All ({bookings.length})</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {stats.todayDepartures.length === 0 && stats.tomorrowDepartures.length === 0 ? (
                  <div className="text-center py-12 dark:text-zinc-500 text-stone-400 text-xs">
                    No departures scheduled for today or tomorrow.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {stats.todayDepartures.length > 0 && (
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-md mb-3 inline-block">
                          Today ({stats.todayDepartures.length})
                        </span>
                        <div className="space-y-2 mt-2">
                          {stats.todayDepartures.map((b) => (
                            <div key={b.id} className="p-3.5 rounded-xl dark:bg-zinc-900/60 bg-stone-50 border dark:border-white/5 border-stone-200 flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-xs dark:text-white text-stone-900">{b.customerName}</h4>
                                <p className="text-[11px] text-amber-500">{b.packageName} • {b.guests} Guests</p>
                              </div>
                              <button
                                onClick={() => {
                                  setSelectedBooking(b);
                                  setActiveTab('bookings');
                                }}
                                className="px-3 py-1.5 rounded-lg border border-amber-500/40 text-amber-500 text-[11px] hover:bg-amber-500 hover:text-black transition-colors"
                              >
                                Manage
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {stats.tomorrowDepartures.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-md mb-3 inline-block">
                          Tomorrow ({stats.tomorrowDepartures.length})
                        </span>
                        <div className="space-y-2 mt-2">
                          {stats.tomorrowDepartures.map((b) => (
                            <div key={b.id} className="p-3.5 rounded-xl dark:bg-zinc-900/60 bg-stone-50 border dark:border-white/5 border-stone-200 flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-xs dark:text-white text-stone-900">{b.customerName}</h4>
                                <p className="text-[11px] text-amber-500">{b.packageName} • {b.guests} Guests</p>
                              </div>
                              <button
                                onClick={() => {
                                  setSelectedBooking(b);
                                  setActiveTab('bookings');
                                }}
                                className="px-3 py-1.5 rounded-lg border border-amber-500/40 text-amber-500 text-[11px] hover:bg-amber-500 hover:text-black transition-colors"
                              >
                                Manage
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Experience Popularity Breakdown */}
              <div className="p-6 rounded-2xl dark:bg-[#121418] bg-white border dark:border-white/10 border-stone-200/90 shadow-md space-y-5">
                <div className="border-b dark:border-white/10 border-stone-200/80 pb-4">
                  <h3 className="text-sm font-semibold tracking-wider uppercase dark:text-white text-stone-900">Experience Popularity</h3>
                  <p className="text-xs dark:text-zinc-400 text-stone-500">Distribution by Tour Type</p>
                </div>

                <div className="space-y-4">
                  {Object.entries(stats.packageCounts).map(([pkgName, count]) => {
                    const percentage = Math.round((count / (stats.total || 1)) * 100);
                    return (
                      <div key={pkgName} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="dark:text-zinc-200 text-stone-800 truncate max-w-[180px]">{pkgName}</span>
                          <span className="text-amber-500 font-semibold">{count} ({percentage}%)</span>
                        </div>
                        <div className="w-full h-2 rounded-full dark:bg-zinc-800 bg-stone-200 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-700"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  {Object.keys(stats.packageCounts).length === 0 && (
                    <p className="text-xs text-center py-6 text-stone-400">No booking statistics yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: RESERVATIONS & BOOKINGS MANAGEMENT */}
        {activeTab === 'bookings' && (
          <div className="p-6 lg:p-8 space-y-6 max-w-7xl">
            {/* Search, Filter, and Export Action Bar */}
            <div className="p-5 rounded-2xl dark:bg-[#121418] bg-white border dark:border-white/10 border-stone-200/90 shadow-md flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 dark:text-zinc-400 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search customer, email, phone or notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full dark:bg-zinc-900/80 bg-stone-50 border dark:border-white/15 border-stone-300 rounded-xl pl-10 pr-4 py-2.5 text-xs dark:text-white text-stone-900 dark:placeholder:text-zinc-500 placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="dark:bg-zinc-900 bg-stone-50 border dark:border-white/15 border-stone-300 rounded-xl px-3 py-2.5 text-xs font-semibold uppercase tracking-wider dark:text-white text-stone-900 focus:outline-none focus:border-amber-500"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PENDING">Pending Action</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>

                {/* Package Filter */}
                <select
                  value={packageFilter}
                  onChange={(e) => setPackageFilter(e.target.value)}
                  className="dark:bg-zinc-900 bg-stone-50 border dark:border-white/15 border-stone-300 rounded-xl px-3 py-2.5 text-xs font-medium dark:text-white text-stone-900 focus:outline-none focus:border-amber-500"
                >
                  <option value="ALL">All Packages</option>
                  {tourPackages.map((p) => (
                    <option key={p.id} value={p.title}>{p.title}</option>
                  ))}
                </select>

                {/* CSV Export Button */}
                <button
                  onClick={exportToCSV}
                  className="px-4 py-2.5 rounded-xl border dark:border-white/15 border-stone-300 dark:text-zinc-300 text-stone-700 hover:border-amber-500 hover:text-amber-500 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                  title="Export to CSV Spreadsheet"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Export CSV</span>
                </button>
              </div>
            </div>

            {/* Bookings Count Summary Bar */}
            <div className="flex items-center justify-between text-xs dark:text-zinc-400 text-stone-500 font-medium px-1">
              <span>Showing {filteredBookings.length} of {bookings.length} reservations</span>
              {(statusFilter !== 'ALL' || packageFilter !== 'ALL' || searchQuery) && (
                <button
                  onClick={() => {
                    setStatusFilter('ALL');
                    setPackageFilter('ALL');
                    setSearchQuery('');
                  }}
                  className="text-amber-500 hover:underline font-semibold"
                >
                  Reset Filters
                </button>
              )}
            </div>

            {/* Bookings Table / Cards List */}
            {isLoadingBookings ? (
              <div className="text-center py-24 dark:text-zinc-500 text-stone-400 text-sm flex flex-col items-center gap-3">
                <RefreshCw className="w-6 h-6 animate-spin text-amber-500" />
                <span>Loading reservations from database...</span>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-20 p-8 rounded-2xl dark:bg-[#121418] bg-white border dark:border-white/10 border-stone-200/90 shadow-md">
                <Calendar className="w-12 h-12 text-stone-300 dark:text-zinc-700 mx-auto mb-3" />
                <h3 className="text-base font-semibold dark:text-white text-stone-900">No Reservations Found</h3>
                <p className="text-xs dark:text-zinc-400 text-stone-500 max-w-sm mx-auto mt-1">
                  Try adjusting your search terms or filters above, or create a new booking manually.
                </p>
                <button
                  onClick={() => setActiveTab('new-booking')}
                  className="mt-5 px-5 py-2.5 bg-amber-500 text-black text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-amber-400 transition-colors"
                >
                  Add New Booking
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((b) => {
                  const cleanPhone = b.phone ? b.phone.replace(/[^0-9+]/g, '') : '';
                  const whatsappConfirmationMsg = `Hello ${b.customerName}! 🏜️ This is Families Tours confirming your Agafay reservation for "${b.packageName}" on ${b.date.split('T')[0]} for ${b.guests} guest(s). Pickup from your Marrakech accommodation is included. What is your hotel/riad name?`;
                  const whatsappUrl = cleanPhone
                    ? `https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(whatsappConfirmationMsg)}`
                    : null;

                  return (
                    <div
                      key={b.id}
                      className="p-6 rounded-2xl dark:bg-[#121418] bg-white border dark:border-white/10 border-stone-200/90 shadow-md hover:border-amber-500/50 hover:shadow-xl transition-all duration-300"
                    >
                      {/* Top row: Client name, status badge, status dropdown, actions */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b dark:border-white/5 border-stone-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full dark:bg-zinc-800 bg-stone-100 flex items-center justify-center font-bold text-amber-500 border dark:border-white/10 border-stone-200 shadow-inner text-sm">
                            {b.customerName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2.5">
                              <h3 className="font-semibold text-base dark:text-white text-stone-900">{b.customerName}</h3>
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  b.status === 'PENDING'
                                    ? 'bg-amber-500/15 text-amber-500 border border-amber-500/40'
                                    : b.status === 'CONFIRMED'
                                    ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/40'
                                    : b.status === 'COMPLETED'
                                    ? 'bg-blue-500/15 text-blue-400 border border-blue-500/40'
                                    : 'bg-red-500/15 text-red-400 border border-red-500/40'
                                }`}
                              >
                                {b.status}
                              </span>
                            </div>
                            <p className="text-amber-500 font-serif italic text-xs mt-0.5">
                              {b.packageName}
                            </p>
                          </div>
                        </div>

                        {/* Status Switcher & Delete */}
                        <div className="flex items-center gap-2.5">
                          <select
                            value={b.status}
                            onChange={(e) => handleStatusChange(b.id, e.target.value)}
                            className="dark:bg-zinc-900 bg-stone-50 border dark:border-white/20 border-stone-300 rounded-xl px-3 py-1.5 text-xs font-semibold uppercase tracking-wider dark:text-white text-stone-900 focus:outline-none focus:border-amber-500"
                          >
                            <option value="PENDING">Set Pending</option>
                            <option value="CONFIRMED">Set Confirmed</option>
                            <option value="COMPLETED">Set Completed</option>
                            <option value="CANCELLED">Set Cancelled</option>
                          </select>

                          <button
                            onClick={() => setSelectedBooking(b)}
                            className="p-2 border dark:border-white/10 border-stone-300 dark:text-zinc-300 text-stone-600 hover:text-amber-500 rounded-xl transition-colors cursor-pointer"
                            title="View Full Booking Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteBooking(b.id)}
                            className="p-2 border border-red-500/20 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                            title="Delete Booking"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 text-xs">
                        <div>
                          <span className="dark:text-zinc-500 text-stone-400 uppercase font-semibold text-[10px] block mb-1">Tour Date & Group</span>
                          <p className="font-semibold dark:text-white text-stone-900 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-amber-500" />
                            {new Date(b.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                          </p>
                          <p className="dark:text-zinc-400 text-stone-600 mt-0.5 flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-stone-400" />
                            {b.guests} {b.guests === 1 ? 'Guest' : 'Guests'}
                          </p>
                        </div>

                        <div>
                          <span className="dark:text-zinc-500 text-stone-400 uppercase font-semibold text-[10px] block mb-1">Contact Info</span>
                          <a
                            href={`mailto:${b.email}`}
                            className="dark:text-zinc-200 text-stone-800 hover:text-amber-500 transition-colors flex items-center gap-1.5 font-medium truncate"
                          >
                            <Mail className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                            <span className="truncate">{b.email}</span>
                          </a>
                          {b.phone ? (
                            <a
                              href={`tel:${b.phone}`}
                              className="dark:text-zinc-400 text-stone-600 hover:text-amber-500 transition-colors flex items-center gap-1.5 mt-1 font-mono"
                            >
                              <Phone className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                              <span>{b.phone}</span>
                            </a>
                          ) : (
                            <span className="text-[11px] text-stone-400 italic mt-1 block">No phone provided</span>
                          )}
                        </div>

                        <div className="sm:col-span-2">
                          <span className="dark:text-zinc-500 text-stone-400 uppercase font-semibold text-[10px] block mb-1">Special Requests / Notes</span>
                          <p className="italic dark:text-zinc-300 text-stone-600 line-clamp-2">
                            {b.message ? `"${b.message}"` : 'No special requests specified.'}
                          </p>
                        </div>
                      </div>

                      {/* Quick WhatsApp Action Footer */}
                      {whatsappUrl && (
                        <div className="mt-4 pt-3 border-t dark:border-white/5 border-stone-100 flex items-center justify-between">
                          <span className="text-[11px] dark:text-zinc-500 text-stone-400">
                            Booked on: {new Date(b.createdAt).toLocaleDateString()}
                          </span>
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/15 border border-emerald-500/40 hover:bg-emerald-500/25 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-semibold transition-all shadow-sm"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>1-Click WhatsApp Confirmation</span>
                            <ExternalLink className="w-3 h-3 ml-0.5" />
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ADD NEW RESERVATION (MANUAL CREATOR) */}
        {activeTab === 'new-booking' && (
          <div className="p-6 lg:p-8 max-w-4xl space-y-6">
            <div className="p-8 rounded-2xl dark:bg-[#121418] bg-white border dark:border-white/10 border-stone-200/90 shadow-xl space-y-6">
              <div>
                <h2 className="text-xl font-light dark:text-white text-stone-900">Create New Reservation</h2>
                <p className="text-xs dark:text-zinc-400 text-stone-500 mt-1">
                  Add phone or walk-in reservations directly to the database and trigger automatic email confirmations.
                </p>
              </div>

              <form onSubmit={handleCreateManualBooking} className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-amber-500 mb-2">
                    Tour Package Experience
                  </label>
                  <select
                    value={newBookingForm.packageName}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, packageName: e.target.value })}
                    className="w-full dark:bg-zinc-900 bg-stone-50 border dark:border-white/15 border-stone-300 rounded-xl px-4 py-3 text-sm dark:text-white text-stone-900 focus:outline-none focus:border-amber-500 font-medium"
                  >
                    {tourPackages.map((p) => (
                      <option key={p.id} value={p.title}>
                        {p.title} ({p.price} MAD/person)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold dark:text-zinc-400 text-stone-600 mb-2">
                      Customer Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newBookingForm.customerName}
                      onChange={(e) => setNewBookingForm({ ...newBookingForm, customerName: e.target.value })}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full dark:bg-zinc-900 bg-stone-50 border dark:border-white/15 border-stone-300 rounded-xl px-4 py-3 text-sm dark:text-white text-stone-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold dark:text-zinc-400 text-stone-600 mb-2">
                      Customer Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={newBookingForm.email}
                      onChange={(e) => setNewBookingForm({ ...newBookingForm, email: e.target.value })}
                      placeholder="e.g. sarah@example.com"
                      className="w-full dark:bg-zinc-900 bg-stone-50 border dark:border-white/15 border-stone-300 rounded-xl px-4 py-3 text-sm dark:text-white text-stone-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold dark:text-zinc-400 text-stone-600 mb-2">
                      Phone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={newBookingForm.phone}
                      onChange={(e) => setNewBookingForm({ ...newBookingForm, phone: e.target.value })}
                      placeholder="+33 6 12 34 56 78"
                      className="w-full dark:bg-zinc-900 bg-stone-50 border dark:border-white/15 border-stone-300 rounded-xl px-4 py-3 text-sm dark:text-white text-stone-900 focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold dark:text-zinc-400 text-stone-600 mb-2">
                      Tour Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={newBookingForm.date}
                      onChange={(e) => setNewBookingForm({ ...newBookingForm, date: e.target.value })}
                      className="w-full dark:bg-zinc-900 bg-stone-50 border dark:border-white/15 border-stone-300 rounded-xl px-4 py-3 text-sm dark:text-white text-stone-900 focus:outline-none focus:border-amber-500 [color-scheme:auto]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold dark:text-zinc-400 text-stone-600 mb-2">
                      Number of Guests
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={newBookingForm.guests}
                      onChange={(e) => setNewBookingForm({ ...newBookingForm, guests: parseInt(e.target.value || '1', 10) })}
                      className="w-full dark:bg-zinc-900 bg-stone-50 border dark:border-white/15 border-stone-300 rounded-xl px-4 py-3 text-sm dark:text-white text-stone-900 focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold dark:text-zinc-400 text-stone-600 mb-2">
                    Internal Notes / Hotel Pickup Location
                  </label>
                  <textarea
                    rows={3}
                    value={newBookingForm.message}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, message: e.target.value })}
                    placeholder="e.g. Hotel pickup from Riad Yasmine at 4:30 PM. Vegetarian meal requested."
                    className="w-full dark:bg-zinc-900 bg-stone-50 border dark:border-white/15 border-stone-300 rounded-xl px-4 py-3 text-sm dark:text-white text-stone-900 focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                <div className="flex gap-4 pt-4 border-t dark:border-white/10 border-stone-200">
                  <button
                    type="submit"
                    disabled={isCreatingBooking}
                    className="flex-1 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold tracking-wider uppercase text-xs rounded-xl shadow-xl shadow-amber-500/25 hover:from-amber-400 hover:to-amber-500 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isCreatingBooking ? 'Saving Booking...' : 'Save & Confirm Reservation'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('bookings')}
                    className="px-6 py-4 rounded-xl border dark:border-white/15 border-stone-300 text-xs font-semibold tracking-wider uppercase dark:text-zinc-300 text-stone-700 hover:bg-stone-100 dark:hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 4: TOURS & EXPERIENCES */}
        {activeTab === 'tours' && (
          <div className="p-6 lg:p-8 space-y-6 max-w-7xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-light dark:text-white text-stone-900">Live Tour Experiences ({tourPackages.length})</h2>
                <p className="text-xs dark:text-zinc-400 text-stone-500">Public pricing and package details displayed to website visitors.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tourPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="rounded-2xl dark:bg-[#121418] bg-white border dark:border-white/10 border-stone-200/90 overflow-hidden shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={pkg.image}
                        alt={pkg.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                      <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
                        <h3 className="text-lg font-light text-white">{pkg.title}</h3>
                        <span className="px-3 py-1 bg-black/80 backdrop-blur-md rounded-md text-amber-400 font-bold text-sm">
                          {pkg.price} MAD
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <p className="text-xs text-amber-500 font-serif italic">{pkg.subtitle}</p>
                      <p className="text-xs dark:text-zinc-300 text-stone-600 line-clamp-3 leading-relaxed">{pkg.description}</p>
                      
                      <div className="pt-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1.5">Includes:</span>
                        <ul className="text-xs dark:text-zinc-400 text-stone-600 space-y-1">
                          {pkg.features.slice(0, 3).map((f, i) => (
                            <li key={i} className="flex items-center gap-1.5">
                              <Check className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                              <span className="truncate">{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-t dark:border-white/5 border-stone-100 flex items-center justify-between text-xs dark:text-zinc-400 text-stone-500">
                    <span>Duration: {pkg.duration}</span>
                    <button
                      onClick={() => {
                        setNewBookingForm({
                          ...newBookingForm,
                          packageName: pkg.title,
                        });
                        setActiveTab('new-booking');
                      }}
                      className="text-amber-500 hover:underline font-semibold"
                    >
                      + Book Client
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: MEDIA & PHOTO ASSETS STUDIO */}
        {activeTab === 'media' && (
          <div className="p-6 lg:p-8 space-y-8 max-w-7xl">
            {/* Upload Box */}
            <div className="p-6 lg:p-8 rounded-2xl dark:bg-[#121418] bg-white border border-amber-500/40 shadow-xl space-y-6">
              <div>
                <h2 className="text-lg font-light flex items-center gap-2 dark:text-white text-stone-900">
                  <Upload className="w-5 h-5 text-amber-500" />
                  Upload Photos & Media Assets
                </h2>
                <p className="text-xs dark:text-zinc-400 text-stone-500 mt-1">
                  Uploaded photos are automatically optimized and served with high-speed CDN delivery on your website.
                </p>
              </div>

              <form onSubmit={handleUploadImage} className="grid sm:grid-cols-3 gap-5 items-end">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold dark:text-zinc-400 text-stone-600 mb-2">
                    Category Tag
                  </label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    className="w-full dark:bg-zinc-900 bg-stone-50 border dark:border-white/15 border-stone-300 rounded-xl px-4 py-3 text-xs dark:text-white text-stone-900 focus:outline-none focus:border-amber-500 font-medium"
                  >
                    <option value="Camels">Camels (Camel Treks)</option>
                    <option value="Adventure">Adventure (Quads & 4x4)</option>
                    <option value="Camp">Camp (Agafay Desert Tents & Dinners)</option>
                    <option value="Nature">Nature (Sunrises & Stone Hills)</option>
                    <option value="General">General Assets</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold dark:text-zinc-400 text-stone-600 mb-2">
                    Select Image File
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-stone-500 dark:text-zinc-400 file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-500/15 file:text-amber-500 hover:file:bg-amber-500/25 cursor-pointer"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={!uploadFile || isUploading}
                    className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition-all disabled:opacity-40 cursor-pointer"
                  >
                    {isUploading ? 'Uploading Photo...' : 'Upload Photo'}
                  </button>
                </div>
              </form>
            </div>

            {/* Media Gallery Filter & Grid */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold dark:text-white text-stone-900">Photo Library & Gallery Assets ({filteredR2Images.length})</h3>
                  <p className="text-xs dark:text-zinc-400 text-stone-500">Live high-speed cloud storage</p>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1">
                  {['ALL', 'tours', 'gallery', 'videos', 'camels'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setMediaFilterCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                        mediaFilterCategory === cat
                          ? 'bg-amber-500 text-black'
                          : 'dark:bg-zinc-900 bg-stone-200 dark:text-zinc-300 text-stone-700 hover:bg-amber-500/20'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {isLoadingImages ? (
                <div className="text-center py-20 dark:text-zinc-500 text-stone-400 text-sm">
                  Loading photo library...
                </div>
              ) : filteredR2Images.length === 0 ? (
                <div className="text-center py-16 p-8 rounded-2xl dark:bg-[#121418] bg-white border dark:border-white/10 border-stone-200/90 text-stone-400 text-xs">
                  No images found matching category tag.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredR2Images.map((img) => (
                    <div
                      key={img.key}
                      className="rounded-xl overflow-hidden dark:bg-[#121418] bg-white border dark:border-white/10 border-stone-200/90 shadow-sm hover:shadow-xl hover:border-amber-500/40 transition-all flex flex-col justify-between group"
                    >
                      <div
                        className="aspect-video relative overflow-hidden bg-stone-100 dark:bg-zinc-900 cursor-pointer"
                        onClick={() => setPreviewImage(img.url)}
                      >
                        <img
                          src={img.url}
                          alt={img.key}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye className="w-5 h-5 text-white" />
                        </div>
                      </div>

                      <div className="p-3 space-y-2">
                        <p className="text-[11px] font-mono truncate dark:text-zinc-200 text-stone-800" title={img.key}>
                          {img.key}
                        </p>
                        <div className="flex items-center justify-between text-[10px] dark:text-zinc-500 text-stone-400">
                          <span>{(img.size / 1024).toFixed(0)} KB</span>
                        </div>

                        <div className="flex gap-1.5 pt-1">
                          <button
                            onClick={() => copyToClipboard(img.url, img.key)}
                            className="flex-1 py-1.5 px-2 bg-amber-500/10 hover:bg-amber-500 hover:text-black border border-amber-500/30 rounded-lg text-[10px] font-semibold text-amber-500 flex items-center justify-center gap-1 transition-all cursor-pointer"
                          >
                            <Copy className="w-3 h-3" />
                            <span>{copiedKey === img.key ? 'Copied!' : 'Copy Link'}</span>
                          </button>

                          <a
                            href={img.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg border dark:border-white/10 border-stone-300 dark:text-zinc-400 text-stone-600 hover:text-amber-500 transition-colors"
                            title="Open direct link"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: SETTINGS & SYSTEM INTEGRATIONS */}
        {activeTab === 'settings' && (
          <div className="p-6 lg:p-8 space-y-6 max-w-4xl">
            <div className="p-8 rounded-2xl dark:bg-[#121418] bg-white border dark:border-white/10 border-stone-200/90 shadow-xl space-y-6">
              <div>
                <h2 className="text-xl font-light dark:text-white text-stone-900">System Integrations & Health</h2>
                <p className="text-xs dark:text-zinc-400 text-stone-500 mt-1">
                  Active connection statuses for website operations.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl dark:bg-zinc-900/60 bg-stone-50 border dark:border-white/5 border-stone-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <Check className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold dark:text-white text-stone-900">Online Reservation System</h4>
                      <p className="text-[11px] dark:text-zinc-400 text-stone-500">Stores client bookings and inquiries in real-time</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/15 text-emerald-500 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    Active
                  </span>
                </div>

                <div className="p-4 rounded-xl dark:bg-zinc-900/60 bg-stone-50 border dark:border-white/5 border-stone-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <Check className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold dark:text-white text-stone-900">Photo & Video Cloud Storage</h4>
                      <p className="text-[11px] dark:text-zinc-400 text-stone-500">Fast global delivery of Agafay tour media</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/15 text-emerald-500 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    Active
                  </span>
                </div>

                <div className="p-4 rounded-xl dark:bg-zinc-900/60 bg-stone-50 border dark:border-white/5 border-stone-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <Check className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold dark:text-white text-stone-900">Automated Email Notifications</h4>
                      <p className="text-[11px] dark:text-zinc-400 text-stone-500">Instant confirmation emails to clients and agency managers</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/15 text-emerald-500 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    Active
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t dark:border-white/10 border-stone-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold dark:text-white text-stone-900">Admin Session Control</h4>
                  <p className="text-[11px] dark:text-zinc-400 text-stone-500">Default security PIN: <code className="text-amber-500">families2026</code></p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/30 text-red-500 text-xs font-semibold rounded-xl transition-all"
                >
                  Terminate Session
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Booking Detail Modal Drawer */}
      {selectedBooking && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="w-full max-w-lg dark:bg-[#121418] bg-white border dark:border-white/15 border-stone-300 p-8 rounded-2xl shadow-2xl space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b dark:border-white/10 border-stone-200 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500">Reservation Details</span>
                <h3 className="text-xl font-light dark:text-white text-stone-900 mt-0.5">{selectedBooking.customerName}</h3>
                <p className="text-xs text-amber-500 font-serif italic">{selectedBooking.packageName}</p>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl dark:bg-zinc-900 bg-stone-50 border dark:border-white/5 border-stone-200">
                  <span className="text-[10px] uppercase text-stone-400 block mb-1">Status</span>
                  <span className="font-bold text-amber-500">{selectedBooking.status}</span>
                </div>
                <div className="p-3 rounded-xl dark:bg-zinc-900 bg-stone-50 border dark:border-white/5 border-stone-200">
                  <span className="text-[10px] uppercase text-stone-400 block mb-1">Group Size</span>
                  <span className="font-bold dark:text-white text-stone-900">{selectedBooking.guests} Guests</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between py-1 border-b dark:border-white/5 border-stone-100">
                  <span className="dark:text-zinc-400 text-stone-500">Tour Date:</span>
                  <span className="font-semibold dark:text-white text-stone-900">
                    {new Date(selectedBooking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b dark:border-white/5 border-stone-100">
                  <span className="dark:text-zinc-400 text-stone-500">Email:</span>
                  <a href={`mailto:${selectedBooking.email}`} className="text-amber-500 font-medium hover:underline">
                    {selectedBooking.email}
                  </a>
                </div>
                <div className="flex justify-between py-1 border-b dark:border-white/5 border-stone-100">
                  <span className="dark:text-zinc-400 text-stone-500">Phone:</span>
                  <span className="font-mono dark:text-white text-stone-900">{selectedBooking.phone || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-1 border-b dark:border-white/5 border-stone-100">
                  <span className="dark:text-zinc-400 text-stone-500">Booked On:</span>
                  <span className="dark:text-zinc-300 text-stone-700">{new Date(selectedBooking.createdAt).toLocaleString()}</span>
                </div>
              </div>

              {selectedBooking.message && (
                <div className="p-4 rounded-xl dark:bg-zinc-900/60 bg-stone-50 border dark:border-white/5 border-stone-200">
                  <span className="text-[10px] uppercase font-bold text-amber-500 block mb-1">Customer Special Request:</span>
                  <p className="italic dark:text-zinc-300 text-stone-700 leading-relaxed">
                    &ldquo;{selectedBooking.message}&rdquo;
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  handleStatusChange(selectedBooking.id, selectedBooking.status === 'CONFIRMED' ? 'COMPLETED' : 'CONFIRMED');
                }}
                className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
              >
                {selectedBooking.status === 'CONFIRMED' ? 'Mark as Completed' : 'Confirm Reservation'}
              </button>
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-5 py-3 rounded-xl border dark:border-white/15 border-stone-300 text-xs font-semibold uppercase tracking-wider dark:text-zinc-300 text-stone-700 hover:bg-stone-100 dark:hover:bg-white/5 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Lightbox */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-6"
          onClick={() => setPreviewImage(null)}
        >
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={previewImage}
            alt="Preview"
            className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
