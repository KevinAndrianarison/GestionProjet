import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ModalEditFactureIn = ({ isOpen, onClose, factureToEdit, updateFacture }) => {
  const [formData, setFormData] = useState({
    numero: '',
    montant_ht: '',
    montant_ttc: '',
    prix_tva: '',
    pourcentage_tva: '',
    date_facturation: '',
    date_enregistrement: '',
    type_assigner: '',
    validation: '',
    piece_jointe: ''
  });

  useEffect(() => {
    if (factureToEdit) {
      setFormData(factureToEdit);
    }
  }, [factureToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateFacture(formData); // Appelle la fonction de mise à jour
    onClose(); // Ferme le modal
  };

  if (!isOpen) return null;

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

    <h2 className="text-xl my-6">Modifier la facture</h2>
    <form className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto max-h-[65vh]" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Numéro</label>
        <input
          type="text"
          name="numero"
          value={formData.numero}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Montant HT</label>
        <input
          type="number"
          name="montant_ht"
          value={formData.montant_ht}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Pourcentage TVA</label>
        <input
          type="number"
          name="pourcentage_tva"
          value={formData.pourcentage_tva}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Prix TVA</label>
        <input
          type="number"
          name="prix_tva"
          value={formData.prix_tva}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Montant TTC</label>
        <input
          type="number"
          name="montant_ttc"
          value={formData.montant_ttc}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date de facturation</label>
        <input
          type="date"
          name="date_facturation"
          value={formData.date_facturation}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date d'enregistrement</label>
        <input
          type="date"
          name="date_enregistrement"
          value={formData.date_enregistrement}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Type assigné</label>
        <input
          type="text"
          name="type_assigner"
          value={formData.type_assigner}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Validation</label>
        <input
          type="text"
          name="validation"
          value={formData.validation}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Pièce jointe</label>
        <input
          type="text"
          name="piece_jointe"
          value={formData.piece_jointe}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded text-sm"
        />
      </div>
      <div className="lg:col-span-1 mt-3">
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Enregistrer
        </button>
      </div>
    </form>
  </div>
</div>

  );
};
ModalEditFactureIn.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    factureToEdit: PropTypes.func.isRequired,
    updateFacture: PropTypes.func.isRequired,
  };
export default ModalEditFactureIn;
