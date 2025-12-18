import React, { useState } from 'react';
import Input from '../../../shared/Input';
import Button from '../../../shared/Button';
import { useTranslation } from '../../../../hooks/useTranslation';
import { Skill } from '../../../../types/resume';
import { CloseIconSmall } from '../../../shared/Icons';

interface SkillListProps {
  skills: Skill[];
  onSkillsChange: (data: Skill[]) => void;
}

const SkillList: React.FC<SkillListProps> = ({ skills, onSkillsChange }) => {
  const { t } = useTranslation();
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    const skill: Skill = {
      id: Date.now().toString() + Math.random(),
      name: newSkill.trim(),
    };
    onSkillsChange([...skills, skill]);
    setNewSkill('');
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const removeSkill = (id: string) => {
    onSkillsChange(skills.filter((s) => s.id !== id));
  };

  return (
    <div>
      <h3 className="text-lg font-bold mb-3 text-light-text dark:text-dark-text">{t('resumeBuilder.skills.title')}</h3>
      <div className="flex gap-2 mb-4">
        <Input
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={handleSkillKeyDown}
          placeholder={t('resumeBuilder.skills.input.placeholder')}
        />
        <Button onClick={handleAddSkill} disabled={!newSkill.trim()}>
          {t('resumeBuilder.skills.add')}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 min-h-[44px]">
        {skills.length === 0 && (
          <p className="text-sm text-light-muted dark:text-dark-muted italic">{t('resumeBuilder.skills.empty')}</p>
        )}
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 animate-fadeIn"
          >
            <span>{skill.name}</span>
            <button
              onClick={() => removeSkill(skill.id)}
              className="hover:text-danger transition-colors focus:outline-none focus:ring-2 focus:ring-danger focus:ring-offset-1 dark:focus:ring-offset-gray-800 rounded-full p-0.5"
              aria-label={t('common.removeAriaLabel', { item: skill.name })}
            >
              <CloseIconSmall className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillList;