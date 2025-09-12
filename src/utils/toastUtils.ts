import { toast } from "react-toastify";

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 2500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    style: {
      background: "#7c3aed",
      color: "#fff",
      fontWeight: 600,
      borderRadius: "0.75rem",
    },
    icon: false,
  });
};