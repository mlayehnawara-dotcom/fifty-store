export type SocialPlatform = 'instagram' | 'tiktok';

export interface SocialMediaItem {
  id: string;
  platform: SocialPlatform;
  image: string;
  postUrl: string;
  caption: string;
  createdAt: string;
}

export const OFFICIAL_TIKTOK_PROFILE_IMAGE = '/social/tiktok-profile.jpeg';
