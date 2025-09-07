'use client';

import { createX402Client } from 'x402-axios';
import { WalletClient } from 'viem';
import { base } from 'viem/chains';

// USDC contract address on Base
export const USDC_CONTRACT_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

// Payment configuration
export const PAYMENT_CONFIG = {
  chain: base,
  currency: 'USDC',
  contractAddress: USDC_CONTRACT_ADDRESS,
  decimals: 6, // USDC has 6 decimals
};

export interface PaymentRequest {
  amount: number; // Amount in cents (USD)
  contentId: string;
  description: string;
}

export interface PaymentResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

/**
 * Create an x402 client configured for USDC payments on Base
 */
export function createPaymentClient(walletClient: WalletClient) {
  return createX402Client({
    walletClient,
    chain: base,
    currency: 'USDC',
    contractAddress: USDC_CONTRACT_ADDRESS,
  });
}

/**
 * Convert USD cents to USDC wei (6 decimals)
 */
export function centsToUSDCWei(cents: number): bigint {
  // Convert cents to dollars, then to USDC wei
  const dollars = cents / 100;
  const usdcWei = BigInt(Math.round(dollars * 1_000_000)); // 6 decimals
  return usdcWei;
}

/**
 * Convert USDC wei to USD cents
 */
export function usdcWeiToCents(wei: bigint): number {
  const dollars = Number(wei) / 1_000_000; // 6 decimals
  return Math.round(dollars * 100);
}

/**
 * Process a payment using x402 protocol
 */
export async function processPayment(
  walletClient: WalletClient,
  paymentRequest: PaymentRequest
): Promise<PaymentResult> {
  try {
    // Create x402 client
    const x402Client = createPaymentClient(walletClient);
    
    // Convert amount to USDC wei
    const amountWei = centsToUSDCWei(paymentRequest.amount);
    
    // Create payment request
    const paymentData = {
      amount: amountWei.toString(),
      currency: 'USDC',
      recipient: process.env.NEXT_PUBLIC_PAYMENT_RECIPIENT_ADDRESS || '0x0000000000000000000000000000000000000000',
      metadata: {
        contentId: paymentRequest.contentId,
        description: paymentRequest.description,
        timestamp: Date.now(),
      },
    };
    
    // Execute payment
    const result = await x402Client.pay(paymentData);
    
    if (result.success && result.transactionHash) {
      return {
        success: true,
        transactionHash: result.transactionHash,
      };
    } else {
      return {
        success: false,
        error: result.error || 'Payment failed',
      };
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown payment error',
    };
  }
}

/**
 * Verify payment transaction on Base
 */
export async function verifyPayment(
  transactionHash: string,
  expectedAmount: number,
  expectedRecipient: string
): Promise<boolean> {
  try {
    // This would typically involve checking the transaction on Base
    // For now, we'll implement a basic verification
    console.log('Verifying payment:', {
      transactionHash,
      expectedAmount,
      expectedRecipient,
    });
    
    // In a real implementation, you would:
    // 1. Fetch the transaction from Base
    // 2. Verify it's a USDC transfer
    // 3. Check the amount and recipient
    // 4. Ensure the transaction is confirmed
    
    return true; // Placeholder - implement actual verification
  } catch (error) {
    console.error('Payment verification error:', error);
    return false;
  }
}

/**
 * Get user's USDC balance on Base
 */
export async function getUSDCBalance(walletClient: WalletClient): Promise<bigint> {
  try {
    const balance = await walletClient.readContract({
      address: USDC_CONTRACT_ADDRESS as `0x${string}`,
      abi: [
        {
          name: 'balanceOf',
          type: 'function',
          stateMutability: 'view',
          inputs: [{ name: 'account', type: 'address' }],
          outputs: [{ name: '', type: 'uint256' }],
        },
      ],
      functionName: 'balanceOf',
      args: [walletClient.account.address],
    });
    
    return balance as bigint;
  } catch (error) {
    console.error('Error fetching USDC balance:', error);
    return BigInt(0);
  }
}
