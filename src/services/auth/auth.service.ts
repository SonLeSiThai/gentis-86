import axios from 'axios';

const API_URL = import.meta.env.AUTH_API_URL; 

export const login = async (phone: string, password: string) => {
  const response = await axios.post(`${API_URL}/login`, {
    phone,
    password,
  });

  return response.data; 
};
