import React, { createContext, useContext, useState } from "react";

// Création du contexte
const EditContext = createContext();

// Fournisseur du contexte
export const EditProvider = ({ children }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [fournisseurToEdit, setFournisseurToEdit] = useState(null);

  const openEditModal = (fournisseur) => {
    setFournisseurToEdit(fournisseur);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setFournisseurToEdit(null);
  };

  return (
    <EditContext.Provider
      value={{
        isEditModalOpen,
        fournisseurToEdit,
        openEditModal,
        closeEditModal,
      }}
    >
      {children}
    </EditContext.Provider>
  );
};

// Hook personnalisé pour accéder au contexte
export const useEdit = () => useContext(EditContext);
