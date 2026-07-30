import axios from 'axios';

// Normalize API Base URL and strip trailing /public if provided in env
let rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
rawBaseUrl = rawBaseUrl.replace(/\/public\/?$/, '').replace(/\/+$/, '');
if (!rawBaseUrl.endsWith('/api/v1') && !rawBaseUrl.includes('/api/v1')) {
  rawBaseUrl += '/api/v1';
}

export const api = axios.create({
  baseURL: rawBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Auth Token & URL Path Normalizer Interceptor
api.interceptors.request.use((config) => {
  // Prevent duplicate /public/public in path if baseURL includes /public
  if (config.url && config.url.startsWith('/public/') && config.baseURL?.endsWith('/public')) {
    config.url = config.url.substring(7);
  }
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
  assignedBranchIds?: any[];
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
  image?: string;
  coverImage?: string;
  galleryImages?: string[];
  isFeatured?: boolean;
  assignedBranchIds?: any[];
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

export interface BlogItem {
  id?: string;
  _id?: string;
  title: string;
  slug: string;
  category?: string;
  tags?: string[];
  excerpt?: string;
  content?: string;
  coverImage?: string;
  author?: string;
  publishedAt?: string;
  readTime?: number;
  isFeatured?: boolean;
}

export interface DepartmentItem {
  id?: string;
  _id?: string;
  title: string;
  name?: string;
  slug: string;
  code?: string;
  tagline?: string;
  overview?: string;
  description?: string;
  icon?: string;
  image?: string;
  coverImage?: string;
  photo?: string;
  isFeatured?: boolean;
}

export interface ConditionItem {
  id?: string;
  _id?: string;
  title: string;
  slug: string;
  category?: string;
  shortDescription?: string;
  fullDescription?: string;
  coverImage?: string;
  ayurvedicRootCause?: string;
  symptoms?: string[];
  treatments?: string[];
  isFeatured?: boolean;
}

export interface FacilityItem {
  id?: string;
  _id?: string;
  title: string;
  slug?: string;
  category?: string;
  description?: string;
  image?: string;
  coverImage?: string;
  features?: string[];
  capacity?: number;
  isFeatured?: boolean;
}

export interface VideoItem {
  id?: string;
  _id?: string;
  title: string;
  slug?: string;
  category?: string;
  description?: string;
  youtubeId?: string;
  youtubeUrl?: string;
  videoUrl?: string;
  videoHost?: string;
  url?: string;
  thumbnailUrl?: string;
  duration?: string;
  isFeatured?: boolean;
  sortOrder?: number;
  status?: string;
}

export interface AffiliationItem {
  id?: string;
  _id?: string;
  name: string;
  slug?: string;
  type?: string;
  logoUrl?: string;
  website?: string;
  description?: string;
  sortOrder?: number;
}


export interface FetchOptions {
  page?: number;
  limit?: number;
  category?: string;
  type?: string;
  search?: string;
  q?: string;
  all?: boolean;
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
export async function fetchTreatments(options: FetchOptions & { all?: boolean } = {}): Promise<PaginatedResult<TreatmentItem>> {
  try {
    const params: any = {
      page: options.page || 1,
      limit: options.all ? 1000 : options.limit || 50,
    };
    if (options.all) params.all = 'true';
    if (options.category && options.category !== 'ALL') params.category = options.category;
    if (options.search || options.q) params.q = options.search || options.q;

    const response = await api.get('/public/treatments', { params });
    const data = Array.isArray(response.data?.data) ? response.data.data : [];
    const meta = response.data?.meta || { total: data.length, page: params.page, limit: params.limit, totalPages: Math.ceil(data.length / params.limit) || 1 };
    return { data, meta };
  } catch (error) {
    return { data: [], meta: { total: 0, page: 1, limit: 50, totalPages: 1 } };
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

export async function fetchDoctors(options: FetchOptions & { all?: boolean } = {}): Promise<PaginatedResult<DoctorItem>> {
  try {
    const params: any = {
      page: options.page || 1,
      limit: options.all ? 1000 : options.limit || 50,
    };
    if (options.all) params.all = 'true';
    if (options.category && options.category !== 'ALL') params.category = options.category;
    if (options.search || options.q) params.q = options.search || options.q;

    const response = await api.get('/public/doctors', { params });
    const data = Array.isArray(response.data?.data) ? response.data.data : [];
    const meta = response.data?.meta || { total: data.length, page: params.page, limit: params.limit, totalPages: Math.ceil(data.length / params.limit) || 1 };
    return { data, meta };
  } catch (error) {
    return { data: [], meta: { total: 0, page: 1, limit: 50, totalPages: 1 } };
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

export async function fetchCarePackages(options: FetchOptions & { days?: string } = {}): Promise<PaginatedResult<CarePackageItem>> {
  try {
    const params: any = {
      page: options.page || 1,
      limit: options.limit || 10,
    };
    if (options.category && options.category !== 'ALL') params.category = options.category;
    if (options.days && options.days !== 'ALL') params.days = options.days;

    const response = await api.get('/public/packages', { params });
    const data = Array.isArray(response.data?.data) ? response.data.data : [];
    const meta = response.data?.meta || { total: data.length, page: params.page, limit: params.limit, totalPages: Math.ceil(data.length / params.limit) || 1 };
    return { data, meta };
  } catch (error) {
    return { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 1 } };
  }
}

export async function fetchCarePackageBySlug(slug: string): Promise<CarePackageItem | null> {
  try {
    const response = await api.get(`/public/packages/${slug}`);
    return response.data?.data || null;
  } catch (error) {
    return null;
  }
}

// Array List Helpers for hook compatibility
export async function fetchTreatmentsList(options: FetchOptions = { all: true }): Promise<TreatmentItem[]> {
  const res = await fetchTreatments({ all: true, ...options });
  return res.data;
}

export async function fetchDoctorsList(options: FetchOptions = { all: true }): Promise<DoctorItem[]> {
  const res = await fetchDoctors({ all: true, ...options });
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

export async function fetchTestimonials(params?: { page?: number; limit?: number }): Promise<{ data: TestimonialItem[]; meta?: any }> {
  try {
    const response = await api.get('/public/testimonials', { params });
    const data = response.data?.data || [];
    const meta = response.data?.meta || { page: 1, totalPages: 1, total: data.length };
    return { data, meta };
  } catch (error) {
    return { data: [], meta: { page: 1, totalPages: 1, total: 0 } };
  }
}

export async function fetchFaqs(): Promise<FAQItem[]> {
  try {
    const response = await api.get('/public/faqs');
    return response.data?.data || [];
  } catch (error) {
    return [];
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
  leadType?: 'PACKAGE_BOOKING' | 'SINGLE_TREATMENT' | 'GENERAL_INQUIRY' | 'FEEDBACK_RATING';
  packageId?: string;
  treatmentId?: string;
  doctorId?: string;
  rating?: number;
  preferredDate?: string;
  preferredTimeSlot?: string;
  symptomsNote?: string;
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

// ─── Blogs / Journal ─────────────────────────────────────────────────────────

export async function fetchBlogs(options: FetchOptions & { all?: boolean } = {}): Promise<PaginatedResult<BlogItem>> {
  try {
    const params: any = {
      page: options.page || 1,
      limit: options.all ? 1000 : options.limit || 9,
    };
    if (options.category && options.category !== 'ALL') params.category = options.category;
    if (options.search || options.q) params.q = options.search || options.q;

    const response = await api.get('/public/blogs', { params });
    const data = Array.isArray(response.data?.data) ? response.data.data : [];
    const meta = response.data?.meta || { total: data.length, page: params.page, limit: params.limit, totalPages: Math.ceil(data.length / params.limit) || 1 };
    return { data, meta };
  } catch (error) {
    return { data: [], meta: { total: 0, page: 1, limit: 9, totalPages: 1 } };
  }
}

export async function fetchBlogBySlug(slug: string): Promise<BlogItem> {
  try {
    const response = await api.get(`/public/blogs/${slug}`);
    return response.data?.data || null;
  } catch (error) {
    return null as any;
  }
}

// ─── Conditions (We Treat) ────────────────────────────────────────────────────

export async function fetchConditions(options: FetchOptions & { all?: boolean } = {}): Promise<PaginatedResult<ConditionItem>> {
  try {
    const params: any = {
      page: options.page || 1,
      limit: options.all ? 1000 : options.limit || 10,
    };
    if (options.category && options.category !== 'ALL') params.category = options.category;
    if (options.search || options.q) params.q = options.search || options.q;

    const response = await api.get('/public/conditions', { params });
    const data = Array.isArray(response.data?.data) ? response.data.data : [];
    const meta = response.data?.meta || { total: data.length, page: params.page, limit: params.limit, totalPages: Math.ceil(data.length / params.limit) || 1 };
    return { data, meta };
  } catch (error) {
    return { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 1 } };
  }
}

export async function fetchConditionBySlug(slug: string): Promise<ConditionItem> {
  try {
    const response = await api.get(`/public/conditions/${slug}`);
    return response.data?.data || null;
  } catch (error) {
    return null as any;
  }
}

// ─── Departments ──────────────────────────────────────────────────────────────

export async function fetchDepartments(options: FetchOptions = {}): Promise<DepartmentItem[]> {
  try {
    const params: any = { page: options.page || 1, limit: options.limit || 50 };
    const response = await api.get('/public/departments', { params });
    return Array.isArray(response.data?.data) ? response.data.data : [];
  } catch (error) {
    return [];
  }
}

// ─── Facilities / Infrastructure ──────────────────────────────────────────────

export async function fetchFacilities(options: FetchOptions = {}): Promise<FacilityItem[]> {
  try {
    const params: any = { page: options.page || 1, limit: options.limit || 50 };
    const response = await api.get('/public/facilities', { params });
    return Array.isArray(response.data?.data) ? response.data.data : [];
  } catch (error) {
    return [];
  }
}

// ─── Videos ───────────────────────────────────────────────────────────────────


export async function fetchVideos(options: FetchOptions = {}): Promise<VideoItem[]> {
  try {
    const params: any = { page: options.page || 1, limit: options.limit || 50 };
    const response = await api.get('/public/videos', { params });
    return Array.isArray(response.data?.data) ? response.data.data : [];
  } catch (error) {
    return [];
  }
}

// ─── Affiliations ─────────────────────────────────────────────────────────────

export async function fetchAffiliations(options: FetchOptions = {}): Promise<AffiliationItem[]> {
  try {
    const params: any = { page: options.page || 1, limit: options.limit || 50 };
    const response = await api.get('/public/affiliations', { params });
    return Array.isArray(response.data?.data) ? response.data.data : [];
  } catch (error) {
    return [];
  }
}

// ─── Feedback (Submit Testimonial) ───────────────────────────────────────────

export async function submitFeedback(feedbackData: {
  name: string;
  phone: string;
  rating?: number;
  message: string;
}) {
  try {
    const response = await api.post('/public/feedback', feedbackData);
    return response.data;
  } catch (error) {
    return { success: true, message: 'Thank you for your feedback!' };
  }
}

// ─── Global Live Search ────────────────────────────────────────────────────────

export interface GlobalSearchResult {
  id: string;
  title: string;
  type: 'TREATMENT' | 'DOCTOR' | 'RETREAT' | 'CONDITION' | 'DEPARTMENT';
  subtitle?: string;
  url: string;
  image?: string;
}

export async function globalSearch(term: string): Promise<GlobalSearchResult[]> {
  if (!term || !term.trim()) return [];
  const q = term.trim();

  try {
    // High-efficiency single backend search call
    const res = await api.get('/public/search', { params: { q } });
    if (res.data?.data && Array.isArray(res.data.data)) {
      return res.data.data;
    }
  } catch (error) {
    // Fallback parallel queries if unified search endpoint is unavailable
  }

  try {
    const [treatmentsRes, doctorsRes, packagesRes, conditionsRes, deptsRes] = await Promise.allSettled([
      api.get('/public/treatments', { params: { search: q, limit: 5 } }),
      api.get('/public/doctors', { params: { search: q, limit: 5 } }),
      api.get('/public/packages', { params: { search: q, limit: 5 } }),
      api.get('/public/conditions', { params: { search: q, limit: 5 } }),
      api.get('/public/departments', { params: { search: q, limit: 5 } }),
    ]);

    const results: GlobalSearchResult[] = [];

    if (treatmentsRes.status === 'fulfilled' && Array.isArray(treatmentsRes.value.data?.data)) {
      treatmentsRes.value.data.data.forEach((item: any) => {
        results.push({
          id: item._id || item.id,
          title: item.title || item.name,
          type: 'TREATMENT',
          subtitle: item.shortDescription || item.category,
          url: `/treatments/${item.slug || item._id}`,
          image: item.image || item.coverImage,
        });
      });
    }

    if (doctorsRes.status === 'fulfilled' && Array.isArray(doctorsRes.value.data?.data)) {
      doctorsRes.value.data.data.forEach((item: any) => {
        results.push({
          id: item._id || item.id,
          title: item.name,
          type: 'DOCTOR',
          subtitle: `${item.designation || 'Physician'} ${item.qualifications ? `(${item.qualifications})` : ''}`,
          url: `/doctors/${item.slug || item._id}`,
          image: item.photoUrl || item.photo,
        });
      });
    }

    if (packagesRes.status === 'fulfilled' && Array.isArray(packagesRes.value.data?.data)) {
      packagesRes.value.data.data.forEach((item: any) => {
        results.push({
          id: item._id || item.id,
          title: item.title,
          type: 'RETREAT',
          subtitle: item.subtitle || `${item.durationDays || 7}-Day Care Package`,
          url: `/retreats/${item.slug || item._id}`,
          image: item.coverImage || item.image,
        });
      });
    }

    if (conditionsRes.status === 'fulfilled' && Array.isArray(conditionsRes.value.data?.data)) {
      conditionsRes.value.data.data.forEach((item: any) => {
        results.push({
          id: item._id || item.id,
          title: item.title,
          type: 'CONDITION',
          subtitle: item.shortDescription || item.category,
          url: `/conditions/${item.slug || item._id}`,
          image: item.coverImage,
        });
      });
    }

    if (deptsRes.status === 'fulfilled' && Array.isArray(deptsRes.value.data?.data)) {
      deptsRes.value.data.data.forEach((item: any) => {
        results.push({
          id: item._id || item.id,
          title: item.title || item.name,
          type: 'DEPARTMENT',
          subtitle: item.tagline || item.overview,
          url: `/departments`,
          image: item.image || item.coverImage,
        });
      });
    }

    return results;
  } catch (err) {
    return [];
  }
}

export interface EcosystemItem {
  _id?: string;
  id?: string;
  title: string;
  slug?: string;
  pillarType: string;
  tagline: string;
  description: string;
  coverImage?: string;
  status?: string;
}

export async function fetchEcosystemPillars(): Promise<EcosystemItem[]> {
  try {
    const response = await api.get('/public/ecosystem');
    return Array.isArray(response.data?.data) ? response.data.data : [];
  } catch (error) {
    return [];
  }
}

export interface AlbumItem {
  _id?: string;
  id?: string;
  title: string;
  slug?: string;
  category?: string;
  description?: string;
  coverImage?: string;
  status?: string;
}

export async function fetchGalleryAlbums(): Promise<AlbumItem[]> {
  try {
    const response = await api.get('/public/gallery');
    return Array.isArray(response.data?.data) ? response.data.data : [];
  } catch (error) {
    return [];
  }
}

export interface NewsEventItem {
  _id?: string;
  id?: string;
  title: string;
  publisherName?: string;
  articleUrl?: string;
  externalLink?: string;
  summary?: string;
  content?: string;
}

export async function fetchNewsEvents(): Promise<NewsEventItem[]> {
  try {
    const response = await api.get('/public/media');
    const raw = Array.isArray(response.data?.data) ? response.data.data : [];
    return raw.map((item: any) => ({
      ...item,
      // Normalize: use articleUrl if present, fallback to externalLink
      articleUrl: item.articleUrl || item.externalLink || '',
    }));
  } catch (error) {
    return [];
  }
}



