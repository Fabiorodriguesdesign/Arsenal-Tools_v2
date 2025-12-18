import React from 'react';
import type { jsPDF } from 'jspdf';
import { ResumeData } from '../../../../types/resume';
import { getResumeLabel, translateLevel } from '../../../../utils/resume/resumeTranslations';

interface TemplateProps {
  data: ResumeData;
}

const ModernTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personal, experience, education, skills, languages, primaryColor, lang } = data;

  return (
    <div className="w-full h-full bg-white text-gray-800 flex flex-col md:flex-row overflow-hidden shadow-2xl print:shadow-none">
      {/* Sidebar (Left Column) */}
      <aside 
        className="w-full md:w-1/3 p-6 md:p-8 text-white print:w-1/3 print:p-6" 
        style={{ backgroundColor: primaryColor }}
      >
        <div className="flex flex-col items-center text-center mb-8">
          {personal.photo && (
            <img 
              src={personal.photo} 
              alt={personal.fullName} 
              className="w-32 h-32 rounded-full object-cover border-4 border-white/30 mb-4"
            />
          )}
          <h1 className="text-2xl font-bold mb-2">{personal.fullName}</h1>
          <p className="text-white/90 font-medium uppercase tracking-wider text-sm">{personal.jobTitle}</p>
        </div>

        <div className="space-y-6 text-sm">
          {/* Contact Info */}
          <div>
            <h3 className="font-bold uppercase tracking-wider border-b border-white/30 pb-2 mb-3 opacity-90">{getResumeLabel(lang, 'contact')}</h3>
            <ul className="space-y-2">
              {personal.email && <li className="break-all">{personal.email}</li>}
              {personal.phone && <li>{personal.phone}</li>}
              {personal.location && <li>{personal.location}</li>}
              {personal.linkedin && <li className="break-all">{personal.linkedin.replace(/^https?:\/\//, '')}</li>}
              {personal.website && <li className="break-all">{personal.website.replace(/^https?:\/\//, '')}</li>}
            </ul>
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div>
              <h3 className="font-bold uppercase tracking-wider border-b border-white/30 pb-2 mb-3 opacity-90">{getResumeLabel(lang, 'skills')}</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map(skill => (
                  <span key={skill.id} className="bg-white/20 px-2 py-1 rounded text-xs">
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div>
              <h3 className="font-bold uppercase tracking-wider border-b border-white/30 pb-2 mb-3 opacity-90">{getResumeLabel(lang, 'languages')}</h3>
              <ul className="space-y-2">
                {languages.map(langItem => (
                  <li key={langItem.id} className="flex justify-between">
                    <span>{langItem.name}</span>
                    <span className="opacity-70 text-xs">{translateLevel(langItem.level, lang)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content (Right Column) */}
      <main className="w-full md:w-2/3 p-6 md:p-8 bg-white print:w-2/3 print:p-6">
        {/* Summary */}
        {personal.summary && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-8 h-1 rounded-full" style={{ backgroundColor: primaryColor }}></span>
              {getResumeLabel(lang, 'summary')}
            </h2>
            <p className="text-gray-600 leading-relaxed text-sm text-justify">
              {personal.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-8 h-1 rounded-full" style={{ backgroundColor: primaryColor }}></span>
              {getResumeLabel(lang, 'experience')}
            </h2>
            <div className="space-y-6">
              {experience.map(exp => (
                <div key={exp.id} className="relative pl-4 border-l-2 border-gray-200">
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-4" style={{ borderColor: primaryColor }}></div>
                  <h3 className="font-bold text-gray-800">{exp.position}</h3>
                  <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-gray-500 mb-2">
                    <span className="font-medium text-gray-700">{exp.company}</span>
                    <span>
                        {exp.startDate} - {exp.current ? getResumeLabel(lang, 'current') : exp.endDate}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 whitespace-pre-line">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-8 h-1 rounded-full" style={{ backgroundColor: primaryColor }}></span>
              {getResumeLabel(lang, 'education')}
            </h2>
            <div className="space-y-6">
              {education.map(edu => (
                <div key={edu.id}>
                  <h3 className="font-bold text-gray-800">{edu.institution}</h3>
                  <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-gray-500 mb-1">
                    <span className="font-medium text-gray-700">{edu.degree} - {edu.fieldOfStudy}</span>
                    <span>
                         {edu.startDate} - {edu.current ? getResumeLabel(lang, 'current') : edu.endDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default React.memo(ModernTemplate);