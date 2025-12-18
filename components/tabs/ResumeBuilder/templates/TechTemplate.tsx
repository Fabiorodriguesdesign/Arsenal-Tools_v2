
import React from 'react';
import { ResumeData } from '../../../../types/resume';
import { getResumeLabel, translateLevel } from '../../../../utils/resume/resumeTranslations';

interface TemplateProps {
  data: ResumeData;
}

const TechTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personal, experience, education, skills, languages, primaryColor, lang } = data;

  return (
    <div className="w-full h-full bg-gray-50 text-gray-800 flex flex-col p-8 md:p-10 shadow-2xl print:shadow-none font-sans">
      {/* Header Area */}
      <header className="border-b-4 pb-6 mb-6 flex flex-col md:flex-row gap-6 items-center md:items-start" style={{ borderColor: primaryColor }}>
         {personal.photo && (
            <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-300 flex-shrink-0">
                <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover" />
            </div>
         )}
         <div className="flex-grow text-center md:text-left">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-1">
                {personal.fullName.toUpperCase()}
            </h1>
            <p className="text-xl font-mono font-medium mb-3" style={{ color: primaryColor }}>
                &lt;{personal.jobTitle} /&gt;
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm font-mono text-gray-600">
                {personal.email && <span>{personal.email}</span>}
                {personal.phone && <span>| {personal.phone}</span>}
                {personal.location && <span>| {personal.location}</span>}
                {personal.linkedin && <span>| {personal.linkedin.replace(/^https?:\/\//, '')}</span>}
                {personal.website && <span>| {personal.website.replace(/^https?:\/\//, '')}</span>}
            </div>
         </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column (Main Content) */}
        <main className="md:col-span-2 space-y-8">
            {/* Summary */}
            {personal.summary && (
                <section>
                    <h2 className="text-lg font-bold uppercase tracking-wider mb-3 flex items-center gap-2 border-b border-gray-300 pb-1">
                        <span className="text-xl" style={{ color: primaryColor }}>#</span> {getResumeLabel(lang, 'summary')}
                    </h2>
                    <p className="text-gray-700 leading-relaxed text-justify">
                        {personal.summary}
                    </p>
                </section>
            )}

            {/* Experience */}
            {experience.length > 0 && (
                <section>
                    <h2 className="text-lg font-bold uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-gray-300 pb-1">
                        <span className="text-xl" style={{ color: primaryColor }}>#</span> {getResumeLabel(lang, 'experience')}
                    </h2>
                    <div className="space-y-6">
                        {experience.map(exp => (
                            <div key={exp.id} className="relative pl-4 border-l-2" style={{ borderColor: primaryColor }}>
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-bold text-lg text-gray-900">{exp.position}</h3>
                                    <span className="text-xs font-mono bg-gray-200 px-2 py-1 rounded text-gray-700 whitespace-nowrap">
                                        {exp.startDate} - {exp.current ? getResumeLabel(lang, 'current') : exp.endDate}
                                    </span>
                                </div>
                                <div className="font-semibold text-gray-600 mb-2 text-sm">{exp.company}</div>
                                <p className="text-sm text-gray-700 whitespace-pre-line">
                                    {exp.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}
             
             {/* Education (In main column for Tech template) */}
             {education.length > 0 && (
                <section>
                    <h2 className="text-lg font-bold uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-gray-300 pb-1">
                        <span className="text-xl" style={{ color: primaryColor }}>#</span> {getResumeLabel(lang, 'education')}
                    </h2>
                    <div className="grid grid-cols-1 gap-4">
                        {education.map(edu => (
                            <div key={edu.id} className="bg-white p-4 rounded-md shadow-sm border border-gray-200">
                                <div className="flex justify-between mb-1">
                                    <h3 className="font-bold text-gray-900">{edu.institution}</h3>
                                    <span className="text-xs font-mono text-gray-500">
                                         {edu.startDate} - {edu.current ? getResumeLabel(lang, 'current') : edu.endDate}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-700">
                                    {edu.degree} • <span className="italic">{edu.fieldOfStudy}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </main>

        {/* Right Column (Skills & Info) */}
        <aside className="space-y-8">
             {/* Skills */}
            {skills.length > 0 && (
                <section className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 text-gray-500">
                        // {getResumeLabel(lang, 'skills')}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {skills.map(skill => (
                            <span 
                                key={skill.id} 
                                className="px-3 py-1 rounded-md text-xs font-bold font-mono"
                                style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                            >
                                {skill.name}
                            </span>
                        ))}
                    </div>
                </section>
            )}

            {/* Languages */}
            {languages.length > 0 && (
                <section className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 text-gray-500">
                        // {getResumeLabel(lang, 'languages')}
                    </h2>
                    <div className="space-y-3">
                        {languages.map(langItem => (
                             <div key={langItem.id}>
                                <div className="flex justify-between text-sm font-medium text-gray-800 mb-1">
                                    <span>{langItem.name}</span>
                                    <span className="text-gray-400 text-xs font-mono lowercase">{translateLevel(langItem.level, lang)}</span>
                                </div>
                                <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full rounded-full" 
                                        style={{ 
                                            width: langItem.level === 'native' ? '100%' : langItem.level === 'fluent' ? '90%' : langItem.level === 'advanced' ? '75%' : langItem.level === 'intermediate' ? '50%' : '25%',
                                            backgroundColor: primaryColor 
                                        }}
                                    ></div>
                                </div>
                             </div>
                        ))}
                    </div>
                </section>
            )}
        </aside>
      </div>
    </div>
  );
};

export default React.memo(TechTemplate);