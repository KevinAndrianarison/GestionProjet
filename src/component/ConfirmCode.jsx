import "../styles/ConfirmCode.css";
import { UserContext } from "../contexte/useUser";
import { useContext, useState } from "react";
import { ShowContext } from "../contexte/useShow";
import { MessageContext } from "../contexte/useMessage";
import { UrlContext } from "../contexte/useUrl";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export default function ConfirmCode() {
  const { emailTovalidate } = useContext(UserContext);
  const {
    setShowSpinner,
    setShowConfirmMdp,
    setShowSignUpComponent,
    setShowLoginComponent,
  } = useContext(ShowContext);
  const { setMessageSucces, setMessageError } = useContext(MessageContext);
  const { url } = useContext(UrlContext);

  const [codeDeValiation, setCodeDeValidation] = useState("");

  function closeValideCompte() {
    setShowConfirmMdp(false);
  }

  function validateCompte() {
    setShowSpinner(true);
    let formData = {
      email: emailTovalidate,
      verification_code: codeDeValiation,
    };

    axios
      .post(`${url}/api/verify-email`, formData)
      .then((response) => {
        if (response.data.message === "Email vérifié avec succès") {
          setMessageSucces("Vérification du compte réussie !");
          setShowSpinner(false);
          setCodeDeValidation(null);
          setShowConfirmMdp(false);
          setShowSignUpComponent(false);
          setShowLoginComponent(true);
          setTimeout(() => {
            setMessageError("");
          }, 5000);
        }
        if (response.data.message === "Code de vérification incorrect.") {
          setMessageError("Erreur : code incorrect !");
          setShowSpinner(false);
          setCodeDeValidation(null);
          setTimeout(() => {
            setMessageError("");
          }, 5000);
        }
      })
      .catch((err) => {
        console.error(err);
        setShowSpinner(false);
      });
  }

  return (
    <div className="showModal">
      <div className="formModale">
        <FontAwesomeIcon
          icon={faTimes}
          onClick={closeValideCompte}
          className="close-icon"
        />
        <h1>
          📧 Un <b>code de validation</b> vous a été envoyé à "
          <b>{emailTovalidate}</b>", Veuillez vérifier votre boîte de réception,{" "}
          <b>copier</b> ce code, puis le coller dans le champ ci-dessous afin de{" "}
          <b>valider votre compte</b>.
        </h1>
        <div className="content">
          <input
            type="text"
            onChange={(e) => {
              setCodeDeValidation(e.target.value);
            }}
            className="w-full pl-3 pr-3 mt-5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
          />
          <button
            className="w-full btnValiderCode mt-2"
            onClick={validateCompte}
          >
            Valider
          </button>
        </div>
      </div>
    </div>
  );
}
