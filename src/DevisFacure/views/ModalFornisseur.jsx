import { useState } from 'react';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';

const ModalFornisseur = ({ isOpen, onClose, addFournisseur }) => {
  const [nom_societe, setNomSociete] = useState('');
  const [note, setNote] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [sexe, setSexe] = useState('');
  const [telephone, setTelephone] = useState('');
  const [site_web, setSiteWeb] = useState('');
  const [adresse, setAdresse] = useState('');
  const [ville, setVille] = useState('');
  const [pays, setPays] = useState('');
  const [numero_siren, setNumeroSiren] = useState('');
  const [type_fournisseur, setTypeFournisseur] = useState('societe');

  const handleAddFournisseur = () => {
    const newFournisseur = {
      nom_societe,
      note,
      nom,
      email,
      sexe,
      telephone,
      site_web,
      adresse,
      ville,
      pays,
      numero_siren,
      type: type_fournisseur,
    };

    addFournisseur(newFournisseur);

    // Réinitialisation des champs après ajout
    setNomSociete('');
    setNote('');
    setNom('');
    setEmail('');
    setSexe('');
    setTelephone('');
    setSiteWeb('');
    setAdresse('');
    setVille('');
    setPays('');
    setNumeroSiren('');
    setTypeFournisseur('societe');

    Swal.fire({
      title: 'Succès!',
      text: 'Fournisseur ajouté avec succès!',
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

        <h2 className="text-xl my-6">Ajouter un nouveau fournisseur</h2>
        <form className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto max-h-[65vh]">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la société</label>
            <input
              type="text"
              value={nom_societe}
              onChange={(e) => setNomSociete(e.target.value)}
              placeholder="Nom de la société"
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Nom"
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <input
              type="text"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              placeholder="Téléphone"
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
            <input
              type="text"
              value={adresse}
              onChange={(e) => setAdresse(e.target.value)}
              placeholder="Adresse"
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
            <input
              type="text"
              value={ville}
              onChange={(e) => setVille(e.target.value)}
              placeholder="Ville"
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pays</label>
            <input
              type="text"
              value={pays}
              onChange={(e) => setPays(e.target.value)}
              placeholder="Pays"
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Numéro SIREN</label>
            <input
              type="text"
              value={numero_siren}
              onChange={(e) => setNumeroSiren(e.target.value)}
              placeholder="Numéro SIREN"
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
          <div className="lg:col-span-1 mt-3">
            <button
              type="button"
              onClick={handleAddFournisseur}
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

ModalFornisseur.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  addFournisseur: PropTypes.func.isRequired,
};

export default ModalFornisseur;
