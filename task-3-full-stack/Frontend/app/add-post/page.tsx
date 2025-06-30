'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { createArticle } from '@/redux/Slices/articleSlice';
import type { AppDispatch } from '@/redux/store';
import ProtectedRoute from '@/components/common/ProtectedRoute';

interface DayOption {
  label: string;
  value: number;
}

interface ArticleFormData {
  title: string;
  content: string;
  visible_days: number[];
}

const daysOfWeek: DayOption[] = [
  { label: 'Sunday', value: 0 },
  { label: 'Monday', value: 1 },
  { label: 'Tuesday', value: 2 },
  { label: 'Wednesday', value: 3 },
  { label: 'Thursday', value: 4 },
  { label: 'Friday', value: 5 },
  { label: 'Saturday', value: 6 },
];

export default function AddPostPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [token, setToken] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [visibilityDays, setVisibilityDays] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      router.push('/login');
    } else {
      setToken(storedToken);
    }
  }, [router]);

  const handleDayToggle = (value: number) => {
    setVisibilityDays(prev =>
      prev.includes(value)
        ? prev.filter(d => d !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!token) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    const formData: ArticleFormData = {
      title,
      content,
      visible_days: visibilityDays.filter(day => typeof day === 'number'),
    };

    try {
      const resultAction = await dispatch(createArticle({
        title,
        content,
        visible_days: visibilityDays.filter(day => typeof day === 'number'),
      }));

      if (createArticle.fulfilled.match(resultAction)) {
        router.push('/my-posts');
      } else {
        setError(resultAction.payload as string);
      }
    } catch (err) {
      setError('Unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Add New Article</h1>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Content</label>
            <textarea
              className="w-full border p-2 rounded"
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Visibility Days</label>
            <div className="grid grid-cols-2 gap-2">
              {daysOfWeek.map(({ label, value }) => (
                <label key={value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={visibilityDays.includes(value)}
                    onChange={() => handleDayToggle(value)}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </ProtectedRoute>
  );
}
