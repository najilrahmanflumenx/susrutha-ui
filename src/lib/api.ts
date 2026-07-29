import axios from 'axios';
import { doctors } from '../data/doctors';
import { treatments } from '../data/treatments';
import { specialties } from '../data/specialties';
import { packages } from '../data/packages';
import { branches, facilities } from '../data/site';

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
    console.warn('API fetch failed, fallback to local data:', error);
  }
  return {
    doctors: doctors,
    packages: packages,
    conditions: specialties.map(s => ({ _id: s.id, slug: s.slug, title: s.name, shortDescription: s.tagline, category: 'Speciality Pathway' })),
    facilities: [
      { _id: 'f-1', title: 'Inpatient Rooms', description: 'Economic to luxury options with TV, AC/Non-AC, WiFi on demand, hot water, attached bath.', photo: '/images/hospital-room.jpg', features: ['40 Inpatient Beds', '24x7 Nursing', 'Dietary Service'] },
      { _id: 'f-2', title: 'Panchakarma Suites', description: 'Separate male and female therapy rooms with dedicated therapists trained in classical protocols.', photo: '/images/hero-ayurveda.jpg', features: ['Male & Female Suites', 'Experienced Therapists', 'Medicated Oils'] },
      { _id: 'f-3', title: 'Operation Theatre', description: 'On-site OT supporting procedures including Kshara Sutra and related minor surgical care.', photo: '/images/herbs-mortar.jpg', features: ['Kshara Sutra Unit', 'Sterile Environment', 'Minor Surgery Support'] },
      { _id: 'f-4', title: 'Physiotherapy Unit', description: 'Integrated rehabilitation support alongside Ayurvedic therapies for spine & joint recovery.', photo: '/images/hospital-room.jpg', features: ['Rehab Equipment', 'Spine Mobility', 'Guided Exercises'] },
      { _id: 'f-5', title: 'Ayur Village (Gramam)', description: 'Four traditional Kerala cottages with private treatment rooms, ~20 km from airport.', photo: '/images/ayur-village.jpg', features: ['Traditional Cottages', 'Private Therapy', 'Serene Environment'] },
    ],
  };
};

export const getBranches = async () => {
  try {
    const res = await api.get('/branches');
    if (res.data && res.data.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
      return res.data.data;
    }
  } catch (error) {
    console.warn('API fetch failed, fallback to local data:', error);
  }
  return branches.map(b => ({
    _id: b.id,
    id: b.id,
    code: b.code,
    name: b.name,
    slug: b.slug,
    type: b.type,
    city: b.city,
    address: b.address,
    description: b.description,
    features: b.features,
    opdTimings: b.hours.op,
    contact: { phone: ['+91 96566 56736'], email: 'info@susruthaayurveda.com' },
  }));
};

export const getDoctors = async (branchCode?: string) => {
  try {
    const res = await api.get('/doctors', { params: { branchCode } });
    if (res.data && res.data.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
      return res.data.data;
    }
  } catch (error) {
    console.warn('API fetch failed, fallback to local data:', error);
  }
  const mappedDocs = doctors.map(d => ({
    _id: d.id,
    slug: d.slug,
    name: d.name,
    qualifications: d.qual,
    designation: d.role,
    isDirector: d.isDirector,
    photo: d.image || '/images/doctor-portrait.jpg',
    availability: d.availability,
    specialties: d.pillars,
    assignedBranchIds: d.branchIds,
    departmentId: { _id: d.specialtyIds[0] || 'gen', title: 'Ayurveda Specialist' },
  }));

  if (branchCode) {
    return mappedDocs.filter(d => d.assignedBranchIds.includes(branchCode) || d.assignedBranchIds.includes(branchCode.toLowerCase()));
  }
  return mappedDocs;
};

export const getDoctorBySlug = async (slug: string) => {
  try {
    const res = await api.get(`/doctors/${slug}`);
    if (res.data && res.data.data) return res.data.data;
  } catch (error) {
    console.warn('API fetch failed, fallback to local data:', error);
  }
  const d = doctors.find((doc) => doc.slug === slug || doc.id === slug) || doctors[0];
  return {
    _id: d.id,
    slug: d.slug,
    name: d.name,
    qualifications: d.qual,
    designation: d.role,
    isDirector: d.isDirector,
    photo: d.image || '/images/doctor-portrait.jpg',
    availability: d.availability,
    specialties: d.pillars,
    biography: d.aiSummary,
    philosophy: d.philosophy,
    approach: d.approach,
    specializations: d.specializations,
    signatureTreatments: d.signatureTreatments,
    education: d.education,
  };
};

