import React, { useEffect, useState } from 'react';
import { FaBuilding } from 'react-icons/fa';

const Geonames = () => {
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [error, setError] = useState(''); // État pour stocker les erreurs

  // Récupérer la liste des pays
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        setCountries(data.map(country => ({
          code: country.cca2,
          name: country.name.common,
        })));
      } catch (error) {
        console.error("Erreur lors de la récupération des pays :", error);
      }
    };
    fetchCountries();
  }, []);

  // Récupérer la liste des villes en fonction du pays
  useEffect(() => {
    const fetchCities = async (countryCode) => {
      try {
        setError(''); // Réinitialiser l'erreur
        const country = countries.find(c => c.code === countryCode);
        if (!country) {
          setError("Le pays sélectionné est introuvable.");
          return;
        }

        // Requête à Nominatim pour récupérer les villes
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?country=${country.name}&city&format=json&limit=50`
        );
        const data = await response.json();

        if (data.length > 0) {
          setCities(data.map(city => city.display_name));
        } else {
          setCities([]);
          setError("Aucune ville trouvée pour le pays sélectionné.");
        }
      } catch (error) {
        setError("Erreur lors de la récupération des villes.");
        setCities([]);
        console.error(error);
      }
    };

    if (selectedCountry) {
      fetchCities(selectedCountry);
    }
  }, [selectedCountry, countries]);

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
    setSelectedCity('');
    setCities([]); // Vider la liste des villes lors du changement de pays
  };

  return (
    <div>
      <label className="block text-sm font-medium leading-6 text-gray-900">Pays</label>
      <div className="flex items-center">
        <FaBuilding className="mr-2 text-gray-600" />
        <select
          onChange={handleCountryChange}
          value={selectedCountry}
          className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm"
        >
          <option value="">Sélectionnez un pays</option>
          {countries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      {selectedCountry && (
        <>
          <label className="block text-sm font-medium leading-6 text-gray-900 mt-4">Ville</label>
          <select
            onChange={(e) => setSelectedCity(e.target.value)}
            value={selectedCity}
            className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm"
          >
            <option value="">Sélectionnez une ville</option>
            {cities.map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
          </select>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </>
      )}
    </div>
  );
};

export default Geonames;
