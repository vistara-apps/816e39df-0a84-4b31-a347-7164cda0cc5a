export interface User {
  farcasterId: string;
  walletAddress?: string;
  creationDate: Date;
}

export interface LegalContent {
  id: string;
  title: string;
  contentType: 'card' | 'guide' | 'checklist' | 'template';
  category: 'tenant' | 'employment' | 'consumer' | 'traffic' | 'arrests';
  content: string;
  minLength?: number;
  maxLength?: number;
  price: number; // in cents
}

export interface Transaction {
  id: string;
  userId: string;
  contentId: string;
  amount: number;
  currency: 'eth' | 'usd';
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}

export interface DocumentGenerationRequest {
  templateType: string;
  userInputs: Record<string, string>;
  userId: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export type CategoryType = 'tenant' | 'employment' | 'consumer' | 'traffic' | 'arrests';

export interface LegalCategory {
  id: CategoryType;
  title: string;
  description: string;
  icon: string;
  color: string;
}
