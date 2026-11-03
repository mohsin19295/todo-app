export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="scrollbar-custom relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-light-border bg-[#0f2027]/90 p-6 text-white shadow-custom-shadow">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-xl leading-none text-white/80 transition hover:bg-white/20"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
