import { useState, useEffect, useContext } from "react";
import { ProjectContext } from "../contexte/useProject";
import { UrlContext } from "../contexte/useUrl";
import { ShowContext } from "../contexte/useShow";
import axios from "axios";

export default function GestionPlanning() {
  const {
    idProject,
    nomProjet,
    ligneBudgetaire,
    nomClient,
    nbJours,
    ListChefs,
    TJM,
    dateDebut,
    dateFin,
    LisGrandEtap,
    setLisGrandEtap,
    ListeMateriel,
    getOneProjet,
    ListJalon,
    categorie,
  } = useContext(ProjectContext);
  const { url } = useContext(UrlContext);
  const { setShowcreateJalon } = useContext(ShowContext);
  const [displayedJalons, setDisplayedJalons] = useState([]);
  const [verifyIfChef, setVerifyIfChef] = useState(false);

  function putAvencement(e, id) {
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    let formData = {
      avancement: e.target.value || "0",
    };
    const updatedTaches = LisGrandEtap.map((etape) => {
      return {
        ...etape,
        taches: etape.taches.map((tache) =>
          tache.id === id ? { ...tache, avancement: e.target.value } : tache
        ),
      };
    });
    setLisGrandEtap(updatedTaches);
    axios
      .put(`${url}/api/projets/taches/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {})
      .catch((err) => {
        console.error(err);
      });
  }

  const convertirDate = (date) => {
    if (date) {
      const [annee, mois, jour] = date.split("-").map(Number);
      return new Date(annee, mois - 1, jour);
    } else {
      return null;
    }
  };

  function incrementerIdParDate(taches) {
    let dateTracker = {};
    let currentId = 0;
    taches.responsables?.forEach((responsable) => {
      responsable.feuilles_temps?.forEach((feuille) => {
        if (feuille.date && !dateTracker[feuille.date]) {
          dateTracker[feuille.date] = true;
          currentId++;
        }
        feuille["incrId"] = currentId;
      });
    });

    return currentId;
  }

  const getSortedTasksAndJalons = (list) => {
    const allItems = [...list.taches, ...ListJalon];
    return allItems.sort((a, b) => {
      const dateA = a.date_debut || a.date;
      const dateB = b.date_debut || b.date;
      return convertirDate(dateA) - convertirDate(dateB);
    });
  };

  function showCreateJalon() {
    setShowcreateJalon(true);
  }

  useEffect(() => {
    const userString = localStorage.getItem("user");
    let user = JSON.parse(userString);
    let idIfChef;
    ListChefs.forEach((list) => {
      if (
        list.role === "chef" ||
        list.utilisateur.role === "admin"
      ) {
        idIfChef = list.utilisateur.id;
        if (user.id === idIfChef) {
          setVerifyIfChef(true);
        }
      }
    });
    getOneProjet(idProject);
  }, []);

  return (
    <>
      <div className="btngestPlanning  mt-2 text-xs flex flex-wrap justify-end ">
        {(categorie === "Mes projets" || verifyIfChef) && (
          <button
            onClick={showCreateJalon}
            className="bg-blue-500 text-white px-3 py-2 rounded mr-5 mt-2"
          >
            Ajouter un jalon
          </button>
        )}

        <button className="bg-blue-500 hidden text-white px-3 py-2 rounded mt-2  mr-5">
          Basculer vue ligne budgetaire
        </button>
        <button className="bg-blue-500 hidden text-white px-3 py-2 rounded mt-2 mr-5">
          Bouton Modifier / Enregistrer
        </button>
      </div>
      <div className="titreGestPlanning min-w-max mt-2 flex text-xs">
        <div className="border w-[440px] p-1 text-center">
          <div>Nombre d'écart de jour total actuelement</div>
        </div>
        <div className="border w-[440px]  p-1 text-center">
          <div>Date de fin de projet probable</div>
        </div>
        <div className="border w-[500px] flex  p-1">
          <b>Nom du projet : </b>
          <p>&nbsp;{nomProjet}</p>
        </div>
        <div className="border w-[500px] flex p-1">
          <b>NB jours : </b>
          <p>&nbsp;{nbJours}</p>
        </div>
      </div>
      <div className=" bodyGestPlanning min-w-max text-xs flex">
        <div className="border w-[440px] pl-1 flex flex-col justify-center">
          <p className=" h-[75%] flex justify-center items-center text-3xl font-bold">
            {LisGrandEtap.reduce((total, list) => {
              const ecartEtape = list.taches.reduce(
                (sum, t) =>
                  Number(sum) +
                  Number(t.charge_provisionnel) -
                  Number(incrementerIdParDate(t)),
                0
              );
              return total + ecartEtape;
            }, 0)}
          </p>
          <p className="text-blue-500  h-[20%] text-center">
            (Nombre jours de retard par rapport à la date previsionelle)
          </p>
        </div>
        <div className="border w-[440px] flex items-center justify-center">
          <p className="text-3xl font-bold">
            {dateFin.split("-").reverse().join("/")}
          </p>
        </div>
        <div className="border w-[500px] p-1">
          <div className="flex">
            <b>Ligne budgetaire : </b>
            <p>&nbsp;{ligneBudgetaire}</p>
          </div>
          <div className="flex  mt-1">
            <b>Clients :</b>
            <p>&nbsp;{nomClient}</p>
          </div>
          <div className="flex hidden mt-1">
            <b>Reference client :</b>
            <p>&nbsp;ref-sbz-njc-TT-001</p>
          </div>
          <div className="flex justify-between items-end mt-1 ">
            <div className="flex">
              <b>Chefs de projet :</b>
              {ListChefs.map(
                (list) =>
                  list.role === "chef" && (
                    <p key={list.id}>&nbsp;{list.utilisateur.nom}, </p>
                  )
              )}
            </div>
            <button className="p-1 bg-blue-500 hidden rounded text-white">
              Modifier
            </button>
          </div>
          <div className="flex hidden  mt-1">
            <b>Resssource humaire :</b>
            <p>&nbsp;Kevin, jean placide, …. (btn ajouter un Ress Hum)</p>
          </div>
        </div>
        <div className="border w-[500px] p-1">
          <div className="flex">
            <b>Taux Jour Moyen HT (€) : </b>
            <p>&nbsp;{TJM}</p>
          </div>
          <div className="flex  mt-1">
            <b>Total (€) :</b>
            <p>&nbsp;{TJM * nbJours}</p>
          </div>
          <div className="flex  mt-1">
            <b>Debut de projet :</b>
            <p>&nbsp;{dateDebut.split("-").reverse().join("/")}</p>
          </div>
          <div className="flex justify-between  items-end mt-1">
            <div className="flex">
              <b>Resp Hierarchique :</b>
              {ListChefs.map(
                (list) =>
                  list.role === "resp" && (
                    <p key={list.id}>&nbsp;{list.utilisateur.nom}, </p>
                  )
              )}
            </div>
            <button className="text-white hidden mr-2 p-1 bg-blue-500 rounded">
              Modifier
            </button>
          </div>
          {ListeMateriel.length !== 0 && (
            <div className="flex mt-1">
              <b>Ressource materielle :</b>
              {ListeMateriel.map((list) => (
                <p key={list.id}>&nbsp;{list.valeur}, </p>
              ))}
            </div>
          )}
        </div>
      </div>
      {LisGrandEtap.length !== 0 && (
        <div className="min-w-max">
          <div className=" bg-blue-300 flex px-3 mt-5 tableau border  text-sm py-2">
            <div className="w-[450px] border-gray-600 border-r">
              Grandes étapes et tâches
            </div>
            <div className="w-[150px] hidden border-gray-600 text-center border-r">
              Dépendance
            </div>
            <div className="w-[150px] border-gray-600 text-center border-r">
              Charge previsionel
            </div>
            <div className="w-[150px] border-gray-600 text-center border-r">
              Date debut prev
            </div>
            <div className="w-[200px] border-gray-600 text-center border-r">
              Date fin prev/charge
            </div>
            <div className="w-[150px] border-gray-600 text-center border-r">
              Date de fin réel
            </div>
            <div className="w-[150px] border-gray-600 text-center border-r">
              Ecart des jours
            </div>
            <div className="w-[200px] border-gray-600 text-center border-r">
              Avancement estimé
            </div>
            <div className="w-[250px] border-gray-600 text-center border-r">
              Etats du risque/avancement
            </div>
          </div>
          {/* {LisGrandEtap.map((list, index) => (
            <div key={list.id} className="mb-4">
              <div className="flex items-center px-3 tableau border text-sm ">
                <div className="w-[450px]  border-r text-left pr-2 overflow-auto break-words py-1">
                  {index + 1} - {list.nom}
                  <b className="text-blue-500">
                    {" "}
                    (
                    {list.taches.reduce(
                      (sum, t) => Number(sum) + Number(t.charge_provisionnel),
                      0
                    )}
                    j)
                  </b>
                </div>
                <div className="w-[150px] text-center border-r py-1"></div>
                <div className="w-[150px] text-center border-r py-1 text-blue-500 font-bold bg-gray-200">
                  {list.taches.reduce(
                    (sum, t) => Number(sum) + Number(t.charge_provisionnel),
                    0
                  )}
                </div>
                <div className="w-[150px] text-center border-r py-1 text-blue-500 font-bold">
                  {list.date_debut.split("-").reverse().join("/")}
                </div>
                <div className="w-[200px] text-center border-r py-1 text-blue-500 font-bold bg-gray-200">
                  {list.date_fin.split("-").reverse().join("/")}
                </div>
                <div className="w-[150px] text-center border-r py-1 text-blue-500 font-bold">
                  {list.date_fin.split("-").reverse().join("/")}
                </div>
                <div className="w-[150px] text-center border-r py-1 text-blue-500 font-bold">
                  {list.taches.reduce(
                    (sum, t) => Number(sum) + Number(t.charge_provisionnel),
                    0
                  ) -
                    list.taches.reduce(
                      (sum, t) => Number(sum) + incrementerIdParDate(t),
                      0
                    )}
                </div>
                <div className="w-[200px] text-center border-r py-1 text-blue-500 font-bold">
                  {list.taches.reduce(
                    (sum, t) => sum + Number(t.avancement || 0),
                    0
                  )}
                  %
                </div>
                {convertirDate(list.date_fin) >
                  convertirDate(list.date_limite) && (
                  <div className="w-[250px] text-center text-red-500 border-r py-1">
                    Depassement budget
                  </div>
                )}
                {convertirDate(list.date_fin) <=
                  convertirDate(list.date_limite) && (
                  <div className="w-[250px] text-center font-bold py-1 border-r text-green-500">
                    Normal
                  </div>
                )}
              </div>
              {ListJalon.map((list, idd) => (
                <div
                  key={list.id}
                  className=" flex items-center px-3 tableau border text-sm "
                >
                  <div className="w-[450px] pl-10  border-r text-left pr-2 overflow-auto break-words py-1 font-bold">
                    - Jalon {idd + 1} : {list.nom}
                  </div>
                  <div className="w-[150px]"></div>
                  <div className="w-[150px]"></div>
                  <div className="w-[150px] text-center">{list.date}</div>
                  <div className="w-[200px]"></div>
                  <div className="w-[150px] text-center border-r py-1"></div>
                  <div className="w-[150px]"></div>
                  <div className="w-[200px]"></div>
                  <div className="w-[250px]"></div>
                </div>
              ))}

              {list.taches.map((tache, idx) => (
                <div
                  key={tache.id}
                  className=" flex items-center px-3 tableau border text-sm "
                >
                  <div className="w-[450px] pl-5  border-r text-left pr-2 overflow-auto break-words py-1">
                    {index + 1} - {idx + 1} - {tache.titre}
                  </div>
                  <div className="w-[150px] text-center border-r py-1">1</div>
                  <div className="w-[150px] text-center border-r py-1">
                    {tache.charge_provisionnel}
                  </div>
                  <div className="w-[150px] text-center border-r py-1">
                    {tache.date_debut.split("-").reverse().join("/")}
                  </div>
                  <div className="w-[200px] text-center border-r py-1">
                    {tache.date_limite.split("-").reverse().join("/")}
                  </div>
                  <div className="w-[150px] text-center border-r py-1">
                    {tache.date_fin}
                  </div>
                  <div className="w-[150px] text-center border-r py-1">
                    {tache.charge_provisionnel - incrementerIdParDate(tache)}
                  </div>
                  <div className="w-[200px] text-center border-r py-1">
                    <input
                      type="number"
                      value={Number(tache.avancement) || ""}
                      onChange={(e) => putAvencement(e, tache.id)}
                      className="w-[200px] text-center border-r py-1 focus:outline-none"
                    />
                  </div>
                  {convertirDate(tache.date_fin) >
                    convertirDate(tache.date_limite) && (
                    <div className="w-[250px] text-center text-red-500 border-r py-1">
                      Depassement budget
                    </div>
                  )}
                  {convertirDate(tache.date_fin) <=
                    convertirDate(tache.date_limite) && (
                    <div className="w-[250px] text-center font-bold py-1 border-r text-green-500">
                      Normal
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))} */}
          {LisGrandEtap.map((list, index) => (
            <div key={list.id} className="mb-4">
              <div className="flex items-center px-3 tableau border text-sm ">
                <div className="w-[450px]  border-r text-left pr-2 overflow-auto break-words py-1">
                  {index + 1} - {list.nom}
                  <b className="text-blue-500">
                    {" "}
                    (
                    {list.taches.reduce(
                      (sum, t) => Number(sum) + Number(t.charge_provisionnel),
                      0
                    )}
                    j)
                  </b>
                </div>
                <div className="w-[150px] text-center hidden border-r py-1"></div>
                <div className="w-[150px] text-center border-r py-1 text-blue-500 font-bold bg-gray-200">
                  {list.taches.reduce(
                    (sum, t) => Number(sum) + Number(t.charge_provisionnel),
                    0
                  )}
                </div>
                <div className="w-[150px] text-center border-r py-1 text-blue-500 font-bold">
                  {list.date_debut.split("-").reverse().join("/")}
                </div>
                <div className="w-[200px] text-center border-r py-1 text-blue-500 font-bold bg-gray-200">
                  {list.date_fin.split("-").reverse().join("/")}
                </div>
                <div className="w-[150px] text-center border-r py-1 text-blue-500 font-bold">
                  {list.date_fin.split("-").reverse().join("/")}
                </div>
                <div className="w-[150px] text-center border-r py-1 text-blue-500 font-bold">
                  {list.taches.reduce(
                    (sum, t) => Number(sum) + Number(t.charge_provisionnel),
                    0
                  ) -
                    list.taches.reduce(
                      (sum, t) => Number(sum) + incrementerIdParDate(t),
                      0
                    )}
                </div>
                <div className="w-[200px] text-center border-r py-1 text-blue-500 font-bold">
                  {list.taches.reduce(
                    (sum, t) => sum + Number(t.avancement || 0),
                    0
                  )}
                  %
                </div>
                {convertirDate(list.date_fin) >
                  convertirDate(list.date_limite) && (
                  <div className="w-[250px] text-center text-red-500 border-r py-1">
                    Depassement budget
                  </div>
                )}
                {convertirDate(list.date_fin) <=
                  convertirDate(list.date_limite) && (
                  <div className="w-[250px] text-center font-bold py-1 border-r text-green-500">
                    Normal
                  </div>
                )}
              </div>
              {getSortedTasksAndJalons(list).map((item, idx) => {
                if (item.date_debut) {
                  return (
                    <div
                      key={item.id}
                      className=" flex items-center px-3 tableau border text-sm "
                    >
                      <div className="w-[450px] pl-5  border-r text-left pr-2 overflow-auto break-words py-1">
                        - {item.titre}
                      </div>
                      <div className="w-[150px] hidden text-center border-r py-1">
                        1
                      </div>
                      <div className="w-[150px] text-center border-r py-1">
                        {item.charge_provisionnel}
                      </div>
                      <div className="w-[150px] text-center border-r py-1">
                        {item.date_debut.split("-").reverse().join("/")}
                      </div>
                      <div className="w-[200px] text-center border-r py-1">
                        {item.date_limite.split("-").reverse().join("/")}
                      </div>
                      <div className="w-[150px] text-center border-r py-1">
                        {item.date_fin}
                      </div>
                      <div className="w-[150px] text-center border-r py-1">
                        {item.charge_provisionnel - incrementerIdParDate(item)}
                      </div>
                      <div className="w-[200px] text-center border-r py-1">
                        <input
                          type="number"
                          value={Number(item.avancement) || ""}
                          onChange={(e) => putAvencement(e, item.id)}
                          className="w-[200px] text-center border-r py-1 focus:outline-none"
                          disabled={
                            categorie !== "Mes projets" && !verifyIfChef
                          }
                        />
                      </div>
                      {convertirDate(item.date_fin) >
                        convertirDate(item.date_limite) && (
                        <div className="w-[250px] text-center text-red-500 border-r py-1">
                          Depassement budget
                        </div>
                      )}
                      {convertirDate(item.date_fin) <=
                        convertirDate(item.date_limite) && (
                        <div className="w-[250px] text-center font-bold py-1 border-r text-green-500">
                          Normal
                        </div>
                      )}
                    </div>
                  );
                } else if (item.gest_proj_etape_id === list.id) {
                  return (
                    <div
                      key={item.id}
                      className=" flex items-center px-3 tableau border text-sm "
                    >
                      <div className="w-[450px] pl-10  border-r text-left pr-2 overflow-auto break-words py-1 font-bold">
                        {"<>"} Jalon : {item.nom}
                      </div>
                      <div className="w-[150px] hidden"></div>
                      <div className="w-[150px]"></div>
                      <div className="w-[150px] text-center">
                        {item.date.split("-").reverse().join("/")}
                      </div>
                      <div className="w-[200px]"></div>
                      <div className="w-[150px] text-center border-r py-1"></div>
                      <div className="w-[150px]"></div>
                      <div className="w-[200px]"></div>
                      <div className="w-[250px]"></div>
                    </div>
                  );
                }
              })}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
