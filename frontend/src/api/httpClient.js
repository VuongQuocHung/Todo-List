const DEFAULT_TIMEOUT = 10000; // 10 giây

// Mọi lỗi khi gọi API đều được chuẩn hóa về dạng này
export class ApiError extends Error {
  constructor(message, { 
    status = 0, 
    code = 'UNKNOWN_ERROR' 
  } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status; // HTTP status (0 = không nhận được phản hồi)
    this.code = code; // mã lỗi từ backend, hoặc TIMEOUT / NETWORK_ERROR
  }
}

export const request = async (url, {
  method = 'GET',
  body,
  signal, // signal để nơi gọi tự hủy request (không bắt buộc)
  timeout = DEFAULT_TIMEOUT,
} = {}) => {
  // Tự hủy request nếu quá thời gian chờ.
  // Nếu nơi gọi truyền signal riêng thì gộp cả hai: cái nào hủy trước thì request dừng.
  const timeoutSignal = AbortSignal.timeout(timeout);
  const finalSignal = signal ? AbortSignal.any([signal, timeoutSignal]): timeoutSignal;

  let response;

  try {
    response = await fetch(url, {
      method,
      credentials: 'include',
      headers: body ? { 
        'Content-Type': 'application/json' 
      } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: finalSignal,
    });
  } catch (error) {
    // fetch chỉ ném lỗi khi KHÔNG nhận được phản hồi từ server
    if(error.name === 'AbortError') {
      throw error; // bị hủy chủ động → giữ nguyên để nơi xử lý lỗi bỏ qua
    }

    if (error.name === 'TimeoutError') {
      throw new ApiError('Máy chủ phản hồi quá lâu, vui lòng thử lại', { 
        code: 'TIMEOUT' 
      });
    }

    if (error instanceof TypeError) {
      // Mất mạng / server tắt / bị CORS chặn → fetch ném TypeError
      throw new ApiError('Không kết nối được máy chủ, vui lòng kiểm tra mạng', { 
        code: 'NETWORK_ERROR' 
      });
    }

    throw error; // lỗi khác (do code sai) → ném nguyên để dễ debug
  }

  if(response.status === 204){
    return null; // // DELETE thành công không có body
  }

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    // Backend trả lỗi dạng { 
    //   error: { 
    //     code, 
    //     message 
    //   } 
    // } 
    
    throw new ApiError(result?.error?.message || 'Đã xảy ra lỗi, vui lòng thử lại', {
      status: response.status,
      code: result?.error?.code,
    });
  }

  return result;
}