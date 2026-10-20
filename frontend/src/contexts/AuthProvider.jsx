import { AuthContext } from "./AuthContext";
import { useEffect, useState } from "react";
import { request } from '../api/httpClient';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => { // Kiểm tra đăng nhập
    let ignore = false; // bỏ qua kết quả của một lời gọi API cũ khi Component đã bị gỡ bỏ (unmount) hoặc khi useEffect đã chạy sang lượt mới.
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include'
        });

        if(!response.ok){
          if(!ignore){
            setUser(null);
          }
          return;
        }

        const result = await response.json();
        // console.log("Chay vao AuthProvider:", data);
        if (!ignore) {
          setUser(result.data);
        }
      } catch {
        if (!ignore) {
          setUser(null);
        }
      } finally {
        if (!ignore) {
          setIsAuthLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      ignore = true; // đánh dấu rằng kết quả request này không còn được sử dụng
    };
  }, []);

  const login = (loggedInUser) => {
    setUser(loggedInUser);
  }

  const logout = async () => {
    await request('/api/auth/logout', { method: 'POST' }); // lỗi → ApiError, để nơi gọi xử lý

    setUser(null);
  };


  return (
    <AuthContext.Provider 
      value={{user, isAuthLoading, login, logout}}
    >
      {children}
    </AuthContext.Provider>
  )
};