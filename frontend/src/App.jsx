import './App.css'
import { RegisterPage } from './pages/auth/register/RegisterPage.jsx'
import { Toaster } from 'sonner'

function App() {
  return (
    <>
      <RegisterPage />
      <Toaster position="top-right" richColors closeButton />
    </>
  )
}

export default App
