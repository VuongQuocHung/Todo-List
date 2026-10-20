import { request } from './httpClient';

// Lấy danh sách công việc theo từ khóa, trang, tab lọc
// Trả về { data, pagination, stats }
export const getTodos = ({
  keyword,
  page,
  limit,
  filterTab
}, options) => {
  const params = new URLSearchParams({
    keyword,
    page: String(page),
    limit: String(limit),
    filterTab
  });

  return request(`/api/todos?${params.toString()}`, options);
}

// Tạo mới 1 công việc
export const createTodo = async (todoData, options) => {
  const result = await request('/api/todos', {
    ...options,
    method: 'POST',
    body: todoData,
  });

  return result.data;
};

// 
export const updateTodo = async (id, updateData, options) => {
  const result = await request(`/api/todos/${id}`, {
    ...options,
    method: 'PATCH',
    body: updateData,
  });

  return result.data;
}

export const deleteTodo = async (id, options) => {
  const result = await request(`/api/todos/${id}`, {
    ...options,
    method: 'DELETE',
  });

}