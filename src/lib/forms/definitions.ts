/**
 * Form definitions shared by the rendered forms and the server-side validation,
 * so labels, required flags and allowed options cannot drift apart.
 * Fields and options mirror the live Contact Form 7 forms on voisetech.com.
 */
import countries from '../../data/countries.json';

export type FieldType = 'text' | 'email' | 'tel' | 'url' | 'select' | 'textarea' | 'file';
export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  autocomplete?: string;
  maxLength?: number;
  accept?: string[];
  maxBytes?: number;
  hint?: string;
  half?: boolean;
  placeholder?: string;
};
export type FormDef = {
  id: 'contact' | 'careers' | 'gam';
  title: string;
  subject: (v: Record<string, string>) => string;
  recipientsEnv: 'CONTACT_TO' | 'CAREERS_TO' | 'GAM_TO';
  submitLabel: string;
  fields: Field[];
};

const DOCS = ['.pdf', '.doc', '.docx'];
const FIVE_MB = 5 * 1024 * 1024;
const BANDS = ['Less than $5,000', '$5,000 - $10,000', '$10,000 - $50,000', '$50,000 - $100,000', '$100,000 - $500,000', '$500,000 - $1M', '$1M - $2M', '$2M - $5M', 'Over $5M'];

export const forms: Record<FormDef['id'], FormDef> = {
  contact: {
    id: 'contact',
    title: 'Contact enquiry',
    recipientsEnv: 'CONTACT_TO',
    submitLabel: 'Send message',
    subject: (v) => `Enquiry From Website - ${v.name}${v.company ? ` (${v.company})` : ''} - ${v.type}`,
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, autocomplete: 'name', maxLength: 120, half: true },
      { name: 'email', label: 'Work email', type: 'email', required: true, autocomplete: 'email', maxLength: 200, half: true },
      { name: 'phone', label: 'Contact number', type: 'tel', autocomplete: 'tel', maxLength: 40, half: true, hint: 'Optional' },
      { name: 'country', label: 'Country', type: 'select', required: true, options: countries, autocomplete: 'country-name', half: true },
      { name: 'company', label: 'Company', type: 'text', autocomplete: 'organization', maxLength: 160, half: true, hint: 'Optional' },
      { name: 'website', label: 'Website URL', type: 'url', autocomplete: 'url', maxLength: 300, half: true, hint: 'Optional', placeholder: 'https://' },
      { name: 'type', label: 'Are you a', type: 'select', required: true, options: ['Publisher', 'Buyer'] },
      { name: 'message', label: 'Message', type: 'textarea', maxLength: 4000, hint: 'Optional - tell us what you’re looking for.' },
    ],
  },
  careers: {
    id: 'careers',
    title: 'Job application',
    recipientsEnv: 'CAREERS_TO',
    submitLabel: 'Submit application',
    subject: (v) => `Careers application - ${v.role} - ${v.name}`,
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, autocomplete: 'name', maxLength: 120, half: true },
      { name: 'email', label: 'Email', type: 'email', required: true, autocomplete: 'email', maxLength: 200, half: true },
      { name: 'phone', label: 'Contact number', type: 'tel', autocomplete: 'tel', maxLength: 40, half: true, hint: 'Optional' },
      { name: 'role', label: 'Role applying for', type: 'text', required: true, maxLength: 160, half: true },
      { name: 'department', label: 'Department', type: 'select', required: true, options: ['Human Resources', 'Technical', 'Marketing', 'Communications', 'Finance'], half: true },
      { name: 'experience', label: 'Years of experience', type: 'select', required: true, options: ['0 years', '1–3 years', '4–7 years', '8–12 years', '13–20 years', '21–30 years', '31–40 years', '40+ years'], half: true },
      { name: 'coverLetter', label: 'Cover letter', type: 'file', required: true, accept: DOCS, maxBytes: FIVE_MB, half: true, hint: 'PDF, DOC or DOCX, up to 5 MB' },
      { name: 'resume', label: 'Resume', type: 'file', required: true, accept: DOCS, maxBytes: FIVE_MB, half: true, hint: 'PDF, DOC or DOCX, up to 5 MB' },
      { name: 'message', label: 'Message', type: 'textarea', maxLength: 4000, hint: 'Optional' },
    ],
  },
  gam: {
    id: 'gam',
    title: 'GAM 360 enquiry',
    recipientsEnv: 'GAM_TO',
    submitLabel: 'Submit enquiry',
    subject: (v) => `GAM 360 enquiry - ${v.firstName} ${v.lastName}${v.website ? ` (${v.website})` : ''}`,
    fields: [
      { name: 'firstName', label: 'First name', type: 'text', required: true, autocomplete: 'given-name', maxLength: 80, half: true },
      { name: 'lastName', label: 'Last name', type: 'text', required: true, autocomplete: 'family-name', maxLength: 80, half: true },
      { name: 'email', label: 'Email', type: 'email', required: true, autocomplete: 'email', maxLength: 200, half: true },
      { name: 'phone', label: 'Contact number', type: 'tel', autocomplete: 'tel', maxLength: 40, half: true, hint: 'Optional' },
      { name: 'website', label: 'Website URL', type: 'url', autocomplete: 'url', maxLength: 300, hint: 'Optional', placeholder: 'https://' },
      { name: 'traffic', label: 'Monthly inventory traffic', type: 'select', required: true, options: BANDS, half: true },
      { name: 'revenue', label: 'Your monthly ad revenue (of all sites)', type: 'select', required: true, options: BANDS, half: true },
      { name: 'country', label: 'Where are you located?', type: 'select', required: true, options: countries },
      { name: 'siteList', label: 'Site / app list', type: 'file', accept: DOCS, maxBytes: FIVE_MB, hint: 'Optional - PDF, DOC or DOCX, up to 5 MB' },
    ],
  },
};

export const HONEYPOT = 'fax_number';
export const TIMESTAMP = '_t';
