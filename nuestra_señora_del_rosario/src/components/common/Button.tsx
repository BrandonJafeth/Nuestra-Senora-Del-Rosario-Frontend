
import { useToast } from '../../hooks/useToast';

const Button = () => {
  const { showToast } = useToast();

  return (
    <div className='grid gap-4 grid-col-span-1 px-2'>
      <button className='bg-emerald-400 rounded-2xl px-5 py-5' onClick={() => showToast('This is a success message!', 'success')}>
        Show Success Snackbar
      </button>
      <button className='bg-red-600 rounded-2xl px-5 py-5' onClick={() => showToast('This is an error message!', 'error')}>
        Show Error Snackbar
      </button>
      <button className='bg-yellow-400 rounded-2xl px-5 py-5' onClick={() => showToast('This is a warning message!', 'warning')}>
        Show Warning Snackbar
      </button>
      <button className='bg-zinc-600 rounded-2xl px-5 py-5' onClick={() => showToast('This is an info message!', 'info')}>
        Show Info Snackbar
      </button>
    </div>
  );
};

export default Button;
