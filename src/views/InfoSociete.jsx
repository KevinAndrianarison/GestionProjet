import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUnlock } from '@fortawesome/free-solid-svg-icons';
import { ShowContext } from "../contexte/useShow";
import { MessageContext } from "../contexte/useMessage";
import { UrlContext } from "../contexte/useUrl";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";


function InfoSociete() {
    const [isEditable, setIsEditable] = useState(false);
    const [logo, setLogo] = useState("https://archive.org/download/placeholder-image/placeholder-image.jpg");
    const [isEditing, setIsEditing] = useState(false);
    const [tempLogo, setTempLogo] = useState(null);
    const [tempLogoSend, setTempLogoSend] = useState(null);

    const [nomSociete, setnomSociete] = useState("");
    const [gerant, setgerant] = useState("");
    const [email_societe, setemail_societe] = useState("");
    const [contact_societe, setcontact_societe] = useState("");
    const [siren, setsiren] = useState("");
    const [siret, setsiret] = useState("");
    const [site_web, setsite_web] = useState("");
    const [pays, setpays] = useState("");
    const [ville, setville] = useState("");
    const [adresse, setadresse] = useState("");
    const [rcs, setrcs] = useState("");
    const [affiliation_tva, setaffiliation_tva] = useState(false);
    const [num_tva, setnum_tva] = useState("");
    const [tva, settva] = useState("");
    const [load, setLoad] = useState(false);

    const { url } = useContext(UrlContext);
    const { setMessageSucces, setMessageError } = useContext(MessageContext);
    const { setShowSpinner, showAdmin } = useContext(ShowContext);

    useEffect(() => {
        setShowSpinner(true);
        const tokenString = localStorage.getItem("token");
        let token = JSON.parse(tokenString);
    
        const request1 = axios.get(`${url}/api/administrateurs/entreprise`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        Promise.all([request1])
          .then(([entrepriseResponse]) => {
            setLogo(`https://bg.societe-manage.com/public/storage/${entrepriseResponse.data.entreprise.logo}` || "https://archive.org/download/placeholder-image/placeholder-image.jpg")
            console.log(entrepriseResponse.data.entreprise.logo);
            setnomSociete(entrepriseResponse.data.entreprise.nom || "");
            setgerant(entrepriseResponse.data.entreprise.gerant || "");
            setemail_societe(entrepriseResponse.data.entreprise.email_societe || "");
            setcontact_societe(entrepriseResponse.data.entreprise.contact_societe || "");
            setsiren(entrepriseResponse.data.entreprise.siren || "");
            setsiret(entrepriseResponse.data.entreprise.siret || "");
            setsite_web(entrepriseResponse.data.entreprise.site_web || "");
            setpays(entrepriseResponse.data.entreprise.pays || "");
            setville(entrepriseResponse.data.entreprise.ville || "");
            setadresse(entrepriseResponse.data.entreprise.adresse || "");
            setrcs(entrepriseResponse.data.entreprise.rcs || "");
            setaffiliation_tva();
            setaffiliation_tva(!!entrepriseResponse.data.entreprise.affilation_tva);
            setnum_tva(entrepriseResponse.data.entreprise.num_tva || "");
            settva(entrepriseResponse.data.entreprise.tva || "");
            setShowSpinner(false);
          })
          .catch((err) => {
            console.error(err);
            setShowSpinner(false);
          });
      }, [load]);

    const saveInfoEntity = () => {
        const userString = localStorage.getItem("user");
        const tokenString = localStorage.getItem("token");
        let user = JSON.parse(userString);
        let token = JSON.parse(tokenString);
        const roleString = localStorage.getItem("role");
        let role = JSON.parse(roleString);

        setShowSpinner(true);
        if(affiliation_tva === true && tva === "" && num_tva === ""){
            setShowSpinner(false);
            setMessageError("Si vous êtes affilié au TVA, il faut remplir tous les champs concernants");
            setTimeout(() => {
                setMessageError("");
              }, 5000);
            return false;
        }
        if(role !== "admin"){
            setShowSpinner(false);
            setMessageError("Vous n'êtes pas autorisé à modifier ces informations !");
            setTimeout(() => {
                setMessageSucces("");
              }, 5000);
            return false;
        }
        let formData = {
            nom: nomSociete,
            adresse : adresse,
            contact_societe: contact_societe,
            email_societe : email_societe,
            gerant : gerant,
            affilation_tva: Boolean(affiliation_tva),
            num_tva: num_tva,
            pays: pays,
            rcs: rcs,
            siren: siren,
            siret : siret,
            site_web : site_web,
            tva: tva,
            ville : ville
        };

        axios
        .put(
          `${url}/api/entreprises/${user.gest_com_entreprise_id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          localStorage.setItem(
            "entity",
            JSON.stringify(response.data.entreprise.nom)
          );
          setMessageSucces("Modification réussi !");
          setIsEditable(false);
          setShowSpinner(false);
          setLogo("https://archive.org/download/placeholder-image/placeholder-image.jpg")
          setLoad(!load);
          setTimeout(() => {
            setMessageSucces("");
          }, 5000);
        })
        .catch((err) => {
          console.error(err);
          setShowSpinner(false);
        });
    }


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = () => {
                setTempLogo(reader.result);
            };
            reader.readAsDataURL(file);
        }
        if (file) {
            setTempLogoSend(file);
        }
    };
    

    const handleSave = () => {
        if (tempLogoSend) {
            let formData = new FormData();
            formData.append("logo", tempLogoSend);

            const userString = localStorage.getItem("user");
            const tokenString = localStorage.getItem("token");
            let user = JSON.parse(userString);
            let token = JSON.parse(tokenString);
            const roleString = localStorage.getItem("role");
            let role = JSON.parse(roleString);
    
            if (role !== "admin") {
                setShowSpinner(false);
                setMessageError("Vous n'êtes pas autorisé à modifier ces informations !");
                setTimeout(() => {
                    setMessageSucces("");
                }, 5000);
                return false;
            }
    
            axios.post(
                    `${url}/api/entreprises/${user.gest_com_entreprise_id}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "X-HTTP-Method-Override": "PUT",
                        },
                    }
                )
                .then((response) => {
                    localStorage.setItem("entity", JSON.stringify(response.data.entreprise.nom));
                    setMessageSucces("Modification réussie !");
                    setShowSpinner(false);
                    setLoad(!load);
                    handleCancel();
                    setTimeout(() => {
                        setMessageSucces("");
                    }, 5000);
                })
                .catch((err) => {
                    console.error(err);
                    setShowSpinner(false);
                    setMessageError("Erreur lors de la modification du logo");
                    setTimeout(() => {
                        setMessageError("");
                    }, 5000);
                });
    
            setTempLogo(null);
        }
    };

    const handleCancel = () => {
        setTempLogo(null);
        setIsEditing(false);
    };


    return (
        <>
            <div className="w-full">
                <div className="w-[800px] max-w-[100%] m-auto p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 px-4 py-3">
                        <div>
                            <h1 className="text-xl">Profil de la société</h1>
                            <p className="pt-2">Gérez vos informations de votre société.</p>
                        </div>
                        <div className="relative">
                            <div className="relative">
                                <img
                                    src={tempLogo || logo}
                                    alt="Logo de la société"
                                    className="object-cover w-32 max-h-32 mx-auto"
                                />
                                {!isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-1"
                                    >
                                        ✏️
                                    </button>
                                )}
                            </div>

                            {isEditing && (
                                <div className="absolute bottom-[-20px] left-0 w-full h-full flex items-center justify-center rounded-full">
                                    <div>
                                        <input
                                            id="logo-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => handleImageChange(e)}
                                        />
                                        <button
                                            onClick={() => document.getElementById("logo-upload").click()}
                                            className="bg-green-500 text-white px-3 py-2 rounded-md mx-2"
                                        >
                                            📤 Charger
                                        </button>
                                        {tempLogo && (
                                            <>
                                                <button
                                                    onClick={handleSave}
                                                    className="bg-[var(--color-background-secondary);] text-white px-2 py-1 mx-2"
                                                >
                                                    <FontAwesomeIcon icon={faCheck}/>
                                                </button>
                                            </>
                                        )}
                                        <button
                                            onClick={handleCancel}
                                            className="bg-red-500 text-white px-2 py-1 mx-2"
                                        >
                                            <FontAwesomeIcon icon={faXmark}/>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>


                    <div className="border border-gray-300 rounded-lg shadow-lg w-full mt-5">
                        <div className="divide-y divide-gray-200">
                            <div className="grid grid-cols-2 px-4 py-3">
                                <div>Nom de la société</div>
                                <div>
                                    <input
                                        type="text"
                                        value={nomSociete}
                                        onChange={(e) => setnomSociete(e.target.value)}
                                        readOnly={!isEditable}
                                        className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 ring-inset focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                                        placeholder="Nom de la société"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 px-4 py-3">
                                <div>Gerant de la société</div>
                                <div>
                                    <input
                                        type="text"
                                        value={gerant}
                                        onChange={(e) => setgerant(e.target.value)}
                                        readOnly={!isEditable}
                                        className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 ring-inset focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                                        placeholder="Gerant de la société"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 px-4 py-3">
                                <div>Email de la société</div>
                                <div>
                                    <input
                                        type="text"
                                        value={email_societe}
                                        onChange={(e) => setemail_societe(e.target.value)}
                                        readOnly={!isEditable}
                                        className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 ring-inset focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                                        placeholder="Email de la société"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 px-4 py-3">
                                <div>Contact de la société</div>
                                <div>
                                    <input
                                        type="text"
                                        value={contact_societe}
                                        onChange={(e) => setcontact_societe(e.target.value)}
                                        readOnly={!isEditable}
                                        className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 ring-inset focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                                        placeholder="+33 6 78 87 45 21"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 px-4 py-3">
                                <div>Numéro SIREN</div>
                                <div>
                                    <input
                                        type="text"
                                        value={siren}
                                        onChange={(e) => setsiren(e.target.value)}
                                        readOnly={!isEditable}
                                        className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 ring-inset focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                                        placeholder="Numéro SIREN"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 px-4 py-3">
                                <div>Numéro SIRET</div>
                                <div>
                                    <input
                                        type="text"
                                        value={siret}
                                        onChange={(e) => setsiret(e.target.value)}
                                        readOnly={!isEditable}
                                        className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 ring-inset focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                                        placeholder="Numéro SIRET"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 px-4 py-3">
                                <div>Site Web</div>
                                <div>
                                    <input
                                        type="text"
                                        value={site_web}
                                        onChange={(e) => setsite_web(e.target.value)}
                                        readOnly={!isEditable}
                                        className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 ring-inset focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                                        placeholder="Site Web"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 px-4 py-3">
                                <div>Pays</div>
                                <div>
                                    <input
                                        type="text"
                                        value={pays}
                                        onChange={(e) => setpays(e.target.value)}
                                        readOnly={!isEditable}
                                        className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 ring-inset focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                                        placeholder="Pays"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 px-4 py-3">
                                <div>Ville</div>
                                <div>
                                    <input
                                        type="text"
                                        value={ville}
                                        onChange={(e) => setville(e.target.value)}
                                        readOnly={!isEditable}
                                        className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 ring-inset focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                                        placeholder="Ville"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 px-4 py-3">
                                <div>Adresse</div>
                                <div>
                                    <input
                                        type="text"
                                        value={adresse}
                                        onChange={(e) => setadresse(e.target.value)}
                                        readOnly={!isEditable}
                                        className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 ring-inset focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                                        placeholder="Adresse"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 px-4 py-3">
                                <div>RCS</div>
                                <div>
                                    <input
                                        type="text"
                                        value={rcs}
                                        onChange={(e) => setrcs(e.target.value)}
                                        readOnly={!isEditable}
                                        className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 ring-inset focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                                        placeholder="RCS"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 px-4 py-3">
                                <div>Affiliation TVA</div>
                                <div>
                                    <select
                                        value={affiliation_tva}
                                        onChange={(e) => setaffiliation_tva(e.target.value === "true")}
                                        disabled={!isEditable}
                                        className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 ring-inset focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                                    >
                                        <option value="true">Oui</option>
                                        <option value="false">Non</option>
                                    </select>
                                </div>
                            </div>
                            {affiliation_tva && (
                                <>
                                    <div className="grid grid-cols-2 px-4 py-3">
                                        <div>Numéro de TVA</div>
                                        <div>
                                            <input
                                                type="text"
                                                value={num_tva || ""}
                                                onChange={(e) => setnum_tva(e.target.value)}
                                                readOnly={!isEditable}
                                                className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 ring-inset focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                                                placeholder="Numéro de TVA"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 px-4 py-3">
                                        <div>Pourcentage de la TVA pour les devis</div>
                                        <div>
                                            <select
                                                value={tva || ""}
                                                onChange={(e) => settva(e.target.value)}
                                                readOnly={!isEditable}
                                                className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 ring-inset focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none">
                                                <option value="">TVA par defaut</option>
                                                <option value={20}>20%</option>
                                                <option value={7}>7%</option>
                                            </select>
                                        </div>
                                    </div>
                                </>
                            )}
                            <div className="grid grid-cols-2 p-4">
                                <div></div>
                                <div className="">
                                    <button
                                        onClick={isEditable ? saveInfoEntity : () => setIsEditable(!isEditable)}
                                        className={`w-full py-3 font-medium text-white ${isEditable ? "bg-blue-500" : "bg-slate-500"}`}
                                    >
                                        {isEditable ? "Enregistrer" : <><FontAwesomeIcon className="mr-1" icon={faUnlock} /> Activer la modification</>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default InfoSociete;
