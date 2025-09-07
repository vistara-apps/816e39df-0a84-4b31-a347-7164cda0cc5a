import { DatabaseService, Transaction } from './supabase';

export interface PaymentRequest {
  userId: string;
  amountCents: number;
  contentId?: string;
  templateId?: string;
  currency?: string;
}

export interface PaymentResult {
  success: boolean;
  transaction?: Transaction;
  error?: string;
  transactionHash?: string;
}

export class PaymentService {
  /**
   * Process a micro-transaction payment
   */
  static async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    try {
      // Create transaction record
      const transaction = await DatabaseService.createTransaction(
        request.userId,
        request.amountCents,
        request.contentId,
        request.templateId,
        request.currency || 'eth'
      );

      if (!transaction) {
        return {
          success: false,
          error: 'Failed to create transaction record'
        };
      }

      // In a real implementation, this would integrate with:
      // 1. Coinbase OnchainKit for crypto payments
      // 2. Stripe for traditional payments
      // 3. Other payment processors
      
      // For now, simulate payment processing
      const paymentSuccess = await this.simulatePayment(request);
      
      if (paymentSuccess.success) {
        // Update transaction status
        const updatedTransaction = await DatabaseService.updateTransactionStatus(
          transaction.id,
          'completed',
          paymentSuccess.transactionHash
        );

        // Grant content access
        if (updatedTransaction) {
          await DatabaseService.grantContentAccess(
            request.userId,
            transaction.id,
            request.contentId,
            request.templateId
          );
        }

        return {
          success: true,
          transaction: updatedTransaction || transaction,
          transactionHash: paymentSuccess.transactionHash
        };
      } else {
        // Update transaction status to failed
        await DatabaseService.updateTransactionStatus(
          transaction.id,
          'failed'
        );

        return {
          success: false,
          transaction,
          error: paymentSuccess.error || 'Payment failed'
        };
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      return {
        success: false,
        error: 'Payment processing failed'
      };
    }
  }

  /**
   * Check if user has access to content
   */
  static async checkAccess(
    userId: string,
    contentId?: string,
    templateId?: string
  ): Promise<boolean> {
    return await DatabaseService.checkContentAccess(userId, contentId, templateId);
  }

  /**
   * Get user's transaction history
   */
  static async getTransactionHistory(userId: string): Promise<Transaction[]> {
    return await DatabaseService.getUserTransactions(userId);
  }

  /**
   * Calculate total spent by user
   */
  static async getUserTotalSpent(userId: string): Promise<number> {
    const transactions = await DatabaseService.getUserTransactions(userId);
    return transactions
      .filter(t => t.status === 'completed')
      .reduce((total, t) => total + t.amount_cents, 0);
  }

  /**
   * Get pricing for content or template
   */
  static async getPrice(contentId?: string, templateId?: string): Promise<number | null> {
    try {
      if (contentId) {
        const content = await DatabaseService.getLegalContentById(contentId);
        return content?.price_cents || null;
      }
      
      if (templateId) {
        const template = await DatabaseService.getDocumentTemplateById(templateId);
        return template?.price_cents || null;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting price:', error);
      return null;
    }
  }

  /**
   * Simulate payment processing (replace with real payment integration)
   */
  private static async simulatePayment(request: PaymentRequest): Promise<{
    success: boolean;
    transactionHash?: string;
    error?: string;
  }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate 95% success rate
    const success = Math.random() > 0.05;
    
    if (success) {
      return {
        success: true,
        transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`
      };
    } else {
      return {
        success: false,
        error: 'Simulated payment failure'
      };
    }
  }

  /**
   * Format price for display
   */
  static formatPrice(cents: number, currency = 'USD'): string {
    const amount = cents / 100;
    
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount);
    }
    
    // For crypto currencies, show as decimal
    return `${amount.toFixed(4)} ${currency.toUpperCase()}`;
  }

  /**
   * Validate payment request
   */
  static validatePaymentRequest(request: PaymentRequest): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!request.userId) {
      errors.push('User ID is required');
    }

    if (!request.amountCents || request.amountCents <= 0) {
      errors.push('Amount must be greater than 0');
    }

    if (!request.contentId && !request.templateId) {
      errors.push('Either content ID or template ID is required');
    }

    if (request.contentId && request.templateId) {
      errors.push('Cannot specify both content ID and template ID');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Process refund (for failed transactions or disputes)
   */
  static async processRefund(transactionId: string): Promise<PaymentResult> {
    try {
      const updatedTransaction = await DatabaseService.updateTransactionStatus(
        transactionId,
        'refunded'
      );

      if (updatedTransaction) {
        return {
          success: true,
          transaction: updatedTransaction
        };
      } else {
        return {
          success: false,
          error: 'Failed to process refund'
        };
      }
    } catch (error) {
      console.error('Refund processing error:', error);
      return {
        success: false,
        error: 'Refund processing failed'
      };
    }
  }
}

// Payment status helpers
export const PaymentStatus = {
  isPending: (transaction: Transaction) => transaction.status === 'pending',
  isCompleted: (transaction: Transaction) => transaction.status === 'completed',
  isFailed: (transaction: Transaction) => transaction.status === 'failed',
  isRefunded: (transaction: Transaction) => transaction.status === 'refunded',
} as const;

// Common pricing constants
export const PRICING = {
  LEGAL_CARD: 50, // $0.50
  LEGAL_GUIDE: 75, // $0.75
  DOCUMENT_TEMPLATE: 100, // $1.00
  PREMIUM_CONTENT: 150, // $1.50
} as const;
