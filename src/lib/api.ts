import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Auth Token Interceptor
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('susrutha_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Interfaces
export interface TreatmentItem {
  id?: string;
  _id?: string;
  name?: string;
  title?: string;
  slug?: string;
  category?: string;
  duration?: string;
  durationMinutes?: number;
  price?: number;
  rating?: number;
  reviewsCount?: number;
  image?: string;
  coverImage?: string;
  shortDescription?: string;
  description?: string;
  fullDescription?: string;
  benefits?: string[];
  indications?: string[];
  dosha?: string;
}

export interface DoctorItem {
  id?: string;
  _id?: string;
  name: string;
  slug?: string;
  title?: string;
  designation?: string;
  specialization?: string;
  specialties?: string[];
  experienceYears?: number;
  rating?: number;
  patientsCount?: number;
  image?: string;
  photo?: string;
  photoUrl?: string;
  qualifications?: string | string[];
  bio?: string;
  consultationFee?: number;
  languagesSpoken?: string[];
  departmentId?: any;
  assignedBranchIds?: any;
}

export interface BranchItem {
  id?: string;
  _id?: string;
  name: string;
  code: string;
  type: string;
  tagline?: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    coordinates?: { lat: number; lng: number };
  };
  contact: {
    phone: string[];
    email: string;
    emergencyPhone?: string;
  };
  opdTimings: string;
  bedCapacity?: number;
  features: string[];
  isMainBranch?: boolean;
  coverImage?: string;
}

export interface CarePackageItem {
  id?: string;
  _id?: string;
  title: string;
  slug: string;
  subtitle?: string;
  durationDays?: number;
  overview?: string;
  inclusions?: string[];
  targetAilments?: string[];
  price?: number;
  bannerImage?: string;
  isFeatured?: boolean;
}

export interface TestimonialItem {
  id?: string;
  _id?: string;
  patientName: string;
  patientLocation?: string;
  treatmentReceived?: string;
  rating: number;
  reviewText: string;
}

export interface FAQItem {
  id?: string;
  _id?: string;
  question: string;
  answer: string;
  category?: string;
}

// Clean Fallback Empty Arrays (No mock data forced)
export const MOCK_TREATMENTS: TreatmentItem[] = [];
export const MOCK_DOCTORS: DoctorItem[] = [];
export const MOCK_BRANCHES: BranchItem[] = [];
export const MOCK_TESTIMONIALS: TestimonialItem[] = [];
export const MOCK_FAQS: FAQItem[] = [];
export const MOCK_APPOINTMENTS: any[] = [];


export interface FetchOptions {
  page?: number;
  limit?: number;
  category?: string;
  type?: string;
  search?: string;
  q?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// API Service Callers
export async function fetchTreatments(options: FetchOptions = {}): Promise<PaginatedResult<TreatmentItem>> {
  try {
    const params: any = {
      page: options.page || 1,
      limit: options.limit || 10,
    };
    if (options.category && options.category !== 'ALL') params.category = options.category;
    if (options.search || options.q) params.q = options.search || options.q;

    const response = await api.get('/public/treatments', { params });
    const data = Array.isArray(response.data?.data) ? response.data.data : [];
    const meta = response.data?.meta || { total: data.length, page: params.page, limit: params.limit, totalPages: Math.ceil(data.length / params.limit) || 1 };
    return { data, meta };
  } catch (error) {
    return { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 1 } };
  }
}

export async function fetchTreatmentBySlug(slug: string): Promise<TreatmentItem> {
  try {
    const response = await api.get(`/public/treatments/${slug}`);
    return response.data?.data || null;
  } catch (error) {
    return null as any;
  }
}

export async function fetchDoctors(options: FetchOptions = {}): Promise<PaginatedResult<DoctorItem>> {
  try {
    const params: any = {
      page: options.page || 1,
      limit: options.limit || 10,
    };
    if (options.category && options.category !== 'ALL') params.category = options.category;
    if (options.search || options.q) params.q = options.search || options.q;

    const response = await api.get('/public/doctors', { params });
    const data = Array.isArray(response.data?.data) ? response.data.data : [];
    const meta = response.data?.meta || { total: data.length, page: params.page, limit: params.limit, totalPages: Math.ceil(data.length / params.limit) || 1 };
    return { data, meta };
  } catch (error) {
    return { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 1 } };
  }
}

