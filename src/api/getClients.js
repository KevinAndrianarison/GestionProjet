import axios from "axios"

export async function getClients(URL_DE_L_API) {
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
  try {
    const response = await axios.get(`${URL_DE_L_API}/clients`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des clients :", error);
    throw error;
  }
}