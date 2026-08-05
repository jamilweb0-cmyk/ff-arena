import toast from "react-hot-toast";

// ✅ সাকসেস টোস্ট (সবুজ গ্লো সহ)
export const showSuccess = (message) => {
  toast.success(message, {
    className: "toast-success",
  });
};

// ✅ এরর টোস্ট (লাল গ্লো সহ)
export const showError = (message) => {
  toast.error(message, {
    className: "toast-error",
  });
};

// ✅ লোডিং টোস্ট (পার্পল গ্লো সহ)
export const showLoading = (message) => {
  return toast.loading(message, {
    className: "toast-loading",
  });
};

// ✅ লোডিং টোস্ট বন্ধ করার ফাংশন
export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};