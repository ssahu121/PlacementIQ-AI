import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/aptitude";

export const submitAptitudeResult = async (data: any) => {
  return axios.post(`${API_BASE_URL}/submit`, data);
};

export const getAptitudeResult = async (userId: number) => {
  return axios.get(`${API_BASE_URL}/result/${userId}`);
};