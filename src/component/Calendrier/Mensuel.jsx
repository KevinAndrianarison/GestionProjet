import styles from "../../styles/Calendrier.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Tippy from "@tippyjs/react";

export default function Mentuel() {
  return (
    <>
      <div className="head flex flex-wrap text-auto justify-between">
        <div className={styles.head}>
          <div className="flex items-end">
            <h1 className="flex  flex-wrap text-yellow-600 mr-2">
              - Validation des comptes rendus -
            </h1>
            <button className="hidden bg-green-200 px-5 text-sm rounded-sm py-1 hover:bg-green-500 hover:font-bold">
              Tout valider
            </button>
          </div>
          {/* <h1 className="text-xs  mt-2">
            <b>Nom de la ressource :</b> Jao RAKOTO
          </h1> */}
          {/* <h1 className="text-xs mt-1">
            <b>Nom du projet :</b> Module de gestion de proje
          </h1>
          <h1 className="text-xs mt-1">
            <b>Ligne budgetaire : </b> budget-Mod-gestProjet-sbz-softiceo-2024
          </h1>
          <h1 className="text-xs mt-1">
            <b>Periode : </b> <b>21/04/2024</b> à <b>28/04/2024</b>
          </h1>
          <h1 className="text-xs mt-1">
            <b>Chefs de projet :</b> Jao RAKOTO
          </h1> */}
        </div>
      </div>
      {/* <div className="min-w-max">
        <div className=" bg-blue-300 flex px-3 mt-5 tableau border  text-sm py-2">
          <div className="w-[450px] border-gray-600 border-r">
            Grandes étapes et tâches
          </div>
          <div className="w-[50px] border-gray-600 text-center border-r">
            Lun
          </div>
          <div className="w-[50px] border-gray-600 text-center border-r">
            Mar
          </div>
          <div className="w-[50px] border-gray-600 text-center border-r">
            Merc
          </div>
          <div className="w-[50px] border-gray-600 text-center border-r">
            Jeu
          </div>
          <div className="w-[50px] border-gray-600 text-center border-r">
            Ven
          </div>
          <div className="w-[25px]  border-gray-600 text-center border-r"></div>
          <div className="w-[50px] border-gray-600 text-center border-r">
            Lun
          </div>
          <div className="w-[50px] border-gray-600 text-center border-r">
            Mar
          </div>
          <div className="w-[50px] border-gray-600 text-center border-r">
            Merc
          </div>
          <div className="w-[50px] border-gray-600 text-center border-r">
            Jeu
          </div>
          <div className="w-[50px] border-gray-600 text-center border-r">
            Ven
          </div>
          <div className="w-[25px]  border-gray-600 text-center border-r"></div>
          <div className="w-[50px] border-gray-600 text-center border-r">
            Lun
          </div>
          <div className="w-[50px] border-gray-600 text-center border-r">
            Mar
          </div>
          <div className="w-[50px] border-gray-600 text-center border-r">
            Merc
          </div>
          <div className="w-[50px] border-gray-600 text-center border-r">
            Jeu
          </div>
          <div className="w-[50px] border-gray-600 text-center border-r">
            Ven
          </div>
          <div className="w-[25px]  border-gray-600 text-center border-r"></div>
          <div className="w-[50px] border-gray-600 text-center border-r">
            Lun
          </div>
          <div className="w-[50px] border-gray-600 text-center border-r">
            Mar
          </div>
          <div className="w-[50px] border-gray-600 text-center border-r">
            Merc
          </div>
          <div className="w-[50px] border-gray-600 text-center border-r">
            Jeu
          </div>
          <div className="w-[50px] border-gray-600 text-center border-r">
            Ven
          </div>
          <div className="w-[25px]  border-gray-600 text-center border-r"></div>
          <div className="w-[100px] border-gray-600  text-center">
            Total/projet
          </div>
        </div>
        <div className="flex px-3 tableau border text-sm ">
          <div className="w-[450px]  border-r text-right pr-2 py-1">
            <b>Total/jour </b>
          </div>
          <div className="w-[50px] text-center border-r py-1">1</div>
          <div className="w-[50px] text-center border-r py-1">1</div>
          <div className="w-[50px] text-center border-r py-1">1</div>
          <div className="w-[50px] text-center border-r py-1">1</div>
          <div className="w-[50px] text-center border-r py-1">1</div>
          <div className="w-[25px] text-center border-r py-1"></div>
          <div className="w-[50px] text-center border-r py-1">1</div>
          <div className="w-[50px] text-center border-r py-1">1</div>
          <div className="w-[50px] text-center border-r py-1">1</div>
          <div className="w-[50px] text-center border-r py-1">1</div>
          <div className="w-[50px] text-center border-r py-1">1</div>
          <div className="w-[25px] text-center border-r py-1"></div>
          <div className="w-[50px] text-center border-r py-1">1</div>
          <div className="w-[50px] text-center border-r py-1">1</div>
          <div className="w-[50px] text-center border-r py-1">1</div>
          <div className="w-[50px] text-center border-r py-1">1</div>
          <div className="w-[50px] text-center border-r py-1">1</div>
          <div className="w-[25px] text-center border-r py-1"></div>
          <div className="w-[50px] text-center border-r py-1">1</div>
          <div className="w-[50px] text-center border-r py-1">1</div>
          <div className="w-[50px] text-center border-r py-1">1</div>
          <div className="w-[50px] text-center border-r py-1">1</div>
          <div className="w-[50px] text-center border-r py-1">1</div>
          <div className="w-[25px] text-center border-r py-1"></div>
          <div className="w-[100px] text-center py-1">5</div>
        </div>
        <div>
          <div className="flex items-center px-3 tableau border text-sm ">
            <div className="w-[450px]  border-r text-left pr-2 overflow-auto break-words py-1">
              I - fonctionalité : Gestion de ligne budgétaire projet
              <b className="text-blue-500"> (80 jour)</b>
            </div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[25px] text-center border-r py-1"></div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[25px] text-center border-r py-1"></div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[25px] text-center border-r py-1"></div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[25px] text-center border-r py-1"></div>
            <div className="w-[100px] text-center  py-1">5</div>
          </div>
          <div className=" flex items-center px-3 tableau border text-sm ">
            <div className="w-[450px] pl-5  border-r text-left pr-2 overflow-auto break-words py-1">
              I - 1 - fonctionalité : Gestion de ligne budgétaire projet
            </div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[25px] text-center border-r py-1"></div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[25px] text-center border-r py-1"></div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[25px] text-center border-r py-1"></div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[25px] text-center border-r py-1"></div>
            <div className="w-[100px] text-center py-1">5</div>
          </div>
          <div className=" flex items-center px-3 tableau border text-sm ">
            <div className="w-[450px] pl-5  border-r text-left pr-2 overflow-auto break-words py-1">
              I - 1 - fonctionalité : Gestion de ligne budgétaire projet
            </div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[25px] text-center border-r py-1"></div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[25px] text-center border-r py-1"></div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[25px] text-center border-r py-1"></div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[25px] text-center border-r py-1"></div>
            <div className="w-[100px] text-center py-1">5</div>
          </div>
        </div>
        <div className="mt-5">
          <div className="flex items-center px-3 tableau border text-sm ">
            <div className="w-[450px]  border-r text-left pr-2 overflow-auto break-words py-1">
              I - fonctionalité : Gestion de ligne budgétaire projet
              <b className="text-blue-500"> (80 jour)</b>
            </div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[25px] text-center border-r py-1"></div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[25px] text-center border-r py-1"></div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[25px] text-center border-r py-1"></div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[25px] text-center border-r py-1"></div>
            <div className="w-[100px] text-center  py-1">5</div>
          </div>
          <div className=" flex items-center px-3 tableau border text-sm ">
            <div className="w-[450px] pl-5  border-r text-left pr-2 overflow-auto break-words py-1">
              I - 1 - fonctionalité : Gestion de ligne budgétaire projet
            </div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[25px] text-center border-r py-1"></div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[25px] text-center border-r py-1"></div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[25px] text-center border-r py-1"></div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[25px] text-center border-r py-1"></div>
            <div className="w-[100px] text-center  py-1">5</div>
          </div>
          <div className=" flex items-center px-3 tableau border text-sm ">
            <div className="w-[450px] pl-5  border-r text-left pr-2 overflow-auto break-words py-1">
              I - 1 - fonctionalité : Gestion de ligne budgétaire projet
            </div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[25px] text-center border-r py-1"></div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[25px] text-center border-r py-1"></div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[25px] text-center border-r py-1"></div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[50px] text-center border-r py-1">1</div>
            <div className="w-[25px] text-center border-r py-1"></div>
            <div className="w-[100px] text-center  py-1">5</div>
          </div>
        </div>
      </div> */}
      <div className=" max-h-[65vh] overflow-y-auto mt-2">
        <div className="flex border px-2 text-sm font-bold py-1 bg-blue-300">
          <div className="w-[5%]">
            <Tippy content="Tout sélectionner">
              <input type="checkbox" />
            </Tippy>
          </div>
          <li className="w-[35%]">Nom </li>
          <li className="w-[35%]">Tâches </li>
          <li className="w-[10%]">Date </li>
          <li className="w-[10%] text-center">Heures </li>
          <li className="w-[5%] text-center"></li>
        </div>
        <div className="flex border px-2 text-xs py-1">
          <div className="w-[5%]">
            <input type="checkbox" />
          </div>
          <li className="w-[35%]">Steeve </li>
          <li className="w-[35%]">Tâches 1 </li>
          <li className="w-[10%]">20-10-2020 </li>
          <li className="w-[10%] text-center">8 </li>

          <li className="w-[5%] text-center">
            <Tippy content="Valider">
              <FontAwesomeIcon
                icon={faArrowRight}
                className="w-5 text-green-500 cursor-pointer focus:outline-none"
              />
            </Tippy>
          </li>
        </div>
      </div>
    </>
  );
}
