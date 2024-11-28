import { useParams } from 'react-router-dom';
import { useEffect, useState} from 'react';
import React from 'react';
import axios from 'axios';
import { BASE_URL } from "../contextes/ApiUrls";
import { Skeleton } from "@/components/ui/skeleton";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark, faFile, faFilePdf, faImages, faPenToSquare, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { fr } from "date-fns/locale";
import { format } from "date-fns";
import Notiflix from 'notiflix';

const FournisseurDetail = () => {
  const { id } = useParams();
  const [alt, setAlt] = useState('');

  const [refresh, setRefresh] = useState(false);
  const [refreshFournisseurFiles, setRefreshFournisseurFiles] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingFournisseurFiles, setIsLoadingFournisseurFiles] = useState(false);
  const [fournisseurFiles, setFournisseurFiles] = useState([]);
  const [showAddFile, setShowAddFile] = useState(false);
  const [designation_file, setDesignationFile] = useState("");
  const [fournisseur_file, setFournisseurFile] = useState(null)

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
  const [pdfUrl, setPdfurl] = useState('');
  const [imgUrl, setImgUrl] = useState('');

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
      Notiflix.Notify.failure("Erreur lors de la récupération des données du fournisseur:");
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
      Notiflix.Notify.failure("Erreur lors de la récupération des pièces jointes du fournisseur:");
    } finally {
      setIsLoadingFournisseurFiles(false);
    }
  };

  const handleUpload = async (e, field) => {
    const file = e.target.files[0];

    if (file) {
      if (!AllowedFile(file)) {
        return;
      }
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
          Notiflix.Notify.success("Fichier mis à jour");
          if (field === "cabisse") setCabisse(`https://bg.societe-manage.com/public/storage/${response.data.cabisse}`);
          if (field === "assurance") setAssurance(`https://bg.societe-manage.com/public/storage/${response.data.assurance}`);
          if (field === "piece_identite") setPieceIdentite(`https://bg.societe-manage.com/public/storage/${response.data.piece_identite}`);
          if (field === "contrats") setContrats(`https://bg.societe-manage.com/public/storage/${response.data.contrats}`);
          console.log(response.data);
        }
      } catch (error) {
        console.error("Erreur lors de l'upload :", error);
        Notiflix.Notify.failure("Erreur lors de l'upload");
      }
    }
  };

  const DeleteFile = async (IdFile) => {
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
      const response = await axios.delete(`${BASE_URL}fournisseurs/fournisseur-files/${IdFile}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response) {
        setRefreshFournisseurFiles(!refreshFournisseurFiles);
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

  useEffect(() => {
    fetchData();
  }, [refresh]);

  useEffect(() => {
    fetchDataFournisseurFiles();
  }, [refreshFournisseurFiles]);

  const HideAddFile = () => {
    setDesignationFile("");
    setClient_file(null);
    setShowAddFile(false);
  }


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
        Notiflix.Notify.success("Fichier enregistré avec succès !");
        setRefreshFournisseurFiles(!refreshFournisseurFiles);
        HideAddFile();
        setShowAddFile(false);
      } else {
        Notiflix.Notify.failure("Erreur lors de l'enregistrement du fichier.");
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);
      Notiflix.Notify.failure("Une erreur s'est produite lors de l'enregistrement.");
    }
  };

  const showPdf = (url) => {
    console.log("Afficher le PDF :", url);
    setPdf(url);
  };

  const showImg = (url) => {
    console.log("Afficher l'image :", url);
    setImgUrl(url);
  };

  return (
    <>
      {pdfUrl && (
        <>
          <div className='fixed w-full h-full top-0 left-0 z-30 bg-opacity-55 bg-black' onClick={(e) => setPdfurl('')}></div>
          <div className='z-50 fixed w-[1200px] max-w-[90%] max-h-full h-[90vh] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] shadow-md'>
            <FontAwesomeIcon icon={faXmark} className='absolute top-0 right-0 text-xl bg-red-600 p-1 text-white cursor-pointer hover:scale-105 transition-all' onClick={(e) => setPdfurl('')} />
            <embed src={pdfUrl} type="application/pdf" className="w-full h-full" />
          </div>
        </>
      )}

      {imgUrl && (
        <>
          <div className='fixed w-full h-full top-0 left-0 z-30 bg-opacity-55 bg-black' onClick={(e) => setImgUrl('')}></div>
          <div className='z-50 fixed w-[1200px] max-w-[90%] max-h-[75vh] top-[45%] left-[50%] translate-x-[-50%] translate-y-[-50%] shadow-md'>
            <div className='bg-black p-4'>
              <FontAwesomeIcon icon={faXmark} className='absolute top-0 right-0 text-xl bg-red-600 p-1 text-white cursor-pointer hover:scale-105 transition-all' onClick={(e) => setImgUrl('')} />
              <h1 className='text-white'><FontAwesomeIcon icon={faImages} className='mr-2 text-blue-500' />{alt}</h1>
            </div>
            <div className='overflow-auto max-h-[80vh] text-center bg-white align-middle'>
              <img src={imgUrl} alt={alt} className="w-full" />
            </div>
          </div>
        </>
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
              <div className='p-3 shadow-md '>
                {cabisse && (cabisse.endsWith('.pdf') || /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i.test(cabisse)) ? (
                  <>
                    <p
                      className="cursor-pointer hover:scale-105 transition-all mb-4"
                      onClick={() => {
                        const fileUrl = `${cabisse}`;

                        if (cabisse.endsWith('.pdf')) {
                          showPdf(fileUrl);
                        } else if (/\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i.test(cabisse)) {
                          showImg(fileUrl);
                          setAlt('Pièce d\'identité');
                        }
                      }}
                    >
                      {cabisse.endsWith('.pdf') ? (
                        <FontAwesomeIcon icon={faFilePdf} className='mr-2 text-red-600' />
                      ) : /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i.test(cabisse) ? (
                        <FontAwesomeIcon icon={faImages} className='mr-2 text-blue-500' />
                      ) : null}
                      Cabisse
                    </p>
                    <label className="text-blue-500 cursor-pointer">
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
                        <FontAwesomeIcon icon={faFilePdf} className='mr-2 text-red-600' />
                      ) : /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i.test(assurance) ? (
                        <FontAwesomeIcon icon={faImages} className='mr-2 text-blue-500' />
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
                        <FontAwesomeIcon icon={faFilePdf} className='mr-2 text-red-600' />
                      ) : /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i.test(piece_identite) ? (
                        <FontAwesomeIcon icon={faImages} className='mr-2 text-blue-500' />
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
                {contrats && (contrats.endsWith('.pdf') || /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i.test(contrats)) ? (
                  <>
                    <p
                      className="cursor-pointer hover:scale-105 transition-all mb-4"
                      onClick={() => {
                        const fileUrl = `${contrats}`;

                        if (contrats.endsWith('.pdf')) {
                          showPdf(fileUrl);
                        } else if (/\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i.test(contrats)) {
                          showImg(fileUrl);
                          setAlt('Pièce d\'identité');
                        }
                      }}
                    >
                      {contrats.endsWith('.pdf') ? (
                        <FontAwesomeIcon icon={faFilePdf} className='mr-2 text-red-600' />
                      ) : /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i.test(contrats) ? (
                        <FontAwesomeIcon icon={faImages} className='mr-2 text-blue-500' />
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
                {isLoadingFournisseurFiles ? (
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
                    <div className='w-full p-2 h-[400px] max-h-[500px] overflow-auto'>
                      {fournisseurFiles.length > 0 ? (
                        <div className='p-3 shadow-md divide-y divide-gray-200'>
                          {fournisseurFiles.map((fournisseurFile) => (
                            <div key={fournisseurFile.id} className="grid grid-cols-[4fr,3fr,1fr] px-4 py-2">
                              <div
                                className='cursor-pointer hover:scale-105 transition-all'
                                onClick={() => {
                                  const fileUrl = `https://bg.societe-manage.com/public/storage/${fournisseurFile.file}`;

                                  if (fournisseurFile.file.endsWith('.pdf')) {
                                    showPdf(fileUrl);
                                  } else if (/\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i.test(fournisseurFile.file)) {
                                    showImg(fileUrl);
                                    setAlt(fournisseurFile.designation);
                                  }
                                }}
                              >
                                {fournisseurFile.file.endsWith('.pdf') ? (
                                  <FontAwesomeIcon icon={faFilePdf} className='mr-2 text-red-600' />
                                ) : /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i.test(fournisseurFile.file) ? (
                                  <FontAwesomeIcon icon={faImages} className='mr-2 text-blue-500' />
                                ) : null}
                                {fournisseurFile.designation}
                              </div>
                              <div>{format(new Date(fournisseurFile.updated_at), "dd MMMM yyyy | HH.mm", { locale: fr, })}</div>
                              <div className='text-right cursor-pointer'><FontAwesomeIcon icon={faTrashAlt} className='text-red-500' onClick={() => DeleteFile(fournisseurFile.id)} /> </div>                            </div>
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
                                    onChange={(e) => setFournisseurFile(e.target.files[0])}
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
                              <button className='px-2 py-1 bg-red-400 text-white ml-2' title='Annuler' onClick={HideAddFile}><FontAwesomeIcon icon={faXmark} /></button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <button
                          onClick={() => setShowAddFile(true)}
                          className='bg-blue-500 px-6 py-2 text-white hover:scale-105 rounded-md transition-all'
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
