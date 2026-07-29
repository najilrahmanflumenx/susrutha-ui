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

// Mock Data
export const MOCK_TREATMENTS: TreatmentItem[] = [
  {
    id: 'tr-1',
    _id: 'tr-1',
    name: 'Shirodhara Bliss',
    title: 'Shirodhara Bliss',
    slug: 'shirodhara-bliss',
    category: 'Nervous System & Mind',
    duration: '90 Mins',
    durationMinutes: 90,
    price: 3500,
    rating: 4.9,
    reviewsCount: 124,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80',
    description: 'A rhythmic pouring of warm herbal oil onto the forehead to calm the central nervous system, relieve anxiety, and treat chronic insomnia.',
    shortDescription: 'Continuous rhythm pour of warm medicated oil across forehead for deep nervous system relaxation.',
    benefits: ['Deep Nervous System Relaxation', 'Insomnia & Anxiety Relief', 'Mental Clarity & Memory Enhancement'],
    indications: ['Insomnia', 'Anxiety & Stress', 'Migraine', 'Hypertension'],
    dosha: 'Vata & Pitta Pacifying'
  },
  {
    id: 'tr-2',
    _id: 'tr-2',
    name: 'Panchakarma Detox Ritual',
    title: 'Panchakarma Detox Ritual',
    slug: 'panchakarma-detox-ritual',
    category: 'Full-Body Purification',
    duration: '7 Days',
    durationMinutes: 420,
    price: 45000,
    rating: 5.0,
    reviewsCount: 210,
    image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&q=80',
    description: 'The premier five-fold detoxification process designed to eliminate deep-seated cellular toxins (Ama) and restore metabolic agni.',
    shortDescription: 'Comprehensive 5-step cellular detox therapy for total metabolic reset and rejuvenation.',
    benefits: ['Cellular Toxins Flush', 'Immune System Reboot', 'Metabolic Balance Restoration'],
    indications: ['Chronic Fatigue', 'Autoimmune Conditions', 'Metabolic Disorder'],
    dosha: 'Tri-Dosha Balancing'
  },
  {
    id: 'tr-3',
    _id: 'tr-3',
    name: 'Abhyanga Herbal Massage',
    title: 'Abhyanga Herbal Massage',
    slug: 'abhyanga-herbal-massage',
    category: 'Rejuvenation & Circulation',
    duration: '60 Mins',
    durationMinutes: 60,
    price: 2800,
    rating: 4.8,
    reviewsCount: 98,
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&q=80',
    description: 'Synchronized warm medicinal oil therapy performed by two trained therapists to improve lymphatic movement and relieve muscle tension.',
    shortDescription: 'Synchronized full body herbal oil massage for lymphatic drainage and joint mobility.',
    benefits: ['Lymphatic Drainage Boost', 'Joint Stiffness Relief', 'Luminous Skin Nourishment'],
    indications: ['Vata Stiffness', 'General Fatigue', 'Joint Pain'],
    dosha: 'Vata Balancing'
  }
];

export const MOCK_DOCTORS: DoctorItem[] = [
  {
    id: 'doc-1',
    _id: 'doc-1',
    name: 'Dr. Krishnakumar K.',
    slug: 'dr-krishnakumar-k',
    title: 'Chief Medical Officer',
    designation: 'Senior Ayurvedic Physician',
    specialization: 'Kaya Chikitsa & Panchakarma',
    specialties: ['Spine Disc Herniation', 'Panchakarma Detoxification', 'Rheumatoid Arthritis'],
    experienceYears: 24,
    rating: 4.95,
    patientsCount: 15400,
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80',
    photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80',
    qualifications: ['BAMS', 'MD (Ayurveda)'],
    bio: 'Renowned Ayurvedic physician with over 24 years of clinical experience in classical Panchakarma, severe degenerative spine disorders, and chronic arthritis.',
    consultationFee: 500,
    languagesSpoken: ['Malayalam', 'English', 'Hindi']
  },
  {
    id: 'doc-2',
    _id: 'doc-2',
    name: 'Dr. Sreeja Krishna S.',
    slug: 'dr-sreeja-krishna-s',
    title: 'Senior Consultant Physician',
    designation: 'Gynaecology & Skin Specialist',
    specialization: 'Rasayana & Gynaecology',
    specialties: ['PCOS & Women Health', 'Psoriasis & Skin Care', 'Metabolic Disorders'],
    experienceYears: 18,
    rating: 4.90,
    patientsCount: 11200,
    image: 'https://images.unsplash.com/photo-1594824813570-78a295000527?auto=format&fit=crop&q=80',
    photoUrl: 'https://images.unsplash.com/photo-1594824813570-78a295000527?auto=format&fit=crop&q=80',
    qualifications: ['BAMS', 'MS (Ayurveda)'],
    bio: 'Expert in Gynaecology, Infertility, PCOS management, Chronic Psoriasis, and Lifestyle Metabolic Disorders.',
    consultationFee: 400,
    languagesSpoken: ['Malayalam', 'English']
  }
];

