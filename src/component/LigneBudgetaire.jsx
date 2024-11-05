export default function LigneBudgetaire() {
  return (
    <>
      <>
        <div className="btngestPlanning mt-2 text-xs flex flex-wrap justify-end ">
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
            <p>&nbsp;Module de gestion de projet</p>
          </div>
          <div className="border w-[500px] flex p-1">
            <b>NB jours : </b>
            <p>&nbsp;120</p>
          </div>
        </div>
        <div className=" bodyGestPlanning min-w-max text-xs flex">
          <div className="border w-[300px] pl-1 flex flex-col justify-center">
            <p className=" h-[75%] flex justify-center items-center text-3xl font-bold text-green-500">
              66%
            </p>
            <p className="text-blue-500  h-[20%] text-center">
              {" "}
              Consomation budget &gt; Avancement projet{" "}
            </p>
          </div>
          <div className="border w-[300px] flex items-center justify-center">
            <p className="text-3xl font-bold">70%</p>
          </div>
          <div className="border w-[500px] p-1">
            <div className="flex">
              <b>Ligne budgetaire : </b>
              <p className="text-red-500">
                &nbsp;budget-Mod-gestProjet-sbz-softiceo-2024
              </p>
            </div>
            <div className="flex  mt-1">
              <b>Clients :</b>
              <p>&nbsp;Sendbazar - Njary consulting - Tsara Tech</p>
            </div>
            <div className="flex  mt-1">
              <b>Reference client :</b>
              <p>&nbsp;ref-sbz-njc-TT-001</p>
            </div>
            <div className="flex justify-between items-end mt-1">
              <div className="flex">
                <b>Chefs de projet :</b>
                <p>&nbsp;Vola BERIZIKY (BackUp : Jean DUPONT) </p>
              </div>
              <button className="p-1 bg-blue-500 rounded text-white">
                Modifier
              </button>
            </div>
            <div className="flex  mt-1">
              <b>Resssource humaire :</b>
              <p>&nbsp;Kevin, jean placide, …. (btn ajouter un Ress Hum)</p>
            </div>
          </div>
          <div className="border w-[500px] p-1">
            <div className="flex">
              <b>Taux Jour Moyen HT (€) : </b>
              <p>&nbsp;100</p>
            </div>
            <div className="flex  mt-1">
              <b>Total (€) :</b>
              <p>&nbsp;12 000</p>
            </div>
            <div className="flex  mt-1">
              <b>Debut de projet :</b>
              <p>&nbsp;10/09/2024</p>
            </div>
            <div className="flex justify-between  items-end mt-1">
              <div className="flex">
                <b>Resp Hierarchique :</b>
                <p>&nbsp;Erica F, Arnaud V, ... </p>
              </div>
              <button className="text-white mr-2 p-1 bg-blue-500 rounded">
                Modifier
              </button>
            </div>
            <div className="flex justify-between  items-end mt-1">
              <div className="flex">
                <b>Ressource materielle :</b>
                <p>&nbsp;3 srv en dev, 6 srv PROD (btn Ajouter R M)</p>
              </div>
              <button className="text-white mr-2 p-1 bg-blue-500 rounded">
                Modifier
              </button>
            </div>
          </div>
        </div>
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
              Avancement estimé
            </div>
            <div className="w-[250px] border-gray-600 text-center border-r">
              Etats du risque/avancement
            </div>
          </div>
          <div>
            <div className="flex items-center px-3 tableau border text-sm ">
              <div className="w-[450px]  border-r text-left pr-2 overflow-auto break-words py-1">
                I - fonctionalité : Gestion de ligne budgétaire projet
                <b className="text-blue-500"> (80 jour)</b>
              </div>
              <div className="w-[200px] text-center border-r py-1"></div>
              <div className="w-[200px] text-center border-r py-1 text-blue-500 font-bold">
                80
              </div>
              <div className="w-[150px] text-center border-r py-1 text-blue-500 font-bold">
                5
              </div>
              <div className="w-[250px] text-center border-r py-1 text-blue-500 font-bold">
                70%
              </div>
              <div className="w-[200px] text-center border-r py-1 text-blue-500 font-bold">
                75%
              </div>
              <div className="w-[250px] text-center  py-1 border-r bg-green-500">
                Normal
              </div>
            </div>
            <div className=" flex items-center px-3 tableau border text-sm ">
              <div className="w-[450px] pl-5  border-r text-left pr-2 overflow-auto break-words py-1">
                I - 1 - fonctionalité : Gestion de ligne budgétaire projet
              </div>
              <div className="w-[200px] text-center border-r py-1">1</div>
              <div className="w-[200px] text-center border-r py-1">1</div>
              <div className="w-[150px] text-center border-r py-1">15</div>
              <div className="w-[250px] text-center border-r py-1">30%</div>
              <div className="w-[200px] text-center border-r py-1">5%</div>
              <div className="w-[250px] text-center text-red-500 border-r py-1">
                Depassement budget
              </div>
            </div>
            <div className=" flex items-center px-3 tableau border text-sm ">
              <div className="w-[450px] pl-5  border-r text-left pr-2 overflow-auto break-words py-1">
                I - 2 - fonctionalité : Gestion de ligne budgétaire projet
              </div>
              <div className="w-[200px] text-center border-r py-1">1</div>
              <div className="w-[200px] text-center border-r py-1">1</div>
              <div className="w-[150px] text-center border-r py-1">20</div>
              <div className="w-[250px] text-center border-r py-1">0%</div>
              <div className="w-[200px] text-center border-r py-1">5%</div>
              <div className="w-[250px] text-center text-red-500 border-r py-1">
                Depassement budget
              </div>
            </div>
          </div>
          <div className="mt-5">
            <div className="flex items-center px-3 tableau border text-sm ">
              <div className="w-[450px]  border-r text-left pr-2 overflow-auto break-words py-1">
                I - fonctionalité : Gestion de ligne budgétaire projet
                <b className="text-blue-500"> (80 jour)</b>
              </div>
              <div className="w-[200px] text-center border-r py-1"></div>
              <div className="w-[200px] text-center border-r py-1 text-blue-500 font-bold">
                80
              </div>
              <div className="w-[150px] text-center border-r py-1 text-blue-500 font-bold">
                5
              </div>
              <div className="w-[250px] text-center border-r py-1 text-blue-500 font-bold ">
                5%
              </div>
              <div className="w-[200px] text-center border-r py-1 text-blue-500 font-bold ">
                56%
              </div>
              <div className="w-[250px] text-center border-r py-1 bg-red-400">
                Dépassement budget
              </div>
            </div>
            <div className=" flex items-center px-3 tableau border text-sm ">
              <div className="w-[450px] pl-5  border-r text-left pr-2 overflow-auto break-words py-1">
                I - 1 - fonctionalité : Gestion de ligne budgétaire projet
              </div>
              <div className="w-[200px] text-center border-r py-1">1</div>
              <div className="w-[200px] text-center border-r py-1">1</div>
              <div className="w-[150px] text-center border-r py-1">11</div>
              <div className="w-[250px] text-center border-r py-1">52%</div>
              <div className="w-[200px] text-center border-r py-1">1%</div>
              <div className="w-[250px] text-center border-r py-1">Normal</div>
            </div>
          </div>
          <div className=" text-xs flex flex-col btnFlex">
            <button className="bg-blue-500 text-white rounded border mt-2 w-60 py-1">
              Ajouter une tache dans l'étape
            </button>
            <button className="bg-blue-500 text-white rounded border mt-2 w-60 py-1">
              Ajouter une grande étape
            </button>
          </div>
        </div>
      </>
    </>
  );
}
