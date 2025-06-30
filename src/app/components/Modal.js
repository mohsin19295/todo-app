"use client";
export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center">
      <div className="bg-light-bg text-white p-6 rounded-xl max-w-md w-full shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white hover:text-red-400 text-xl"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}