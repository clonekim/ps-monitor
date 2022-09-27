import React from 'react';
import { useAlert } from '../store';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Toaster() {
  const { type, text, setText } = useAlert();

  React.useEffect(() => {
    if (text) {
      toast(text, {
        position: 'bottom-right',
        type,
        onClose: () => setText({ text: null, type: null }),
      });
    }
  }, [text]);

  return (
    <ToastContainer
      position="bottom-right"
      autoClose={['error', 'warning'].includes(type) ? null : 3000}
      hideProgressBar={true}
      newestOnTop={false}
      closeOnClick={true}
      draggable={false}
      limit={3}
    />
  );
}

export default Toaster;
