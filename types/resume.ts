
export interface PersonalData {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  website?: string;
  linkedin?: string;
  location: string;
  summary: string;
  photo?: string; // Base64 string
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

export interface Skill {
  id: string;
  name: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface Language {
  id: string;
  name: string;
  level: 'basic' | 'intermediate' | 'advanced' | 'fluent' | 'native';
}

export type DocumentLanguage = 'pt' | 'en' | 'es';

export interface ResumeData {
  personal: PersonalData;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  templateId: 'modern' | 'classic' | 'tech';
  primaryColor: string;
  lang: DocumentLanguage;
}
