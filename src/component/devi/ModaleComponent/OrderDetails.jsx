import ClientInfo from "./ClientInfo";
import DailyRate from "./DailyRate";
import ServiceList from "./ServiceList";
import StatusBadge from "./StatusBadge";
import TotalBudget from "./TotalBudget";

const OrderDetails = ({ commande, removeService }) => (
    <div className="w-full p-6 mr-2 bg-gray-100 dark:bg-gray-800 sm:rounded-lg">
        <h1 className="text-normal text-lg sm:text-2xl font-medium text-gray-600 dark:text-gray-400">
            Nouvelle commande
        </h1>
        <StatusBadge etat={commande.etat} />
        <ClientInfo client={commande.client} />
        <DailyRate taux={commande.taux_j_moyen} devise={commande.devise}/>
        <TotalBudget taux={commande.taux_j_moyen} services={commande.services} tva={commande.tva} remise={commande.remise} devise={commande.devise}/>
        <ServiceList services={commande.services} onRemoveService={removeService}/>
    </div>
);

export default OrderDetails;