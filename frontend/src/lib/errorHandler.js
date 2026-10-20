import { toast } from 'sonner';
import { ApiError } from '../api/httpClient';

// Tên sự kiện báo "phiên đăng nhập hết hạn"
export const UNAUTHORIZED_EVENT = 'auth:unauthorized';

const DEFAULT_MESSAGE = 'Đã xảy ra lỗi, vui lòng thử lại';

// Request bị hủy chủ động (AbortController) → không phải lỗi thật
export const isAbortError = (error) => error?.name === 'AbortError';

// Lấy câu thông báo an toàn để hiện cho người dùng
export const getErrorMessage = (error, fallback = DEFAULT_MESSAGE) => {
  return error instanceof ApiError ? error.message : fallback;
}

// Điểm xử lý lỗi duy nhất của ứng dụng
export const handleError = (error, {silent = false} = {}) => {
  if(isAbortError(error)){
    return; // bỏ qua
  }

  if (!(error instanceof ApiError)) {
    console.error(error); // lỗi lập trình → log đầy đủ để debug
  }

  if (error?.status === 401) {
    window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    toast.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại', {
      id: 'unauthorized', // nhiều request cùng 401 → chỉ hiện 1 toast
    });
    return;
  }

  if (!silent) {
    toast.error(getErrorMessage(error));
  }
}

// Lệnh để test trên dev tool -> console.log 
// const { handleError, getErrorMessage, isAbortError, UNAUTHORIZED_EVENT } = await import('/src/lib/errorHandler.js');
// const { ApiError } = await import('/src/api/httpClient.js');

// 1. Lỗi API → toast đỏ "Tiêu đề không hợp lệ"
// handleError(new ApiError('Tiêu đề không hợp lệ', { status: 400 }));

// 2. Bug JS → toast "Đã xảy ra lỗi, vui lòng thử lại" + Console in TypeError đầy đủ
// handleError(new TypeError('Cannot read properties of undefined'));

// 3. Hủy request → không có gì xảy ra
// handleError(new DOMException('aborted', 'AbortError'));

// 4. silent → không có toast
// handleError(new ApiError('Lỗi tải', { status: 500 }), { silent: true });

// 5. 401 gọi 3 lần → chỉ 1 toast "Phiên đăng nhập đã hết hạn" + sự kiện được phát
// window.addEventListener(UNAUTHORIZED_EVENT, () => console.log('Đã nhận sự kiện 401'));
// handleError(new ApiError('x', { status: 401 }));
// handleError(new ApiError('x', { status: 401 }));
// handleError(new ApiError('x', { status: 401 }));

// 6. getErrorMessage
// getErrorMessage(new ApiError('Lỗi từ server'));            // 'Lỗi từ server'
// getErrorMessage(new Error('bug'), 'Không tải được');      // 'Không tải được'
