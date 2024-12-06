import axios from "axios";
import React from "react";
import { useEffect, useState, useContext } from "react";
import { Tree, TreeNode } from 'react-organizational-chart';
import { Skeleton } from "@/components/ui/skeleton";
import { UrlContext } from "../contexte/useUrl";
import Modal from '../DevisFacure/views/Modal';
import { ShowContext } from "../contexte/useShow";
import Notiflix from 'notiflix';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import Tippy from "@tippyjs/react";


function GestionStructurePage() {
  const { url } = useContext(UrlContext);
  const [departements, setDepartements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstModalOpen, setFirstModalOpen] = useState(false);
  const [nom, setNom] = useState('');
  const [parentId, setParentId] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [departementOption, setdepartementOption] = useState([]);
  const { setShowSpinner, showAdmin } = useContext(ShowContext);
  const [AddOrEdit, setAddOrEdit] = useState(false);
  const [idToEdit, setIdToEdit] = useState('');
  const [isDepMother, setIsDepMother] = useState(false);

  const fetchDepartements = async () => {
    const tokenString = localStorage.getItem("token");
    const token = JSON.parse(tokenString);
    setIsLoading(true);
  
    try {
      const response = await axios.get(`${url}/api/departements`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const departementsArborescent = buildDepartementTree(response.data);
      setdepartementOption(response.data);
      setDepartements(departementsArborescent);
      const rootDepartement = response.data.find((departement) => departement.gest_r_h_departement_id === null);
      if (rootDepartement) {
        setParentId(rootDepartement.id);
      } else {
        console.warn("Aucun département racine trouvé.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };


  const buildDepartementTree = (departements) => {
    const departementMap = {};
  
    departements.forEach((departement) => {
      departement.enfants_departements = [];
      departementMap[departement.id] = departement;
    });
  
    const tree = [];
  
    departements.forEach((departement) => {
      if (departement.gest_r_h_departement_id === null) {

        tree.push(departement);
      } else {
        const parent = departementMap[departement.gest_r_h_departement_id];
        if (parent) {
          parent.enfants_departements.push(departement);
        }
      }
    });
  
    return tree;
  };


  const addDepartement = async (e) => {
    e.preventDefault();
    const tokenString = localStorage.getItem("token");
    const token = JSON.parse(tokenString);
    if( nom === ''){
      Notiflix.Notify.failure('Le nom du departement ne peut pas être vide');
      return;
    }

    setShowSpinner(true);
    try {
      const formData = {
        nom,
        gest_r_h_departement_id: parentId,
      };
      if(!AddOrEdit){
        const response = await axios.post(`${url}/api/departements`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        Notiflix.Notify.success("Département ajouté avec succès");
        setNom('');
        setRefresh(!refresh);
        setFirstModalOpen(false);
      }else{
        const response = await axios.put(`${url}/api/departements/${idToEdit}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        Notiflix.Notify.success("Département modifié avec succès");
        setNom('');
        setIsDepMother(false);
        setAddOrEdit(false);
        setFirstModalOpen(false);
        setRefresh(!refresh);
      }
    } catch (err) {
      Notiflix.Notify.failure(err);
    }
    finally {
      setShowSpinner(false);
    }
  };

  useEffect(() => {
    fetchDepartements();
  }, [refresh]);

  const SupprimerDep = async(id) => {
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
  
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
  
    try {
      const response = await axios.delete(`${url}/api/departements/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response) {
        setRefresh(!refresh);
      }
      Notiflix.Report.success(
        'Succès',
        'Departement supprimé avec succès.',
        'Fermer'
      );
    } catch (error) {
      console.error('Erreur lors de la suppression des données :', error);
      Notiflix.Report.failure(
        'Echec',
        'Echec lors de la suppression du département.',
        'Fermer'
      );
    }
  }

  const handleEdit = async(id, nom, parentId) => {
    setNom(nom);
    setParentId(parentId);
    if(parentId === '' || parentId === null) {
      setIsDepMother(true);
    }
    setFirstModalOpen(true);
    setAddOrEdit(true);
    setIdToEdit(id);
  }

  const handleAdd = async(parentId) => {
    setNom('');
    setParentId(parentId);
    setFirstModalOpen(true);
    setAddOrEdit(false);
  }

  const renderDepartementTree = (departement) => {
    const lineColor = "#2685fcff";
    const lineWidth = "2px";
    const lineBorderRadius = "10px";
  
    return (
      <TreeNode key={departement.id} departement={departement}>
        <Tree
          lineWidth={lineWidth}
          lineColor={lineColor}
          lineBorderRadius={lineBorderRadius}
          label={
            <div
              className="border-2 border-blue-500 w-[250px] max-w-full m-auto rounded-md h-[150px] p-2"
            >
              <h1 className="font-bold">
                {departement.nom} 
                <Tippy content="Ajouter">
                  <FontAwesomeIcon onClick={()=>handleAdd(departement.id)} className="mx-1 text-blue-500 cursor-pointer w-3" icon={faPlus}/>
                </Tippy> 
                <Tippy content="Modifier"><FontAwesomeIcon className="mx-1 text-blue-500 cursor-pointer w-3" onClick={() => handleEdit(departement.id, departement.nom, departement.gest_r_h_departement_id)} icon={faPen}/>
                  </Tippy>
                <Tippy content="Effacer">
                  <FontAwesomeIcon onClick={() => SupprimerDep(departement.id)} className="mx-1 text-red-500 cursor-pointer w-3" icon={faTrash}/>
                </Tippy>
              </h1>
              <button><FontAwesomeIcon icon={faPlus}/> </button>
            </div>
          }
        >
          {departement.enfants_departements?.map((enfant) => renderDepartementTree(enfant))}
        </Tree>
      </TreeNode>
    );
  };
  
    return (
      <>
        <Modal 
          isOpen={isFirstModalOpen} 
          onClose={() => {
            setFirstModalOpen(false);}}>
            <h1 className="text-md font-bold p-4">Nouveau departement</h1>
            <form onSubmit={addDepartement}>
              <div className="p-4">
                <label>Désignation du département</label>
                <input 
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-400 focus:outline-none"/>
              </div>
              <div className="p-4">
                <label>Département parent</label>
                <select
                  value={parentId}
                  onChange={(e) => {setParentId(e.target.value)}}
                  disabled={isDepMother}
                  className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-400 focus:outline-none"
                >
                  {isDepMother && (<><option value={parentId}></option></>)}
                  {departementOption.map((departement) => (
                    <option key={departement.id} value={departement.id}>
                      {departement.nom}
                    </option>
                  ))}
                </select>
                <button className="mt-4 bg-blue-500 px-4 py-2 text-white" type="submit">Enregistrer</button>
              </div>
            </form>
        </Modal>
        <h1 className="font-bold text-md">Structure de l'entreprise</h1>
        <div className="w-full my-2">
          <button
            className="bg-blue-500 text-white px-3 py-3"
            onClick={()=>setFirstModalOpen(true)}
          >
            Ajouter un département
          </button>
        </div>
        <div className="p-4 w-full">
          {isLoading ? (
            <>
              <Tree
                lineWidth="2px"
                lineColor="#fff"
                lineBorderRadius="10px"
                label={<div>
                  <Skeleton className="bg-gray-100 h-10 w-[90%] rounded" />
                  <Skeleton className="h-4 w-[75%]" />
                  <Skeleton className=" h-4 w-[50%]" />
                  </div>}
            >
                <TreeNode label={<div className="flex flex-col space-y-3">
                  <Skeleton className="bg-gray-100 h-10 w-[90%] rounded" />
                  <Skeleton className="h-4 w-[75%]" />
                  <Skeleton className=" h-4 w-[50%]" />
                </div>}>
                    <TreeNode label={<div className="flex flex-col space-y-3">
                      <Skeleton className="bg-gray-100 h-10 w-[90%] rounded" />
                      <Skeleton className="h-4 w-[75%]" />
                      <Skeleton className=" h-4 w-[50%]" />
                    </div>} />
                    <TreeNode label={<div className="flex flex-col space-y-3">
                      <Skeleton className="bg-gray-100 h-10 w-[90%] rounded" />
                      <Skeleton className="h-4 w-[75%]" />
                      <Skeleton className=" h-4 w-[50%]" />
                    </div>} />
                </TreeNode>
                <TreeNode label={<div className="flex flex-col space-y-3">
                  <Skeleton className="bg-gray-100 h-10 w-[90%] rounded" />
                  <Skeleton className="h-4 w-[75%]" />
                  <Skeleton className=" h-4 w-[50%]" />
                </div>} />
            </Tree>
            </>
          ) : (
            <>
              <div className="w-full overflow-auto py-8">
                {departements.length > 0 ? (
                  <>
                    {departements.map((departement) => renderDepartementTree(departement))}
                  </>
                ) : (
                  <p>Aucun departement</p>
                )}
              </div>
            </>
          )}
        </div>
      </>
    );
  }
  
  export default GestionStructurePage;