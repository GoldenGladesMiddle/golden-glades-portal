export interface ApplicationRecord {
  id: string;
  applicantName: string;
  position: 'Staff' | 'Guidance Counselor' | 'School Administrator';
  submittedDate: string;
  status: 'Pending' | 'Under Review' | 'Approved' | 'Rejected';
  email: string;
  phone: string;
  experience: string;
  notes: string;
}

export const APPLICATIONS_STORE: ApplicationRecord[] = [
  {
    id: 'APP-2001',
    applicantName: 'Robert Martinez',
    position: 'Staff',
    submittedDate: '2026-08-10',
    status: 'Pending',
    email: 'rmartinez@example.com',
    phone: '(305) 555-0143',
    experience: '5 years in administrative support and office operations.',
    notes: 'Resume and references attached.',
  },
];
