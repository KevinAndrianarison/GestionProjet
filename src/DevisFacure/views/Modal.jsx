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
    <div onClick={handleClickOutside}
    id="modal-background"
     className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <div className="flex items-center">
        <button onClick={onClose} className="text-red-500 text-right text-4xl ml-auto">
          &times;
        </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
