import { createContext, useState } from "react";

export const MessageContext = createContext({
  messageSucces: "",
  messageerror: "",
});

export function MessageContextProvider({ children }) {
  const [messageSucces, setMessageSucces] = useState("");
  const [messageError, setMessageError] = useState("");

  return (
    <MessageContext.Provider
      value={{
        messageSucces,
        messageError,
        setMessageSucces,
        setMessageError,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
}
