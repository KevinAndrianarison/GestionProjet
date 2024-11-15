import PropTypes from 'prop-types';

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
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <button onClick={onClose} className="text-red-500 text-right text-3xl">
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

// Validation des props avec prop-types
Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired, // La prop isOpen doit être un booléen et est requise
  onClose: PropTypes.func.isRequired, // La prop onClose doit être une fonction et est requise
  children: PropTypes.node, // La prop children peut être n'importe quel élément React
};

export default Modal;
