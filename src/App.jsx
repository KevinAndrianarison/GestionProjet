import "./App.css";
import { LoginPage } from "./LoginPage";
import Overlay from "./component/Overlay";
import { ShowContext } from "./contexte/useShow";
import { useContext, useEffect } from "react";
import MainPage from "./views/MainPage";
import AlertComponent from "./component/AlertComponent";
import ConfirmCode from "./component/ConfirmCode";
import LogoutComponent from "./component/LogoutComponent";
import DeleteUser from "./component/DeleteUser";
import CreateProject from "./component/CreateProject";
import DeleteProject from "./component/DeleteProject";
import SetProject from "./component/SetProject";
import SeRetirer from "./component/SeRetirer";
import RetirerMembres from "./component/RetirerMembres";
import RetirerChefs from "./component/RetirerChefs";
import DetailsProject from "./component/DetailsProjet";
import DeleteEntity from "./component/DeleteEntity";
import DeleteTask from "./component/DeleteTask";
import SetTask from "./component/SetTask";
import Task from "./component/Task";
import { UserContext } from "./contexte/useUser";
import { useNavigate } from "react-router-dom";

function App() {
  const {
    showSpinner,
    showLoginPage,
    showConfirmMdp,
    showMainPage,
    setShowMainPage,
    setShowLoginPage,
    showLogout,
    showDeleteUser,
    showcreateTask,
    showDeleteTask,
    showSetProject,
    showDetails,
    showSeretirer,
    setShowAdmin,
    showDeleteEntity,
    showRetirer,
    setUser,
    showRetierChefs,
    showTask,
    showDeletetask,
    showSetTask,
  } = useContext(ShowContext);
  const { getAllUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const tokenString = localStorage.getItem("token");
    const roleString = localStorage.getItem("role");
    let token = JSON.parse(tokenString);
    let role = JSON.parse(roleString);

    if (token) {
      if (role === "adminSuper") {
        navigate("/gestionEntity");
        setShowAdmin(false);
        setShowMainPage(true);
        setShowLoginPage(false);
      }
      if (role === "admin") {
        setShowAdmin(true);
        setShowMainPage(true);
      }
      if (role === "employe") {
        setShowAdmin(false);
        setUser(true);
        setShowMainPage(true);
      }
      getAllUser();
    } else {
      setShowMainPage(false);
      setShowLoginPage(true);
    }
  }, []);

  return (
    <div className="app">
      {showLoginPage && <LoginPage />}
      {showSpinner && <Overlay />}
      {showMainPage && <MainPage />}
      {showConfirmMdp && <ConfirmCode />}
      {showLogout && <LogoutComponent />}
      {showDeleteUser && <DeleteUser />}
      {showcreateTask && <CreateProject />}
      {showDeleteTask && <DeleteProject />}
      {showSetProject && <SetProject />}
      {showSeretirer && <SeRetirer />}
      {showDetails && <DetailsProject />}
      {showDeleteEntity && <DeleteEntity />}
      {showRetirer && <RetirerMembres />}
      {showRetierChefs && <RetirerChefs />}
      {showTask && <Task />}
      {showDeletetask && <DeleteTask />}
      {showSetTask && <SetTask />}

      <AlertComponent />
    </div>
  );
}

export default App;
