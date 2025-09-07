'use client';

import { LegalContent } from '@/lib/types';
import { InfoCard } from './InfoCard';
import { ActionLink } from './ActionLink';
import { formatPrice } from '@/lib/utils';

interface LegalContentCardProps {
  content: LegalContent;
  onPurchase: (contentId: string) => void;
  isPurchased?: boolean;
}

export function LegalContentCard({ 
  content, 
  onPurchase, 
  isPurchased = false 
}: LegalContentCardProps) {
  const handlePurchase = () => {
    onPurchase(content.id);
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
          <ActionLink variant="primary" onClick={handlePurchase}>
            Access for {formatPrice(content.price)}
          </ActionLink>
        )}
      </div>
    </InfoCard>
  );
}
