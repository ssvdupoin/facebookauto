export interface Campaign {
  id: string;
  name: string;
  niche: string;
  mood: 'informative' | 'inspiring' | 'sarcastic' | 'professional' | 'playful';
  postingHour: string; // e.g. "09:00"
  isActive: boolean;
  imagePromptAddition?: string;
  createdAt: string;
}

export interface FbPost {
  id: string;
  campaignId: string;
  campaignName: string;
  caption: string;
  imageUrl: string; // Base64 or stock/fallback image URL
  imageSource: 'gemini' | 'unsplash' | 'fallback';
  imagePrompt: string;
  scheduledTime: string; // ISO string
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  publishedTime?: string; // ISO string
  fbPostId?: string; // Simulated or actual FB Post ID
  errorMessage?: string;
  apiPayloadLog?: string; // JSON string of the raw request
  apiResponseLog?: string; // JSON string of the raw response
  likes?: number;
  comments?: number;
  shares?: number;
}

export interface FbConnectionSettings {
  fbPageId: string;
  fbPageAccessToken: string;
  isSimulated: boolean;
  connectedPageName?: string;
  connectedPageAvatar?: string;
}

export interface DbState {
  campaigns: Campaign[];
  posts: FbPost[];
  settings: FbConnectionSettings;
}