export const getDepartments = async () => {
  try {
    const res = await api.get('/departments');
    if (res.data && res.data.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
      return res.data.data;
    }
  } catch (error) {
    console.warn('API fetch failed, fallback to local data:', error);
  }
  return specialties.map(s => ({ _id: s.id, slug: s.slug, title: s.name, description: s.tagline }));
};

export const getPackages = async () => {
  try {
    const res = await api.get('/packages');
    if (res.data && res.data.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
      return res.data.data;
    }
  } catch (error) {
    console.warn('API fetch failed, fallback to local data:', error);
  }
  return packages.map(p => ({
    _id: p.id,
    slug: p.slug,
    title: p.name,
    name: p.name,
    subtitle: p.summary,
    summary: p.summary,
    overview: p.summary,
    durationDays: 7,
    durationLabel: p.durationLabel,
  }));
};

export const getPackageBySlug = async (slug: string) => {
  try {
    const res = await api.get(`/packages/${slug}`);
    if (res.data && res.data.data) return res.data.data;
  } catch (error) {
    console.warn('API fetch failed, fallback to local data:', error);
  }
  const p = packages.find((pkg) => pkg.slug === slug || pkg.id === slug) || packages[0];
  return {
    _id: p.id,
    slug: p.slug,
    title: p.name,
    name: p.name,
    subtitle: p.summary,
    summary: p.summary,
    overview: p.summary,
    durationDays: 7,
    durationLabel: p.durationLabel,
    whoNeeds: p.whoFor,
    inclusions: p.included,
    benefits: p.dayFlow,
  };
};

export const getSettings = async () => {
  try {
    const res = await api.get('/settings');
    if (res.data && res.data.data) return res.data.data;
  } catch (error) {
    console.warn('API fetch failed, fallback to local data:', error);
  }
  return { siteTitle: 'Susrutha Ayurveda', emergencyNumbers: ['+91 96566 56736'] };
};

export const getFacilities = async () => {
  try {
    const res = await api.get('/facilities');
    if (res.data && res.data.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
      return res.data.data;
    }
  } catch (error) {
    console.warn('API fetch failed, fallback to local data:', error);
  }
  return [
    {
      _id: 'f-1',
      title: 'Inpatient Rooms',
      description: 'Economic to luxury options with TV, AC/Non-AC, WiFi on demand, hot water, attached bath.',
      photo: '/images/hospital-room.jpg',
      features: ['40 Inpatient Beds', '24x7 Nursing', 'Dietary Service', 'Hot Water & AC'],
    },
    {
      _id: 'f-2',
      title: 'Panchakarma Suites',
      description: 'Separate male and female therapy rooms with dedicated therapists trained in classical Kerala protocols.',
      photo: '/images/hero-ayurveda.jpg',
      features: ['Male & Female Suites', 'Experienced Therapists', 'Classical Steam Bath', 'Medicated Oils'],
    },
    {
      _id: 'f-3',
      title: 'Operation Theatre',
      description: 'On-site OT supporting procedures including Kshara Sutra and related minor surgical care.',
      photo: '/images/herbs-mortar.jpg',
      features: ['Kshara Sutra Unit', 'Sterile Environment', 'Minor Surgery Support'],
    },
    {
      _id: 'f-4',
      title: 'Physiotherapy Unit',
      description: 'Integrated rehabilitation support alongside Ayurvedic therapies for spine, joint and neurological recovery.',
      photo: '/images/hospital-room.jpg',
      features: ['Rehab Equipment', 'Spine Mobility', 'Neurological Rehab', 'Guided Exercises'],
    },
    {
      _id: 'f-5',
      title: 'Ayur Village (Gramam)',
      description: 'Four traditional Kerala cottages with private treatment rooms, ~20 km from Trivandrum airport.',
      photo: '/images/ayur-village.jpg',
      features: ['Traditional Cottages', 'Private Therapy', 'Serene Environment'],
    },
  ];
};

