export interface HeritageMilestone {
  year: string;
  title: string;
  description: string;
}

export interface DoctorSchedule {
  name: string;
  qualifications: string;
  designation: string;
  center: 'Kattakada' | 'Kowdiar' | 'Both';
  availableDays: string;
  timeSlot: string;
  phone?: string;
}

export interface CarePackageSummary {
  id: string;
  title: string;
  subtitle: string;
  code: string;
  duration: string;
  idealFor: string;
}

export interface GalleryPhotoItem {
  id: string;
  title: string;
  largeUrl: string;
  smallUrl: string;
  album: string;
}

export const SUSRUTHA_HERITAGE_INFO = {
  hospitalName: 'Susrutha Institute of Ayurvedic Sciences (Research) and Panchakarma Hospital',
  tagline: 'The Way To Healthy Life Is Through Ayurveda',
  foundingYear: 1970,
  lineageHistory: `The long-felt desire of the people of Kattakada to have an Ayurvedic Clinic was realized through two visionaries: Ayurvedic Physician Sri. P. Krishna Pillai (Late) and Sri. P.K. Pillai (Late) in 1970. By their untiring efforts, the clinic grew into a full-fledged hospital. Their visions were further enhanced by Sri. P.K. Pillai’s son, Prof. Dr. Krishnankutty Nair (Late), former HOD of Govt. Ayurveda College Panchakarma Hospital Trivandrum—a recipient of the Pride of India Award, Indira Gandhi Sadbhavana Award, and Bharath Jyothi Award. Today, the Research Institute and Hospital are managed by Dr. Nair's son, Dr. Krishnakumar K. (MD Ayur), and daughter, Dr. Sreeja Krishna S. (BAMS, MBA), along with a dedicated team of clinical professionals.`,
  ayurvedaPhilosophy: `Health is the main factor behind the fulfillment of Ayu (life). To safeguard health and prolong lifespan, one should follow principles mentioned in Ayurveda—the age-old science passed down through Guru-Shishya Parampara to cure ailments and enrich life.`,
  
  contacts: {
    mainPhone: '0471-2291027',
    mobileHotline: '+91 9656656736',
    kattakadaPhones: ['0471-2291027', '+91 9656656736', '+91 9446583803', '+91 9447892399'],
    kowdiarPhones: ['+91 8075433728', '+91 8075483770'],
    email: 'info@susruthaayurveda.com',
    kattakadaEmail: 'kattakada@susruthaayurveda.com',
    kowdiarEmail: 'kowdiar@susruthaayurveda.com',
  },

  branches: [
    {
      id: 'kattakada',
      name: 'Susrutha Institute of Ayurvedic Sciences & Panchakarma Hospital (Kattakada)',
      type: 'Main Inpatient Hospital & Research Institute',
      address: 'Opposite Christian College, Kattakada, Thiruvananthapuram, Kerala - 695572',
      phones: ['0471-2291027', '+91 9656656736'],
      email: 'kattakada@susruthaayurveda.com',
      opdTimings: '09:00 AM - 07:00 PM',
      hospitalService: '24x7 Inpatient & Emergency Care',
      mapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3945.91648105041!2d77.08346294944106!3d8.507490299253178!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b05b169ec948029%3A0x31d1be9f32b01994!2sSusrutha+Institute+of+Ayurvedic+Sciences+and+Panchakarma+Hospital!5e0!3m2!1sen!2sin!4v1544898240957'
    },
    {
      id: 'kowdiar',
      name: 'Susrutha Panchakarma Hospital OP Outlet (Kowdiar)',
      type: 'Satellite OPD & Daycare Therapy Center',
      address: 'Ground Floor, Urbon Heights, Opposite Income Tax Office, Pipelane Road, Kowdiar, Thiruvananthapuram, Kerala - 695003',
      phones: ['+91 8075433728', '+91 8075483770'],
      email: 'kowdiar@susruthaayurveda.com',
      opdTimings: '09:00 AM - 07:00 PM',
      hospitalService: 'Outpatient Consultations & Daycare Therapies',
      mapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3945.7225477245597!2d76.95845001478305!3d8.526294893870547!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x5e86ce05043d3eea!2zOMKwMzEnMzQuNyJOIDc2wrA1NyczOC4zIkU!5e0!3m2!1sen!2sin!4v1669613065435!5m2!1sen!2sin'
    }
  ]
};

