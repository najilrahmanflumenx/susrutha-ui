import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1/public';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
  withCredentials: false,
});

export interface PaginationOptions {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  branchCode?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const getHomeData = async () => {
  try {
    const res = await api.get('/home');
    if (res.data && res.data.data) return res.data.data;
  } catch (error) {
    console.error('API fetch getHomeData failed:', error);
  }
  return {
    doctors: [],
    packages: [],
    conditions: [],
    facilities: [],
  };
};

export const getBranches = async () => {
  try {
    const res = await api.get('/branches');
    if (res.data && res.data.data && Array.isArray(res.data.data)) {
      return res.data.data;
    }
  } catch (error) {
    console.error('API fetch getBranches failed:', error);
  }
  return [];
};

export const getDoctors = async (branchCode?: string) => {
  try {
    const res = await api.get('/doctors', { params: { branchCode } });
    if (res.data && res.data.data && Array.isArray(res.data.data)) {
      return res.data.data;
    }
  } catch (error) {
    console.error('API fetch getDoctors failed:', error);
  }
  return [];
};

export const getDoctorBySlug = async (slug: string) => {
  try {
    const res = await api.get(`/doctors/${slug}`);
    if (res.data && res.data.data) return res.data.data;
  } catch (error) {
    console.error('API fetch getDoctorBySlug failed:', error);
  }
  return null;
};

export const getDepartments = async () => {
  try {
    const res = await api.get('/departments');
    if (res.data && res.data.data && Array.isArray(res.data.data)) {
      return res.data.data;
    }
  } catch (error) {
    console.error('API fetch getDepartments failed:', error);
  }
  return [];
};

export const getPackages = async () => {
  try {
    const res = await api.get('/packages');
    if (res.data && res.data.data && Array.isArray(res.data.data)) {
      return res.data.data;
    }
  } catch (error) {
    console.error('API fetch getPackages failed:', error);
  }
  return [];
};

export const getPackageBySlug = async (slug: string) => {
  try {
    const res = await api.get(`/packages/${slug}`);
    if (res.data && res.data.data) return res.data.data;
  } catch (error) {
    console.error('API fetch getPackageBySlug failed:', error);
  }
  return null;
};

export const getSettings = async () => {
  try {
    const res = await api.get('/settings');
    if (res.data && res.data.data) return res.data.data;
  } catch (error) {
    console.error('API fetch getSettings failed:', error);
  }
  return { siteTitle: 'Susrutha Ayurveda', emergencyNumbers: ['+91 96566 56736'] };
};

export const getFacilities = async () => {
  try {
    const res = await api.get('/facilities');
    if (res.data && res.data.data && Array.isArray(res.data.data)) {
      return res.data.data;
    }
  } catch (error) {
    console.error('API fetch getFacilities failed:', error);
  }
  return [];
};

export const getTestimonials = async () => {
  try {
    const res = await api.get('/testimonials');
    if (res.data && res.data.data && Array.isArray(res.data.data)) {
      return res.data.data;
    }
  } catch (error) {
    console.error('API fetch getTestimonials failed:', error);
  }
  return [];
};

export const getFaqs = async () => {
  try {
    const res = await api.get('/faqs');
    if (res.data && res.data.data && Array.isArray(res.data.data)) {
      return res.data.data;
    }
  } catch (error) {
    console.error('API fetch getFaqs failed:', error);
  }
  return [];
};

export const getBlogs = async () => {
  try {
    const res = await api.get('/blogs');
    if (res.data && res.data.data && Array.isArray(res.data.data)) {
      return res.data.data;
    }
  } catch (error) {
    console.error('API fetch getBlogs failed:', error);
  }
  return [];
};

export const getBlogBySlug = async (slug: string) => {
  try {
    const res = await api.get(`/blogs/${slug}`);
    if (res.data && res.data.data) return res.data.data;
  } catch (error) {
    console.error('API fetch getBlogBySlug failed:', error);
  }
  return null;
};

export const getConditions = async () => {
  try {
    const res = await api.get('/conditions');
    if (res.data && res.data.data && Array.isArray(res.data.data)) {
      return res.data.data;
    }
  } catch (error) {
    console.error('API fetch getConditions failed:', error);
  }
  return [];
};

export const getConditionBySlug = async (slug: string) => {
  try {
    const res = await api.get(`/conditions/${slug}`);
    if (res.data && res.data.data) return res.data.data;
  } catch (error) {
    console.error('API fetch getConditionBySlug failed:', error);
  }
  return null;
};

export const getTreatments = async (options?: PaginationOptions) => {
  try {
    const res = await api.get('/treatments', { params: options });
    if (res.data && res.data.data && Array.isArray(res.data.data)) {
      let items = res.data.data;
      if (options?.limit && !res.data.meta) {
        items = items.slice(0, options.limit);
      }
      return items;
    }
  } catch (error) {
    console.error('API fetch getTreatments failed:', error);
  }
  return [];
};

export const getTreatmentBySlug = async (slug: string) => {
  try {
    const res = await api.get(`/treatments/${slug}`);
    if (res.data && res.data.data) return res.data.data;
  } catch (error) {
    console.error('API fetch getTreatmentBySlug failed:', error);
  }
  return null;
};

export const getEcosystem = async () => {
  try {
    const res = await api.get('/ecosystem');
    if (res.data && res.data.data && Array.isArray(res.data.data)) {
      return res.data.data;
    }
  } catch (error) {
    console.error('API fetch getEcosystem failed:', error);
  }
  return [];
};

export const getEcosystemBySlug = async (slug: string) => {
  try {
    const res = await api.get(`/ecosystem/${slug}`);
    if (res.data && res.data.data) return res.data.data;
  } catch (error) {
    console.error('API fetch getEcosystemBySlug failed:', error);
  }
  return null;
};

export const getVideos = async () => {
  try {
    const res = await api.get('/videos');
    if (res.data && res.data.data && Array.isArray(res.data.data)) return res.data.data;
  } catch (error) {
    console.error('API fetch getVideos failed:', error);
  }
  return [];
};

export const getGallery = async () => {
  try {
    const res = await api.get('/gallery');
    if (res.data && res.data.data && Array.isArray(res.data.data)) return res.data.data;
  } catch (error) {
    console.error('API fetch getGallery failed:', error);
  }
  return [];
};

export const getAffiliations = async () => {
  try {
    const res = await api.get('/affiliations');
    if (res.data && res.data.data && Array.isArray(res.data.data)) return res.data.data;
  } catch (error) {
    console.error('API fetch getAffiliations failed:', error);
  }
  return [];
};

export const getMedia = async () => {
  try {
    const res = await api.get('/media');
    if (res.data && res.data.data && Array.isArray(res.data.data)) return res.data.data;
  } catch (error) {
    console.error('API fetch getMedia failed:', error);
  }
  return [];
};

export interface BookAppointmentPayload {
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  preferredBranchCode: string;
  preferredDoctorId?: string;
  preferredDate?: string;
  timeSlot?: string;
  preferredTimeSlot?: string;
  symptomsNote?: string;
}

export const bookAppointment = async (payload: BookAppointmentPayload) => {
  try {
    const res = await api.post('/appointment', payload);
    return res.data;
  } catch (error: any) {
    console.error('Book appointment API endpoint error:', error);
    throw new Error(error.response?.data?.message || 'Failed to submit appointment request');
  }
};

export interface SubmitLeadPayload {
  name: string;
  phone: string;
  email?: string;
  subject?: string;
  message: string;
  preferredBranchCode?: string;
}

export const submitLead = async (payload: SubmitLeadPayload) => {
  try {
    const res = await api.post('/contact', payload);
    return res.data;
  } catch (error: any) {
    console.error('Submit lead API endpoint error:', error);
    throw new Error(error.response?.data?.message || 'Failed to submit contact lead');
  }
};

export interface SubmitFeedbackPayload {
  name: string;
  phone?: string;
  rating?: string;
  message: string;
}

export const submitFeedback = async (payload: SubmitFeedbackPayload) => {
  try {
    const res = await api.post('/feedback', payload);
    return res.data;
  } catch (error: any) {
    console.error('Submit feedback API endpoint error:', error);
    throw new Error(error.response?.data?.message || 'Failed to submit feedback');
  }
};

export default api;
