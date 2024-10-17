import "./styles/LoginPage.css";
import LoginComponent from "./component/LoginComponent";
import { ShowContext } from "./contexte/useShow";
import { useContext } from "react";

export function LoginPage() {
  const { showLoginComponent } = useContext(ShowContext);

  return (
    <div className="main">
      <div className="login">
        <div className="logo"></div>
        {showLoginComponent && <LoginComponent />}
      </div>
    </div>
  );
}