export const MILESTONES: HeritageMilestone[] = [
  { year: '1970', title: 'Founding of Ayurvedic Clinic', description: 'Established in Kattakada by visionaries Sri P. Krishna Pillai (Late) and Sri P.K. Pillai (Late).' },
  { year: '1986', title: 'Clinic & Pharmacy Expansion', description: 'Established full Susrutha clinic and pharmacy center at Kattakada.' },
  { year: '2002', title: '30-Bedded Panchakarma Hospital', description: 'Registered 30-bed Panchakarma Hospital and Institute under leadership of Prof. Dr. Krishnankutty Nair.' },
  { year: '2008', title: 'GMP Certified Pharma', description: 'Registered GMP certified Susrutha Ayurvedic Pharma manufacturing unit.' },
  { year: '2010', title: 'Susrutha Ayurveda Village', description: 'Launched eco-friendly Ayurveda healing village for residential panchakarma.' },
  { year: '2012', title: 'Registered Partnership Firm', description: 'Formalized hospital management and clinical operations partnership.' },
  { year: '2013', title: 'Advanced Nursing School', description: 'Established Susrutha Advanced Ayurveda Nursing School for Panchakarma therapist training.' },
  { year: '2015', title: 'Susrutha Medi Tech Lab', description: 'Inaugurated full-fledged diagnostic laboratory with 5km home sampling facility.' },
  { year: '2016', title: 'Charitable Medical Trust', description: 'Registered Susrutha Charitable Medical Trust for subsidised rural healthcare.' },
  { year: '2019', title: 'Susrutha CAN Movement', description: 'Pioneered Cancer Care Awareness & Supportive Care movement.' },
  { year: '2020', title: 'Specialty Care Units', description: 'Launched Susrutha Proctology, Postnatal Care, and Post-stroke Palliative Care units.' },
  { year: '2022 (Apr)', title: 'Susrutha Life Care Pvt Ltd', description: 'Incorporated Susrutha Life Care Private Limited.' },
  { year: '2022 (Jun)', title: 'Kowdiar OP Outlet', description: 'Inaugurated first satellite OPD and daycare treatment center at Kowdiar, Trivandrum.' }
];

export const DOCTORS_SCHEDULE: DoctorSchedule[] = [
  // Kowdiar
  { name: 'Dr. M. K. Sasidharan', qualifications: 'Retrd. Prof. Govt. Ayurveda College Trivandrum (Former Head Panchakarma Poojappura)', designation: 'Senior Visiting Professor', center: 'Kowdiar', availableDays: 'Saturday', timeSlot: '09.00 AM To 01.00 PM' },
  { name: 'Dr. Vinaya Babu B.', qualifications: 'BSE, BAMS (Chief Medical Officer Rtd Govt. of Kerala)', designation: 'Senior Consultant', center: 'Kowdiar', availableDays: 'Monday, Thursday', timeSlot: '09.00 AM To 01.00 PM' },
  { name: 'Dr. Sreeja Krishna S.', qualifications: 'BAMS, MBA Hospital Management', designation: 'Director & Senior Consultant', center: 'Both', availableDays: 'Kowdiar: Wednesday | Kattakada: Tue, Thu, Sat', timeSlot: '09.00 AM To 05.00 PM (Kowdiar)' },
  { name: 'Dr. Priyanka R.', qualifications: 'BAMS, MS (Ayur) Ayurvedic Gynaecologist & Obstetrician', designation: 'Gynaecologist Specialist', center: 'Both', availableDays: 'Kowdiar: Tuesday | Kattakada: Sun, Mon, Wed, Fri', timeSlot: '09.00 AM To 05.00 PM' },
  { name: 'Dr. Nithya P.', qualifications: 'BAMS', designation: 'Consultant Physician', center: 'Kowdiar', availableDays: 'Saturday', timeSlot: '09.00 AM To 03.00 PM' },
  
  // Kattakada
  { name: 'Dr. Krishnakumar K.', qualifications: 'MD (Ayur)', designation: 'Managing Director & Chief Physician', center: 'Kattakada', availableDays: 'On Prior Appointment', timeSlot: 'Full Day' },
  { name: 'Dr. Dipu Sukumar', qualifications: 'BAMS, Ayurveda Proctologist (Piles & Fistula Specialist)', designation: 'Proctologist Specialist', center: 'Kattakada', availableDays: 'On Prior Appointment', timeSlot: 'OPD Hours' },
  { name: 'Dr. Roopasree', qualifications: 'BAMS', designation: 'Resident Medical Officer (RMO)', center: 'Kattakada', availableDays: 'All Days', timeSlot: '24X7 Available' },
  { name: 'Dr. K. Kaveri', qualifications: 'BAMS', designation: 'Consultant Medical Officer', center: 'Kattakada', availableDays: 'Mon, Wed, Fri', timeSlot: '09.00 AM To 04.00 PM' }
];

