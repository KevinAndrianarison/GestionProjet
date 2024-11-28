import { useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import React from 'react';
import axios from 'axios';
import { BASE_URL } from "../contextes/ApiUrls";
import { ShowContext } from "../../contexte/useShow";
import { Skeleton } from "@/components/ui/skeleton";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark, faFile } from '@fortawesome/free-solid-svg-icons';
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

const FournisseurDetail = () => {
  const { id } = useParams();
  const { setShowSpinner, showAdmin } = useContext(ShowContext);

  const [refresh, setRefresh] = useState(false);
  const [refreshFournisseurFiles, setRefreshFournisseurFiles] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [IsLoadingFournisseurFiles, setIsLoadingFournisseurFiles] = useState(false);
  const [FournisseurFiles, setFournisseurFiles] = useState([]);
  const [showAddFile, setShowAddFile] = useState(false);
  const [designation_file, setDesignationFile] = useState("");
  const [fournisseur_file, setFournisseur_file] = useState(null)

  const [type_Fournisseur, setTypeFournisseur] = useState("societe");
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
  const [cabisse, setCabisse] = useState("");
  const [contrats, setContrats] = useState("");

  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [sexe, setSexe] = useState("");
  const [telephone, setTelephone] = useState("");
  const [adresse, setAdresse] = useState("");
  const [ville, setVille] = useState(null);
  const [pays, setPays] = useState(null);
  const [pdfUrl, setPdf] = useState('');


  const fetchData = async () => {
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);

    setIsLoading(true);

    try {
      const response = await axios.get(`${BASE_URL}fournisseurs/${id}`, {
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
        setTypeFournisseur(response.data.type);
        setEmail_societe(response.data.email);
        setaffiliation_tva(Boolean(response.data.affilation_tva));
        setnumero_tva(response.data.numero_tva);
        setTel_societe(response.data.tel_societe);
        setNumeroSiret(response.data.numero_siret);
        setPieceIdentite(`https://bg.societe-manage.com/public/storage/${response.data.piece_identite}`);
        setAssurance(`https://bg.societe-manage.com/public/storage/${response.data.assurance}`);
        setCabisse(`https://bg.societe-manage.com/public/storage/${response.data.cabisse}`);
        setContrats(`https://bg.societe-manage.com/public/storage/${response.data.contrats}`);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données du fournisseur", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDataFournisseurFiles = async () => {
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);

    setIsLoadingFournisseurFiles(true);
    try {
      const response = await axios.get(`${BASE_URL}fournisseurs/fournisseur-files/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setFournisseurFiles(response.data);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données du fournisseur :::::", error);
    } finally {
      setIsLoadingFournisseurFiles(false);
    }
  };

  const handleUpload = async (e, field) => {
    const file = e.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append(field, file);

      try {
        const tokenString = localStorage.getItem("token");
        const token = JSON.parse(tokenString);

        const response = await axios.post(`${BASE_URL}fournisseurs/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-HTTP-Method-Override": "PUT",
          },
        });

        if (response.status === 200) {
          setRefresh(!refresh);
          if (field === "cabisse") setCabisse(`https://bg.societe-manage.com/public/storage/${response.data.cabisse}`);
          if (field === "assurance") setAssurance(`https://bg.societe-manage.com/public/storage/${response.data.assurance}`);
          if (field === "piece_identite") setPieceIdentite(`https://bg.societe-manage.com/public/storage/${response.data.piece_identite}`);
          if (field === "contrats") setContrats(`https://bg.societe-manage.com/public/storage/${response.data.contrats}`);
          console.log(response.data);
        }
      } catch (error) {
        console.error("Erreur lors de l'upload :", error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [refresh]);

  useEffect(() => {
    fetchDataFournisseurFiles();
  }, [refreshFournisseurFiles]);

  const handleSaveFournisseurFile = async () => {
    if (!designation_file || !fournisseur_file) {
      alert("Veuillez fournir une désignation et sélectionner un fichier.");
      return;
    }

    const formData = new FormData();
    formData.append("designation", designation_file);
    formData.append("file", fournisseur_file);
    formData.append("gest_fac_founisseur_id", id);

    try {
      const tokenString = localStorage.getItem("token");
      const token = JSON.parse(tokenString);

      const response = await axios.post(`${BASE_URL}fournisseurs/fournisseur-files`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);
      if (response.status === 201) {
        alert("Fichier enregistré avec succès !");
        setRefreshFournisseurFiles(!refreshFournisseurFiles);
        setDesignationFile("");
        setFournisseur_file(null);
      } else {
        alert("Erreur lors de l'enregistrement du fichier.");
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);
      alert("Une erreur s'est produite lors de l'enregistrement.");
    }
  };

  const showPdf = (url) => {
    console.log("Afficher le PDF :", url);
    setPdf(url);
  };

  const showImg = (url) => {
    console.log("Afficher l'image :", url);
    // Code pour afficher l'image
  };

  return (
    <>
      {pdfUrl && (
        <div style={{ height: "600px" }}>
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.0.279/build/pdf.worker.min.js">
            <Viewer fileUrl={pdfUrl} />
          </Worker>
        </div>
      )}
      <h1 className='mb-4 font-bold'>Détail sur la fiche Fournisseur :</h1>
      <div className='pb-5'>
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
                {cabisse && (cabisse.endsWith('.pdf') || /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i.test(cabisse)) ? (
                  <>
                    {cabisse.endsWith('.pdf') ? (
                      <embed src={cabisse} type="application/pdf" className="w-full h-40" />
                    ) : (
                      <img src={cabisse} alt="cabisse" className="w-full h-40 object-cover" />
                    )}
                    <a
                      href={cabisse}
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
                {assurance && (assurance.endsWith('.pdf') || /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i.test(assurance)) ? (
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
                <h1 className='font-bold text-center'>Pièce d'identité</h1>
                {piece_identite && (piece_identite.endsWith('.pdf') || /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i.test(piece_identite)) ? (
                  <>
                    {piece_identite.endsWith('.pdf') ? (
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
                {contrats && (contrats.endsWith('.pdf') || /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i.test(contrats)) ? (
                  <>
                    {contrats.endsWith('.pdf') ? (
                      <embed src={contrats} type="application/pdf" className="w-full h-40" />
                    ) : (
                      <img src={contrats} alt="Contrats" className="w-full h-40 object-cover" />
                    )}
                    <a
                      href={contrats}
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
                {type_Fournisseur === "societe" && (
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
                  <div className="font-normal">{type_Fournisseur === "societe" ? "Nom complet du contact" : "Nom complet"} :</div>
                  <div>{nom}</div>
                </div>
                <div className="grid grid-cols-2 px-4 py-2">
                  <div className="font-normal">{type_Fournisseur === "societe" ? "Email du contact" : "Adresse e-mail"} :</div>
                  <div>{email}</div>
                </div>
                <div className="grid grid-cols-2 px-4 py-2">
                  <div className="font-normal">{type_Fournisseur === "societe" ? "Téléphone du contact" : "Numéro de téléphone"} :</div>
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
              <div className='border-l-4 border-blue-500 shadow-md'>
                {IsLoadingFournisseurFiles ? (
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
                  <>
                    <div className='w-full p-2 h-[400px] max-h-[500px] overflow-auto'>
                      {FournisseurFiles.length > 0 ? (
                        <div className='p-3 shadow-md divide-y divide-gray-200'>
                          {FournisseurFiles.map((FournisseurFile) => (
                            <div key={FournisseurFile.id} className="grid grid-cols-2 px-4 py-2">
                              <div
                                className='cursor-pointer hover:scale-105 transition-all'
                                onClick={() => {
                                  const fileUrl = `https://bg.societe-manage.com/public/storage/${FournisseurFile.file}`;

                                  if (FournisseurFile.file.endsWith('.pdf')) {
                                    showPdf(fileUrl);
                                  } else if (/\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i.test(FournisseurFile.file)) {
                                    showImg(fileUrl);
                                  }
                                }}
                              >
                                {FournisseurFile.designation}
                              </div>
                              <div></div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className='p-2'><i>Aucun autre fichier enregistré</i></p>
                      )}

                    </div>
                    <div className='w-full p-2'>
                      {showAddFile ? (
                        <>
                          <div className='w-full relative shadow-md'>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mt-6">
                              <div className="sm:col-span-1">
                                <input
                                  type="text"
                                  value={designation_file}
                                  onChange={(e) => setDesignationFile(e.target.value)}
                                  placeholder='Designation du fichier'
                                  className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-400 focus:outline-none"
                                />
                              </div>

                              <div className="sm:col-span-1">
                                <label className="text-blue-500 underline cursor-pointer">
                                  <input
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => setFournisseur_file(e.target.files[0])}
                                  />
                                  {fournisseur_file ? (
                                    <>
                                      <FontAwesomeIcon icon={faFile} />
                                      {` Modifier : ${fournisseur_file.name}`}
                                    </>
                                  ) : (
                                    <>
                                      <FontAwesomeIcon icon={faFile} /> Ajouter le fichier
                                    </>
                                  )}
                                </label>
                              </div>
                            </div>
                            <div className='p-2'>
                              <button className='px-2 py-1 bg-blue-400 text-white' title='Enregistrer' onClick={handleSaveFournisseurFile} disabled={!fournisseur_file}><FontAwesomeIcon icon={faCheck} /></button>
                              <button className='px-2 py-1 bg-red-400 text-white ml-2' title='Annuler' onClick={() => setShowAddFile(false)}><FontAwesomeIcon icon={faXmark} /></button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <button
                          onClick={() => setShowAddFile(true)}
                          className='bg-blue-500 px-6 py-2 text-white hover:scale-105 transition-all'
                        >
                          Ajouter un fichier
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FournisseurDetail;
