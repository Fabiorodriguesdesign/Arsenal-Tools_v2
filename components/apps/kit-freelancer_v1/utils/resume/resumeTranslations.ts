
import { DocumentLanguage } from "../../types/resume";

type Dictionary = Record<string, string>;

const pt: Dictionary = {
    contact: 'CONTATO',
    skills: 'HABILIDADES',
    languages: 'IDIOMAS',
    summary: 'RESUMO PROFISSIONAL',
    experience: 'EXPERIÊNCIA PROFISSIONAL',
    education: 'FORMAÇÃO ACADÊMICA',
    current: 'Atualmente',
    level_basic: 'Básico',
    level_intermediate: 'Intermediário',
    level_advanced: 'Avançado',
    level_fluent: 'Fluente',
    level_native: 'Nativo'
};

const en: Dictionary = {
    contact: 'CONTACT',
    skills: 'SKILLS',
    languages: 'LANGUAGES',
    summary: 'PROFESSIONAL SUMMARY',
    experience: 'WORK EXPERIENCE',
    education: 'EDUCATION',
    current: 'Present',
    level_basic: 'Basic',
    level_intermediate: 'Intermediate',
    level_advanced: 'Advanced',
    level_fluent: 'Fluent',
    level_native: 'Native'
};

const es: Dictionary = {
    contact: 'CONTACTO',
    skills: 'HABILIDADES',
    languages: 'IDIOMAS',
    summary: 'RESUMEN PROFESIONAL',
    experience: 'EXPERIENCIA LABORAL',
    education: 'EDUCACIÓN',
    current: 'Actualmente',
    level_basic: 'Básico',
    level_intermediate: 'Intermedio',
    level_advanced: 'Avanzado',
    level_fluent: 'Fluido',
    level_native: 'Nativo'
};

const dictionaries: Record<DocumentLanguage, Dictionary> = { pt, en, es };

export const getResumeLabel = (lang: DocumentLanguage, key: string): string => {
    return dictionaries[lang]?.[key] || dictionaries['pt'][key] || key;
};

export const translateLevel = (level: string, lang: DocumentLanguage): string => {
    // Assumes level comes in format 'basic', 'intermediate', etc.
    return dictionaries[lang]?.[`level_${level}`] || level;
};
