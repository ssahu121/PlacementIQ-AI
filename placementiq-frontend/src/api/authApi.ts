import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/auth";

export const registerUser = async (data: any) => {
  return axios.post(`${API_BASE_URL}/register`, data);
};

export const loginUser = async (data: any) => {
  return axios.post(`${API_BASE_URL}/login`, data);
};