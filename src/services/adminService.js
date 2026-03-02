import api from "./api";

export const getPendingServices = async () => {
  return api.get("/services/pending");
};