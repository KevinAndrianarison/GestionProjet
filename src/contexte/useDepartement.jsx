import axios from "axios";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { UrlContext } from "../contexte/useUrl";

const DepartementContext = createContext();

export const useDepartement = () => {
  return useContext(DepartementContext);
};

export const DepartementProvider = ({ children }) => {
  const { url } = useContext(UrlContext);
  const [departements, setDepartements] = useState([]);
  const [go, setGo] = useState(false);
  const [refresh, setRefresh] = useState(false);

  // Fonction pour récupérer les départements
  const fetchDepartements = useCallback(async () => {
    const tokenString = localStorage.getItem("token");
    const token = tokenString ? JSON.parse(tokenString) : null;

    if (!token) {
      console.warn("Token non trouvé. Veuillez vous connecter.");
      return;
    }

    try {
      const response = await axios.get(`${url}/api/departements`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data;

      if (data.length === 0 && !departements.some((d) => d.nom === "Direction")) {
        await addDepartement("Direction", null);
        await fetchDepartements();
      } else {
        setDepartements(data);
        setGo(true);
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des départements :", err);
    }
  }, [url, departements]);

  const addDepartement = async (nom, parentId) => {
    const tokenString = localStorage.getItem("token");
    const token = tokenString ? JSON.parse(tokenString) : null;

    if (!token) {
      console.warn("Token non trouvé. Veuillez vous connecter.");
      return null;
    }

    try {
      const formData = {
        nom,
        gest_r_h_departement_id: parentId,
      };

      const response = await axios.post(`${url}/api/departements`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Département ajouté :", response.data);
      setRefresh(!refresh);
      return response.data;
    } catch (err) {
      console.error("Erreur lors de l'ajout du département :", err);
      return null;
    }
  };

  useEffect(() => {
    fetchDepartements();
  }, [fetchDepartements, refresh]);

  return (
    <DepartementContext.Provider value={{ departements, go, fetchDepartements }}>
      {children}
    </DepartementContext.Provider>
  );
};
