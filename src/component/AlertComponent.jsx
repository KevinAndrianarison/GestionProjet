import "../styles/AlertComponent.css";
import { MessageContext } from "../contexte/useMessage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import {
  faCheckCircle,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";

export default function AlertComponent() {
  const { messageSucces, messageError } = useContext(MessageContext);

  return (
    <>
      <div className="alert">
        {messageSucces && (
          <div className="alert-content success">
            <FontAwesomeIcon
              icon={faCheckCircle}
              className="alert-icon mb-2 w-5 h-5"
            />
            <p>{messageSucces}</p>
          </div>
        )}
        {messageError && (
          <div className="alert-content danger">
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="alert-icon mb-2 w-5 h-5"
            />
            <p>{messageError}</p>
          </div>
        )}
      </div>
    </>
  );
}
