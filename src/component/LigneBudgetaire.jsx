import { useState, useEffect, useContext } from "react";
import { ProjectContext } from "../contexte/useProject";
import { UrlContext } from "../contexte/useUrl";
import axios from "axios";

export default function LigneBudgetaire() {
  const {
    getOneProjet,
    idProject,
    nomProjet,
    ligneBudgetaire,
    nomClient,
    nbJours,
    ListChefs,
    TJM,
    dateDebut,
    LisGrandEtap,
    setLisGrandEtap,
    ListeMateriel,
    categorie,
  } = useContext(ProjectContext);
  const { url } = useContext(UrlContext);

  const [verifyIfChef, setVerifyIfChef] = useState(false);

  useEffect(() => {
    const userString = localStorage.getItem("user");
    let user = JSON.parse(userString);
    let idIfChef;
    ListChefs.forEach((list) => {
      if (list.role === "chef" || list.utilisateur.role === "admin") {
        idIfChef = list.utilisateur.id;
        if (user.id === idIfChef) {
          setVerifyIfChef(true);
        }
      }
    });
    getOneProjet(idProject);
  }, []);

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

  return (
    <>
      <>
        <div className="btngestPlanning mt-2 text-xs flex flex-wrap justify-end hidden">
          <button className="bg-blue-500 text-white px-3 py-2 rounded mt-2  mr-5">
            Basculer vue planning
          </button>
          <button className="bg-blue-500 text-white px-3 py-2 rounded mt-2 mr-5">
            Bouton Modifier / Enregistrer
          </button>
        </div>
        <div className="titreGestPlanning min-w-max mt-2 flex text-xs">
          <div className="border w-[300px] p-1 text-center">
            <div>Consommation global du buget </div>
          </div>
          <div className="border w-[300px]  p-1 text-center">
            <div>Avancement global estimé</div>
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
          <div className="border w-[300px] pl-1 flex flex-col justify-center">
            <p className="h-[75%] flex justify-center items-center text-3xl font-bold text-green-500">
              {LisGrandEtap.length > 0
                ? (
                    LisGrandEtap.reduce(
                      (totalConsommation, etape) =>
                        totalConsommation +
                        etape.taches.reduce(
                          (sum, tache) =>
                            sum +
                            (incrementerIdParDate(tache) /
                              Number(tache.charge_provisionnel || 1)) *
                              100,
                          0
                        ),
                      0
                    ) / LisGrandEtap.length
                  ).toFixed(2)
                : 0}
              %
            </p>
            <p className="text-blue-500 hidden h-[20%] text-center">
              {" "}
              Consomation budget &gt; Avancement projet{" "}
            </p>
          </div>
          <div className="border w-[300px] flex items-center justify-center">
            <p className="text-3xl font-bold">
              {LisGrandEtap.length > 0
                ? (
                    LisGrandEtap.reduce(
                      (totalAvancement, etape) =>
                        totalAvancement +
                        etape.taches.reduce(
                          (sum, tache) => sum + Number(tache.avancement || 0),
                          0
                        ),
                      0
                    ) / LisGrandEtap.length
                  ).toFixed(2)
                : 0}
              %
            </p>{" "}
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
            <div className="flex justify-between items-end mt-1">
              <div className="flex">
                <b>Chefs de projet :</b>
                {ListChefs.map(
                  (list) =>
                    list.role === "chef" && (
                      <p key={list.id}>&nbsp;{list.utilisateur.nom}, </p>
                    )
                )}
              </div>
              <button className="p-1 hidden bg-blue-500 rounded text-white">
                Modifier
              </button>
            </div>
            <div className="flex hidden mt-1">
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
            <div className="flex justify-between  items-end mt-1">
              {ListeMateriel.length !== 0 && (
                <div className="flex">
                  <b>Ressource materielle :</b>
                  {ListeMateriel.map((list) => (
                    <p key={list.id}>&nbsp;{list.valeur}, </p>
                  ))}
                </div>
              )}
              <button className="text-white hidden mr-2 p-1 bg-blue-500 rounded">
                Modifier
              </button>
            </div>
          </div>
        </div>
        {LisGrandEtap.length !== 0 && (
          <div className="min-w-max">
            <div className=" bg-blue-300 flex px-3 mt-5 tableau border  text-sm py-2">
              <div className="w-[450px] border-gray-600 border-r">
                Grandes étapes et tâches
              </div>
              <div className="w-[200px] border-gray-600 text-center border-r">
                Charge PREVISIONEL
              </div>
              <div className="w-[200px] border-gray-600 text-center border-r">
                Charge réelle consommée
              </div>
              <div className="w-[150px] border-gray-600 text-center border-r">
                Temps restant
              </div>
              <div className="w-[250px] border-gray-600 text-center border-r">
                Consomation budgetaire (%)
              </div>
              <div className="w-[200px] border-gray-600 text-center border-r">
                Avancement estimé (%)
              </div>
              <div className="w-[250px] border-gray-600 text-center border-r">
                Etats du risque/avancement
              </div>
            </div>
            {LisGrandEtap.map((list, index) => (
              <div key={list.id} className="mb-4">
                <div className="flex items-center px-3 tableau border text-sm ">
                  <div className="w-[450px]  border-r text-left pr-2 overflow-auto break-words py-1">
                    {index + 1} - {list.nom}
                    <b className="ml-1 text-blue-500">
                      (
                      {list.taches.reduce(
                        (sum, t) => Number(sum) + Number(t.charge_provisionnel),
                        0
                      )}
                      j)
                    </b>
                  </div>
                  <div className="w-[200px] text-center border-r py-1">
                    {list.taches.reduce(
                      (sum, t) => Number(sum) + Number(t.charge_provisionnel),
                      0
                    )}
                  </div>
                  <div className="w-[200px] text-center border-r py-1 text-blue-500 font-bold">
                    {list.taches.reduce(
                      (sum, t) => Number(sum) + incrementerIdParDate(t),
                      0
                    )}
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
                  <div className="w-[250px] text-center border-r py-1 text-blue-500 font-bold">
                    {list.taches.reduce(
                      (sum, t) =>
                        sum +
                        (incrementerIdParDate(t) /
                          Number(t.charge_provisionnel)) *
                          100,
                      0
                    )}
                    %
                  </div>
                  <div className="w-[200px] text-center border-r py-1 text-blue-500 font-bold">
                    {list.taches.reduce(
                      (sum, t) => sum + Number(t.avancement || 0),
                      0
                    )}
                    %
                  </div>
                  {list.taches.reduce(
                    (sum, t) =>
                      sum +
                      (incrementerIdParDate(t) /
                        Number(t.charge_provisionnel)) *
                        100,
                    0
                  ) <=
                    list.taches.reduce(
                      (sum, t) => sum + Number(t.avancement || 0),
                      0
                    ) && (
                    <div className="w-[250px] text-center  py-1 border-r bg-green-500">
                      Normal
                    </div>
                  )}
                  {list.taches.reduce(
                    (sum, t) =>
                      sum +
                      (incrementerIdParDate(t) /
                        Number(t.charge_provisionnel)) *
                        100,
                    0
                  ) >
                    list.taches.reduce(
                      (sum, t) => sum + Number(t.avancement || 0),
                      0
                    ) && (
                    <div className="w-[250px] text-center text-red-500 border-r py-1">
                      Depassement budget
                    </div>
                  )}
                </div>
                {list.taches.map((tache, idx) => (
                  <div
                    key={tache.id}
                    className=" flex items-center px-3 tableau border text-sm "
                  >
                    <div className="w-[450px] pl-5  border-r text-left pr-2 overflow-auto break-words py-1">
                      {index + 1} - {idx + 1} - {tache.titre}
                    </div>
                    <div className="w-[200px] text-center border-r py-1">
                      {tache.charge_provisionnel}
                    </div>
                    <div className="w-[200px] text-center border-r py-1">
                      {incrementerIdParDate(tache)}
                    </div>
                    <div className="w-[150px] text-center border-r py-1">
                      {tache.charge_provisionnel - incrementerIdParDate(tache)}
                    </div>
                    <div className="w-[250px] text-center border-r py-1">
                      {(incrementerIdParDate(tache) /
                        tache.charge_provisionnel) *
                        100}
                      %
                    </div>
                    <input
                      type="number"
                      value={Number(tache.avancement) || ""}
                      onChange={(e) => putAvencement(e, tache.id)}
                      disabled={categorie !== "Mes projets" && !verifyIfChef}
                      className="w-[200px] text-center border-r py-1 focus:outline-none"
                    />

                    {(incrementerIdParDate(tache) / tache.charge_provisionnel) *
                      100 >
                      Number(tache.avancement) && (
                      <div className="w-[250px] text-center text-red-500 border-r py-1">
                        Depassement budget
                      </div>
                    )}
                    {(incrementerIdParDate(tache) / tache.charge_provisionnel) *
                      100 <=
                      Number(tache.avancement) && (
                      <div className="w-[250px] text-center  py-1 border-r bg-green-500">
                        Normal
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}

            <div className=" text-xs flex flex-col hidden btnFlex">
              <button className="bg-blue-500 text-white rounded border mt-2 w-60 py-1">
                Ajouter une tache dans l'étape
              </button>
              <button className="bg-blue-500 text-white rounded border mt-2 w-60 py-1">
                Ajouter une grande étape
              </button>
            </div>
          </div>
        )}
      </>
    </>
  );
}
