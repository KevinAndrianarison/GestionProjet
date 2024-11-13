// Modal.js
import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  const handleClickOutside = (e) => {
    if (e.target.id === 'modal-background') {
      onClose();
    }
  };

  return (
    <div
      onClick={handleClickOutside}
      id="modal-background"
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div className="relative bg-white rounded-lg p-6 w-full max-w-[90%] w-[700px]">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 mt-2 mr-2 bg-red-500 text-white px-2 rounded"
        >
          &times;
        </button>
        {children}
      </div>
    </div>

  );
};

export default Modal;
