import { Link, NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext.js';
import { useState, useContext } from 'react';
import { toast } from 'sonner';
import { handleError } from '../../lib/errorHandler';

export const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthLoading, logout } = useContext(AuthContext);

  const [isLoggingOut, setIsLogginOut] = useState(false);

  const displayName = user?.username || user?.email || 'User';

  const handleLogout = async () => {
    if(isLoggingOut) return;

    setIsLogginOut(true);
    try {
      await logout();
      toast.success('Đăng xuất thành công');
      navigate('/');
    } catch (error){
      handleError(error);
    } finally {
      setIsLogginOut(false);
    }
  }
  
  return (
    <header className="site-header">
      <div className="home-header">
        <Link className="home-logo" to="/">
          <span className="home-logo-mark">✓</span>
          Todo App
        </Link>

        <nav
          className="home-nav"
          aria-label="Điều hướng chính"
        >
          <Link to="/">Trang chủ</Link>

          {isAuthLoading ? (
            <span>Đang tải...</span>
          ) : user ? (
            <>
              <NavLink
                className="home-todos-link"
                to="/todos"
              >
                Công việc
              </NavLink>

              <div className="header-account">
                <span
                  className="header-avatar"
                  aria-hidden="true"
                >
                  {displayName.charAt(0).toUpperCase()}
                </span>

                <span className="header-user-name">
                  {displayName}
                </span>
              </div>

              <button
                className="header-logout"
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut
                  ? 'Đang đăng xuất...'
                  : 'Đăng xuất'}
              </button>
            </>
          ) : (
            <>
              <NavLink
                className="home-login-link"
                to="/login"
              >
                Đăng nhập
              </NavLink>

              <NavLink
                className="home-register-link"
                to="/register"
              >
                Đăng ký
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};