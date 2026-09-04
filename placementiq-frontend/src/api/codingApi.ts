import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/coding";

export const submitCodingResult = async (data: any) => {
  return axios.post(`${API_BASE_URL}/submit`, data);
};

export const getCodingResult = async (userId: number) => {
  return axios.get(`${API_BASE_URL}/result/${userId}`);
};