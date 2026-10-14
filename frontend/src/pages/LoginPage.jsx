import { useState, useContext } from 'react';
import { Link , useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import '../App.css';
import { AuthContext } from '../contexts/AuthContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

      const data = await response.json().catch(() => null);
      
      // console.log("Data sau khi login:\n", data.data);

      if (!response.ok) {
        throw new Error(
          data?.error?.message || 'Đăng nhập thất bại'
        );
      }

      login(data.data); // lưu thông tin user vào AuthContext

      toast.success('Đăng nhập thành công');
      navigate('/todos');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <main className="register-page">
        <form className="register-card" onSubmit={handleSubmit}>
          <h1>Đăng nhập</h1>

          <div className="register-field">
            <label htmlFor="login-email">Email</label>
            <input
              type="email"
              name="email"
              id="login-email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
              required
            />
            {errors.email && (
              <p
                id="login-email-error"
                className="register-field-error"
              >
                {errors.email}
              </p>
            )}
          </div>

          <div className="register-field">
            <label htmlFor="login-password">Mật khẩu</label>
            <input
              type="password"
              name="password"
              id="login-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Mật khẩu"
              required
            />
            {errors.password && (
              <p
                id="login-password-error"
                className="register-field-error"
              >
                {errors.password}
              </p>
            )}
          </div>

         <button
          className="register-submit"
          type="submit"
          disabled={isSubmitting || isAuthLoading}
        >
          {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>

          <p className="auth-switch">
            Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
          </p>
        </form>
      </main>
    </>
  );
};

