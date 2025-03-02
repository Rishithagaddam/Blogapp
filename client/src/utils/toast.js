import { toast } from 'react-hot-toast';

export const customToast = {
  success: (message) => 
    toast.success(message, {
      style: {
        background: '#1a1a1a',
        color: '#EAEAEA',
        border: '1px solid #333',
      },
      iconTheme: {
        primary: '#FF3131',
        secondary: '#EAEAEA',
      },
    }),

  error: (message) =>
    toast.error(message, {
      style: {
        background: '#1a1a1a',
        color: '#EAEAEA',
        border: '1px solid #333',
      },
      iconTheme: {
        primary: '#FF3131',
        secondary: '#EAEAEA',
      },
    }),

  loading: (message) =>
    toast.loading(message, {
      style: {
        background: '#1a1a1a',
        color: '#EAEAEA',
        border: '1px solid #333',
      },
    }),
}; 