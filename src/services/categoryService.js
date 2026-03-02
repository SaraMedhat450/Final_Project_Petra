import api from "./api";

const categoryService = {
  getAllCategories: async () => {
    try {
      const response = await api.get("/category");
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error.response?.data || error.message);
      throw error;
    }
  },

  getServiceTitles: async () => {
    try {
      const response = await api.get("/service_title");
      return response.data;
    } catch (error) {
      console.error("Error fetching service titles:", error.response?.data || error.message);
      throw error;
    }
  },

  getSubCategories: async () => {
    try {
      const response = await api.get("/subcategory");
      return response.data;
    } catch (error) {
      console.error("Error fetching subcategories:", error.response?.data || error.message);
      throw error;
    }
  },
};

export default categoryService;