import { AlertCircle } from 'lucide-react';

export const TodoErrorBanner = ({message}) => {
  if(!message){
    return null;
  }

  return (
    <div className="flex w-full items-center gap-2 rounded-lg bg-error-container px-3 py-2 text-on-error-container shadow-sm">
      <AlertCircle size={20} className="shrink-0 text-error" />
      <span>{message}</span>
    </div>
  )
}
