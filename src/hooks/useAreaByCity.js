import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import baseUrl from "src/API/apiConfig";

export const useAreasByCity = () => {
  const [areasByCityId, setAreasByCityId] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchAreasByCity = useCallback(async (cityId) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/api/cities/${cityId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response?.status === 200) {
        setAreasByCityId(prev => ({
          ...prev,
          [cityId]: response?.data?.data?.areas || []
        }));
      }

      return response?.data?.data?.areas || [];

    } catch (error) {
      console.error('Error fetching areas:', error);
      toast.error(error?.response?.data?.message);

      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearAreasForCity = useCallback((cityId) => {
    setAreasByCityId(prev => {
      const newState = { ...prev };
      delete newState[cityId];

      return newState;
    });
  }, []);

  return {
    areasByCityId,
    isLoading,
    fetchAreasByCity,
    clearAreasForCity
  };
};
