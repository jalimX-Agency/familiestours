'use client';

import { useState, useEffect, useCallback } from 'react';
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
} from 'lucide-react';

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

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<'bookings' | 'gallery'>('bookings');

  // Bookings State
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Gallery / R2 State
  const [r2Images, setR2Images] = useState<R2Object[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [uploadCategory, setUploadCategory] = useState('Camels');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Check existing session
  useEffect(() => {
    const session = localStorage.getItem('families_admin_auth');
    if (session === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default PIN: families2026 (or any input for local admin)
    if (pinInput === 'families2026' || pinInput === 'admin' || pinInput === '2026') {
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

  // Fetch Bookings
  const fetchBookings = useCallback(async () => {
    setIsLoadingBookings(true);
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      if (data.success) {
        setBookings(data.bookings || []);
      }
    } catch (err) {
      console.error('Failed to load bookings:', err);
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
      }
    } catch (err) {
      console.error('Failed to update booking status:', err);
    }
  };

  // Delete Booking
  const handleDeleteBooking = async (id: string) => {
    if (!confirm('Are you sure you want to delete this reservation?')) return;
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setBookings((prev) => prev.filter((b) => b.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete booking:', err);
    }
  };

  // Upload to R2
  const handleUploadImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    setIsUploading(true);
    setUploadSuccess(null);

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
        setUploadSuccess(data.url);
        setUploadFile(null);
        fetchR2Images();
      } else {
        alert(data.error || 'Failed to upload image to Cloudflare R2');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Network error while uploading');
    } finally {
      setIsUploading(false);
    }
  };

  // Copy URL to clipboard
  const copyToClipboard = (url: string, key: string) => {
    navigator.clipboard.writeText(url);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Filtered Bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    const matchesSearch =
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.packageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.phone && b.phone.includes(searchQuery));
    return matchesStatus && matchesSearch;
  });

  // Calculate statistics
  const totalBookings = bookings.length;
  const pendingCount = bookings.filter((b) => b.status === 'PENDING').length;
  const confirmedCount = bookings.filter((b) => b.status === 'CONFIRMED').length;
  const totalGuests = bookings.reduce((sum, b) => sum + (b.guests || 1), 0);

  // Authentication Login Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-zinc-950 border border-amber-500/20 p-8 rounded-2xl shadow-2xl shadow-amber-500/5">
          <div className="text-center mb-8">
            <div className="w-14 h-14 border border-amber-500/40 rounded-full flex items-center justify-center mx-auto mb-4 bg-amber-500/10">
              <Lock className="w-6 h-6 text-amber-500" />
            </div>
            <h1 className="text-2xl font-light tracking-wide text-white">
              Families Tours <span className="font-serif italic text-amber-500">Admin</span>
            </h1>
            <p className="text-xs text-white/40 tracking-wider uppercase mt-1">Management Portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">
                Enter Admin PIN
              </label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter PIN (e.g. families2026)"
                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                autoFocus
              />
              {pinError && (
                <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Incorrect Admin PIN
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-medium py-3 rounded-lg text-xs uppercase tracking-wider transition-all duration-300 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Navigation */}
      <header className="border-b border-white/10 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 border border-amber-500/40 rounded-full flex items-center justify-center bg-amber-500/10">
              <span className="text-amber-500 font-serif font-bold text-lg">F</span>
            </div>
            <div>
              <h1 className="text-lg font-light tracking-wide">Families Tours</h1>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Connected to Neon & R2
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                fetchBookings();
                fetchR2Images();
              }}
              className="p-2 border border-white/10 rounded-lg hover:border-amber-500/50 hover:text-amber-500 transition-colors text-white/60 text-xs flex items-center gap-1.5 cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${(isLoadingBookings || isLoadingImages) ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 border border-red-500/20 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-zinc-950 border border-white/10 p-5 rounded-xl">
            <div className="flex justify-between items-start">
              <span className="text-xs uppercase tracking-wider text-white/40">Total Bookings</span>
              <Calendar className="w-4 h-4 text-amber-500/60" />
            </div>
            <p className="text-2xl font-light mt-2 text-white">{totalBookings}</p>
          </div>

          <div className="bg-zinc-950 border border-amber-500/30 p-5 rounded-xl bg-amber-500/5">
            <div className="flex justify-between items-start">
              <span className="text-xs uppercase tracking-wider text-amber-500/80">Pending Action</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-light mt-2 text-amber-500">{pendingCount}</p>
          </div>

          <div className="bg-zinc-950 border border-emerald-500/30 p-5 rounded-xl bg-emerald-500/5">
            <div className="flex justify-between items-start">
              <span className="text-xs uppercase tracking-wider text-emerald-400/80">Confirmed</span>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-light mt-2 text-emerald-400">{confirmedCount}</p>
          </div>

          <div className="bg-zinc-950 border border-white/10 p-5 rounded-xl">
            <div className="flex justify-between items-start">
              <span className="text-xs uppercase tracking-wider text-white/40">Total Guests</span>
              <Users className="w-4 h-4 text-purple-400/60" />
            </div>
            <p className="text-2xl font-light mt-2 text-white">{totalGuests}</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 border-b border-white/10 pb-4 mb-6">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-5 py-2.5 rounded-lg text-xs uppercase tracking-wider font-medium transition-colors cursor-pointer ${
              activeTab === 'bookings'
                ? 'bg-amber-500 text-black font-semibold'
                : 'text-white/60 hover:text-white hover:bg-zinc-900'
            }`}
          >
            📋 Reservations & Inquiries ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-5 py-2.5 rounded-lg text-xs uppercase tracking-wider font-medium transition-colors cursor-pointer ${
              activeTab === 'gallery'
                ? 'bg-amber-500 text-black font-semibold'
                : 'text-white/60 hover:text-white hover:bg-zinc-900'
            }`}
          >
            🖼️ Cloudflare R2 Media & Gallery ({r2Images.length})
          </button>
        </div>

        {/* TAB 1: BOOKINGS MANAGEMENT */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-zinc-950 p-4 rounded-xl border border-white/10">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search customer, email, package or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-white/40" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-xs uppercase tracking-wider text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Bookings List */}
            {isLoadingBookings ? (
              <div className="text-center py-20 text-white/40">Loading reservations...</div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-16 bg-zinc-950 rounded-xl border border-white/10 text-white/40">
                No reservations found matching your criteria.
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredBookings.map((b) => {
                  const cleanPhone = b.phone ? b.phone.replace(/[^0-9+]/g, '') : '';
                  const whatsappUrl = cleanPhone
                    ? `https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(
                        `Hello ${b.customerName}, this is Families Tours regarding your reservation for "${b.packageName}".`
                      )}`
                    : null;

                  return (
                    <div
                      key={b.id}
                      className="bg-zinc-950 border border-white/10 p-6 rounded-xl hover:border-white/20 transition-all duration-300"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-medium text-white">{b.customerName}</h3>
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                                b.status === 'PENDING'
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                  : b.status === 'CONFIRMED'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                  : b.status === 'COMPLETED'
                                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                                  : 'bg-red-500/10 text-red-400 border border-red-500/30'
                              }`}
                            >
                              {b.status}
                            </span>
                          </div>
                          <p className="text-amber-500 font-serif italic text-sm mt-0.5">
                            {b.packageName}
                          </p>
                        </div>

                        {/* Status Switcher & Delete */}
                        <div className="flex items-center gap-3">
                          <select
                            value={b.status}
                            onChange={(e) => handleStatusChange(b.id, e.target.value)}
                            className="bg-zinc-900 border border-white/20 rounded-lg px-3 py-1.5 text-xs text-white uppercase tracking-wider focus:outline-none focus:border-amber-500"
                          >
                            <option value="PENDING">Set Pending</option>
                            <option value="CONFIRMED">Set Confirmed</option>
                            <option value="COMPLETED">Set Completed</option>
                            <option value="CANCELLED">Set Cancelled</option>
                          </select>

                          <button
                            onClick={() => handleDeleteBooking(b.id)}
                            className="p-2 border border-red-500/20 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                            title="Delete Booking"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Details & Quick Action Buttons */}
                      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 text-xs text-white/70">
                        <div>
                          <span className="text-white/40 block mb-1">DATE & GUESTS</span>
                          <p className="font-medium text-white">
                            📅 {new Date(b.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </p>
                          <p className="text-white/60">👥 {b.guests} {b.guests === 1 ? 'Guest' : 'Guests'}</p>
                        </div>

                        <div>
                          <span className="text-white/40 block mb-1">CONTACT</span>
                          <a
                            href={`mailto:${b.email}`}
                            className="text-white hover:text-amber-400 transition-colors flex items-center gap-1"
                          >
                            <Mail className="w-3 h-3 text-amber-500" /> {b.email}
                          </a>
                          {b.phone && (
                            <a
                              href={`tel:${b.phone}`}
                              className="text-white/80 hover:text-amber-400 transition-colors flex items-center gap-1 mt-1"
                            >
                              <Phone className="w-3 h-3 text-emerald-400" /> {b.phone}
                            </a>
                          )}
                        </div>

                        <div className="sm:col-span-2">
                          <span className="text-white/40 block mb-1">SPECIAL REQUESTS / NOTES</span>
                          <p className="italic text-white/80">
                            {b.message ? `"${b.message}"` : 'No special requests specified.'}
                          </p>
                        </div>
                      </div>

                      {/* Direct WhatsApp Quick Response */}
                      {whatsappUrl && (
                        <div className="mt-4 pt-3 border-t border-white/5 flex justify-end">
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600/20 border border-emerald-500/40 hover:bg-emerald-600/30 text-emerald-400 rounded-lg text-xs font-medium transition-colors"
                          >
                            <span>💬 Reply on WhatsApp</span>
                            <ExternalLink className="w-3 h-3" />
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

        {/* TAB 2: CLOUDFLARE R2 MEDIA MANAGER */}
        {activeTab === 'gallery' && (
          <div className="space-y-8">
            {/* Upload Box */}
            <div className="bg-zinc-950 border border-amber-500/20 p-6 rounded-xl">
              <h2 className="text-lg font-light mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-amber-500" />
                Upload New Image to Cloudflare R2 (`cdn.familiestours.com`)
              </h2>

              <form onSubmit={handleUploadImage} className="grid sm:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/50 mb-2">
                    Select Category
                  </label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Camels">Camels (Camel Treks)</option>
                    <option value="Adventure">Adventure (Quads & 4x4)</option>
                    <option value="Camp">Camp (Desert Tents & Dinners)</option>
                    <option value="Nature">Nature (Sunrises & Dunes)</option>
                    <option value="General">General / Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/50 mb-2">
                    Choose Image File
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-white/60 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-500/10 file:text-amber-400 hover:file:bg-amber-500/20 cursor-pointer"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={!uploadFile || isUploading}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-medium py-2.5 rounded-lg text-xs uppercase tracking-wider transition-all disabled:opacity-40 cursor-pointer"
                  >
                    {isUploading ? 'Uploading to R2...' : 'Upload to Cloudflare R2'}
                  </button>
                </div>
              </form>

              {uploadSuccess && (
                <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs text-emerald-400 flex items-center justify-between">
                  <span>Image uploaded successfully to: {uploadSuccess}</span>
                  <button
                    onClick={() => copyToClipboard(uploadSuccess, 'uploaded')}
                    className="underline ml-4 cursor-pointer"
                  >
                    {copiedKey === 'uploaded' ? 'Copied!' : 'Copy URL'}
                  </button>
                </div>
              )}
            </div>

            {/* R2 Images Grid */}
            <div>
              <h3 className="text-sm font-light tracking-wider uppercase text-white/50 mb-4">
                Images on Cloudflare R2 ({r2Images.length})
              </h3>

              {isLoadingImages ? (
                <div className="text-center py-20 text-white/40">Loading R2 images...</div>
              ) : r2Images.length === 0 ? (
                <div className="text-center py-16 bg-zinc-950 rounded-xl border border-white/10 text-white/40">
                  No images found in your Cloudflare R2 bucket. Upload your first image above.
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {r2Images.map((img) => (
                    <div
                      key={img.key}
                      className="bg-zinc-950 border border-white/10 rounded-xl overflow-hidden group hover:border-amber-500/40 transition-colors"
                    >
                      <div className="aspect-video bg-zinc-900 relative overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img.url}
                          alt={img.key}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>

                      <div className="p-3">
                        <p className="text-[11px] text-white/80 truncate font-mono" title={img.key}>
                          {img.key}
                        </p>
                        <p className="text-[10px] text-white/40 mt-0.5">
                          Size: {(img.size / 1024).toFixed(1)} KB
                        </p>

                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => copyToClipboard(img.url, img.key)}
                            className="flex-1 py-1.5 px-2 bg-zinc-900 hover:bg-zinc-800 border border-white/10 rounded text-[10px] text-white/80 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          >
                            <Copy className="w-3 h-3" />
                            {copiedKey === img.key ? 'Copied!' : 'Copy Link'}
                          </button>

                          <a
                            href={img.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-zinc-900 hover:bg-zinc-800 border border-white/10 rounded text-white/60 hover:text-white transition-colors"
                            title="Open in new tab"
                          >
                            <ExternalLink className="w-3 h-3" />
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
      </main>
    </div>
  );
}
