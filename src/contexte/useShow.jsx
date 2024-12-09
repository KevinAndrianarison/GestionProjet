import { createContext, useState } from "react";

export const ShowContext = createContext({
  showSpinner: false,
  showMainPage: false,
  showLoginPage: false,
  showLoginComponent: true,
  showConfirmMdp: false,
  showLogout: false,
  showDeleteUser: false,
  showcreateTask: false,
  showDeleteTask: false,
  showDeletetask: false,
  showDeleteEtape: false,
  showSetProject: false,
  showSeretirer: false,
  showRetierChefs: false,
  showDetails: false,
  showAdmin: false,
  showDeleteEntity: false,
  showRetirer: false,
  showTask: false,
  showSetTask: false,
  showListProjet: false,
  showDeletechamps: false,
  showDeleteStatus: false,
  showModaleTask: false,
  showSkeletreonUser: false,
  showcreateJalon: false,
});

export function ShowContextProvider({ children }) {
  const [showSpinner, setShowSpinner] = useState(false);
  const [showLoginPage, setShowLoginPage] = useState(false);
  const [showLoginComponent, setShowLoginComponent] = useState(true);
  const [showMainPage, setShowMainPage] = useState(false);
  const [showConfirmMdp, setShowConfirmMdp] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [showDeleteUser, setShowDeleteUser] = useState(false);
  const [showDeleteStatus, setShowDeleteStatus] = useState(false);
  const [showDeleteStatusTask, setShowDeleteStatusTask] = useState(false);
  const [showDeleteEntity, setShowDeleteEntity] = useState(false);
  const [showcreateTask, setShowcreateTask] = useState(false);
  const [showcreateJalon, setShowcreateJalon] = useState(false);
  const [showDeleteTask, setShowDeleteTask] = useState(false);
  const [showDeleteEtape, setShowDeleteEtape] = useState(false);
  const [showDeletetask, setShowDeletetask] = useState(false);
  const [showDeletechamps, setShowDeletechamps] = useState(false);
  const [showSetProject, setShowSetProject] = useState(false);
  const [showSetTask, setShowSetTask] = useState(false);
  const [showSeretirer, setShowSeretirer] = useState(false);
  const [showRetirer, setShowRetirer] = useState(false);
  const [showRetierChefs, setShowRetierChefs] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showListProjet, setShowListProjet] = useState(false);
  const [showUser, setUser] = useState(false);
  const [isPUTprofil, setisPUTprofil] = useState(false);
  const [showTask, setShowTask] = useState(false);
  const [showModaleTask, setShowModaleTask] = useState(false);
  const [showSkeletreonUser, setShowSkeletreonUser] = useState(false);

  return (
    <ShowContext.Provider
      value={{
        showSpinner,
        showLoginPage,
        showMainPage,
        showLoginComponent,
        showConfirmMdp,
        showLogout,
        showDeleteUser,
        showcreateTask,
        showDeleteTask,
        showSetProject,
        showSeretirer,
        showDetails,
        showAdmin,
        showDeleteEntity,
        showUser,
        showRetirer,
        showRetierChefs,
        showTask,
        showDeletetask,
        showSetTask,
        showListProjet,
        showDeleteEtape,
        showDeleteStatus,
        showDeleteStatusTask,
        showDeletechamps,
        showModaleTask,
        showSkeletreonUser,
        showcreateJalon,
        isPUTprofil,
        setShowDeleteStatusTask,
        setisPUTprofil,
        setShowcreateJalon,
        setShowSkeletreonUser,
        setShowDeletechamps,
        setShowDeletetask,
        setShowDeleteStatus,
        setShowDeleteEtape,
        setShowListProjet,
        setShowSetTask,
        setShowTask,
        setShowLoginComponent,
        setShowRetirer,
        setShowcreateTask,
        setShowConfirmMdp,
        setShowMainPage,
        setShowLoginPage,
        setShowSpinner,
        setShowLogout,
        setShowDeleteUser,
        setShowDeleteTask,
        setShowSetProject,
        setShowSeretirer,
        setShowDetails,
        setShowAdmin,
        setShowDeleteEntity,
        setUser,
        setShowRetierChefs,
        setShowModaleTask,
      }}
    >
      {children}
    </ShowContext.Provider>
  );
}
