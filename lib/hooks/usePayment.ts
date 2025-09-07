'use client';

import { useState, useCallback } from 'react';
import { useWalletClient } from 'wagmi';
import { 
  processPayment, 
  verifyPayment, 
  getUSDCBalance,
  PaymentRequest, 
  PaymentResult,
  usdcWeiToCents 
} from '../payment';

export interface UsePaymentReturn {
  isProcessing: boolean;
  balance: number | null; // Balance in cents
  error: string | null;
  processPayment: (request: PaymentRequest) => Promise<PaymentResult>;
  refreshBalance: () => Promise<void>;
  verifyTransaction: (txHash: string, expectedAmount: number, recipient: string) => Promise<boolean>;
}

/**
 * Hook for handling x402 payments with USDC on Base
 */
export function usePayment(): UsePaymentReturn {
  const { data: walletClient } = useWalletClient();
  const [isProcessing, setIsProcessing] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refreshBalance = useCallback(async () => {
    if (!walletClient) {
      setError('Wallet not connected');
      return;
    }

    try {
      setError(null);
      const balanceWei = await getUSDCBalance(walletClient);
      const balanceCents = usdcWeiToCents(balanceWei);
      setBalance(balanceCents);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch balance';
      setError(errorMessage);
      console.error('Error refreshing balance:', err);
    }
  }, [walletClient]);

  const handleProcessPayment = useCallback(async (request: PaymentRequest): Promise<PaymentResult> => {
    if (!walletClient) {
      const error = 'Wallet not connected';
      setError(error);
      return { success: false, error };
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Check balance before processing
      await refreshBalance();
      
      if (balance !== null && balance < request.amount) {
        const error = 'Insufficient USDC balance';
        setError(error);
        return { success: false, error };
      }

      // Process the payment
      const result = await processPayment(walletClient, request);
      
      if (result.success) {
        // Refresh balance after successful payment
        await refreshBalance();
      } else {
        setError(result.error || 'Payment failed');
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment processing failed';
      setError(errorMessage);
      console.error('Payment processing error:', err);
      return { success: false, error: errorMessage };
    } finally {
      setIsProcessing(false);
    }
  }, [walletClient, balance, refreshBalance]);

  const handleVerifyTransaction = useCallback(async (
    txHash: string, 
    expectedAmount: number, 
    recipient: string
  ): Promise<boolean> => {
    try {
      setError(null);
      const isValid = await verifyPayment(txHash, expectedAmount, recipient);
      return isValid;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Transaction verification failed';
      setError(errorMessage);
      console.error('Transaction verification error:', err);
      return false;
    }
  }, []);

  return {
    isProcessing,
    balance,
    error,
    processPayment: handleProcessPayment,
    refreshBalance,
    verifyTransaction: handleVerifyTransaction,
  };
}
