import { useCallback, useRef, useState } from 'react';
import { useSWRConfig } from 'swr';
import * as todoApi from '../api/todoApi';
import { handleError } from '../lib/errorHandler';
import { TODOS_KEY } from './useTodos';

export const useTodoMutations = () => {
  const { mutate } = useSWRConfig();

  // Thao tác đang chạy: { id, action: 'update' | 'delete' } hoặc null → để giao diện khóa nút
  const [pending, setPending] = useState(null);

  // Cờ chặn bấm trùng: ref đổi NGAY, không phải chờ render lại như state
  const isPendingRef = useRef(false);

  // Làm mới MỌI danh sách todo trong cache (mọi trang, mọi tab, mọi từ khóa)
  const revalidateTodos = useCallback(() => {
    return mutate((key) => Array.isArray(key) && key[0] === TODOS_KEY);
  }, [mutate]);

  // Khung chung cho sửa / xóa: chặn trùng → gọi API → làm mới → xử lý lỗi
  const runAction = useCallback(async (id, action, callApi) => {
    if (isPendingRef.current) {
      return false;
    }

    isPendingRef.current = true;
    setPending({ id, action });

    try {
      await callApi();
      await revalidateTodos(); // giữ khóa nút tới khi danh sách mới về
      return true;
    } catch (error) {
      handleError(error);
      return false;
    } finally {
      isPendingRef.current = false;
      setPending(null);
    }
  }, [revalidateTodos]);

  const createTodo = useCallback(async (todoData) => {
    // Lỗi ném ra để TodoCreateForm tự xử lý (giữ nguyên dữ liệu đang nhập)
    const newTodo = await todoApi.createTodo(todoData);
    revalidateTodos();
    return newTodo;
  }, [revalidateTodos]);

  const updateTodo = useCallback((id, updateData) => {
    return runAction(id, 'update', () => todoApi.updateTodo(id, updateData));
  }, [runAction]);

  const deleteTodo = useCallback((id) => {
    return runAction(id, 'delete', () => todoApi.deleteTodo(id));
  }, [runAction]);

  return { pending, createTodo, updateTodo, deleteTodo };
};
