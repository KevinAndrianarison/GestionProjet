import React, { useContext, useEffect, useState } from 'react';
import ModalHeader from './ModaleComponent/ModalHeader';
import OrderDetails from './ModaleComponent/OrderDetails';
import AddOrderForm from './ModaleComponent/AddOrderForm';
import { deviseData } from '../../utils/deviseTest';
import { UrlContext } from '../../contexte/useUrl';
import { getServices } from '../../api/getServices';
import { getClients } from '../../api/getClients';

function ModaleCommende({ close }) {
  const { url } = useContext(UrlContext);
  const [servicesData, setServicesData] = useState([]);
  const [clients, setClients] = useState([]);
  const [newCommande, setNewCommande] = useState({
    client: {},
    remise: 0,
    tva: 0,
    devise: deviseData[0]?.abreveation,
    taux_j_moyen: 0,
    etat: "Brouillon",
    services: [],
  });

  useEffect(() => {
    getServices(`${url}/api`)
      .then((services) => { setServicesData(services); })
      .catch((error) => {
        setServicesData([]);
        console.error("Erreur lors de la récupération des services :", error);
      });

    getClients(`${url}/api`)
      .then((clientsData) => {
        setClients(clientsData);
      })
      .catch((error) => {
        setClients([]);
        console.error("Erreur lors de la récupération des clients :", error);
      });
  }, [url]);

  const resetNewCommande = () => {
    setNewCommande({
      client: {},
      remise: 0,
      tva: 0,
      devise: deviseData[0]?.abreveation,
      taux_j_moyen: 0,
      etat: "Brouillon",
      services: [],
    });
  }

  const handleRemoveService = (index) => {
    setNewCommande(prevState => ({
      ...prevState,
      services: prevState.services.filter((_, i) => i !== index)
    }));
  };

  useEffect(() => { console.log("newCommande:", newCommande); }, [newCommande]);

  return (
    <div className="fixed top-0 left-0 w-full min-h-screen z-10 flex justify-center items-center">
      <div onClick={close} className="fixed top-0 left-0 w-full min-h-screen backdrop-blur-sm bg-gray-900 bg-opacity-50"></div>
      <div className="p-4 rounded-lg relative z-20 bg-white m-4 w-fit h-fit max-h-[90vh]">
        <ModalHeader close={close} />
        <div className="max-w-6xl mb-5 mx-auto sm:px-6 lg:px-8 max-h-[calc(100vh-20vh)] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 w-fit gap-2">
            <OrderDetails commande={newCommande} removeService={handleRemoveService}/>
            <AddOrderForm clients={clients} onUpdateCommande={setNewCommande} commande={newCommande} servicesData={servicesData} url={url} reset ={resetNewCommande}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModaleCommende;
