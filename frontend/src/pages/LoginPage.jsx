import { useState, useContext } from 'react';
import { Link , useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { CheckCircle2, Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';

const inputClass =
  'h-11 w-full rounded-lg bg-surface-container-lowest pl-10 text-on-surface shadow-sm transition-colors placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container';
const normalRing = 'ring-1 ring-outline-variant/60';
const errorRing = 'ring-2 ring-error';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthLoading } = useContext(AuthContext);

  const validateForm = () => {
    const nextErrors = {};
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      nextErrors.email = 'Vui lòng nhập email';
    } else if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      nextErrors.email = 'Email không đúng định dạng';
    }

    if (!password) {
      nextErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (password.length < 8) {
      nextErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if(isAuthLoading) return;

    if (isSubmitting || !validateForm()) {
      if (!isSubmitting) {
        toast.error('Vui lòng kiểm tra lại thông tin đăng nhập');
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const dataLogin = {
        email: email.trim(),
        password
      };

      // console.log(dataLogin);

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataLogin),
        credentials: 'include'
      });

      const result = await response.json().catch(() => null);
      
      // console.log("Data sau khi login:\n", result.data);

      if (!response.ok) {
        throw new Error(
          result?.error?.message || 'Đăng nhập thất bại'
        );
      }

      login(result.data); // lưu thông tin user vào AuthContext

      toast.success('Đăng nhập thành công');
      navigate('/todos');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8">
      <div className="flex w-full max-w-[420px] flex-col gap-4">
        <div className="rounded-lg bg-surface-container-lowest p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex flex-col gap-1 text-center sm:text-left">
            <div className="mb-1 inline-flex items-center gap-1 self-center sm:self-start">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-container text-on-primary shadow-sm">
                <CheckCircle2 size={16} />
              </span>
              <span className="font-medium text-secondary">Tập trung &amp; Hiệu quả</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-on-surface">Đăng nhập</h1>
            <p className="text-on-surface-variant">Chào mừng bạn quay trở lại với Todo App</p>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col gap-1">
              <label className="font-medium text-on-surface" htmlFor="login-email">Email</label>
              <div className="relative flex items-center">
                <Mail size={18} className="pointer-events-none absolute left-3 text-secondary" />
                <input
                  className={`${inputClass} pr-3 ${errors.email ? errorRing : normalRing}`}
                  type="email"
                  name="email"
                  id="login-email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="vidu@congty.com"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'login-email-error' : undefined}
                />
              </div>
              {errors.email && (
                <p id="login-email-error" className="mt-1 text-xs text-error">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-medium text-on-surface" htmlFor="login-password">Mật khẩu</label>
              <div className="relative flex items-center">
                <Lock size={18} className="pointer-events-none absolute left-3 text-secondary" />
                <input
                  className={`${inputClass} pr-10 ${errors.password ? errorRing : normalRing}`}
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  id="login-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? 'login-password-error' : undefined}
                />
                <button
                  className="absolute right-2.5 flex items-center justify-center rounded p-1 text-secondary transition-colors hover:text-on-surface"
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p id="login-password-error" className="mt-1 text-xs text-error">
                  {errors.password}
                </p>
              )}
            </div>

            <button
              className="mt-1 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary-container font-medium text-on-primary shadow-sm transition-all hover:bg-primary active:scale-[0.99] disabled:cursor-wait disabled:opacity-65"
              type="submit"
              disabled={isSubmitting || isAuthLoading}
            >
              {isSubmitting && <Loader2 size={18} className="animate-spin" />}
              <span>{isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}</span>
            </button>
          </form>

          <p className="mt-6 pt-4 text-center text-on-surface-variant">
            Chưa có tài khoản?
            <Link className="ml-1 font-medium text-primary hover:underline" to="/register">
              Đăng ký ngay
            </Link>
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs font-medium text-secondary">
          <ShieldCheck size={16} />
          <span>Bảo mật &amp; riêng tư</span>
        </div>
      </div>
    </main>
  );
};

