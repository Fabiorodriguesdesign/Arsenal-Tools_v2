
import React, { useState, useCallback } from 'react';
import { useFormPersistence } from './useFormPersistence';
import { SocialFormData, SocialResult, EngagementLevel } from '../types/social';

const INITIAL_STATE: SocialFormData = {
    followers: '',
    likes: '',
    comments: '',
    shares: ''
};

export const useSocialEngagement = () => {
    const [formData, setFormData] = useFormPersistence<SocialFormData>('socialEngagementData', INITIAL_STATE);
    const [result, setResult] = useState<SocialResult | null>(null);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, [setFormData]);

    const calculateEngagement = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        const numLikes = parseInt(formData.likes, 10) || 0;
        const numComments = parseInt(formData.comments, 10) || 0;
        const numShares = parseInt(formData.shares, 10) || 0;
        const numFollowers = parseInt(formData.followers, 10) || 0;

        if (numFollowers === 0) {
            setResult(null);
            return;
        }

        const totalInteractions = numLikes + numComments + numShares;
        const rate = (totalInteractions / numFollowers) * 100;

        let level: EngagementLevel;
        let messageKey: string;

        if (rate < 1) {
            level = 'low';
            messageKey = 'socialEngagement.result.low';
        } else if (rate < 3.5) {
            level = 'average';
            messageKey = 'socialEngagement.result.average';
        } else if (rate < 6) {
            level = 'good';
            messageKey = 'socialEngagement.result.good';
        } else {
            level = 'excellent';
            messageKey = 'socialEngagement.result.excellent';
        }

        setResult({ rate, level, messageKey });
    }, [formData]);

    return {
        formData,
        result,
        handleChange,
        calculateEngagement
    };
};
