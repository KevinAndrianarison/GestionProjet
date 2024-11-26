import { useState, useEffect } from 'react';
import countriesAndCitiesData from './countriesAndCities.json';

const useGeonames = () => {
  const [countriesAndCities, setCountriesAndCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountriesAndCities = async () => {
      try {
        setLoading(true);
        setCountriesAndCities(countriesAndCitiesData);
      } catch (error) {
        setError('Erreur lors de la récupération des données');
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCountriesAndCities();
  }, []);

  return { countriesAndCities, loading, error };
};

export default useGeonames;
