import "./styles/LoginPage.css";
import LoginComponent from "./component/LoginComponent";
import { ShowContext } from "./contexte/useShow";
import { useContext } from "react";
import logosofticeo from "./images/logosofticeo.png";

export function LoginPage() {
  const { showLoginComponent } = useContext(ShowContext);

  return (
    <div className="main">
      <div className="absolute max-w-[100%] p-8 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] border rounded-2xl">
        <div className="m-auto w-60 mb-8">
          <img className="w-60" src={logosofticeo} alt="Sofiticeo" />
        </div>
        {showLoginComponent && <LoginComponent />}
      </div>
    </div>
  );
}
