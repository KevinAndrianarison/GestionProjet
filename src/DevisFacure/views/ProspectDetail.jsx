import { useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import React from 'react';
import axios from 'axios';
import { BASE_URL } from "../contextes/ApiUrls";
import { ShowContext } from "../../contexte/useShow";
import { Skeleton } from "@/components/ui/skeleton";

const ProspectDetail = () => {
  const { id } = useParams();
  const { setShowSpinner, showAdmin } = useContext(ShowContext);

  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 

  const [type_client, setTypeClient] = useState("societe");
  const [tel_societe, setTel_societe] = useState("");
  const [email_societe, setEmail_societe] = useState("");
  const [nom_societe, setNomSociete] = useState("");
  const [site_web, setSiteWeb] = useState("");
  const [numero_siren, setNumeroSiren] = useState("");
  const [numero_siret, setNumeroSiret] = useState("");
  const [affiliation_tva, setaffiliation_tva] = useState(false);
  const [numero_tva, setnumero_tva] = useState("");

  const [piece_identite, setPieceIdentite] = useState("");
  const [assurance, setAssurance] = useState("");
  const [Cabisse, setCabisse] = useState("");
  const [Contrats, setContrats] = useState("");

  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [sexe, setSexe] = useState("");
  const [telephone, setTelephone] = useState("");
  const [adresse, setAdresse] = useState("");
  const [ville, setVille] = useState(null);
  const [pays, setPays] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const tokenString = localStorage.getItem("token");
      let token = JSON.parse(tokenString);

      setIsLoading(true);

      try {
        const response = await axios.get(`${BASE_URL}clients/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          setNomSociete(response.data.nom_societe);
          setNom(response.data.nom);
          setEmail(response.data.email);
          setSexe(response.data.sexe);
          setTelephone(response.data.telephone);
          setSiteWeb(response.data.site_web);
          setAdresse(response.data.adresse);
          setPays(response.data.pays);
          setVille(response.data.ville);
          setNumeroSiren(response.data.numero_siren);
          setTypeClient(response.data.type);
          setEmail_societe(response.data.email);
          setaffiliation_tva(Boolean(response.data.affilation_tva));
          setnumero_tva(response.data.numero_tva);
          setTel_societe(response.data.tel_societe);
          setNumeroSiret(response.data.numero_siret);
          setPieceIdentite(`https://bg.societe-manage.com/public/storage/${response.data.piece_identite}`);
          setAssurance(`https://bg.societe-manage.com/public/storage/${response.data.assurance}`);
          setCabisse(`https://bg.societe-manage.com/public/storage/${response.data.cabisse}`);
          setContrats(`https://bg.societe-manage.com/public/storage/${response.data.contrats}`);

          console.log(response.data)
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données du prospect:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [refresh]);

  const handleUpload = async (e, field) => {
    const file = e.target.files[0];

    if (file) {
      console.log(file);
      const formData = new FormData();
      formData.append(field, file);
  
      try {
        const tokenString = localStorage.getItem("token");
        const token = JSON.parse(tokenString);
  
        const response = await axios.post(`${BASE_URL}clients/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-HTTP-Method-Override": "PUT",
          },
        });

        console.log(response);
  
        if (response.status === 200) {
          setRefresh(!refresh);
          if (field === "cabisse") setCabisse(`https://bg.societe-manage.com/public/storage/${response.data.Cabisse}`);
          if (field === "Assurance") setAssurance(`https://bg.societe-manage.com/public/storage/${response.data.Assurance}`);
          if (field === "piece_identite") setPieceIdentite(`https://bg.societe-manage.com/public/storage/${response.data.piece_identite}`);
          if (field === "Contrats") setContrats(`https://bg.societe-manage.com/public/storage/${response.data.Contrats}`);
        }
      } catch (error) {
        console.error("Erreur lors de l'upload :", error);
      }
    }
  };

  return (
    <>
      <h1 className='mb-4 font-bold'>Détail sur la fiche client :</h1>
      <div>
        {isLoading ? (
          <div className="w-full  border-0 mt-2">
          <div className="flex flex-col space-y-3">
            <Skeleton className="bg-gray-100 h-10 w-[90%] rounded" />
            <div className="space-y-3">
              <Skeleton className="bg-gray-100 h-5 w-[90%]" />
              <Skeleton className="h-4 w-[75%]" />
              <Skeleton className=" h-4 w-[50%]" />
            </div>
          </div>
        </div>
        ) : (
          <div className='w-full'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-3'>
              <div className='p-3 shadow-md cursor-pointer'>
                <h1 className='font-bold text-center'>Cabisse</h1>
                {Cabisse ? (
                  <>
                    {Cabisse.endsWith('.pdf') ? (
                      <embed src={Cabisse} type="application/pdf" className="w-full h-40" />
                    ) : (
                      <img src={Cabisse} alt="Cabisse" className="w-full h-40 object-cover" />
                    )}
                    <a
                      href={Cabisse}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline block mt-2"
                    >
                      Voir le fichier
                    </a>
                    <label className="text-blue-500 underline cursor-pointer">
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => handleUpload(e, "cabisse")}
                      />
                      Modifier le fichier
                    </label>
                  </>
                ) : (
                  <label className="text-blue-500 underline cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => handleUpload(e, "cabisse")}
                    />
                    Ajouter un fichier
                  </label>
                )}
              </div>


              <div className='p-3 shadow-md cursor-pointer'>
                <h1 className='font-bold text-center'>Assurance</h1>
                {assurance ? (
                  <>
                    {assurance.endsWith('.pdf') ? (
                      <embed src={assurance} type="application/pdf" className="w-full h-40" />
                    ) : (
                      <img src={assurance} alt="Assurance" className="w-full h-40 object-cover" />
                    )}
                    <a
                      href={assurance}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline block mt-2"
                    >
                      Voir le fichier
                    </a>
                    <label className="text-blue-500 underline cursor-pointer">
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => handleUpload(e, "assurance")}
                      />
                      Modifier le fichier
                    </label>
                  </>
                ) : (
                  <label className="text-blue-500 underline cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => handleUpload(e, "assurance")}
                    />
                    Ajouter un fichier
                  </label>
                )}
              </div>

              <div className='p-3 shadow-md cursor-pointer'>
                <h1 className='font-bold text-center'>Pièce Jointe</h1>
                {assurance ? (
                  <>
                    {assurance.endsWith('.pdf') ? (
                      <embed src={piece_identite} type="application/pdf" className="w-full h-40" />
                    ) : (
                      <img src={piece_identite} alt="Pièce Jointe" className="w-full h-40 object-cover" />
                    )}
                    <a
                      href={piece_identite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline block mt-2"
                    >
                      Voir le fichier
                    </a>
                    <label className="text-blue-500 underline cursor-pointer">
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => handleUpload(e, "piece_identite")}
                      />
                      Modifier le fichier
                    </label>
                  </>
                ) : (
                  <label className="text-blue-500 underline cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => handleUpload(e, "piece_identite")}
                    />
                    Ajouter un fichier
                  </label>
                )}
              </div>

              <div className='p-3 shadow-md cursor-pointer'>
                <h1 className='font-bold text-center'>Contrats</h1>
                {Contrats ? (
                  <>
                    {assurance.endsWith('.pdf') ? (
                      <embed src={Contrats} type="application/pdf" className="w-full h-40" />
                    ) : (
                      <img src={Contrats} alt="Contrats" className="w-full h-40 object-cover" />
                    )}
                    <a
                      href={Contrats}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline block mt-2"
                    >
                      Voir le fichier
                    </a>
                    <label className="text-blue-500 underline cursor-pointer">
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => handleUpload(e, "contrats")}
                      />
                      Modifier le fichier
                    </label>
                  </>
                ) : (
                  <label className="text-blue-500 underline cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => handleUpload(e, "contrats")}
                    />
                    Ajouter un fichier
                  </label>
                )}
              </div>

            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 border-l-4 border-blue-500'>
              <div className='p-3 shadow-md divide-y divide-gray-200'>
                {type_client === "societe" && (
                  <>
                    <div className="grid grid-cols-2 px-4 py-2">
                      <div className="font-normal">Nom société :</div>
                      <div>{nom_societe}</div>
                    </div>
                    <div className="grid grid-cols-2 px-4 py-2">
                      <div className="font-normal">Site Web :</div>
                      <div>{site_web}</div>
                    </div>
                    <div className="grid grid-cols-2 px-4 py-2">
                      <div className="font-normal">Email de la société :</div>
                      <div>{email_societe}</div>
                    </div>
                    <div className="grid grid-cols-2 px-4 py-2">
                      <div className="font-normal">Téléphone de la société :</div>
                      <div><a href={`tel:${tel_societe}`}>{tel_societe}</a></div>
                    </div>
                    <div className="grid grid-cols-2 px-4 py-2">
                      <div className="font-normal">Numéro Siren :</div>
                      <div>{numero_siren}</div>
                    </div>
                    <div className="grid grid-cols-2 px-4 py-2">
                      <div className="font-normal">Numéro SIRET :</div>
                      <div>{numero_siret}</div>
                    </div>

                    {affiliation_tva === true && (
                      <div className="grid grid-cols-2 px-4 py-2">
                        <div className="font-normal">Numéro TVA :</div>
                        <div>{numero_tva}</div>
                      </div>
                    )}
                  </>
                )}
                <div className="grid grid-cols-2 px-4 py-2">
                  <div className="font-normal">{type_client === "societe" ? "Nom complet du contact" : "Nom complet"} :</div>
                  <div>{nom}</div>
                </div>
                <div className="grid grid-cols-2 px-4 py-2">
                  <div className="font-normal">{type_client === "societe" ? "Email du contact" : "Adresse e-mail"} :</div>
                  <div>{email}</div>
                </div>
                <div className="grid grid-cols-2 px-4 py-2">
                  <div className="font-normal">{type_client === "societe" ? "Téléphone du contact" : "Numéro de téléphone"} :</div>
                  <div>{telephone}</div>
                </div>
                <div className="grid grid-cols-2 px-4 py-2">
                  <div className="font-normal">Genre :</div>
                  <div>{sexe}</div>
                </div>

                <div className="grid grid-cols-2 px-4 py-2">
                  <div className="font-normal">Pays :</div>
                  <div>{pays}</div>
                </div>
                <div className="grid grid-cols-2 px-4 py-2">
                  <div className="font-normal">Ville :</div>
                  <div>{ville}</div>
                </div>
                <div className="grid grid-cols-2 px-4 py-2">
                  <div className="font-normal">Adresse :</div>
                  <div>{adresse}</div>
                </div>
              </div>
              <div className='border-l-4 border-blue-500 shadow-md max-h-[700px] overflow-auto'>

              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProspectDetail;
