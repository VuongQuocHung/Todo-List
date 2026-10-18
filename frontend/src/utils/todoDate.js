const vnDateFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Ho_Chi_Minh',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export const formatDueDate = (dateStr) => {
  if (!dateStr) return '';
  const clean = dateStr.slice(0, 10);
  const parts = clean.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
};

export const isOverdue = (todo) => {
  if (!todo.dueDate || todo.completed) {
    return false;
  }

  const today = vnDateFormatter.format(new Date());
  return todo.dueDate < today;
};