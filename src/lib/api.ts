import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1/public';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: false,
});

export const getHomeData = async () => {
  try {
    const res = await api.get('/home');
    return res.data.data;
  } catch (error) {
    console.warn('API fetch failed, fallback to local data:', error);
    return null;
  }
};

export const getBranches = async () => {
  try {
    const res = await api.get('/branches');
    return res.data.data;
  } catch (error) {
    console.warn('API fetch failed, fallback to local data:', error);
    return null;
  }
};

export const getDoctors = async (branchCode?: string) => {
  try {
    const res = await api.get('/doctors', { params: { branchCode } });
    return res.data.data;
  } catch (error) {
    console.warn('API fetch failed, fallback to local data:', error);
    return null;
  }
};

export const getDoctorBySlug = async (slug: string) => {
  try {
    const res = await api.get(`/doctors/${slug}`);
    return res.data.data;
  } catch (error) {
    console.warn('API fetch failed, fallback to local data:', error);
    return null;
  }
};

export const getDepartments = async () => {
  try {
    const res = await api.get('/departments');
    return res.data.data;
  } catch (error) {
    console.warn('API fetch failed, fallback to local data:', error);
    return null;
  }
};

export const getPackages = async () => {
  try {
    const res = await api.get('/packages');
    return res.data.data;
  } catch (error) {
    console.warn('API fetch failed, fallback to local data:', error);
    return null;
  }
};

export const getPackageBySlug = async (slug: string) => {
  try {
    const res = await api.get(`/packages/${slug}`);
    return res.data.data;
  } catch (error) {
    console.warn('API fetch failed, fallback to local data:', error);
    return null;
  }
};

export const getSettings = async () => {
  try {
    const res = await api.get('/settings');
    return res.data.data;
  } catch (error) {
    console.warn('API fetch failed, fallback to local data:', error);
    return null;
  }
};

export const getFacilities = async () => {
  try {
    const res = await api.get('/facilities');
    return res.data.data;
  } catch (error) {
    console.warn('API fetch failed, fallback to local data:', error);
    return null;
  }
};

export const getTestimonials = async () => {
  try {
    const res = await api.get('/testimonials');
    return res.data.data;
  } catch (error) {
    console.warn('API fetch failed, fallback to local data:', error);
    return null;
  }
};

export const getFaqs = async () => {
  try {
    const res = await api.get('/faqs');
    return res.data.data;
  } catch (error) {
    console.warn('API fetch failed, fallback to local data:', error);
    return null;
  }
};

export const getBlogs = async () => {
  try {
    const res = await api.get('/blogs');
    return res.data.data;
  } catch (error) {
    console.warn('API fetch failed, fallback to local data:', error);
    return null;
  }
};

export const getBlogBySlug = async (slug: string) => {
  try {
    const res = await api.get(`/blogs/${slug}`);
    return res.data.data;
  } catch (error) {
    console.warn('API fetch failed, fallback to local data:', error);
    return null;
  }
};

export const getConditions = async () => {
  try {
    const res = await api.get('/conditions');
    return res.data.data;
  } catch (error) {
    console.warn('API fetch failed, fallback to local data:', error);
    return null;
  }
};

export const getConditionBySlug = async (slug: string) => {
  try {
    const res = await api.get(`/conditions/${slug}`);
    return res.data.data;
  } catch (error) {
    console.warn('API fetch failed, fallback to local data:', error);
    return null;
  }
};

export const getTreatments = async () => {
  try {
    const res = await api.get('/treatments');
    return res.data.data;
  } catch (error) {
    console.warn('API fetch failed, fallback to local data:', error);
    return null;
  }
};

export const getTreatmentBySlug = async (slug: string) => {
  try {
    const res = await api.get(`/treatments/${slug}`);
    return res.data.data;
  } catch (error) {
    console.warn('API fetch failed, fallback to local data:', error);
    return null;
  }
};

export const getEcosystem = async () => {
  try {
    const res = await api.get('/ecosystem');
    return res.data.data;
  } catch (error) {
    console.warn('API fetch failed, fallback to local data:', error);
    return null;
  }
};

export const getEcosystemBySlug = async (slug: string) => {
  try {
    const res = await api.get(`/ecosystem/${slug}`);
    return res.data.data;
  } catch (error) {
    console.warn('API fetch failed, fallback to local data:', error);
    return null;
  }
};

export const getVideos = async () => {
  try {
    const res = await api.get('/videos');
    return res.data.data;
  } catch (error) {
    console.warn('API fetch failed, fallback to local data:', error);
    return null;
  }
};

export const getGallery = async () => {
  try {
    const res = await api.get('/gallery');
    return res.data.data;
  } catch (error) {
    console.warn('API fetch failed, fallback to local data:', error);
    return null;
  }
};

export const getAffiliations = async () => {
  try {
    const res = await api.get('/affiliations');
    return res.data.data;
  } catch (error) {
    console.warn('API fetch failed, fallback to local data:', error);
    return null;
  }
};

export const getMedia = async () => {
  try {
    const res = await api.get('/media');
    return res.data.data;
  } catch (error) {
    console.warn('API fetch failed, fallback to local data:', error);
    return null;
  }
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
  const res = await api.post('/appointment', payload);
  return res.data;
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
  const res = await api.post('/contact', payload);
  return res.data;
};

export interface SubmitFeedbackPayload {
  name: string;
  phone?: string;
  rating?: string;
  message: string;
}

export const submitFeedback = async (payload: SubmitFeedbackPayload) => {
  const res = await api.post('/feedback', payload);
  return res.data;
};

export default api;
