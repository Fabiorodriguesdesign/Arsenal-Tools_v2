import React from 'react';
import { Skill, Language } from '../../../types/resume';
import SkillList from './skills/SkillList';
import LanguageList from './skills/LanguageList';

interface SkillsStepProps {
  skills: Skill[];
  languages: Language[];
  onSkillsChange: (data: Skill[]) => void;
  onLanguagesChange: (data: Language[]) => void;
}

const SkillsStep: React.FC<SkillsStepProps> = ({ skills, languages, onSkillsChange, onLanguagesChange }) => {
  return (
    <div className="animate-fadeIn space-y-8">
      <SkillList skills={skills} onSkillsChange={onSkillsChange} />
      <div className="border-t border-light-border dark:border-dark-border"></div>
      <LanguageList languages={languages} onLanguagesChange={onLanguagesChange} />
    </div>
  );
};

export default SkillsStep;
