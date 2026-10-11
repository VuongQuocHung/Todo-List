import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import './App.css';
import { HomePage } from './pages/HomePage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { RegisterPage } from './pages/RegisterPage.jsx';

const AuthScreen = ({ children }) => {
  return (
    <div className="auth-screen">
      <Link className="back-home-button" to="/">
        ← Trang chủ
      </Link>
      {children}
    </div>
  );
};

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/register"
          element={
            <AuthScreen>
              <RegisterPage />
            </AuthScreen>
          }
        />
        <Route
          path="/login"
          element={
            <AuthScreen>
              <LoginPage />
            </AuthScreen>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster position="top-right" richColors closeButton />
    </>
  );
}

export default App;

