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
  showSetProject: false,
  showSeretirer: false,
  showRetierChefs: false,
  showDetails: false,
  showAdmin: false,
  showDeleteEntity: false,
  showRetirer: false,
  showTask: false,
  showSetTask: false,
});

export function ShowContextProvider({ children }) {
  const [showSpinner, setShowSpinner] = useState(false);
  const [showLoginPage, setShowLoginPage] = useState(false);
  const [showLoginComponent, setShowLoginComponent] = useState(true);
  const [showMainPage, setShowMainPage] = useState(false);
  const [showConfirmMdp, setShowConfirmMdp] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [showDeleteUser, setShowDeleteUser] = useState(false);
  const [showDeleteEntity, setShowDeleteEntity] = useState(false);
  const [showcreateTask, setShowcreateTask] = useState(false);
  const [showDeleteTask, setShowDeleteTask] = useState(false);
  const [showDeletetask, setShowDeletetask] = useState(false);
  const [showSetProject, setShowSetProject] = useState(false);
  const [showSetTask, setShowSetTask] = useState(false);
  const [showSeretirer, setShowSeretirer] = useState(false);
  const [showRetirer, setShowRetirer] = useState(false);
  const [showRetierChefs, setShowRetierChefs] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showUser, setUser] = useState(false);
  const [showTask, setShowTask] = useState(false);

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
        setShowDeletetask,
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
      }}
    >
      {children}
    </ShowContext.Provider>
  );
}
