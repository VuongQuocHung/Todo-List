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
  if (!todo.dueDate) {
    return false;
  }

  if (todo.completed) {
    return Boolean(todo.completedDate && todo.completedDate > todo.dueDate);
  }

  const parts = vnDateFormatter.formatToParts(new Date());
  const year = parts.find((part) => part.type === 'year').value;
  const month = parts.find((part) => part.type === 'month').value;
  const day = parts.find((part) => part.type === 'day').value;
  const today = `${year}-${month}-${day}`;
  return todo.dueDate < today;
};
