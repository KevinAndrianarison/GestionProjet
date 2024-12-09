import { useState } from "react";
import AddServiceForm from "./AddServiceForm";
import DualInputField from "./DualInputField";
import InputField from "./InputField";
import SelectState from "./SelectState";
import SubmitButton from "./SubmitButton";
import { deviseData, getSymbolFromAbbreviation } from "../../../utils/deviseTest";
import SelectDevise from "./SelectDevise";
import InputClient from "./InputClient";
import Spinner from "../../Spinner"
import { postCommande } from "../../../api/postCommande";
import Overlay from "../../Overlay";

const AddOrderForm = ({ clients, onUpdateCommande, servicesData, commande, url, reset }) => {
    const [selectedClient, setSelectedClient] = useState(null);
    const [tauxJournalierMoyen, setTauxJournalierMoyen] = useState('');
    const [tva, setTva] = useState('');
    const [remise, setRemise] = useState('')
    const [newService, setNewService] = useState({ item: '', duree: '' });
    const [etat, setEtat] = useState('Brouillon');
    const [devise, setDevise] = useState(deviseData[0]?.abreveation);
    const [inputError, setInputError] = useState('');
    const [serviceEmpty, setServiceEmpty] = useState('');
    const [tauxJournalierMoyenEmpty, setTauxJournalierMoyenEmpty] = useState('');
    const [loading, setLoading] = useState(false)


    const handleAddService = () => {

        if (!(newService && newService.item && newService.duree)) {
            setServiceEmpty("Veillez remplir tout les champ de service")
            return
        }
        setServiceEmpty("")
        setNewService({ item: '', duree: '' });
        onUpdateCommande(prev => ({ ...prev, services: [...prev.services, { ...newService, id: prev.services.length + 1 }] }));
    };

    const handleInputChange = (field, value) => {
        switch (field) {
            case 'tauxJournalierMoyen':
                setTauxJournalierMoyen(value);
                onUpdateCommande(prev => ({ ...prev, taux_j_moyen: parseFloat(value ? value : "0") }));
                break;
            case 'tva':
                setTva(value);
                onUpdateCommande(prev => ({ ...prev, tva: parseFloat(value ? value : "0") }));
                break;
            case 'remise':
                setRemise(value);
                onUpdateCommande(prev => ({ ...prev, remise: parseFloat(value ? value : "0") }));
                break;
            case 'etat':
                setEtat(value);
                onUpdateCommande(prev => ({ ...prev, etat: value }));
                break;
            case 'devise':
                setDevise(value);
                onUpdateCommande(prev => ({ ...prev, devise: value }));
                break;
            default:
                break;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedClient) {
            setInputError('Veuillez sélectionner un client valide.');
            return;
        }
        setInputError('');

        if (!tauxJournalierMoyen) {
            setTauxJournalierMoyenEmpty("Veuillez ajouter un taux journalier moyen.")
            return
        }
        setTauxJournalierMoyenEmpty('');

        if (!commande.services.length) {
            setServiceEmpty('Veuillez ajouter un sevice valide minimum.');
            return
        }
        setServiceEmpty('');

        try {
            setLoading(true);
            const response = await postCommande(`${url}/api`, commande);
            reset();
            setSelectedClient(null);
            setTauxJournalierMoyen('');
            setTva('');
            setRemise('');
            setEtat('Brouillon');
            setDevise(deviseData[0]?.abreveation);           
        } catch (error) {
            console.error("Erreur lors de l'envoi de la commande :", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading && <Overlay/>}
            <form onSubmit={handleSubmit} className="min-w-[348px] p-3 flex flex-col justify-between">
                <h1 className="text-normal text-center text-lg sm:text-2xl font-medium text-gray-600 dark:text-gray-400 mb-4">
                    Ajouter une nouvelle commande
                </h1>
                <div className="flex w-full justify-between gap-2 flex-wrap">
                    <SelectDevise devise={devise} setDevise={(value => handleInputChange('devise', value))} />
                    <SelectState etat={etat} setEtat={(value) => handleInputChange('etat', value)} />
                </div>
                <InputClient clients={clients} inputError={inputError} onUpdateCommande={onUpdateCommande} setInputError={setInputError} setSelectedClient={setSelectedClient} selectedClient={selectedClient}/>
                <div className="relative w-full">
                    <InputField
                        style={`pr-6 ${tauxJournalierMoyenEmpty ? 'border-red-500' : ''}`}
                        type="number"
                        placeholder="Taux journalier moyen"
                        value={tauxJournalierMoyen}
                        onChange={e => handleInputChange('tauxJournalierMoyen', e.target.value)}
                    />
                    <p className="absolute top-7 right-2"> {getSymbolFromAbbreviation(devise)}</p>
                </div>
                {tauxJournalierMoyenEmpty && <p className="text-red-500 mt-2">{tauxJournalierMoyenEmpty}</p>}
                <DualInputField
                    label1="Tva"
                    value1={tva}
                    onChange1={e => handleInputChange('tva', e.target.value)}
                    label2="Remise"
                    value2={remise}
                    onChange2={e => handleInputChange('remise', e.target.value)}
                />
                <AddServiceForm
                    service={newService}
                    setService={setNewService}
                    onAddService={handleAddService}
                    serviceEmpty={serviceEmpty}
                    servicesData={servicesData}
                />
                {serviceEmpty && <p className="text-red-500 mt-2">{serviceEmpty}</p>}
                <SubmitButton text="Enregistrer" />
            </form>
        </>
    );
};

export default AddOrderForm;