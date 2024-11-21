import { useState } from 'react';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';

const ModalFactureIn = ({ isOpen, onClose, addFacture }) => {
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


  const handleAddFacture = () => {
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
      piece_jointe
    };

    addFacture(newFacture);

    // Réinitialisation des champs après ajout
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
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center ${
        isOpen ? 'block' : 'hidden'
      }`}
      onClick={handleClickOutside}
      id="modal-background"
    >
      <div className="bg-white w-3/4 md:w-2/3 lg:w-1/2 p-8 rounded-lg shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-500 text-3xl mr-3"
        >
          &times;
        </button>

        <h2 className="text-xl my-6">Nouvelle facture</h2>
        <form className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto max-h-[65vh]">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de facture</label>
            <input
              type="text"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              placeholder="Numéro de facture"
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>

          <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Montant HT
      </label>
      <input
        type="text"
        value={montant_ht}
        onChange={(e) => setMontantHT(e.target.value)}
        placeholder="Montant HT"
        className="w-full p-2 border border-gray-300 rounded text-sm"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Pourcentage TVA
      </label>
      <input
        type="text"
        value={pourcentage_tva}
        onChange={(e) => setPourcentageTVA(e.target.value)}
        placeholder="Prix TVA"
        className="w-full p-2 border border-gray-300 rounded text-sm"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Prix TVA
      </label>
      <input
        type="text"
        value={prix_tva}
        onChange={(e) => setPrixTVA(e.target.value)}
        placeholder="Prix TVA"
        className="w-full p-2 border border-gray-300 rounded text-sm"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Montant TTC
      </label>
      <input
        type="text"
        value={montant_ttc}
        onChange={(e) => setMontantTTC(e.target.value)}
        placeholder="Montant TTC"
        className="w-full p-2 border border-gray-300 rounded text-sm"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Date de facturation
      </label>
      <input
        type="date"
        value={date_facturation}
        onChange={(e) => setDateFacturation(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded text-sm"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Date d'enregistrement
      </label>
      <input
        type="date"
        value={date_enregistrement}
        onChange={(e) => setDateEnregistrement(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded text-sm"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Type assigné
      </label>
      <input
        type="text"
        value={type_assigner}
        onChange={(e) => setTypeAssigner(e.target.value)}
        placeholder="Type assigné"
        className="w-full p-2 border border-gray-300 rounded text-sm"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Validation
      </label>
      <input
        type="text"
        value={validation}
        onChange={(e) => setValidation(e.target.value)}
        placeholder="Validation"
        className="w-full p-2 border border-gray-300 rounded text-sm"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Pièce jointe
      </label>
      <input
        type="text"
        value={piece_jointe}
        onChange={(e) => setPieceJointe(e.target.value)}
        placeholder="Prix TVA"
        className="w-full p-2 border border-gray-300 rounded text-sm"
      />
    </div>
          <div className="lg:col-span-1 mt-3">
            <button
              type="button"
              onClick={handleAddFacture}
              className="w-full bg-blue-500 text-white p-2 rounded text-sm hover:bg-blue-600"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

ModalFactureIn.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  addFacture: PropTypes.func.isRequired,
};

export default ModalFactureIn;
