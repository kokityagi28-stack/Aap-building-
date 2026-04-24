import { Timestamp } from 'firebase/firestore';

export type UserRole = 'creator' | 'client';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: UserRole;
  bio?: string;
  skills?: string[];
  categories?: string[];
  socialLinks?: Record<string, string>;
  rating: number;
  reviewCount: number;
  followerCount: number;
  followingCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type PortfolioType = 'video' | 'image' | 'audio';

export interface PortfolioItem {
  id: string;
  creatorId: string;
  type: PortfolioType;
  url: string;
  thumbnailUrl?: string;
  title: string;
  description: string;
  tags: string[];
  likesCount: number;
  commentsCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Review {
  id: string;
  creatorId: string;
  clientId: string;
  clientName: string;
  rating: number;
  comment: string;
  createdAt: Timestamp;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: Timestamp;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: string;
  lastMessageAt?: Timestamp;
  updatedAt: Timestamp;
}

export const CATEGORIES = [
  'Video Editor',
  'Thumbnail Designer',
  '2D Animator',
  '3D Animator',
  'Voice Over Artist',
  'Social Media Manager',
  'Graphic Designer',
  'Content Strategist'
];
