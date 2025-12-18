
export interface SocialFormData {
    followers: string;
    likes: string;
    comments: string;
    shares: string;
}

export type EngagementLevel = 'low' | 'average' | 'good' | 'excellent';

export interface SocialResult {
    rate: number;
    level: EngagementLevel;
    messageKey: string;
}
