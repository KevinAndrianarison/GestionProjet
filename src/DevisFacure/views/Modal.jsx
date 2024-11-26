import PropTypes from 'prop-types';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  //const handleClickOutside = (e) => {
  //  if (e.target.id === 'modal-background') {
  //    onClose();
  //  }
  //};

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 blur-xl z-10"></div> 
      <div className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white rounded-md w-[600px] max-w-[90%] z-30">
        <div className='text-right w-full absolute top-[15px] right-[0]'><FontAwesomeIcon icon={faXmark} className=" cursor-pointer w-16 h-5 text-red-600" onClick={onClose}/></div>
        <div className='p-4 overflow-auto'>{children}</div>
      </div>
    </>
  );
};

// Validation des props avec prop-types
Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired, // La prop isOpen doit être un booléen et est requise
  onClose: PropTypes.func.isRequired, // La prop onClose doit être une fonction et est requise
  children: PropTypes.node, // La prop children peut être n'importe quel élément React
};

export default Modal;
