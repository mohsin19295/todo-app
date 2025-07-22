// "use client";
export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center">
      <div className="bg-[#e5e7ea] p-6 rounded-xl max-w-md w-full shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-black hover:text-black/90 text-3xl cursor-pointer"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}