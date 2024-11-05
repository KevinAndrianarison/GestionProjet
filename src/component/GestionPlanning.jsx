export default function GestionPlanning() {
  return (
    <>
      <div className="btngestPlanning mt-2 text-xs flex flex-wrap justify-end ">
        <button className="bg-blue-500 text-white px-3 py-2 rounded mr-5 mt-2">
          Ajouter un jalon
        </button>
        <button className="bg-blue-500 text-white px-3 py-2 rounded mt-2  mr-5">
          Basculer vue ligne budgetaire
        </button>
        <button className="bg-blue-500 text-white px-3 py-2 rounded mt-2 mr-5">
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
          <p>&nbsp;Module de gestion de projet</p>
        </div>
        <div className="border w-[500px] flex p-1">
          <b>NB jours : </b>
          <p>&nbsp;120</p>
        </div>
      </div>
      <div className=" bodyGestPlanning min-w-max text-xs flex">
        <div className="border w-[440px] pl-1 flex flex-col justify-center">
          <p className=" h-[75%] flex justify-center items-center text-3xl font-bold">
            3
          </p>
          <p className="text-blue-500  h-[20%] text-center">
            (Nombre jours de retard par rapportà la date previsionelle)
          </p>
        </div>
        <div className="border w-[440px] flex items-center justify-center">
          <p className="text-3xl font-bold">02/10/2025</p>
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
          <div className="flex  mt-1">
            <b>Ressource materielle :</b>
            <p>&nbsp;3 srv en dev, 6 srv PROD (btn Ajouter R M)</p>
          </div>
        </div>
      </div>
      <div className="min-w-max">
        <div className=" bg-blue-300 flex px-3 mt-5 tableau border  text-sm py-2">
          <div className="w-[450px] border-gray-600 border-r">
            Grandes étapes et tâches
          </div>
          <div className="w-[150px] border-gray-600 text-center border-r">
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
        <div>
          <div className="flex items-center px-3 tableau border text-sm ">
            <div className="w-[450px]  border-r text-left pr-2 overflow-auto break-words py-1">
              I - fonctionalité : Gestion de ligne budgétaire projet
              <b className="text-blue-500"> (80 jour)</b>
            </div>
            <div className="w-[150px] text-center border-r py-1"></div>
            <div className="w-[150px] text-center border-r py-1 text-blue-500 font-bold bg-gray-200">
              80
            </div>
            <div className="w-[150px] text-center border-r py-1 text-blue-500 font-bold">
              20/10/2024
            </div>
            <div className="w-[200px] text-center border-r py-1 text-blue-500 font-bold bg-gray-100">
              20/10/2024
            </div>
            <div className="w-[150px] text-center border-r py-1 text-blue-500 font-bold">
              20/10/2024
            </div>
            <div className="w-[150px] text-center border-r py-1 text-blue-500 font-bold">
              5
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
            <div className="w-[150px] text-center border-r py-1">1</div>
            <div className="w-[150px] text-center border-r py-1 bg-gray-200">
              1
            </div>
            <div className="w-[150px] text-center border-r py-1">
              20/10/2024
            </div>
            <div className="w-[200px] text-center border-r py-1 bg-gray-100">
              20/10/2024
            </div>
            <div className="w-[150px] text-center border-r py-1">
              20/10/2024
            </div>
            <div className="w-[150px] text-center border-r py-1">1</div>
            <div className="w-[200px] text-center border-r py-1">5%</div>
            <div className="w-[250px] text-center text-red-500 border-r py-1">
              Depassement budget
            </div>
          </div>
          <div className=" flex items-center px-3 tableau border text-sm ">
            <div className="w-[450px] pl-10  border-r text-left pr-2 overflow-auto break-words py-1 font-bold">
              - Jalon 1 : presentation au client des premier resultat
            </div>
            <div className="w-[150px] text-center border-r py-1">1</div>
            <div className="w-[150px] text-center border-r py-1 bg-gray-200">
              1
            </div>
            <div className="w-[150px] text-center border-r py-1">
              20/10/2024
            </div>
            <div className="w-[200px] text-center border-r py-1 bg-gray-100">
              20/10/2024
            </div>
            <div className="w-[150px] text-center border-r py-1">
              20/10/2024
            </div>
            <div className="w-[150px] text-center border-r py-1">1</div>
            <div className="w-[200px] text-center border-r py-1">11%</div>
            <div className="w-[250px] text-center border-r py-1">Normal</div>
          </div>
          <div className=" flex items-center px-3 tableau border text-sm ">
            <div className="w-[450px] pl-5  border-r text-left pr-2 overflow-auto break-words py-1">
              I - 2 - fonctionalité : Gestion de ligne budgétaire projet
            </div>
            <div className="w-[150px] text-center border-r py-1">1</div>
            <div className="w-[150px] text-center border-r py-1 bg-gray-200">
              1
            </div>
            <div className="w-[150px] text-center border-r py-1">
              20/10/2024
            </div>
            <div className="w-[200px] text-center border-r py-1 bg-gray-100">
              20/10/2024
            </div>
            <div className="w-[150px] text-center border-r py-1">
              20/10/2024
            </div>
            <div className="w-[150px] text-center border-r py-1">1</div>
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
            <div className="w-[150px] text-center border-r py-1"></div>
            <div className="w-[150px] text-center border-r py-1 text-blue-500 font-bold bg-gray-200">
              80
            </div>
            <div className="w-[150px] text-center border-r py-1 text-blue-500 font-bold">
              20/10/2024
            </div>
            <div className="w-[200px] text-center border-r py-1 bg-gray-100 text-blue-500 font-bold">
              20/10/2024
            </div>
            <div className="w-[150px] text-center border-r py-1 text-blue-500 font-bold ">
              20/10/2024
            </div>
            <div className="w-[150px] text-center border-r py-1 text-blue-500 font-bold ">
              -2
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
            <div className="w-[150px] text-center border-r py-1">1</div>
            <div className="w-[150px] text-center border-r py-1 bg-gray-200">
              1
            </div>
            <div className="w-[150px] text-center border-r py-1">
              20/10/2024
            </div>
            <div className="w-[200px] text-center border-r py-1 bg-gray-100">
              20/10/2024
            </div>
            <div className="w-[150px] text-center border-r py-1">
              20/10/2024
            </div>
            <div className="w-[150px] text-center border-r py-1">1</div>
            <div className="w-[200px] text-center border-r py-1">1%</div>
            <div className="w-[250px] text-center border-r py-1">Normal</div>
          </div>
        </div>
      </div>
    </>
  );
}
