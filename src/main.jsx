import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "tippy.js/dist/tippy.css";
import "@fontsource/montserrat"; // POUR LES TEXTES
import "@fontsource/righteous"; // POUR LES TITRES
import App from "./App.jsx";
import "./index.css";
import { UserContextProvider } from "./contexte/useUser.jsx";
import { UrlContextProvider } from "./contexte/useUrl.jsx";
import { ShowContextProvider } from "./contexte/useShow.jsx";
import { MessageContextProvider } from "./contexte/useMessage.jsx";
import { EntityContextProvider } from "./contexte/useEntity.jsx";
import { ProjectContextProvider } from "./contexte/useProject.jsx";
import { TaskContextProvider } from "./contexte/useTask.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <MessageContextProvider>
        <UrlContextProvider>
          <ShowContextProvider>
            <EntityContextProvider>
              <UserContextProvider>
                <ProjectContextProvider>
                  <TaskContextProvider>
                    <App />
                  </TaskContextProvider>
                </ProjectContextProvider>
              </UserContextProvider>
            </EntityContextProvider>
          </ShowContextProvider>
        </UrlContextProvider>
      </MessageContextProvider>
    </BrowserRouter>
  </StrictMode>
);