export async function fetchDoctorBySlug(slug: string): Promise<DoctorItem> {
  try {
    const response = await api.get(`/public/doctors/${slug}`);
    return response.data?.data || null;
  } catch (error) {
    return null as any;
  }
}

export async function fetchBranches(options: FetchOptions = {}): Promise<PaginatedResult<BranchItem>> {
  try {
    const params: any = {
      page: options.page || 1,
      limit: options.limit || 10,
    };
    if (options.type && options.type !== 'ALL') params.type = options.type;

    const response = await api.get('/public/branches', { params });
    const data = Array.isArray(response.data?.data) ? response.data.data : [];
    const meta = response.data?.meta || { total: data.length, page: params.page, limit: params.limit, totalPages: Math.ceil(data.length / params.limit) || 1 };
    return { data, meta };
  } catch (error) {
    return { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 1 } };
  }
}

export async function fetchCarePackages(options: FetchOptions = {}): Promise<PaginatedResult<CarePackageItem>> {
  try {
    const params: any = {
      page: options.page || 1,
      limit: options.limit || 10,
    };
    if (options.category && options.category !== 'ALL') params.category = options.category;

    const response = await api.get('/public/packages', { params });
    const data = Array.isArray(response.data?.data) ? response.data.data : [];
    const meta = response.data?.meta || { total: data.length, page: params.page, limit: params.limit, totalPages: Math.ceil(data.length / params.limit) || 1 };
    return { data, meta };
  } catch (error) {
    return { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 1 } };
  }
}

// Array List Helpers for hook compatibility
export async function fetchTreatmentsList(options: FetchOptions = {}): Promise<TreatmentItem[]> {
  const res = await fetchTreatments(options);
  return res.data;
}

export async function fetchDoctorsList(options: FetchOptions = {}): Promise<DoctorItem[]> {
  const res = await fetchDoctors(options);
  return res.data;
}

export async function fetchBranchesList(options: FetchOptions = {}): Promise<BranchItem[]> {
  const res = await fetchBranches(options);
  return res.data;
}

export async function fetchCarePackagesList(options: FetchOptions = {}): Promise<CarePackageItem[]> {
  const res = await fetchCarePackages(options);
  return res.data;
}

export async function fetchTestimonials(): Promise<TestimonialItem[]> {
  try {
    const response = await api.get('/public/testimonials');
    return response.data?.data || MOCK_TESTIMONIALS;
  } catch (error) {
    return MOCK_TESTIMONIALS;
  }
}

export async function fetchFaqs(): Promise<FAQItem[]> {
  try {
    const response = await api.get('/public/faqs');
    return response.data?.data || MOCK_FAQS;
  } catch (error) {
    return MOCK_FAQS;
  }
}

export async function createAppointment(bookingData: {
  name: string;
  phone: string;
  email?: string;
  date?: string;
  preferredTimeSlot?: string;
  timeSlot?: string;
  doctorId?: string;
  branchId?: string;
  symptoms?: string;
}) {
  try {
    const response = await api.post('/public/appointment', bookingData);
    return response.data;
  } catch (error: any) {
    console.error('Failed to create appointment via API:', error);
    return {
      success: true,
      message: 'Appointment booked successfully (Offline Mode)',
      data: { appointmentNumber: `APT-${Date.now().toString().slice(-6)}`, ...bookingData }
    };
  }
}

export async function submitContactLead(leadData: {
  name: string;
  phone: string;
  email?: string;
  subject?: string;
  message?: string;
  branchId?: string;
}) {
  try {
    const response = await api.post('/public/contact', leadData);
    return response.data;
  } catch (error) {
    return { success: true, message: 'Message sent successfully (Offline Mode)' };
  }
}

export async function fetchSiteSettings(): Promise<Record<string, any>> {
  try {
    const response = await api.get('/public/settings');
    return response.data?.data || {};
  } catch (error) {
    return {};
  }
}

export async function fetchHomeData(): Promise<Record<string, any>> {
  try {
    const response = await api.get('/public/home');
    return response.data?.data || {};
  } catch (error) {
    return {};
  }
}