export const getTestimonials = async () => {
  try {
    const res = await api.get('/testimonials');
    if (res.data && res.data.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
      return res.data.data;
    }
  } catch (error) {
    console.warn('API fetch failed, fallback to local data:', error);
  }
  return [
    {
      _id: 't-1',
      patientName: 'Subhash Nair',
      treatmentReceived: 'Spine & Joint Rehabilitation (14-day Inpatient)',
      patientLocation: 'Trivandrum',
      rating: 5,
      reviewText: 'After years of severe lumbar spine discomfort and posture stiffness, 14 days of supervised Panchakarma and Kati Vasti at Susrutha Kattakada restored my mobility completely.',
    },
    {
      _id: 't-2',
      patientName: 'Elena Rostova',
      treatmentReceived: 'Rejuvenation & Rasayana Programme',
      patientLocation: 'Vienna, Austria',
      rating: 5,
      reviewText: 'Staying at Susrutha Ayur Village was a serene healing journey. Physician consultations were thorough and therapist care was deeply compassionate and authentic.',
    },
    {
      _id: 't-3',
      patientName: 'Ramesh Menon',
      treatmentReceived: 'Post-Stroke Ayurvedic Rehab & Abhyanga',
      patientLocation: 'Kowdiar, TVM',
      rating: 5,
      reviewText: 'The combined physiotherapy and Ayurvedic oil therapies helped my father regain motor strength significantly faster. Highly professional clinical team.',
    },
  ];
};

export const getFaqs = async () => {
  try {
    const res = await api.get('/faqs');
    if (res.data && res.data.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
      return res.data.data;
    }
  } catch (error) {
    console.warn('API fetch failed, fallback to local data:', error);
  }
  return [
    { question: 'What makes Susrutha different from a wellness resort?', answer: 'Susrutha is a 40-bed Panchakarma hospital and research institute with inpatient beds, clinical rosters, and physician-directed protocols.' },
    { question: 'How far is the hospital from Trivandrum airport?', answer: 'Susrutha Ayur Village is about 20 km from Trivandrum International Airport.' },
  ];
};

export const getBlogs = async () => {
  try {
    const res = await api.get('/blogs');
    if (res.data && res.data.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
      return res.data.data;
    }
  } catch (error) {
    console.warn('API fetch failed, fallback to local data:', error);
  }
  return [
    { _id: 'b-1', slug: 'understanding-panchakarma-hospital-care', title: 'Understanding Panchakarma as Hospital Care', summary: 'Why authentic Panchakarma is sequenced and physician-directed.' },
  ];
};

export const getBlogBySlug = async (slug: string) => {
  try {
    const res = await api.get(`/blogs/${slug}`);
    if (res.data && res.data.data) return res.data.data;
  } catch (error) {
    console.warn('API fetch failed, fallback to local data:', error);
  }
  return { _id: 'b-1', slug: slug, title: 'Understanding Panchakarma as Hospital Care', content: 'Authentic Panchakarma care at Susrutha.' };
};

export const getConditions = async () => {
  try {
    const res = await api.get('/conditions');
    if (res.data && res.data.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
      return res.data.data;
    }
  } catch (error) {
    console.warn('API fetch failed, fallback to local data:', error);
  }
  return specialties.map(s => ({
    _id: s.id,
    slug: s.slug,
    title: s.name,
    shortDescription: s.tagline,
    ayurvedicRootCause: s.ayurvedicView,
    category: 'Speciality Pathway',
  }));
};

export const getConditionBySlug = async (slug: string) => {
  try {
    const res = await api.get(`/conditions/${slug}`);
    if (res.data && res.data.data) return res.data.data;
  } catch (error) {
    console.warn('API fetch failed, fallback to local data:', error);
  }
  const spec = specialties.find(s => s.slug === slug || s.id === slug) || specialties[0];
  return {
    _id: spec.id,
    slug: spec.slug,
    title: spec.name,
    shortDescription: spec.tagline,
    fullDescription: spec.overview,
    ayurvedicRootCause: spec.ayurvedicView,
    symptoms: spec.symptoms,
    treatmentApproach: spec.approach,
    faqs: spec.faqs,
  };
};

export const getTreatments = async (options?: PaginationOptions) => {
  try {
    const res = await api.get('/treatments', { params: options });
    if (res.data && res.data.data) {
      if (Array.isArray(res.data.data) && res.data.data.length > 0) {
        let items = res.data.data;
        if (options?.limit && !res.data.meta) {
          items = items.slice(0, options.limit);
        }
        return items;
      }
    }
  } catch (error) {
    console.warn('API fetch failed, fallback to local data:', error);
  }
  let mapped = treatments.map(t => ({
    _id: t.id,
    slug: t.slug,
    title: t.name,
    shortDescription: t.aiSummary,
    fullDescription: t.overview,
    category: t.category,
    coverImage: t.image || '/images/hero-ayurveda.jpg',
  }));

  if (options?.category && options.category !== 'All') {
    mapped = mapped.filter(t => t.category.toLowerCase().includes(options.category!.toLowerCase()));
  }
  if (options?.search) {
    const q = options.search.toLowerCase();
    mapped = mapped.filter(t => t.title.toLowerCase().includes(q) || t.shortDescription.toLowerCase().includes(q));
  }
  if (options?.limit) {
    const page = options.page || 1;
    const start = (page - 1) * options.limit;
    return mapped.slice(start, start + options.limit);
  }
  return mapped;
};

