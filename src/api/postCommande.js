import axios from "axios";
import formatDate from "../utils/formatDate";
import Notiflix from 'notiflix';

export async function postCommande(URL_DE_L_API, newCommande) {
  const commende = {
    date: formatDate(new Date()),
    etat: newCommande.etat,
    remise: newCommande.remise ? String(newCommande.remise) : "",
    note: newCommande.note ? newCommande.note : "",
    tva: newCommande.tva ? String(newCommande.tva) : "",
    taux_j_moyen: String(newCommande.taux_j_moyen),
    gest_fac_client_id: newCommande.client.id,
    devise: newCommande.devise,
  };

  const tokenString = localStorage.getItem("token");
  let token = JSON.parse(tokenString);

  try {
    const response = await axios.post(`${URL_DE_L_API}/commandes`, commende, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const commandeId = response.data.commande.id;

    if (newCommande.services.length > 0) {
      await Promise.all(
        newCommande.services.map(service =>
          postCommandeDetaile(URL_DE_L_API, token, service, commandeId)
        )
      );
    }
    Notiflix.Notify.success(response.data.message);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'envoi de la commande :", error);
    Notiflix.Notify.failure(error.response.data.error);
    throw error;
  }
}

const postCommandeDetaile = async (URL_DE_L_API, token, service, commandeId) => {
  const commandeService = {
    dure_j: String(service.duree),
    gest_fac_commande_id: commandeId,
    gest_fact_service_id: service.item.id,
  };

  try {
    const response = await axios.post(`${URL_DE_L_API}/commandes/Services`, commandeService, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'envoi du détail du service :", error);
    throw error;
  }
};
