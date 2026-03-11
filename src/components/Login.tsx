import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';

interface LoginProps {
  onToggleForm: () => void;
}

export default function Login({ onToggleForm }: LoginProps) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      const result = await login(formData.email, formData.password);

      if (!result.success) {
        setError(result.error || 'Invalid email or password. Please try again.');
      }
      // If success, user will be automatically logged in and redirected by AuthContext
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Clear error when user starts typing
  const handleInputChange = (field: 'email' | 'password', value: string) => {
    setFormData({ ...formData, [field]: value });
    if (error) setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/islam-makhachev.JPG')", backgroundPosition: "center 10%" }}
      />
      {/* Dark overlay so the form is readable */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-card/80 backdrop-blur-xl border border-edge rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-subtle rounded-full mb-4">
              <LogIn className="w-8 h-8 text-accent-text" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-ink-muted">Log in to track your training</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-400">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-ink-secondary mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-muted" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your@email.com"
                  required
                  autoComplete="email"
                  className="w-full bg-input border border-edge rounded-lg pl-12 pr-4 py-3 text-ink placeholder-ink-faint focus:border-accent focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink-secondary mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-muted" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="w-full bg-input border border-edge rounded-lg pl-12 pr-4 py-3 text-ink placeholder-ink-faint focus:border-accent focus:outline-none transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent-hover disabled:bg-ink-faint disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Log In
                </>
              )}
            </button>
          </form>

          {/* Toggle to Register */}
          <div className="mt-6 text-center">
            <p className="text-ink-muted">
              Don't have an account?{' '}
              <button
                onClick={onToggleForm}
                className="text-accent-text hover:text-accent font-semibold transition"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
