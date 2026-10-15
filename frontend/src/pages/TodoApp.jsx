import { useState } from "react";
import { toast } from "sonner";


export const TodoApp = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [todoList, setTodoList] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    
    if(isSubmitting || !validateForm()) {
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
          description: description.trim() || null,
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

  // const handleRemove = (id) => {
  //   const todoListFilter = todoList.filter(item => item.id !== id);
  //   setTodoList(todoListFilter);
  // }

  // const handleChangeStatus = (event, id) => {
  //   const status = event.target.value;
  //   setTodoList(todoList.map(item =>
  //     item.id === id ? { ...item, status } : item
  //   ));
  // }

  // const handleEdit = (id, isEdit) => {
  //   const todoListNew = [...todoList];
  //   const itemUpdate = todoListNew.find(item => item.id === id);
  //   itemUpdate.isEdit = isEdit;
  //   setTodoList(todoListNew); 
  // }

  // const handleUpdate = (event, id) => {
  //   const content = event.target.value;
  //   const todoListNew = [...todoList];
  //   const itemUpdate = todoListNew.find(item => item.id === id);
  //   itemUpdate.content = content;
  //   setTodoList(todoListNew);
  // }


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
          <h2>Công việc vừa tạo</h2>

          {todoList.length === 0 && (
            <p>Chưa có công việc vừa tạo.</p>
          )}

          {todoList.map((item) => (
            <article key={item.id} className="todo-card">
              <h3>{item.title}</h3>

              {item.description && <p>{item.description}</p>}

              <span>
                {item.completed ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
              </span>
            </article>
          ))}
        </section>
      </main>
    </>
  )
}