import { AuthContext } from "./AuthContext";
import { useEffect, useState } from "react";
import { request } from '../api/httpClient';
import { useNavigate } from 'react-router-dom';
import { UNAUTHORIZED_EVENT } from '../lib/errorHandler';
import { useSWRConfig } from 'swr';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const navigate = useNavigate();

  const { mutate } = useSWRConfig();


  // Xóa toàn bộ dữ liệu SWR đã cache (không tải lại) → người đăng nhập sau không thấy dữ liệu người trước
  const clearCache = () => {
    mutate(() => true, undefined, { 
      revalidate: false 
    });
  };

  useEffect(() => { // Kiểm tra đăng nhập
    // Effect bị dọn dẹp (unmount / StrictMode chạy lại) → hủy hẳn request cũ
    const controller = new AbortController();
    const checkAuth = async () => {
      try {
        const result = await request('/api/auth/me', { 
          signal: controller.signal 
        });

        if (controller.signal.aborted) {
          return;
        }

        setUser(result.data);
      } catch {
        if (controller.signal.aborted) {
          return; // request bị hủy chủ động → không phải lỗi
        }

        // 401 (chưa đăng nhập), mất mạng, server lỗi... → coi như chưa đăng nhập
        setUser(null);
      } finally {
        if (!controller.signal.aborted) {
          setIsAuthLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      controller.abort();
    };
  }, []);

    // Có API nào trả 401 (errorHandler phát sự kiện) → đăng xuất phía client và về trang đăng nhập
  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      clearCache();
      navigate('/login', { replace: true });
    };

    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);

    return () => {
      window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
    };
  }, [navigate]);


  const login = (loggedInUser) => {
    setUser(loggedInUser);
  }

  const logout = async () => {
    await request('/api/auth/logout', { method: 'POST' }); // lỗi → ApiError, để nơi gọi xử lý

    setUser(null);
    clearCache();
  };


  return (
    <AuthContext.Provider 
      value={{user, isAuthLoading, login, logout}}
    >
      {children}
    </AuthContext.Provider>
  )
};