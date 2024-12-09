export const deviseData = [
  {
    nom: "Euro",
    abreveation: "EUR",
    symbole: "€",
  },
  {
    nom: "Ariary",
    abreveation: "MG",
    symbole: "Ar",
  },
  {
    nom: "Dollar américain",
    abreveation: "USD",
    symbole: "$",
  },
  {
    nom: "Livre sterling",
    abreveation: "GBP",
    symbole: "£",
  },
  {
    nom: "Yen japonais",
    abreveation: "JPY",
    symbole: "¥",
  },
  {
    nom: "Dollar australien",
    abreveation: "AUD",
    symbole: "A$",
  },
  {
    nom: "Franc suisse",
    abreveation: "CHF",
    symbole: "CHF",
  },
  {
    nom: "Dollar canadien",
    abreveation: "CAD",
    symbole: "C$",
  },
  {
    nom: "Yuan renminbi chinois",
    abreveation: "CNY",
    symbole: "¥",
  },
  {
    nom: "Rouble russe",
    abreveation: "RUB",
    symbole: "₽",
  },
  {
    nom: "Roupie indienne",
    abreveation: "INR",
    symbole: "₹",
  },
  {
    nom: "Réal brésilien",
    abreveation: "BRL",
    symbole: "R$",
  },
  {
    nom: "Rand sud-africain",
    abreveation: "ZAR",
    symbole: "R",
  },
  {
    nom: "Peso mexicain",
    abreveation: "MXN",
    symbole: "$",
  },
];

export function getSymbolFromAbbreviation(abbreviation) {
  const currency = deviseData.find((dev) => dev.abreveation === abbreviation);
  return currency ? currency.symbole : "Symbole non trouvé";
}
