import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Editor } from "@tinymce/tinymce-react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { useState, useEffect, useRef, useContext } from "react";
import { UrlContext } from "../contexte/useUrl";
import axios from "axios";
import { MessageContext } from "../contexte/useMessage";
import { ShowContext } from "../contexte/useShow";


function ParametreDevis() {
    const [headerDevis, setHeaderDevis] = useState("<i>Vous n'avez pas encore configurer votre entête</i>");
    const [footerDevis, setFooterDevis] = useState("<i>Vous n'avez pas encore configurer votre pied de page</i>");
    const [cgv, setCgv] = useState("<i>Vous n'avez pas encore configurer votre CGV</i>");

    const [contenuToPut, setContenuToPut] = useState("");
    const [titreContenu, setTitreContenu] = useState("");
    const [id_headerDevis, setId_headerDevis] = useState('');
    const [id_FooterDevis, setId_FooterDevis] = useState('');
    const [afficherTiny, setAfficherTiny] = useState(false);
    const [id_Contenu, setId_contenu] = useState('');
    const [endP, setEndP] = useState('');
    const editorRef = useRef("");
    const { url } = useContext(UrlContext);
    const [load, setLoad] = useState(false);
    const { setMessageSucces, setMessageError } = useContext(MessageContext);
    const { setShowSpinner, showAdmin } = useContext(ShowContext);
    const [isCgv, setIsCgv] = useState(false);

    useEffect(() => {
        const tokenString = localStorage.getItem("token");
        let token = JSON.parse(tokenString);
    
        const request1 = axios.get(`${url}/api/layouts/headers/devis`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const request2 = axios.get(`${url}/api/layouts/footers/devis`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const request3 = axios.get(`${url}/api/administrateurs/entreprise`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });


        Promise.all([request1, request2, request3])
          .then(([headerResponse, FooterResponse, cgvResponse]) => {
            setHeaderDevis(headerResponse.data[0].cotenu);
            setFooterDevis(FooterResponse.data[0].cotenu);
            setCgv(cgvResponse.data.entreprise.cgv);
            setId_headerDevis(headerResponse.data[0].id);
            setId_FooterDevis(FooterResponse.data[0].id);
          })
          .catch((err) => {
            console.error(err);
          });
      }, [load]);

      const saveContenu = () => {
        const tokenString = localStorage.getItem("token");
        let token = JSON.parse(tokenString);
        
        if (!token) {
            setMessageSucces("Utilisateur non authentifié !");
            return;
        }
    
        setShowSpinner(true);

        const contenu = editorRef.current.getContent();
        if (!contenu || contenu.trim() === "") {
            setMessageSucces("Le contenu ne peut pas être vide.");
            setShowSpinner(false);
            return;
        }
        
        let formData;

        if (isCgv) {
            formData = {
                cgv: contenu,
            };
        } else {
            formData = {
                cotenu: contenu,
            };
        }
    
        axios
            .put(
                `${endP}/${id_Contenu}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((response) => {
                setMessageSucces("Modification réussie !");
                setShowSpinner(false);
                setAfficherTiny(false);
                setTitreContenu("'");
                setEndP('');
                setContenuToPut('');
                setId_contenu('');
                setIsCgv(false);

                setLoad(!load);
                setTimeout(() => {
                    setMessageSucces("");
                }, 5000);
            })
            .catch((err) => {
                console.error(err);
                setShowSpinner(false);
                setMessageSucces("Une erreur est survenue. Veuillez réessayer.");
            });
    };

    const handleClickAffiche = (type) => {
        if (type === 'head'){
            setAfficherTiny(true);
            setTitreContenu("Entête des devis");
            setEndP(`${url}/api/layouts/headers/devis`);
            setContenuToPut(headerDevis);
            setId_contenu(id_headerDevis);
        }else if (type === 'foot'){
            setAfficherTiny(true);
            setTitreContenu("Pied des pages des devis");
            setEndP(`${url}/api/layouts/footers/devis`);
            setContenuToPut(footerDevis);
            setId_contenu(id_FooterDevis);
        }else if (type === 'cgv'){
            const userString = localStorage.getItem("user");
            let user = JSON.parse(userString);
            setAfficherTiny(true);
            setTitreContenu("Conditions Générales de vente");
            setEndP(`${url}/api/entreprises`);
            setContenuToPut(cgv);
            setId_contenu(user.gest_com_entreprise_id);
            setIsCgv(true);
        }
    };



    return (
        <>
            <h1 className="text-md font-extrabold mb-4">Paramètre des devis</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-4">
                    <div className="shadow-md p-5 w-[100%]">
                        <h2 className="font-bold">Entête par defaut des devis sortants</h2>
                        <div className="p-4 shadow-sm max-h-[400px] overflow-auto relative my-2" dangerouslySetInnerHTML={{ __html: headerDevis }} />
                        <button 
                            className="bg-yellow-600 px-3 py-2 text-white cursor-pointer"
                            onClick={() => handleClickAffiche('head')}>
                                Modifier l'entête</button>
                    </div>
                    <hr className="my-6"></hr>
                    <div className="shadow-md p-5 w-[100%]">
                        <h2 className="font-bold">Entête par defaut des devis sortants</h2>
                        <div className="p-4 shadow-sm max-h-[400px] overflow-auto relative my-2" dangerouslySetInnerHTML={{ __html: footerDevis }} />
                        <button 
                            className="bg-yellow-600 px-3 py-2 text-white cursor-pointer"
                            onClick={() => handleClickAffiche('foot')}>
                                Modifier les pieds de page</button>
                    </div>
                    <hr className="my-6"></hr>
                    <div className="shadow-md p-5 w-[100%]">
                        <h2 className="font-bold">Les conditions générales de ventes (CGV)</h2>
                        <div className="p-4 shadow-sm max-h-[400px] overflow-auto relative my-2" dangerouslySetInnerHTML={{ __html: cgv }} />
                        <button 
                            className="bg-yellow-600 px-3 py-2 text-white cursor-pointer"
                            onClick={() => handleClickAffiche('cgv')}>
                                Modifier Les CGV</button>
                    </div>


                </div>
                {/* La modification sur grand ecran */}
                {afficherTiny && (
                    <>
                        <div 
                        className="fixed top-0 left-0 w-[100%] h-[100%] bg-white opacity-75 block"
                        onClick={(e) => setAfficherTiny(false)} ></div>
                        <div 
                            className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[800px] max-w-[85%]  p-4 shadow-xl rounded-md bg-white lg:relative lg:max-w-[100%]">
                            <p className="text-right"> 
                                <FontAwesomeIcon 
                                icon={faXmark} 
                                onClick={(e) => setAfficherTiny(false)}
                                className="text-red-700 cursor-pointer " 
                                title="Quitter"/>
                            </p>
                            <h2 className="my-2 font-bold ml-2">{titreContenu}</h2>
                            <button onClick={saveContenu} className="block lg:hidden my-4 px-3 py-2 bg-blue-500 text-white ml-2">Enregistrer</button>
                            <div className="w-[100%] max-h-[55vh] overflow-auto p-2">
                                <Editor
                                    apiKey="grqm2ym9jtrry4atbeq5xsrd1rf2fe5jpsu3qwpvl7w9s7va"
                                    onInit={(_evt, editor) => {
                                    editorRef.current = editor;
                                    }}
                                    initialValue={contenuToPut}
                                    init={{
                                    max_width: "100%",
                                    height: 200,
                                    min_height: 200,
                                    max_height: "50vh",
                                    menubar: false,
                                    branding: false,
                                    plugins: "link image table",
                                    toolbar: "bold italic underline | forecolor backcolor | table | alignleft aligncenter alignright | bullist numlist | link image media | code fullscreen",
                                    content_style:
                                        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                                    }}
                                />
                            </div>
                            <button onClick={saveContenu} className="hidden lg:block my-4 px-3 py-2 bg-blue-500 text-white ml-2">Enregistrer</button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default ParametreDevis;