import React from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ open, onClose, children }: ModalProps) {
  return (
    // backdrop
    <div
      onClick={onClose}
      className={`
        fixed inset-0 flex  justify-center items-center transition-colors
        ${open ? "visible bg-black/20" : "invisible"}
      `}
    >
      {/* modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          bg-yellow-950  rounded-xl shadow p-5 pb-9 transition-all
          ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}
        `}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 w-9 rounded-full  text-gray-400 bg-yellow-700  hover:bg-gray-50 hover:text-gray-600"
        >
          <p className="text-xl rounded-full ">X</p>
        </button>
        {children}
      </div>
    </div>
  );
}
