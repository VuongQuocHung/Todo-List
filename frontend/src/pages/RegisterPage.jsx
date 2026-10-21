import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { AtSign, Eye, EyeOff, IdCard, Info, KeyRound, Loader2, Lock, Mail, UserCheck, UserPlus } from 'lucide-react';

// Ô nhập lỗi → viền đỏ; bình thường → viền xám nhạt
const getInputClass = (error, paddingRight = 'pr-3') =>
  `h-10 w-full rounded-lg bg-surface-container-lowest pl-9 ${paddingRight} text-on-surface shadow-sm outline-none transition-all placeholder:text-outline focus:ring-2 focus:ring-primary-container ${
    error ? 'ring-2 ring-error' : 'ring-1 ring-outline-variant/60'
  }`;

export const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({}); // lưu lỗi riêng của từng input và hiển thị ngay bên dưới ở giao diện
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const nextErrors = {};
    const normalizedEmail = email.trim();

    if (!username.trim()) {
      nextErrors.username = 'Vui lòng nhập username';
    } else if (username.trim().length < 3) {
      nextErrors.username = 'Username phải có ít nhất 3 ký tự';
    } else if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
      nextErrors.username = 'Username chỉ được chứa chữ cái, số và dấu gạch dưới';
    }

    if (fullname.trim().length > 100) {
      nextErrors.fullname = 'Họ tên không được vượt quá 100 ký tự';
    }

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

    if (!confirmPassword) {
      nextErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting || !validateForm()) {
      if (!isSubmitting) {
        toast.error('Vui lòng kiểm tra lại thông tin đăng ký');
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          fullname: fullname.trim() || null,
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error?.message || data?.message || 'Đăng ký thất bại'
        );
      }

      toast.success('Đăng ký thành công');
      setUsername('');
      setFullname('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setErrors({});
    } catch (error) {
      toast.error(error.message || 'Không thể kết nối đến server');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-6 md:px-8">
      <div className="flex w-full max-w-[440px] flex-col gap-4">
        <div className="flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-surface-container text-primary shadow-sm">
            <UserPlus size={26} />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-on-surface">Tạo tài khoản mới</h1>
          <p className="mt-1 text-on-surface-variant">
            Bắt đầu quản lý công việc hiệu quả và tập trung hơn
          </p>
        </div>

        <div className="rounded-lg bg-surface-container-lowest p-6 shadow-sm">
          <form className="flex flex-col gap-3" onSubmit={handleSubmit} noValidate>
            <Field id="username" label="Tên người dùng" required icon={AtSign} error={errors.username}>
              <input
                className={getInputClass(errors.username)}
                type="text"
                name="username"
                id="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Ví dụ: annguyen"
                aria-invalid={Boolean(errors.username)}
                aria-describedby={errors.username ? 'username-error' : undefined}
              />
            </Field>

            <Field id="fullname" label="Họ và tên" hint="(Không bắt buộc)" icon={IdCard} error={errors.fullname}>
              <input
                className={getInputClass(errors.fullname)}
                type="text"
                name="fullname"
                id="fullname"
                value={fullname}
                onChange={(event) => setFullname(event.target.value)}
                placeholder="Ví dụ: Nguyễn Văn An"
                aria-invalid={Boolean(errors.fullname)}
                aria-describedby={errors.fullname ? 'fullname-error' : undefined}
              />
            </Field>

            <Field id="email" label="Email" required icon={Mail} error={errors.email}>
              <input
                className={getInputClass(errors.email)}
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="vidu@congty.com"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
            </Field>

            <Field id="password" label="Mật khẩu" required icon={Lock} error={errors.password}>
              <input
                className={getInputClass(errors.password, 'pr-10')}
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? 'password-error' : 'password-hint'}
              />
              <button
                className="absolute right-2.5 flex items-center justify-center rounded p-1 text-on-surface-variant transition-colors hover:text-on-surface"
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </Field>
            {!errors.password && (
              <p id="password-hint" className="-mt-2 flex items-center gap-1 text-xs text-on-surface-variant">
                <Info size={14} />
                Tối thiểu 8 ký tự
              </p>
            )}

            <Field id="confirm-password" label="Xác nhận mật khẩu" required icon={KeyRound} error={errors.confirmPassword}>
              <input
                className={getInputClass(errors.confirmPassword)}
                type="password"
                name="confirmPassword"
                id="confirm-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="••••••••"
                aria-invalid={Boolean(errors.confirmPassword)}
                aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
              />
            </Field>

            <button
              className="mt-2 flex h-11 w-full items-center justify-center gap-1 rounded-lg bg-primary-container font-medium text-on-primary shadow-sm transition-all hover:bg-primary active:scale-[0.99] disabled:cursor-wait disabled:opacity-65"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <UserCheck size={18} />}
              <span>{isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}</span>
            </button>
          </form>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-on-surface-variant">
          <span>Đã có tài khoản?</span>
          <Link className="font-medium text-primary hover:underline" to="/login">
            Đăng nhập
          </Link>
        </div>
      </div>
    </main>
  );
};

// Khung chung cho 1 ô nhập: nhãn + icon bên trái + dòng báo lỗi
const Field = ({ id, label, required, hint, icon: Icon, error, children }) => {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1 font-medium text-on-surface" htmlFor={id}>
          <span>{label}</span>
          {required && <span className="text-error">*</span>}
        </label>
        {hint && <span className="text-xs text-on-surface-variant">{hint}</span>}
      </div>
      <div className="relative flex items-center">
        <Icon size={18} className="pointer-events-none absolute left-3 text-on-surface-variant" />
        {children}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-0.5 text-xs text-error">
          {error}
        </p>
      )}
    </div>
  );
};
