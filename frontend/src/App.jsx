import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import './App.css';
import { Header } from './components/layout/Header.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { RegisterPage } from './pages/RegisterPage.jsx';
import { TodoApp } from './pages/TodoApp.jsx';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/todos" element={<TodoApp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster position="top-right" richColors closeButton />
    </>
  );
}

export default App;