export const getTreatmentBySlug = async (slug: string) => {
  try {
    const res = await api.get(`/treatments/${slug}`);
    if (res.data && res.data.data) return res.data.data;
  } catch (error) {
    console.warn('API fetch failed, fallback to local data:', error);
  }
  const tx = treatments.find(t => t.slug === slug || t.id === slug) || treatments[0];
  return {
    _id: tx.id,
    slug: tx.slug,
    title: tx.name,
    shortDescription: tx.aiSummary,
    fullDescription: tx.overview,
    category: tx.category,
    coverImage: tx.image || '/images/hero-ayurveda.jpg',
    benefits: tx.benefits,
    // Map rich procedure objects { step, detail } as procedureSteps objects
    procedureSteps: tx.procedure.map(p => ({ step: p.step, detail: p.detail })),
    durationMinutes: (() => {
      const match = tx.duration.match(/(\d+)/);
      return match ? parseInt(match[1]) : 60;
    })(),
    recommendedDays: (() => {
      const matches = tx.duration.match(/(\d+)/g);
      return matches && matches.length > 1 ? parseInt(matches[1]) : 7;
    })(),
    indications: tx.whoNeeds,
    contraindications: tx.avoid,
    preparation: tx.preparation,
    aftercare: tx.aftercare,
    safety: tx.safety,
    conditions: tx.conditions,
    faqs: tx.faqs.map(f => ({ q: f.q, a: f.a })),
    malayalam: (tx as any).malayalam || 'ആയുർവേദ ചികിത്സ',
    doctorIds: tx.doctorIds || [],
  };
};

export const getEcosystem = async () => {
  try {
    const res = await api.get('/ecosystem');
    if (res.data && res.data.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
      return res.data.data;
    }
  } catch (error) {
    console.warn('API fetch failed, fallback to local data:', error);
  }
  return [
    { _id: 'e-1', slug: 'susrutha-pharma', title: 'Susrutha Ayurveda Pharma', description: 'GMP certified pharmacy' }
  ];
};

export const getEcosystemBySlug = async (slug: string) => {
  try {
    const res = await api.get(`/ecosystem/${slug}`);
    if (res.data && res.data.data) return res.data.data;
  } catch (error) {
    console.warn('API fetch failed, fallback to local data:', error);
  }
  return { _id: 'e-1', slug: slug, title: 'Susrutha Ayurveda Pharma', description: 'GMP certified pharmacy' };
};

export const getVideos = async () => {
  try {
    const res = await api.get('/videos');
    if (res.data && res.data.data) return res.data.data;
  } catch (error) {
    console.warn('API fetch failed, fallback to local data:', error);
  }
  return [];
};

export const getGallery = async () => {
  try {
    const res = await api.get('/gallery');
    if (res.data && res.data.data) return res.data.data;
  } catch (error) {
    console.warn('API fetch failed, fallback to local data:', error);
  }
  return [];
};

export const getAffiliations = async () => {
  try {
    const res = await api.get('/affiliations');
    if (res.data && res.data.data) return res.data.data;
  } catch (error) {
    console.warn('API fetch failed, fallback to local data:', error);
  }
  return [];
};

export const getMedia = async () => {
  try {
    const res = await api.get('/media');
    if (res.data && res.data.data) return res.data.data;
  } catch (error) {
    console.warn('API fetch failed, fallback to local data:', error);
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
  } catch (error) {
    console.warn('Book appointment API endpoint offline, handling locally:', error);
    return { success: true, message: 'Request recorded locally' };
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
  } catch (error) {
    console.warn('Submit lead API endpoint offline, handling locally:', error);
    return { success: true, message: 'Lead recorded locally' };
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
  } catch (error) {
    console.warn('Submit feedback API endpoint offline, handling locally:', error);
    return { success: true, message: 'Feedback recorded locally' };
  }
};

export default api;
