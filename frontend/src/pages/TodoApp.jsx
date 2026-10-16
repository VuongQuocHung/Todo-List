import { useEffect,useState } from "react";
import { toast } from "sonner";


export const TodoApp = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [todoList, setTodoList] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [keyword, setKeyword] = useState('');
  const [dueDate, setDueDate] = useState('');

  const validateForm = () => {
    const nextErrors = {};

    if (!title.trim()) {
      nextErrors.title = 'Vui lòng nhập tiêu đề';
    } else if (title.trim().length > 200) {
      nextErrors.title = 'Tiêu đề không được vượt quá 200 ký tự';
    }

    if (description.trim().length > 2000) {
      nextErrors.description = 'Mô tả không được vượt quá 2.000 ký tự';
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleCreate = async (event) => {
    event.preventDefault(); // không reload trang
    if (isLoading || isSubmitting || !validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          dueDate: dueDate || null,
        }),
      });

      const result = await response.json().catch(() => null);
      console.log("ket qua la:",result);

      if (!response.ok) {
        throw new Error(
          result?.error?.message || 'Không tạo được công việc'
        );
      }

      setTodoList((currentList) => [result.data, ...currentList]);

      console.log(todoList);

      // sau khi tạo xong, reset form tạo
      setTitle('');
      setDescription('');
      setErrors({});
      setDueDate('');

      toast.success('Tạo công việc thành công');

    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleChangeStatus = async (id, completed) => {
    if (updatingId !== null) {
      return;
    }

    setUpdatingId(id);

    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          completed,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error?.message || 'Không cập nhật được trạng thái'
        );
      }

      setTodoList((currentList) =>
        currentList.map((item) =>
          item.id === id ? result.data : item
        )
      );

      toast.success('Cập nhật trạng thái thành công');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDueDate = (date) => {
    return date.split("-").reverse().join("/");
  }

  const vnDateFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const isOverdue = (todo) => {
    if(!todo.dueDate || todo.completed){
      return false;
    }

    const today = vnDateFormatter.format(new Date());
    return todo.dueDate < today;
  }

  const handleDelete = async (id) => {
    if (deletingId !== null) {
      return;
    }

    if (!window.confirm('Bạn muốn xóa công việc này?')) {
      return;
    }

    setDeletingId(id);

    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const result = await response.json();

        throw new Error(
          result.error?.message || 'Không xóa được công việc'
        );
      }

      setTodoList((currentList) =>
        currentList.filter((item) => item.id !== id)
      );

      toast.success('Xóa công việc thành công');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeletingId(null);
    }
  };

    useEffect(() => {
    let ignore = false;

    const loadTodos = async () => {
      try {
        const response = await fetch('/api/todos', {
          credentials: 'include',
        });

        const result = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            result.error?.message || 'Không tải được công việc'
          );
        }
        if (!ignore) {
          setTodoList(result.data);
        }
      } catch (error) {
        if (!ignore) {
          setLoadError(error.message);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadTodos();

    return () => {
      ignore = true;
    }
  }, [])

  const filteredTodos = todoList.filter((item) => {
    return item.title.toLowerCase().includes(keyword.trim().toLowerCase());
  })

  return (
    <>
      <main className="todo">
        <h1>Công việc của tôi</h1>
        <form
          className="todo-form"
          onSubmit={handleCreate}
          noValidate
        >
          <div className="register-field">
            <label htmlFor="todo-title">Tiêu đề *</label>

            <input
              id="todo-title"
              name="title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Nhập tiêu đề công việc"
              disabled={isSubmitting}
            />

            {errors.title && (
              <p className="register-field-error">
                {errors.title}
              </p>
            )}
          </div>

          <div className="register-field">
            <label htmlFor="todo-description">
              Mô tả (không bắt buộc)
            </label>
            
            <div className="register-field">
              <label htmlFor="todo-due-date">
                Hạn hoàn thành (không bắt buộc)
              </label>

              <input
                id="todo-due-date"
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <textarea
              id="todo-description"
              name="description"
              rows={4}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Nhập mô tả công việc"
              disabled={isSubmitting}
            />

            {errors.description && (
              <p className="register-field-error">
                {errors.description}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="register-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang tạo...' : 'Tạo công việc'}
          </button>
        </form>

        <section className="todo__list">
          <h2>Danh sách công việc</h2>
          <div className="register-field">
            <label htmlFor="todo-search">Tìm công việc</label>
            <input
              id="todo-search"
              type="search"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Nhập tiêu đề cần tìm..."
            />
          </div>
          {isLoading ? (
            <p>Đang tải công việc...</p>
          ) : loadError ? (
            <p role="alert">{loadError}</p>
          ) : (
            <>
              {filteredTodos.length === 0 && (
                <p>
                  {keyword.trim()
                    ? 'Không tìm thấy công việc phù hợp.'
                    : 'Chưa có công việc nào.'}
                </p>
              )}

              {filteredTodos.map((item) => (
                <article key={item.id} className="todo-card">
                  <h3>{item.title}</h3>

                  {item.description && <p>{item.description}</p>}

                  <p>
                    Hạn hoàn thành:{' '}
                    {item.dueDate ? formatDueDate(item.dueDate) : 'Chưa đặt hạn'}

                    {isOverdue(item) && (
                      <strong style={{ color: '#dc2626' }}> — Quá hạn</strong>
                    )}
                  </p>
                  <label>
                    Trạng thái:{' '}
                    <select
                      value={String(item.completed)}
                      disabled={updatingId !== null}
                      onChange={(event) =>
                        handleChangeStatus(
                          item.id,
                          event.target.value === 'true'
                        )
                      }
                    >
                      <option value="false">Chưa hoàn thành</option>
                      <option value="true">Đã hoàn thành</option>
                    </select>
                  </label>

                  {updatingId === item.id && <span> Đang lưu...</span>}

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    disabled={updatingId !== null || deletingId !== null}
                  >
                    {deletingId === item.id ? 'Đang xóa...' : 'Xóa'}
                  </button>
                </article>
              ))}
            </>
          )}
        </section>
      </main>
    </>
  )
}