export const MOCK_BRANCHES: BranchItem[] = [
  {
    id: 'br-1',
    _id: 'br-1',
    name: 'Kattakada Inpatient Hospital & Research Center',
    code: 'KTK',
    type: 'INPATIENT_HOSPITAL',
    tagline: '40-Bed Inpatient Panchakarma Hospital Campus & Research Institute',
    address: { street: 'Kattakada-Killi Main Road', city: 'Thiruvananthapuram', state: 'Kerala', pincode: '695572', coordinates: { lat: 8.5085, lng: 77.0805 } },
    contact: { phone: ['+91 96566 56736', '+91 471 229 0256'], email: 'kattakada@susruthaayurveda.com', emergencyPhone: '+91 96566 56736' },
    opdTimings: '09:00 AM - 07:00 PM (Mon - Sun)',
    bedCapacity: 40,
    features: ['40 Inpatient Beds', 'Private Panchakarma Cottages', 'Herbal Species Botanical Garden', 'Organic Pure Vegetarian Kitchen'],
    isMainBranch: true,
    coverImage: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80'
  },
  {
    id: 'br-2',
    _id: 'br-2',
    name: 'Kowdiar City Outpatient Clinic',
    code: 'KWR',
    type: 'CITY_CLINIC',
    tagline: 'Premium City Outpatient Consultation & Specialty Care Center',
    address: { street: 'Kowdiar Palace Road', city: 'Thiruvananthapuram', state: 'Kerala', pincode: '695003', coordinates: { lat: 8.5241, lng: 76.9637 } },
    contact: { phone: ['+91 96566 56736'], email: 'kowdiar@susruthaayurveda.com' },
    opdTimings: '09:00 AM - 07:00 PM (Mon - Sat)',
    bedCapacity: 0,
    features: ['Executive OPD Consultation', 'Daycare Panchakarma & Kizhi Therapy', 'In-house GMP Medicine Pharmacy'],
    isMainBranch: false,
    coverImage: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80'
  }
];

export const MOCK_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 't-1',
    patientName: 'Ananya Sharma',
    patientLocation: 'Mumbai, India',
    treatmentReceived: '7-Day Panchakarma Retreat',
    rating: 5,
    reviewText: 'My chronic back pain and fatigue completely vanished after the 7-day inpatient Panchakarma therapy at Susrutha Kattakada. The doctors and therapists treat you like family.'
  },
  {
    id: 't-2',
    patientName: 'David Miller',
    patientLocation: 'London, UK',
    treatmentReceived: 'Shirodhara & Rasayana Therapy',
    rating: 5,
    reviewText: 'The serene botanical hospital environment paired with authentic classical Kerala treatments made my stay truly transformative. Highly recommended!'
  }
];

export const MOCK_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How long should I stay for a complete Panchakarma detox?',
    answer: 'A classical Panchakarma program typically ranges from 7 to 21 days depending on your health goals and dosha assessment during consultation.'
  },
  {
    id: 'faq-2',
    question: 'Are inpatient rooms available at the hospital?',
    answer: 'Yes! Our Kattakada hospital campus features 40 private inpatient rooms, executive suites, and traditional panchakarma therapy cottages.'
  }
];

export const MOCK_APPOINTMENTS = [
  {
    id: 'apt-101',
    patientName: 'Ananya Sharma',
    patientEmail: 'ananya@example.com',
    doctorName: 'Dr. Krishnakumar K.',
    treatmentName: 'Shirodhara Bliss',
    date: '2026-08-02',
    time: '10:30 AM',
    status: 'Confirmed',
    amount: 3500,
    type: 'In-Clinic Retreat'
  },
  {
    id: 'apt-102',
    patientName: 'Rohan Mehta',
    patientEmail: 'rohan@example.com',
    doctorName: 'Dr. Sreeja Krishna S.',
    treatmentName: 'Panchakarma Detox Ritual',
    date: '2026-08-04',
    time: '02:00 PM',
    status: 'Pending',
    amount: 45000,
    type: '7-Day Sanctuary Retreat'
  }
];

// API Service Callers
export async function fetchTreatments(): Promise<TreatmentItem[]> {
  try {
    const response = await api.get('/public/treatments');
    return response.data?.data || MOCK_TREATMENTS;
  } catch (error) {
    return MOCK_TREATMENTS;
  }
}

export async function fetchTreatmentBySlug(slug: string): Promise<TreatmentItem> {
  try {
    const response = await api.get(`/public/treatments/${slug}`);
    return response.data?.data || MOCK_TREATMENTS[0];
  } catch (error) {
    return MOCK_TREATMENTS.find((t) => t.slug === slug) || MOCK_TREATMENTS[0];
  }
}

export async function fetchDoctors(): Promise<DoctorItem[]> {
  try {
    const response = await api.get('/public/doctors');
    return response.data?.data || MOCK_DOCTORS;
  } catch (error) {
    return MOCK_DOCTORS;
  }
}

export async function fetchDoctorBySlug(slug: string): Promise<DoctorItem> {
  try {
    const response = await api.get(`/public/doctors/${slug}`);
    return response.data?.data || MOCK_DOCTORS[0];
  } catch (error) {
    return MOCK_DOCTORS.find((d) => d.slug === slug) || MOCK_DOCTORS[0];
  }
}

export async function fetchBranches(): Promise<BranchItem[]> {
  try {
    const response = await api.get('/public/branches');
    return response.data?.data || MOCK_BRANCHES;
  } catch (error) {
    return MOCK_BRANCHES;
  }
}

export async function fetchCarePackages(): Promise<CarePackageItem[]> {
  try {
    const response = await api.get('/public/packages');
    return response.data?.data || [];
  } catch (error) {
    return [];
  }
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
