'use client';

import { useState } from 'react';
import { LegalContent } from '@/lib/types';
import { InfoCard } from './InfoCard';
import { PaymentButton } from './PaymentButton';
import { formatPrice } from '@/lib/utils';

interface LegalContentCardProps {
  content: LegalContent;
  onPurchase: (contentId: string, transactionHash?: string) => void;
  isPurchased?: boolean;
}

export function LegalContentCard({ 
  content, 
  onPurchase, 
  isPurchased = false 
}: LegalContentCardProps) {
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handlePaymentSuccess = (transactionHash: string) => {
    setPaymentError(null);
    onPurchase(content.id, transactionHash);
  };

  const handlePaymentError = (error: string) => {
    setPaymentError(error);
  };

  return (
    <InfoCard variant="display">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-heading">{content.title}</h3>
          <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-semibold">
            {formatPrice(content.price)}
          </span>
        </div>
        
        <div className="text-body text-white text-opacity-90">
          {isPurchased ? (
            <div 
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: content.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\n/g, '<br>')
                  .replace(/• /g, '• ')
              }}
            />
          ) : (
            <div>
              <p className="mb-4">
                Get instant access to detailed information about {content.title.toLowerCase()}, 
                including your specific rights, actionable steps, and what to do next.
              </p>
              <div className="bg-white bg-opacity-10 p-4 rounded-lg">
                <p className="text-sm text-white text-opacity-80">
                  This content includes:
                </p>
                <ul className="text-sm text-white text-opacity-80 mt-2 space-y-1">
                  <li>• Your specific legal rights</li>
                  <li>• Step-by-step action guide</li>
                  <li>• What to do and what to avoid</li>
                  <li>• When to seek professional help</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {!isPurchased && (
          <PaymentButton
            contentId={content.id}
            amount={content.price}
            description={`Access to ${content.title}`}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
          />
        )}

        {/* Display payment error if any */}
        {paymentError && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 border-opacity-30 rounded-lg p-3 mt-4">
            <p className="text-red-200 text-sm">{paymentError}</p>
          </div>
        )}
      </div>
    </InfoCard>
  );
}
