import axios from "axios";

const API_URL = "http/model";

// Send image or input to AI model
export const runModel = async (inputData) => {
  const res = await axios.post(`${API_URL}/run`, inputData);
  return res.data;
};

// Get model info (if needed)
export const getModelInfo = async () => {
  const res = await axios.get(`${API_URL}/info`);
  return res.data;
};
