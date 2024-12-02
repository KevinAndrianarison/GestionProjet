import { useState } from 'react';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';

const ModalFactureIn = () => {
  const [numero, setNumero] = useState('');
  const [montant_ht, setMontantHT] = useState('');
  const [montant_ttc, setMontantTTC] = useState('');
  const [prix_tva, setPrixTVA] = useState('');
  const [pourcentage_tva, setPourcentageTVA] = useState('');
  const [date_facturation, setDateFacturation] = useState('');
  const [date_enregistrement, setDateEnregistrement] = useState('');
  const [type_assigner, setTypeAssigner] = useState('');
  const [validation, setValidation] = useState('');
  const [piece_jointe, setPieceJointe] = useState('');
  const [errorMessage, setErrorMessage] = useState("");

  const resetFactureFields = () => {
    setNumero('');
    setMontantHT('');
    setMontantTTC('');
    setPrixTVA('');
    setPourcentageTVA('');
    setDateFacturation('');
    setDateEnregistrement('');
    setTypeAssigner('');
    setValidation('');
    setPieceJointe('');
  };

  const handleAddFacture = () => {
    setErrorMessage('');

    const newFacture = {
      numero,
      montant_ht,
      montant_ttc,
      prix_tva,
      pourcentage_tva,
      date_facturation,
      date_enregistrement,
      type_assigner,
      validation,
      piece_jointe,
    };

    addFacture(newFacture);
    resetFactureFields();

    Swal.fire({
      title: 'Succès!',
      text: 'Facture ajoutée avec succès!',
      icon: 'success',
      confirmButtonText: 'OK',
    });
    onClose();
  };

  const handleClickOutside = (e) => {
    if (e.target.id === 'modal-background') {
      onClose();
      resetFactureFields();
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center ${isOpen ? 'block' : 'hidden'}`}
      onClick={handleClickOutside}
      id="modal-background">
      <div className="bg-white w-3/4 md:w-2/3 lg:w-1/2 p-8 rounded-lg shadow-lg relative">
        <button
          onClick={() => { onClose(); resetFactureFields(); }}
          className="absolute top-2 right-2 text-red-500 text-3xl mr-5">
          &times;
        </button>
        
      </div>
    </div>
  );
};



export default ModalFactureIn;
