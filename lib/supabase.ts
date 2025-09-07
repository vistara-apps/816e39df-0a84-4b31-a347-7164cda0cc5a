import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface User {
  id: string;
  farcaster_id?: string;
  wallet_address: string;
  email?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface LegalContent {
  id: string;
  title: string;
  content_type: 'card' | 'guide' | 'checklist' | 'template';
  category: 'tenant' | 'employment' | 'consumer' | 'healthcare' | 'family' | 'criminal';
  content: {
    summary: string;
    details: string;
    steps?: string[];
    checklist?: string[];
    tips?: string[];
  };
  price_cents: number;
  min_length?: number;
  max_length?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  description?: string;
  category: string;
  template_content: string;
  required_fields: string[];
  price_cents: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  content_id?: string;
  template_id?: string;
  amount_cents: number;
  currency: string;
  transaction_hash?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  created_at: string;
  updated_at: string;
}

export interface UserContentAccess {
  id: string;
  user_id: string;
  content_id?: string;
  template_id?: string;
  transaction_id?: string;
  access_granted_at: string;
  expires_at?: string;
}

export interface GeneratedDocument {
  id: string;
  user_id: string;
  template_id: string;
  document_content: string;
  input_data: Record<string, any>;
  created_at: string;
}

// Database operations
export class DatabaseService {
  // User operations
  static async createUser(walletAddress: string, farcasterId?: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert({
          wallet_address: walletAddress,
          farcaster_id: farcasterId
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  }

  static async getUserByWallet(walletAddress: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('wallet_address', walletAddress)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }

  static async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  }

  // Legal content operations
  static async getLegalContent(category?: string): Promise<LegalContent[]> {
    try {
      let query = supabase
        .from('legal_content')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching legal content:', error);
      return [];
    }
  }

  static async getLegalContentById(id: string): Promise<LegalContent | null> {
    try {
      const { data, error } = await supabase
        .from('legal_content')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching legal content by ID:', error);
      return null;
    }
  }

  // Document template operations
  static async getDocumentTemplates(category?: string): Promise<DocumentTemplate[]> {
    try {
      let query = supabase
        .from('document_templates')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching document templates:', error);
      return [];
    }
  }

  static async getDocumentTemplateById(id: string): Promise<DocumentTemplate | null> {
    try {
      const { data, error } = await supabase
        .from('document_templates')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching document template by ID:', error);
      return null;
    }
  }

  // Transaction operations
  static async createTransaction(
    userId: string,
    amountCents: number,
    contentId?: string,
    templateId?: string,
    currency = 'eth'
  ): Promise<Transaction | null> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          content_id: contentId,
          template_id: templateId,
          amount_cents: amountCents,
          currency,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating transaction:', error);
      return null;
    }
  }

  static async updateTransactionStatus(
    transactionId: string,
    status: Transaction['status'],
    transactionHash?: string
  ): Promise<Transaction | null> {
    try {
      const updates: any = { status };
      if (transactionHash) {
        updates.transaction_hash = transactionHash;
      }

      const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', transactionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating transaction status:', error);
      return null;
    }
  }

  static async getUserTransactions(userId: string): Promise<Transaction[]> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user transactions:', error);
      return [];
    }
  }

  // Content access operations
  static async grantContentAccess(
    userId: string,
    transactionId: string,
    contentId?: string,
    templateId?: string
  ): Promise<UserContentAccess | null> {
    try {
      const { data, error } = await supabase
        .from('user_content_access')
        .insert({
          user_id: userId,
          content_id: contentId,
          template_id: templateId,
          transaction_id: transactionId
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error granting content access:', error);
      return null;
    }
  }

  static async checkContentAccess(
    userId: string,
    contentId?: string,
    templateId?: string
  ): Promise<boolean> {
    try {
      let query = supabase
        .from('user_content_access')
        .select('id')
        .eq('user_id', userId);

      if (contentId) {
        query = query.eq('content_id', contentId);
      }
      if (templateId) {
        query = query.eq('template_id', templateId);
      }

      const { data, error } = await query.single();
      if (error && error.code !== 'PGRST116') throw error;
      return !!data;
    } catch (error) {
      console.error('Error checking content access:', error);
      return false;
    }
  }

  static async getUserContentAccess(userId: string): Promise<UserContentAccess[]> {
    try {
      const { data, error } = await supabase
        .from('user_content_access')
        .select('*')
        .eq('user_id', userId)
        .order('access_granted_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user content access:', error);
      return [];
    }
  }

  // Generated document operations
  static async saveGeneratedDocument(
    userId: string,
    templateId: string,
    documentContent: string,
    inputData: Record<string, any>
  ): Promise<GeneratedDocument | null> {
    try {
      const { data, error } = await supabase
        .from('generated_documents')
        .insert({
          user_id: userId,
          template_id: templateId,
          document_content: documentContent,
          input_data: inputData
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving generated document:', error);
      return null;
    }
  }

  static async getUserGeneratedDocuments(userId: string): Promise<GeneratedDocument[]> {
    try {
      const { data, error } = await supabase
        .from('generated_documents')
        .select(`
          *,
          document_templates (
            name,
            description,
            category
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user generated documents:', error);
      return [];
    }
  }
}
