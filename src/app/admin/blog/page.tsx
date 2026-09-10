'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  RefreshCw, Plus, Pencil, Trash2, X, ArrowLeft, Eye, EyeOff, UploadCloud,
} from 'lucide-react';

interface BlogPostData {
  id: string;
  slug: string;
  locale: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  heroImage: string;
  heroImageAlt: string;
  metaTitle: string;
  metaDescription: string;
  readingTime: number;
  published: boolean;
  publishedAt: string;
  updatedAt: string;
}

const LOCALES = ['en', 'fr', 'es'] as const;
const LOCALE_LABEL: Record<string, string> = { en: 'EN', fr: 'FR', es: 'ES' };

function emptyForm(locale: string): Partial<BlogPostData> {
  return {
    slug: '',
    locale,
    title: '',
    excerpt: '',
    content: '',
    category: 'Travel Guide',
    tags: [],
    heroImage: '',
    heroImageAlt: '',
    metaTitle: '',
    metaDescription: '',
    readingTime: 5,
    published: true,
  };
}

function PostModal({
  post,
  defaultLocale,
  onClose,
  onSave,
}: {
  post: BlogPostData | null;
  defaultLocale: string;
  onClose: () => void;
  onSave: (data: Partial<BlogPostData> & { id?: string }) => Promise<void>;
}) {
  const isEditing = Boolean(post);
  const [form, setForm] = useState<Partial<BlogPostData>>(
    post ? { ...post } : emptyForm(defaultLocale)
  );
  const [tagsInput, setTagsInput] = useState((post?.tags || []).join(', '));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('category', 'blog');
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) {
        setForm((f) => ({ ...f, heroImage: data.url }));
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch {
      setError('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.slug || !form.title || !form.content) {
      setError('Slug, title, and content are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        ...form,
        id: post?.id,
        tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
      });
    } catch (err: any) {
      setError(err.message || 'Failed to save post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      <div
        className="relative z-10 w-full max-w-2xl bg-[#0f1115] border border-white/[0.08] shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06] sticky top-0 bg-[#0f1115] z-10">
          <p className="text-[15px] font-semibold text-white">{isEditing ? 'Edit Post' : 'New Blog Post'}</p>
          <button onClick={onClose} className="p-1 text-zinc-500 hover:text-zinc-100 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {error && (
            <div className="p-3 border border-red-500/40 bg-red-500/10 text-red-400 text-xs rounded">{error}</div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono tracking-widest uppercase text-zinc-500 mb-2">Locale</label>
              <select
                value={form.locale}
                onChange={(e) => setForm({ ...form, locale: e.target.value })}
                className="w-full h-9 px-3 bg-zinc-900 border border-white/10 text-zinc-200 text-sm focus:border-amber-500 outline-none"
              >
                {LOCALES.map((l) => (
                  <option key={l} value={l}>{LOCALE_LABEL[l]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-mono tracking-widest uppercase text-zinc-500 mb-2">Slug</label>
              <input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="agafay-desert-vs-sahara-desert"
                className="w-full h-9 px-3 bg-zinc-900 border border-white/10 text-zinc-200 text-sm focus:border-amber-500 outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono tracking-widest uppercase text-zinc-500 mb-2">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full h-9 px-3 bg-zinc-900 border border-white/10 text-zinc-200 text-sm focus:border-amber-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono tracking-widest uppercase text-zinc-500 mb-2">Excerpt</label>
            <textarea
              rows={2}
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className="w-full px-3 py-2 bg-zinc-900 border border-white/10 text-zinc-200 text-sm focus:border-amber-500 outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono tracking-widest uppercase text-zinc-500 mb-2">
              Content (HTML — h2/h3/p/ul/a tags)
            </label>
            <textarea
              rows={10}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full px-3 py-2 bg-zinc-900 border border-white/10 text-zinc-200 text-xs font-mono focus:border-amber-500 outline-none resize-y"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono tracking-widest uppercase text-zinc-500 mb-2">Category</label>
              <input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full h-9 px-3 bg-zinc-900 border border-white/10 text-zinc-200 text-sm focus:border-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono tracking-widest uppercase text-zinc-500 mb-2">Reading Time (min)</label>
              <input
                type="number"
                min={1}
                value={form.readingTime}
                onChange={(e) => setForm({ ...form, readingTime: parseInt(e.target.value, 10) || 5 })}
                className="w-full h-9 px-3 bg-zinc-900 border border-white/10 text-zinc-200 text-sm focus:border-amber-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono tracking-widest uppercase text-zinc-500 mb-2">Tags (comma-separated)</label>
            <input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full h-9 px-3 bg-zinc-900 border border-white/10 text-zinc-200 text-sm focus:border-amber-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono tracking-widest uppercase text-zinc-500 mb-2">Hero Image</label>
            <div className="flex items-center gap-3">
              <input
                value={form.heroImage}
                onChange={(e) => setForm({ ...form, heroImage: e.target.value })}
                placeholder="https://cdn.familiestours.com/..."
                className="flex-1 h-9 px-3 bg-zinc-900 border border-white/10 text-zinc-200 text-xs font-mono focus:border-amber-500 outline-none"
              />
              <label className="flex items-center gap-2 h-9 px-3 border border-white/10 text-zinc-400 text-xs cursor-pointer hover:border-amber-500 transition-colors">
                {isUploading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
                Upload
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => { if (e.target.files?.[0]) handleImageUpload(e.target.files[0]); }}
                />
              </label>
            </div>
            {form.heroImage && (
              <img src={form.heroImage} alt="" className="mt-3 h-24 w-full object-cover rounded border border-white/10" />
            )}
          </div>

          <div>
            <label className="block text-[10px] font-mono tracking-widest uppercase text-zinc-500 mb-2">Hero Image Alt Text</label>
            <input
              value={form.heroImageAlt}
              onChange={(e) => setForm({ ...form, heroImageAlt: e.target.value })}
              className="w-full h-9 px-3 bg-zinc-900 border border-white/10 text-zinc-200 text-sm focus:border-amber-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono tracking-widest uppercase text-zinc-500 mb-2">Meta Title (SEO)</label>
            <input
              value={form.metaTitle}
              onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
              className="w-full h-9 px-3 bg-zinc-900 border border-white/10 text-zinc-200 text-sm focus:border-amber-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono tracking-widest uppercase text-zinc-500 mb-2">
              Meta Description (SEO) — {(form.metaDescription || '').length}/160
            </label>
            <textarea
              rows={2}
              value={form.metaDescription}
              onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
              className="w-full px-3 py-2 bg-zinc-900 border border-white/10 text-zinc-200 text-sm focus:border-amber-500 outline-none resize-none"
            />
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
              className="w-4 h-4 accent-amber-500"
            />
            <span className="text-sm text-zinc-300">Published (visible on the public site)</span>
          </label>

          <div className="pt-4 border-t border-white/[0.06] flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-10 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Post'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-6 border border-white/10 text-zinc-400 text-sm hover:border-white/30 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminBlogPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [posts, setPosts] = useState<BlogPostData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [localeFilter, setLocaleFilter] = useState<'all' | 'en' | 'fr' | 'es'>('all');
  const [modalState, setModalState] = useState<{ isOpen: boolean; post: BlogPostData | null }>({
    isOpen: false,
    post: null,
  });

  useEffect(() => {
    fetch('/api/admin/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setIsAuthenticated(true);
        } else {
          router.push('/admin');
        }
      })
      .catch(() => router.push('/admin'))
      .finally(() => setIsChecking(false));
  }, [router]);

  const fetchPosts = useCallback(() => {
    setIsLoading(true);
    fetch('/api/blog')
      .then((res) => res.json())
      .then((data) => { if (data.success) setPosts(data.posts); })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchPosts();
  }, [isAuthenticated, fetchPosts]);

  const handleSave = async (data: Partial<BlogPostData> & { id?: string }) => {
    const isEdit = Boolean(data.id);
    const url = isEdit ? `/api/blog/${data.id}` : '/api/blog';
    const res = await fetch(url, {
      method: isEdit ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!result.success) throw new Error(result.error || 'Failed to save');
    setModalState({ isOpen: false, post: null });
    fetchPosts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this blog post permanently?')) return;
    const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' });
    const result = await res.json();
    if (result.success) fetchPosts();
  };

  const handleTogglePublished = async (post: BlogPostData) => {
    await fetch(`/api/blog/${post.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !post.published }),
    });
    fetchPosts();
  };

  const filteredPosts = localeFilter === 'all' ? posts : posts.filter((p) => p.locale === localeFilter);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0b0d]">
        <RefreshCw className="w-6 h-6 text-amber-500 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#0a0b0d] text-zinc-100">
      <div className="border-b border-white/[0.06] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/admin" className="p-2 text-zinc-500 hover:text-zinc-100 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </a>
          <h1 className="text-sm font-semibold tracking-wide uppercase">Blog Posts</h1>
        </div>
        <button
          onClick={() => setModalState({ isOpen: true, post: null })}
          className="flex items-center gap-2 h-9 px-4 bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Post
        </button>
      </div>

      <div className="px-6 py-4 flex gap-2 border-b border-white/[0.06]">
        {(['all', 'en', 'fr', 'es'] as const).map((l) => (
          <button
            key={l}
            onClick={() => setLocaleFilter(l)}
            className={`h-8 px-4 text-xs font-mono uppercase tracking-wide border transition-colors ${
              localeFilter === l
                ? 'border-amber-500 bg-amber-500/15 text-amber-400'
                : 'border-white/10 text-zinc-500 hover:border-white/30'
            }`}
          >
            {l === 'all' ? 'All' : LOCALE_LABEL[l]}
          </button>
        ))}
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <RefreshCw className="w-6 h-6 text-amber-500 animate-spin" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <p className="text-center text-zinc-500 py-20 text-sm">No posts yet. Click "New Post" to create one.</p>
        ) : (
          <div className="border border-white/[0.06] divide-y divide-white/[0.06]">
            {filteredPosts.map((post) => (
              <div key={post.id} className="flex items-center gap-4 px-4 py-3 hover:bg-white/[0.02] transition-colors">
                <img src={post.heroImage} alt="" className="w-14 h-10 object-cover rounded flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-zinc-100 truncate">{post.title}</p>
                  <p className="text-xs text-zinc-500 font-mono truncate">{post.slug}</p>
                </div>
                <span className="text-[10px] font-mono px-2 py-1 border border-white/10 text-zinc-400 flex-shrink-0">
                  {LOCALE_LABEL[post.locale]}
                </span>
                <span className="text-xs text-zinc-500 flex-shrink-0 hidden md:block">{post.category}</span>
                <button
                  onClick={() => handleTogglePublished(post)}
                  className={`p-1.5 flex-shrink-0 ${post.published ? 'text-emerald-500' : 'text-zinc-600'}`}
                  title={post.published ? 'Published — click to unpublish' : 'Unpublished — click to publish'}
                >
                  {post.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setModalState({ isOpen: true, post })}
                  className="p-1.5 text-zinc-500 hover:text-amber-500 flex-shrink-0 transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="p-1.5 text-zinc-500 hover:text-red-500 flex-shrink-0 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalState.isOpen && (
        <PostModal
          post={modalState.post}
          defaultLocale={localeFilter === 'all' ? 'en' : localeFilter}
          onClose={() => setModalState({ isOpen: false, post: null })}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
