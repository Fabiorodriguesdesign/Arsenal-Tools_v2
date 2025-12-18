import React from 'react';
import { ResumeData } from '../../../../types/resume';
import { getResumeLabel, translateLevel } from '../../../../utils/resume/resumeTranslations';

interface TemplateProps {
  data: ResumeData;
}

const ClassicTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personal, experience, education, skills, languages, primaryColor, lang } = data;

  return (
    <div className="w-full h-full bg-white text-gray-900 flex flex-col p-10 md:p-12 shadow-2xl print:shadow-none font-serif">
      {/* Header Centered */}
      <header className="text-center border-b-2 pb-6 mb-6" style={{ borderColor: primaryColor }}>
        <h1 className="text-3xl font-bold uppercase tracking-wide mb-2" style={{ color: primaryColor }}>
          {personal.fullName}
        </h1>
        <p className="text-lg font-medium text-gray-600 mb-3 uppercase tracking-wider">
          {personal.jobTitle}
        </p>
        
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-gray-600">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && (
            <>
                <span className="text-gray-400">•</span>
                <span>{personal.phone}</span>
            </>
          )}
          {personal.location && (
            <>
                <span className="text-gray-400">•</span>
                <span>{personal.location}</span>
            </>
          )}
          {personal.linkedin && (
             <>
                <span className="text-gray-400">•</span>
                <span>{personal.linkedin.replace(/^https?:\/\//, '')}</span>
             </>
          )}
          {personal.website && (
             <>
                <span className="text-gray-400">•</span>
                <span>{personal.website.replace(/^https?:\/\//, '')}</span>
             </>
          )}
        </div>
      </header>

      <main className="space-y-6">
        {/* Summary */}
        {personal.summary && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-3 border-b pb-1" style={{ color: primaryColor, borderColor: '#e5e7eb' }}>
              {getResumeLabel(lang, 'summary')}
            </h2>
            <p className="text-sm leading-relaxed text-justify text-gray-700">
              {personal.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-4 border-b pb-1" style={{ color: primaryColor, borderColor: '#e5e7eb' }}>
              {getResumeLabel(lang, 'experience')}
            </h2>
            <div className="space-y-5">
              {experience.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-base text-gray-800">{exp.company}</h3>
                    <span className="text-xs font-medium text-gray-500 whitespace-nowrap">
                        {exp.startDate} - {exp.current ? getResumeLabel(lang, 'current') : exp.endDate}
                    </span>
                  </div>
                  <div className="italic text-sm text-gray-600 mb-2">{exp.position}</div>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-4 border-b pb-1" style={{ color: primaryColor, borderColor: '#e5e7eb' }}>
              {getResumeLabel(lang, 'education')}
            </h2>
            <div className="space-y-4">
              {education.map(edu => (
                <div key={edu.id}>
                   <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-base text-gray-800">{edu.institution}</h3>
                    <span className="text-xs font-medium text-gray-500 whitespace-nowrap">
                        {edu.startDate} - {edu.current ? getResumeLabel(lang, 'current') : edu.endDate}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700">
                    <span className="font-semibold">{edu.degree}</span> 
                    {edu.fieldOfStudy && <span>, {edu.fieldOfStudy}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills & Languages in a single column */}
        {(skills.length > 0 || languages.length > 0) && (
            <div className="space-y-6">
                {skills.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-widest mb-3 border-b pb-1" style={{ color: primaryColor, borderColor: '#e5e7eb' }}>
                        {getResumeLabel(lang, 'skills')}
                        </h2>
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 columns-2">
                            {skills.map(skill => (
                                <li key={skill.id}>{skill.name}</li>
                            ))}
                        </ul>
                    </section>
                )}

                {languages.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-widest mb-3 border-b pb-1" style={{ color: primaryColor, borderColor: '#e5e7eb' }}>
                        {getResumeLabel(lang, 'languages')}
                        </h2>
                        <ul className="space-y-1 text-sm text-gray-700">
                            {languages.map(langItem => (
                                <li key={langItem.id} className="flex justify-between border-b border-dotted border-gray-300 pb-1 last:border-0">
                                    <span>{langItem.name}</span>
                                    <span className="italic text-gray-500 text-xs">{translateLevel(langItem.level, lang)}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>
        )}
      </main>
    </div>
  );
};

export default React.memo(ClassicTemplate);