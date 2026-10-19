import { AlertCircle } from 'lucide-react';

export const TodoErrorBanner = ({message}) => {
  if(!message){
    return null;
  }

  return (
    <div className="todo-error-banner">
      <AlertCircle size={16} />
      <span>{message}</span>
    </div>
  )
}