export const BASE_URL = "https://api.petrajuniors.com/api";
export const UPLOAD_URL = "https://api.petrajuniors.com/uploads";

export const API_ENDPOINTS = {
  // Categories & Subcategories
  CATEGORIES: `${BASE_URL}/category`,
  SUBCATEGORIES: `${BASE_URL}/subcategory`,

  // Services
  SERVICES: `${BASE_URL}/service`,
  SERVICE_ALL_DETAILS: `${BASE_URL}/service/detail`,
  SERVICE_DETAILS: (id) => `${BASE_URL}/service/detail/${id}`,
  SERVICE_GALLERY: `${BASE_URL}/service/gallery`,
  PROVIDERS: `${BASE_URL}/providers`,
  ACTIVE_PROVIDERS: `${BASE_URL}/providers/active`,
  PROVIDER_DETAILS: (id) => `${BASE_URL}/providers/active/${id}`,
  PROVIDER_SERVICES: (id) => `${BASE_URL}/service/provider/${id}`,

  // Auth & Registration
  REGISTER_PROVIDER: `${BASE_URL}/register/provider`,
  REGISTER_CUSTOMER: `${BASE_URL}/register`,
  LOGIN_CUSTOMER: `${BASE_URL}/login`,
  LOGIN_PROVIDER: `${BASE_URL}/login/provider`,

  // Bookings
  BOOKINGS: `${BASE_URL}/booking`,
  BOOKING_DETAILS: (id) => `${BASE_URL}/booking/${id}`,
  BOOKING_STATUS: (id) => `${BASE_URL}/booking/${id}/status`,
};

export const COMMON_HEADERS = {
  "Content-Type": "application/json",
};
