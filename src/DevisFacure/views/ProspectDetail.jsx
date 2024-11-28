import { useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import React from 'react';
import axios from 'axios';
import { BASE_URL } from "../contextes/ApiUrls";
import { Skeleton } from "@/components/ui/skeleton";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark, faFile, faFilePdf, faImages, faPenToSquare, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import Notiflix from 'notiflix';
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const ProspectDetail = () => {
  const { id } = useParams();

  const [refresh, setRefresh] = useState(false);
  const [refreshClientFiles, setRefreshClientFiles] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 
  const [IsLoadingClientFiles, setIsLoadingClientFiles] = useState(false);
  const [ClientFiles, setClientFiles] = useState([]);
  const [showAddFile, setShowAddFile] = useState(false);
  const [designation_file, setDesignationFile] = useState("");
  const [client_file, setClient_file] = useState(null)

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
  const [pdfUrl, setPdfurl] = useState('');
  const [ImgUrl, setImgUrl] = useState('');
  const [alt, setAlt] = useState('');


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
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données du client:", error);
      Notiflix.Notify.failure("Erreur lors de la récupération des données du client:");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDataClientFiles = async () => {
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);

    setIsLoadingClientFiles(true);
      try {
        const response = await axios.get(`${BASE_URL}clients/client-files/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          setClientFiles(response.data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données du client:", error);
        Notiflix.Notify.failure("Erreur lors de la récupération des pièces jointes du client:");
      } finally {
        setIsLoadingClientFiles(false);
      }
  };

  const DeleteFile = async (IdFile) =>{
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);

    const confirmDelete = () => {
      return new Promise((resolve) => {
        Notiflix.Confirm.show(
          'Confirmer',
          'Êtes-vous sûr de vouloir supprimer ?',
          'Oui',
          'Non',
          () => resolve(true),
          () => resolve(false)
        );
      });
    };
    const confirmed = await confirmDelete();
    if (!confirmed) {
      return;
    }

    try {
      const response = await axios.delete(`${BASE_URL}clients/client-files/${IdFile}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response) {
        setRefreshClientFiles(!refreshClientFiles);
      }
      Notiflix.Report.success(
        'Succès',
        'Fichier supprimé avec succès.',
        'Fermer'
      );
    } catch (error) {
      console.error('Erreur lors de la suppression des données :', error);
      Notiflix.Report.failure(
        'Echec',
        'Echec lors de la suppression du fichier.',
        'Fermer'
      );
    }
  }

  const handleUpload = async (e, field) => {
    const file = e.target.files[0];

    if (file) {
      if (!AllowedFile(file)) {
        return;
      }
      const formData = new FormData();
      formData.append(field, file);
      setIsLoading(true);
      try {
        const tokenString = localStorage.getItem("token");
        const token = JSON.parse(tokenString);
  
        const response = await axios.post(`${BASE_URL}clients/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-HTTP-Method-Override": "PUT",
          },
        });
  
        if (response.status === 200) {
          setRefresh(!refresh);
          Notiflix.Notify.success("Fichier mis à jour");
          if (field === "cabisse") setCabisse(`https://bg.societe-manage.com/public/storage/${response.data.Cabisse}`);
          if (field === "Assurance") setAssurance(`https://bg.societe-manage.com/public/storage/${response.data.Assurance}`);
          if (field === "piece_identite") setPieceIdentite(`https://bg.societe-manage.com/public/storage/${response.data.piece_identite}`);
          if (field === "Contrats") setContrats(`https://bg.societe-manage.com/public/storage/${response.data.Contrats}`);
        }
      } catch (error) {
        console.error("Erreur lors de l'upload :", error);
        Notiflix.Notify.failure("Erreur lors de l'upload");
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [refresh]);

  useEffect(() => {
    fetchDataClientFiles();
  }, [refreshClientFiles]);

  const AllowedFile = (file) => {
    const allowedFileTypes = /\.(pdf|jpg|jpeg|png|gif|bmp|svg|webp)$/i;
    const maxFileSize = 2 * 1024 * 1024;
  
    if (!allowedFileTypes.test(file.name)) {
      Notiflix.Notify.warning(
        "Le fichier doit être un PDF ou une image valide (jpg, jpeg, png, gif, bmp, svg, webp)."
      );
      return false;
    }
  
    if (file.size > maxFileSize) {
      Notiflix.Notify.warning("Le fichier ne doit pas dépasser 2 Mo.");
      return false;
    }
  
    return true;
  };

  const handleSaveClientFile = async () => {
    if (!designation_file || !client_file) {
      Notiflix.Notify.warning("Veuillez fournir une désignation et sélectionner un fichier.");
      return;
    }

    if (!AllowedFile(client_file)) {
      return;
    }

    setIsLoadingClientFiles(true);
    const formData = new FormData();
    formData.append("designation", designation_file);
    formData.append("file", client_file);
    formData.append("gest_fac_client_id", id);
  
    try {
      const tokenString = localStorage.getItem("token");
      const token = JSON.parse(tokenString);
  
      const response = await axios.post(`${BASE_URL}clients/client-files`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 201) {
        Notiflix.Notify.success("Fichier enregistré avec succès !");
        setRefreshClientFiles(!refreshClientFiles);
        HideAddFile();
        setShowAddFile(false);
      } else {
        Notiflix.Notify.failure("Erreur lors de l'enregistrement du fichier.");
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);
      Notiflix.Notify.failure("Une erreur s'est produite lors de l'enregistrement.");
      setIsLoadingClientFiles(false);
    }
  };

  const showPdf = (url) => {
    setPdfurl(url);
  };
  
  const showImg = (url , alt) => {
    setImgUrl(url);
  };

  const HideAddFile = () => {
    setDesignationFile("");
    setClient_file(null);
    setShowAddFile(false);
  }

  return (
    <>
      {pdfUrl && (
        <>
          <div className='fixed w-full h-full top-0 left-0 z-30 bg-opacity-55 bg-black' onClick={(e)=>setPdfurl('')}></div>
          <div className='z-50 fixed w-[1200px] max-w-[90%] max-h-full h-[90vh] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] shadow-md'>
            <FontAwesomeIcon icon={faXmark} className='absolute top-0 right-0 text-xl bg-red-600 p-1 text-white cursor-pointer hover:scale-105 transition-all' onClick={(e)=>setPdfurl('')}/>
            <embed src={pdfUrl} type="application/pdf" className="w-full h-full" />
          </div>
        </>
      )}

      {ImgUrl && (
        <>
          <div className='fixed w-full h-full top-0 left-0 z-30 bg-opacity-55 bg-black' onClick={(e)=>setImgUrl('')}></div>
          <div className='z-50 fixed w-[1200px] max-w-[90%] max-h-[75vh] top-[45%] left-[50%] translate-x-[-50%] translate-y-[-50%] shadow-md'>
            <div className='bg-black p-4'>
              <FontAwesomeIcon icon={faXmark} className='absolute top-0 right-0 text-xl bg-red-600 p-1 text-white cursor-pointer hover:scale-105 transition-all' onClick={(e)=>setImgUrl('')}/>
              <h1 className='text-white'><FontAwesomeIcon icon={faImages} className='mr-2 text-blue-500'/>{alt}</h1>
            </div>
            <div className='overflow-auto max-h-[80vh] text-center bg-white align-middle'>
              <img src={ImgUrl} alt={alt} className="w-full" />
            </div>
          </div>
        </>
      )}
      <h1 className='mb-4 font-bold'>Détail sur la fiche client :</h1>
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
            <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-3'>
              <div className='p-3 shadow-md '>
                {Cabisse && (Cabisse.endsWith('.pdf') || /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i.test(Cabisse)) ? (
                  <>
                    <p
                      className="cursor-pointer hover:scale-105 transition-all mb-4"
                      onClick={() => {
                        const fileUrl = `${Cabisse}`;

                        if (Cabisse.endsWith('.pdf')) {
                          showPdf(fileUrl);
                        } else if (/\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i.test(Cabisse)) {
                          showImg(fileUrl);
                          setAlt('Pièce d\'identité');
                        }
                      }}
                    >
                      {Cabisse.endsWith('.pdf') ? (
                        <FontAwesomeIcon icon={faFilePdf} className='mr-2 text-red-600'/>
                      ) : /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i.test(Cabisse) ? (
                        <FontAwesomeIcon icon={faImages} className='mr-2 text-blue-500'/>
                      ) : null}
                      Assurances
                    </p>
                    <label className="text-blue-500 cursor-pointer ml-2 mt-4">
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => handleUpload(e, "cabisse")}
                      />
                      <FontAwesomeIcon icon={faPenToSquare} className='mr-2' /> Modifier le fichier
                    </label>
                  </>
                ) : (
                  <>
                    <h1 className='font-bold text-center'>Cabisse
                      <label className="text-blue-500 cursor-pointer ml-4">
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => handleUpload(e, "cabisse")}
                      />
                      <FontAwesomeIcon icon={faPlus} /> Ajouter un fichier
                    </label>
                    </h1>
                  </>
                )}
              </div>


              <div className='p-3 shadow-md'>
                {assurance && (assurance.endsWith('.pdf') || /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i.test(assurance)) ? (
                  <>
                    <p
                      className="cursor-pointer hover:scale-105 transition-all mb-4"
                      onClick={() => {
                        const fileUrl = `${assurance}`;

                        if (assurance.endsWith('.pdf')) {
                          showPdf(fileUrl);
                        } else if (/\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i.test(assurance)) {
                          showImg(fileUrl);
                          setAlt('Pièce d\'identité');
                        }
                      }}
                    >
                      {assurance.endsWith('.pdf') ? (
                        <FontAwesomeIcon icon={faFilePdf} className='mr-2 text-red-600'/>
                      ) : /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i.test(assurance) ? (
                        <FontAwesomeIcon icon={faImages} className='mr-2 text-blue-500'/>
                      ) : null}
                      Assurances
                    </p>
                    <label className="text-blue-500 cursor-pointer ml-2 mt-4">
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => handleUpload(e, "assurance")}
                      />
                      <FontAwesomeIcon icon={faPenToSquare} className='mr-2' /> Modifier le fichier
                    </label>
                  </>
                ) : (
                  <>
                    <h1 className='font-bold text-center'>Assurance 
                      <label className="text-blue-500 cursor-pointer ml-4">
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => handleUpload(e, "assurance")}
                      />
                      <FontAwesomeIcon icon={faPlus} /> Ajouter un fichier
                    </label>
                    </h1>
                  </>
                )}
              </div>

              <div className='p-3 shadow-md'>
                {piece_identite && (piece_identite.endsWith('.pdf') || /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i.test(piece_identite)) ? (
                  <>
                    <p
                      className="cursor-pointer hover:scale-105 transition-all mb-4"
                      onClick={() => {
                        const fileUrl = `${piece_identite}`;

                        if (piece_identite.endsWith('.pdf')) {
                          showPdf(fileUrl);
                        } else if (/\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i.test(piece_identite)) {
                          showImg(fileUrl);
                          setAlt('Pièce d\'identité');
                        }
                      }}
                    >
                      {piece_identite.endsWith('.pdf') ? (
                        <FontAwesomeIcon icon={faFilePdf} className='mr-2 text-red-600'/>
                      ) : /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i.test(piece_identite) ? (
                        <FontAwesomeIcon icon={faImages} className='mr-2 text-blue-500'/>
                      ) : null}
                      Pièce d'identité
                    </p>
                    <label className="text-blue-500 cursor-pointer ml-2 mt-4">
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => handleUpload(e, "piece_identite")}
                      />
                      <FontAwesomeIcon icon={faPenToSquare} className='mr-2' /> Modifier le fichier
                    </label>
                  </>
                ) : (
                  <>
                    <h1 className='font-bold text-center'>Pièce d'identité 
                      <label className="text-blue-500 cursor-pointer ml-4">
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => handleUpload(e, "piece_identite")}
                      />
                      <FontAwesomeIcon icon={faPlus} /> Ajouter un fichier
                    </label></h1>
                  </>
                )}
              </div>
              <div className='p-3 shadow-md'>
                {Contrats && (Contrats.endsWith('.pdf') || /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i.test(Contrats)) ? (
                  <>
                    <p
                      className="cursor-pointer hover:scale-105 transition-all mb-4"
                      onClick={() => {
                        const fileUrl = `${Contrats}`;

                        if (Contrats.endsWith('.pdf')) {
                          showPdf(fileUrl);
                        } else if (/\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i.test(Contrats)) {
                          showImg(fileUrl);
                          setAlt('Pièce d\'identité');
                        }
                      }}
                    >
                      {Contrats.endsWith('.pdf') ? (
                        <FontAwesomeIcon icon={faFilePdf} className='mr-2 text-red-600'/>
                      ) : /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i.test(Contrats) ? (
                        <FontAwesomeIcon icon={faImages} className='mr-2 text-blue-500'/>
                      ) : null}
                      Contrats
                    </p>
                    <label className="text-blue-500 cursor-pointer ml-2 mt-4">
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => handleUpload(e, "contrats")}
                      />
                      <FontAwesomeIcon icon={faPenToSquare} className='mr-2' /> Modifier le fichier
                    </label>
                  </>
                ) : (
                  <>
                    <h1 className='font-bold text-center'>Contrats
                    <label className="text-blue-500 cursor-pointer ml-4">
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => handleUpload(e, "contrats")}
                      />
                      <FontAwesomeIcon icon={faPlus} /> Ajouter un fichier
                    </label>
                    </h1>
                  </>
                )}
              </div>

            </div>
            <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 border-l-4 border-blue-500'>
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
              <div className='border-l-4 border-blue-500 shadow-md'>
              {IsLoadingClientFiles ? (
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
                  <div className='w-full px-2 py-0'>
                    <div className='px-3 py-0 divide-y divide-gray-200'>
                      <div className="grid grid-cols-[4fr,3fr,1fr] px-4 py-2 font-bold bg-slate-50 shadow-sm">
                        <div>Fichier</div>
                        <div>Date</div>
                        <div></div>
                      </div>
                    </div>
                  </div>
                  <div className='w-full px-2 py-0 h-[400px] max-h-[500px] overflow-auto'>
                  {ClientFiles.length > 0 ? (
                    <div className='px-3 py-0 shadow-md divide-y divide-gray-200'>
                      {ClientFiles.map((ClientFile) => (
                        <div key={ClientFile.id} className="grid grid-cols-[4fr,3fr,1fr] px-4 py-2">
                          <div
                            className="cursor-pointer hover:scale-105 transition-all"
                            onClick={() => {
                              const fileUrl = `https://bg.societe-manage.com/public/storage/${ClientFile.file}`;

                              if (ClientFile.file.endsWith('.pdf')) {
                                showPdf(fileUrl);
                              } else if (/\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i.test(ClientFile.file)) {
                                showImg(fileUrl);
                                setAlt(ClientFile.designation);
                              }
                            }}
                          >
                            {ClientFile.file.endsWith('.pdf') ? (
                              <FontAwesomeIcon icon={faFilePdf} className='mr-2 text-red-600'/>
                            ) : /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i.test(ClientFile.file) ? (
                              <FontAwesomeIcon icon={faImages} className='mr-2 text-blue-500'/>
                            ) : null}
                            {ClientFile.designation}
                          </div>
                          <div>{format(new Date(ClientFile.updated_at), "dd MMMM yyyy | HH.mm", {locale: fr, })}</div>
                          <div className='text-right cursor-pointer'><FontAwesomeIcon icon={faTrashAlt} className='text-red-500' onClick={() => DeleteFile(ClientFile.id)}/> </div>
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
                                  onChange={(e) => setClient_file(e.target.files[0])}
                                />
                                {client_file ? (
                                    <>
                                      <FontAwesomeIcon icon={faFile} />
                                      {` Modifier : ${client_file.name}`}
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
                            <button className='px-2 py-1 bg-blue-400 text-white' title='Enregistrer' onClick={handleSaveClientFile} disabled={!client_file}><FontAwesomeIcon icon={faCheck}/></button>
                            <button className='px-2 py-1 bg-red-400 text-white ml-2' title='Annuler' onClick={HideAddFile}><FontAwesomeIcon icon={faXmark}/></button>
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

export default ProspectDetail;
