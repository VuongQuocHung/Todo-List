import { Link, NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext.js';
import { useState, useContext } from 'react';
import { toast } from 'sonner';
import { CheckSquare, LogOut } from 'lucide-react';
import { handleError } from '../../lib/errorHandler';

// NavLink truyền isActive → đổi màu link của trang đang mở
const navLinkClass = ({ isActive }) =>
  `rounded-lg px-3 py-1.5 font-medium transition-colors ${
    isActive
      ? 'bg-surface-container-high text-on-surface'
      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
  }`;

const authLinkClass = ({ isActive }) =>
  `rounded-lg px-3 py-1.5 font-medium transition-colors ${
    isActive
      ? 'bg-primary-container text-on-primary'
      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
  }`;

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
    <header className="sticky top-0 z-50 border-b border-surface-container-high bg-surface-container-lowest/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-6">
          <Link className="group flex items-center gap-2" to="/">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-container text-on-primary shadow-sm">
              <CheckSquare size={18} />
            </span>
            <span className="text-lg font-semibold tracking-tight text-on-surface transition-colors group-hover:text-primary">
              Todo App
            </span>
          </Link>

          <nav className="hidden items-center gap-1 sm:flex" aria-label="Điều hướng chính">
            <NavLink className={navLinkClass} to="/" end>
              Trang chủ
            </NavLink>
            {user && (
              <NavLink className={navLinkClass} to="/todos">
                Công việc
              </NavLink>
            )}
          </nav>
        </div>

        {isAuthLoading ? (
          <span className="text-on-surface-variant">Đang tải...</span>
        ) : user ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary-container text-xs font-semibold text-on-secondary-container"
                aria-hidden="true"
              >
                {displayName.charAt(0).toUpperCase()}
              </span>
              <span className="hidden max-w-36 truncate font-medium text-on-surface md:inline-block">
                {displayName}
              </span>
            </div>

            <div className="hidden h-4 w-px bg-surface-container-high md:block"></div>

            <button
              className="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-error disabled:cursor-wait disabled:opacity-60"
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">
                {isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}
              </span>
            </button>
          </div>
        ) : (
          <nav className="flex items-center gap-3">
            <NavLink className={authLinkClass} to="/login">
              Đăng nhập
            </NavLink>
            <NavLink className={authLinkClass} to="/register">
              Đăng ký
            </NavLink>
          </nav>
        )}
      </div>
    </header>
  );
};
