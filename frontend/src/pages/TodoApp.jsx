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
        }),
      });

      const result = await response.json().catch(() => null);
      console.log("ket qua la:",result);

      if (!response.ok) {
        throw new Error(result.message);
      }

      setTodoList((currentList) => [result.data, ...currentList]);

      console.log(todoList);

      setTitle('');
      setDescription('');
      setErrors({});

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

          {isLoading ? (
            <p>Đang tải công việc...</p>
          ) : loadError ? (
            <p role="alert">{loadError}</p>
          ) : (
            <>
              {todoList.length === 0 && (
                <p>Chưa có công việc nào.</p>
              )}

              {todoList.map((item) => (
                <article key={item.id} className="todo-card">
                  <h3>{item.title}</h3>

                  {item.description && <p>{item.description}</p>}

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
                </article>
              ))}
            </>
          )}
        </section>
      </main>
    </>
  )
}