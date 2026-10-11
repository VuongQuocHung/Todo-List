import { useState } from 'react';
import { toast } from 'sonner';
import '../App.css';

export const RegisterPage = () => {
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
          fullname: fullname.trim() || undefined,
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
    <main className="register-page">
      <form className="register-card" onSubmit={handleSubmit} noValidate>
        <h1>Đăng ký</h1>

        <div className="register-field">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Username"
            aria-invalid={Boolean(errors.username)}
            aria-describedby={errors.username ? 'username-error' : undefined}
          />
          {errors.username && (
            <p id="username-error" className="register-field-error">
              {errors.username}
            </p>
          )}
        </div>

        <div className="register-field">
          <label htmlFor="fullname">Họ tên (không bắt buộc)</label>
          <input
            type="text"
            name="fullname"
            id="fullname"
            value={fullname}
            onChange={(event) => setFullname(event.target.value)}
            placeholder="Họ tên"
            aria-invalid={Boolean(errors.fullname)}
            aria-describedby={errors.fullname ? 'fullname-error' : undefined}
          />
          {errors.fullname && (
            <p id="fullname-error" className="register-field-error">
              {errors.fullname}
            </p>
          )}
        </div>

        <div className="register-field">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && <p id="email-error" className="register-field-error">{errors.email}</p>}
        </div>

        <div className="register-field">
          <label htmlFor="password">Mật khẩu</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Mật khẩu"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'password-error' : undefined}
          />
          {errors.password && <p id="password-error" className="register-field-error">{errors.password}</p>}
        </div>

        <div className="register-field">
          <label htmlFor="confirm-password">Xác nhận mật khẩu</label>
          <input
            type="password"
            name="confirmPassword"
            id="confirm-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Xác nhận mật khẩu"
            aria-invalid={Boolean(errors.confirmPassword)}
            aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
          />
          {errors.confirmPassword && (
            <p id="confirm-password-error" className="register-field-error">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <button className="register-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
        </button>
      </form>
    </main>
  );
};
