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

            // Try /providers/active/:id first (public-ish), fallback to /provider/:id
            try {
                const r = await api.get(`/providers/active/${providerId}`);
                const d = r.data;
                return d.provider || d.data || (d.id ? d : null);
            } catch {
                const response = await api.get(`/provider/${providerId}`);
                return response.data;
            }
        } catch (error) {
            console.error('Error fetching provider data:', error);
            return null; // Don't throw — dashboard should still render
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
},

    /**
     * Fetch bookings for the current authenticated user.
     * Returns a normalized array (handles all common response shapes).
     */
    getBookings: async () => {
        try {
            const response = await api.get('/booking');
            const d = response.data;
            // Handles: array, {data: []}, {bookings: []}, {booking: []}
            if (Array.isArray(d)) return d;
            if (Array.isArray(d?.data)) return d.data;
            if (Array.isArray(d?.bookings)) return d.bookings;
            if (Array.isArray(d?.booking)) return d.booking;
            return [];
        } catch (error) {
            console.error('Error fetching bookings:', error);
            return []; // Return empty array so dashboards don't crash
        }
    },

    createBooking: async (bookingData) => {
        try {
            const response = await api.post('/booking', bookingData);
            return response.data;
        } catch (error) {
            console.error('Error creating booking:', error);
            throw error;
        }
    },

    updateBookingStatus: async (id, status) => {
        try {
            const response = await api.put(`/booking/${id}/status`, { status });
            return response.data;
        } catch (error) {
            console.error('Error updating booking status:', error);
            throw error;
        }
    }
};

export default serviceService;
