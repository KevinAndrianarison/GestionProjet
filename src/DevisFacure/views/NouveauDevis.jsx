import React from "react";
import MyEditor from "./MyEditor";
import NavbarClient from "./NavbarClient";

function NouveauDevis() {
  return (
    <div>
      <NavbarClient />
      <h1 className="my-4">Créer une facture</h1>
      <MyEditor />
    </div>
  );
}

export default NouveauDevis;
