
import React, { useState } from 'react';
import { Icon } from './icons';
import { FAQItem } from '../types';

interface FAQProps {
  items: FAQItem[];
}

const FAQ: React.FC<FAQProps> = ({ items }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (!items || items.length === 0) {
      return (
          <div className="text-center py-12 px-4 bg-neutral-50 dark:bg-neutral-800/30 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <p className="text-neutral-500 dark:text-neutral-400">Nenhuma pergunta frequente disponível no momento.</p>
          </div>
      );
  }

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div 
            key={index} 
            className={`border rounded-lg overflow-hidden transition-colors duration-300 ${
                openIndex === index 
                    ? 'bg-white dark:bg-neutral-900 border-accent-blue/30 dark:border-accent-purple/30 shadow-sm' 
                    : 'bg-neutral-50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800 hover:border-accent-blue/30 dark:hover:border-accent-purple/30'
            }`}
        >
          <button
            onClick={() => handleToggle(index)}
            className="w-full flex justify-between items-center text-left p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue dark:focus-visible:ring-accent-purple rounded"
            aria-expanded={openIndex === index}
            aria-controls={`faq-answer-${index}`}
            id={`faq-question-${index}`}
          >
            <span className={`font-bold text-lg pr-4 transition-colors ${openIndex === index ? 'text-accent-blue dark:text-accent-purple' : 'text-neutral-800 dark:text-neutral-200'}`}>
                {item.question}
            </span>
            <Icon
              name="chevron-down"
              className={`w-5 h-5 text-neutral-500 transition-transform duration-300 flex-shrink-0 ${
                openIndex === index ? 'rotate-180 text-accent-blue dark:text-accent-purple' : ''
              }`}
              aria-hidden="true"
            />
          </button>
          <div
            id={`faq-answer-${index}`}
            role="region"
            aria-labelledby={`faq-question-${index}`}
            className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
              openIndex === index ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
            }`}
          >
            <div className="overflow-hidden">
                <div className="px-5 pb-5 pt-0 text-neutral-600 dark:text-neutral-400 leading-relaxed border-t border-transparent">
                  {item.answer}
                </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FAQ;