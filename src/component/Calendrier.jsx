import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDay,
  faCalendarWeek,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Hebdomadaire from "./Calendrier/Hebdomadaire";
import Mensuel from "./Calendrier/Mensuel";

export default function Calendrier() {
  const [isMensuel, setIsmentuel] = useState(false);
  const [isHebd, setIshebd] = useState(true);

  return (
    <>
      <div className="flex ">
        <div
          onClick={() => {
            setIsmentuel(false);
            setIshebd(true);
          }}
          className={
            isHebd
              ? "px-3 py-1 bg-yellow-500 cursor"
              : "px-3 py-1 cursor-pointer"
          }
        >
          {" "}
          <FontAwesomeIcon icon={faCalendarDay} /> Hebdomadaire
        </div>
        <div
          onClick={() => {
            setIshebd(false);
            setIsmentuel(true);
          }}
          className={
            isMensuel
              ? "px-3 py-1 bg-yellow-500 cursor"
              : "px-3 py-1 cursor-pointer"
          }
        >
          {" "}
          <FontAwesomeIcon icon={faCalendarWeek} /> Mensuel
        </div>
      </div>
      {isHebd && (
        <div className="mt-2 overflow-x-auto min-h-[65vh] p-3">
          <Hebdomadaire />
        </div>
      )}
      {isMensuel && (
        <div className="mt-2 overflow-x-auto min-h-[65vh] p-3">
          <Mensuel />
        </div>
      )}
    </>
  );
}
