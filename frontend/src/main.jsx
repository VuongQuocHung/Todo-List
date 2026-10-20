import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthProvider.jsx';
import { SWRConfig } from 'swr';
import { handleError, isAbortError } from './lib/errorHandler.js';

import './index.css';
import App from './App.jsx';

// Cấu hình dùng chung cho mọi useSWR trong app
const swrConfig = {
  // Mọi lỗi tải dữ liệu bằng SWR đều đi qua errorHandler.
  // silent: lỗi danh sách đã hiện bằng banner → chỉ cần xử lý 401 + log.
  onError: (error) => handleError(error, { silent: true }),

  // Tự thử lại khi lỗi mạng / lỗi server, tối đa 3 lần, chờ 2s → 4s → 6s
  onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
    if (isAbortError(error)) return; // bị hủy → không thử lại
    if (error.status >= 400 && error.status < 500) return; // lỗi 4xx thử lại cũng vô ích
    if (retryCount >= 3) return;

    setTimeout(() => revalidate({ retryCount }), 2000 * (retryCount + 1));
  },
};

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <SWRConfig value={swrConfig}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </SWRConfig>
  </BrowserRouter>
);

