import { useState } from "react";

const dataDemo = [
  {
    id: 1,
    content: "Công việc 1",
    status: "initial",
    isEdit: false
  },
  {
    id: 2,
    content: "Công việc 2",
    status: "initial",
    isEdit: false
  },
  {
    id: 3,
    content: "Công việc 3",
    status: "doing",
    isEdit: false
  },
  {
    id: 4,
    content: "Công việc 4",
    status: "completed",
    isEdit: false
  },
  {
    id: 5,
    content: "Công việc 5",
    status: "rejected",
    isEdit: false
  }
];


export const TodoApp = () => {
  const [todoList, setTodoList] = useState(dataDemo);

  const handleCreate = (event) => {
    event.preventDefault(); // không reload trang
    const content = event.target.content.value; // giá trị từ ô input
    if(content){
      setTodoList([
        ...todoList, 
        {
          id: Date.now(),
          content: content,
          status : 'initial'
        }
    ]);
      event.target.content.value = "";
    }
  }

  const handleRemove = (id) => {
    const todoListFilter = todoList.filter(item => item.id !== id);
    setTodoList(todoListFilter);
  }

  const handleChangeStatus = (event, id) => {
    const status = event.target.value;
    setTodoList(todoList.map(item =>
      item.id === id ? { ...item, status } : item
    ));
  }

  const handleEdit = (id, isEdit) => {
    const todoListNew = [...todoList];
    const itemUpdate = todoListNew.find(item => item.id === id);
    itemUpdate.isEdit = isEdit;
    setTodoList(todoListNew); 
  }

  const handleUpdate = (event, id) => {
    const content = event.target.value;
    const todoListNew = [...todoList];
    const itemUpdate = todoListNew.find(item => item.id === id);
    itemUpdate.content = content;
    setTodoList(todoListNew);
  }


  return (
    <>
      <div className="todo">
        <form className="todo__create" onSubmit={handleCreate}>
          <input name="content" placeholder="Nhập nội dung công việc..."/>
          <button>Tạo công việc</button>
        </form>

        <div className="todo__list">
          {todoList.map(item => (
            <div key={item.id} className={`todo__item todo__item--${item.status}`}> 
            {item.isEdit ? (
              <input defaultValue={item.content} 
              onBlur = {() => handleEdit(item.id, false)}
              onChange={(event) => handleUpdate(event, item.id)}
              />
            ) : (
              <span onClick={() => handleEdit(item.id, true)}>{item.content}</span>
            )}

              <span>
                <select defaultValue={item.status} 
                onChange={(event) => handleChangeStatus(event, item.id)}
                >
                  <option value={"initial"}>Khởi tạo</option>
                  <option value={"doing"}>Đang làm</option>
                  <option value={"completed"}>Hoàn thành</option>
                  <option value={"rejected"}>Hủy bỏ</option>
                </select>
                <button onClick={() => handleRemove(item.id)}>Xóa</button>
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}