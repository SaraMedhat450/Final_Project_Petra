import api from './api';

const serviceService = {
    createService: async (serviceData) => {
        try {
            const response = await api.post('/service/create', serviceData);
            return response.data;
        } catch (error) {
            console.error('Error creating service:', error);
            throw error;
        }
    },

    getAllServices: async () => {
        try {
            const userData = JSON.parse(localStorage.getItem("userData") || "{}");
            const providerId = userData.id;

            if (!providerId) {
                console.warn("No providerId found in localStorage");
                return { data: [] };
            }

            const response = await api.get(`/service/detail/${providerId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching services:', error);
            throw error;
        }
    },

    getProviderData: async () => {
        try {
            const userData = JSON.parse(localStorage.getItem("userData") || "{}");
            const providerId = userData.id;

            if (!providerId) {
                console.warn("No providerId found in localStorage");
                return null;
            }

            const response = await api.get(`/provider/${providerId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching provider data:', error);
            throw error;
        }
    },

    deleteService: async (id) => {
        try {
            const response = await api.delete(`/service/delete/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting service:', error);
            throw error;
        }
    },

    updateService: async (id, serviceData) => {
        try {
            const response = await api.put(`/service/${id}`, serviceData);
            return response.data;
        } catch (error) {
            console.error('Error updating service:', error.response?.data || error.message);
            throw error;
        }
    }
};

export default serviceService;
