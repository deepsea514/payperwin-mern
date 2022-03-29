import { toast } from 'react-toastify';

const toastConfig = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'colored',
}

export const successMessage = (message) => {
    toast.success(message, toastConfig);
}

export const errorMessage = (message) => {
    toast.error(message, toastConfig);
}