'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAccount } from 'wagmi';
import { DatabaseService, User, Transaction, UserContentAccess } from '@/lib/supabase';
import { PaymentService } from '@/lib/payment';

interface UserContextType {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // User data
  transactions: Transaction[];
  contentAccess: UserContentAccess[];
  totalSpent: number;
  
  // Actions
  refreshUserData: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  checkContentAccess: (contentId?: string, templateId?: string) => Promise<boolean>;
  
  // Payment
  processPayment: (request: {
    amountCents: number;
    contentId?: string;
    templateId?: string;
  }) => Promise<{ success: boolean; error?: string }>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const { address, isConnected } = useAccount();
  
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [contentAccess, setContentAccess] = useState<UserContentAccess[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);

  // Initialize user when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      initializeUser(address);
    } else {
      // Clear user data when wallet disconnects
      setUser(null);
      setTransactions([]);
      setContentAccess([]);
      setTotalSpent(0);
    }
  }, [isConnected, address]);

  const initializeUser = async (walletAddress: string) => {
    setIsLoading(true);
    try {
      // Try to get existing user
      let userData = await DatabaseService.getUserByWallet(walletAddress);
      
      // Create user if doesn't exist
      if (!userData) {
        userData = await DatabaseService.createUser(walletAddress);
      }
      
      if (userData) {
        setUser(userData);
        await loadUserData(userData.id);
      }
    } catch (error) {
      console.error('Error initializing user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserData = async (userId: string) => {
    try {
      // Load transactions
      const userTransactions = await DatabaseService.getUserTransactions(userId);
      setTransactions(userTransactions);
      
      // Load content access
      const userAccess = await DatabaseService.getUserContentAccess(userId);
      setContentAccess(userAccess);
      
      // Calculate total spent
      const spent = await PaymentService.getUserTotalSpent(userId);
      setTotalSpent(spent);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const refreshUserData = async () => {
    if (user) {
      await loadUserData(user.id);
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const updatedUser = await DatabaseService.updateUser(user.id, updates);
      if (updatedUser) {
        setUser(updatedUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  };

  const checkContentAccess = async (
    contentId?: string,
    templateId?: string
  ): Promise<boolean> => {
    if (!user) return false;
    
    try {
      return await PaymentService.checkAccess(user.id, contentId, templateId);
    } catch (error) {
      console.error('Error checking content access:', error);
      return false;
    }
  };

  const processPayment = async (request: {
    amountCents: number;
    contentId?: string;
    templateId?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const result = await PaymentService.processPayment({
        userId: user.id,
        ...request
      });

      if (result.success) {
        // Refresh user data to show new transaction and access
        await refreshUserData();
      }

      return {
        success: result.success,
        error: result.error
      };
    } catch (error) {
      console.error('Error processing payment:', error);
      return {
        success: false,
        error: 'Payment processing failed'
      };
    }
  };

  const value: UserContextType = {
    // User state
    user,
    isAuthenticated: !!user && isConnected,
    isLoading,
    
    // User data
    transactions,
    contentAccess,
    totalSpent,
    
    // Actions
    refreshUserData,
    updateProfile,
    checkContentAccess,
    processPayment
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

// Helper hooks for specific user data
export function useUserTransactions() {
  const { transactions, refreshUserData } = useUser();
  return { transactions, refreshTransactions: refreshUserData };
}

export function useUserContentAccess() {
  const { contentAccess, checkContentAccess, refreshUserData } = useUser();
  return { 
    contentAccess, 
    checkAccess: checkContentAccess,
    refreshAccess: refreshUserData 
  };
}

export function useUserPayments() {
  const { processPayment, totalSpent, refreshUserData } = useUser();
  return { 
    processPayment, 
    totalSpent,
    refreshPayments: refreshUserData 
  };
}