export const CARE_PACKAGES_DATA: CarePackageSummary[] = [
  { id: 'ano-rectal', title: 'Ano Rectal Care Package', subtitle: 'Piles & Fistula Kshara Sutra Therapy', code: 'ANO', duration: '7 Days', idealFor: 'Piles, Anal Fistula & Fissure relief' },
  { id: 'rejuvenation', title: 'Rejuvenation Package', subtitle: 'Rasayana & Detoxification', code: 'REJ', duration: '7 Days', idealFor: 'Full body detox, anti-aging & immunity booster' },
  { id: 'post-natal', title: 'Post Natal Care Package', subtitle: 'Mother & Baby Holistic Recovery', code: 'PNC', duration: '14 Days (OP/IP)', idealFor: 'Post-partum recovery, pelvic strength & lactation support' },
  { id: 'low-back', title: 'Low Back Pain Care Package', subtitle: 'Lumbar Spine & Sciatica Rehab', code: 'LBP', duration: '7 Days', idealFor: 'Lumbar Spondylosis, Sciatica & Slip Disc' },
  { id: 'neck-pain', title: 'Neck Pain Care Package', subtitle: 'Cervical Spondylosis & Griva Vasthi', code: 'NPK', duration: '7 Days', idealFor: 'Cervical Spondylosis & tech neck stiffness' },
  { id: '3-days', title: '3 Days Ayurveda Package', subtitle: 'Express Relaxation & Detox', code: '3DAY', duration: '3 Days', idealFor: 'Short weekend wellness & stress relief' },
  { id: '5-days', title: '5 Days Ayurveda Package', subtitle: 'Short-Stay Panchakarma Renewal', code: '5DAY', duration: '5 Days', idealFor: 'Body renewal & digestive cleansing' },
  { id: '7-days', title: '7 Days Ayurveda Care Package', subtitle: 'Complete Panchakarma Program', code: '7DAY', duration: '7 Days', idealFor: 'Comprehensive 7-day bio-purification' },
  { id: '16-days', title: '16 Days Ayurveda Care Package', subtitle: 'Inpatient Deep Tissue Recovery', code: '16DAY', duration: '16 Days', idealFor: 'Severe arthritis, stroke rehab & chronic paralysis' },
  { id: 'psoriasis', title: 'Psoriasis & Skin Care Package', subtitle: 'Takradhara & Raktamokshana', code: 'PSK', duration: '14 Days', idealFor: 'Psoriasis, Eczema & chronic dermatitis' },
  { id: 'stress-care', title: 'Stress Care Package', subtitle: 'Shirodhara & Sleep Rejuvenation', code: 'STR', duration: '7 Days', idealFor: 'Insomnia, anxiety & chronic burnout' },
  { id: 'tekky-care', title: 'Tekky Package', subtitle: 'Occupational Disorder Care for IT Pros', code: 'TEK', duration: '7 Days', idealFor: 'Desk professionals with neck, back & eye strain' }
];

export const KOWDIAR_GALLERY_PHOTOS: GalleryPhotoItem[] = Array.from({ length: 36 }, (_, i) => {
  const num = String(i + 1).padStart(2, '0');
  return {
    id: `kowdiar-${num}`,
    title: `Kowdiar Center Inauguration Photo #${i + 1}`,
    largeUrl: `/images/old_site/kowdiar/${num}-large.jpg`,
    smallUrl: `/images/old_site/kowdiar/${num}-small.jpg`,
    album: 'Kowdiar Inauguration'
  };
});
