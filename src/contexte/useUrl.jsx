import { createContext, useState } from "react";

export const UrlContext = createContext({
  url: "",
});
export function UrlContextProvider({ children }) {
  // const [url, setUrl] = useState("http://192.168.1.115:8000");
  const [url, setUrl] = useState("https://bg.societe-manage.com/public");
  // const [url, setUrl] = useState("https://sendbazar.biz/back-end/public");

  return (
    <UrlContext.Provider
      value={{
        url,
      }}
    >
      {children}
    </UrlContext.Provider>
  );
}
