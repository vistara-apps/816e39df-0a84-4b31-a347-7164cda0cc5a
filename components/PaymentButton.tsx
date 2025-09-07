'use client';

import { useState } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { usePayment } from '@/lib/hooks/usePayment';
import { ActionLink } from './ActionLink';
import { formatPrice } from '@/lib/utils';
import { Loader2, Wallet, CheckCircle, AlertCircle } from 'lucide-react';

interface PaymentButtonProps {
  contentId: string;
  amount: number; // Amount in cents
  description: string;
  onPaymentSuccess: (transactionHash: string) => void;
  onPaymentError?: (error: string) => void;
  disabled?: boolean;
}

export function PaymentButton({
  contentId,
  amount,
  description,
  onPaymentSuccess,
  onPaymentError,
  disabled = false,
}: PaymentButtonProps) {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { isProcessing, balance, error, processPayment, refreshBalance } = usePayment();
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleConnect = () => {
    const connector = connectors[0]; // Use first available connector
    if (connector) {
      connect({ connector });
    }
  };

  const handlePayment = async () => {
    if (!isConnected || !address) {
      handleConnect();
      return;
    }

    try {
      setPaymentStatus('idle');
      
      // Refresh balance before payment
      await refreshBalance();
      
      // Check if user has sufficient balance
      if (balance !== null && balance < amount) {
        const errorMsg = `Insufficient USDC balance. You have ${formatPrice(balance)} but need ${formatPrice(amount)}`;
        setPaymentStatus('error');
        onPaymentError?.(errorMsg);
        return;
      }

      // Process payment
      const result = await processPayment({
        amount,
        contentId,
        description,
      });

      if (result.success && result.transactionHash) {
        setPaymentStatus('success');
        onPaymentSuccess(result.transactionHash);
      } else {
        setPaymentStatus('error');
        onPaymentError?.(result.error || 'Payment failed');
      }
    } catch (err) {
      setPaymentStatus('error');
      const errorMsg = err instanceof Error ? err.message : 'Payment failed';
      onPaymentError?.(errorMsg);
    }
  };

  const getButtonContent = () => {
    if (!isConnected) {
      return (
        <>
          <Wallet className="w-4 h-4 mr-2" />
          Connect Wallet
        </>
      );
    }

    if (isProcessing) {
      return (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Processing Payment...
        </>
      );
    }

    if (paymentStatus === 'success') {
      return (
        <>
          <CheckCircle className="w-4 h-4 mr-2" />
          Payment Successful
        </>
      );
    }

    if (paymentStatus === 'error') {
      return (
        <>
          <AlertCircle className="w-4 h-4 mr-2" />
          Payment Failed - Retry
        </>
      );
    }

    return `Pay ${formatPrice(amount)} USDC`;
  };

  const getButtonVariant = () => {
    if (paymentStatus === 'success') return 'secondary';
    if (paymentStatus === 'error') return 'primary';
    return 'primary';
  };

  const isButtonDisabled = disabled || isProcessing || paymentStatus === 'success';

  return (
    <div className="space-y-3">
      {/* Balance Display */}
      {isConnected && balance !== null && (
        <div className="text-sm text-white text-opacity-80 text-center">
          USDC Balance: {formatPrice(balance)}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-500 bg-opacity-20 border border-red-500 border-opacity-30 rounded-lg p-3">
          <div className="flex items-center text-red-200 text-sm">
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            {error}
          </div>
        </div>
      )}

      {/* Payment Button */}
      <ActionLink
        variant={getButtonVariant()}
        onClick={handlePayment}
        disabled={isButtonDisabled}
        className="w-full flex items-center justify-center"
      >
        {getButtonContent()}
      </ActionLink>

      {/* Payment Info */}
      {isConnected && (
        <div className="text-xs text-white text-opacity-60 text-center space-y-1">
          <p>Payment will be processed using USDC on Base</p>
          <p>Transaction fees may apply</p>
        </div>
      )}
    </div>
  );
}
