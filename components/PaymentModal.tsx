'use client';

import React, { useState } from 'react';
import { Modal } from './Modal';
import { ActionLink } from './ActionLink';
import { useUser } from '@/contexts/UserContext';
import { PaymentService } from '@/lib/payment';
import { LegalContent, DocumentTemplate } from '@/lib/supabase';
import { CreditCard, Wallet, AlertCircle, CheckCircle, Loader } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  content?: LegalContent;
  template?: DocumentTemplate;
  onSuccess?: () => void;
}

type PaymentStep = 'details' | 'processing' | 'success' | 'error';

export function PaymentModal({ 
  isOpen, 
  onClose, 
  content, 
  template, 
  onSuccess 
}: PaymentModalProps) {
  const { isAuthenticated, processPayment } = useUser();
  const [step, setStep] = useState<PaymentStep>('details');
  const [error, setError] = useState<string>('');
  const [transactionHash, setTransactionHash] = useState<string>('');

  const item = content || template;
  const itemType = content ? 'Legal Content' : 'Document Template';
  const price = item ? (content?.price_cents || template?.price_cents || 0) : 0;

  const handlePayment = async () => {
    if (!item || !isAuthenticated) return;

    setStep('processing');
    setError('');

    try {
      const result = await processPayment({
        amountCents: price,
        contentId: content?.id,
        templateId: template?.id
      });

      if (result.success) {
        setStep('success');
        onSuccess?.();
      } else {
        setError(result.error || 'Payment failed');
        setStep('error');
      }
    } catch (err) {
      setError('Payment processing failed');
      setStep('error');
    }
  };

  const handleClose = () => {
    setStep('details');
    setError('');
    setTransactionHash('');
    onClose();
  };

  const renderContent = () => {
    switch (step) {
      case 'details':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {content ? (
                  <CreditCard className="w-8 h-8 text-blue-600" />
                ) : (
                  <Wallet className="w-8 h-8 text-blue-600" />
                )}
              </div>
              <h3 className="text-heading text-textPrimary mb-2">
                Purchase {itemType}
              </h3>
              <p className="text-body text-textSecondary">
                Get instant access to this content
              </p>
            </div>

            {item && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-textPrimary">
                      {item.title || item.name}
                    </h4>
                    {(item as DocumentTemplate).description && (
                      <p className="text-sm text-textSecondary mt-1">
                        {(item as DocumentTemplate).description}
                      </p>
                    )}
                    <p className="text-sm text-textSecondary capitalize mt-1">
                      {item.category} • {content?.content_type || 'template'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-textPrimary">
                      {PaymentService.formatPrice(price)}
                    </div>
                    <div className="text-xs text-textSecondary">
                      One-time purchase
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-blue-900 mb-1">
                    What you get:
                  </p>
                  <ul className="text-blue-800 space-y-1">
                    <li>• Instant access to content</li>
                    <li>• Lifetime access (no expiration)</li>
                    <li>• Mobile-friendly format</li>
                    {template && <li>• Customizable document template</li>}
                  </ul>
                </div>
              </div>
            </div>

            {!isAuthenticated && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <p className="text-sm text-yellow-800">
                    Please connect your wallet to make a purchase
                  </p>
                </div>
              </div>
            )}

            <div className="flex space-x-3">
              <ActionLink
                variant="secondary"
                onClick={handleClose}
                className="flex-1"
              >
                Cancel
              </ActionLink>
              <ActionLink
                variant="primary"
                onClick={handlePayment}
                disabled={!isAuthenticated}
                className="flex-1"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Pay {PaymentService.formatPrice(price)}
              </ActionLink>
            </div>
          </div>
        );

      case 'processing':
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Loader className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
            <div>
              <h3 className="text-heading text-textPrimary mb-2">
                Processing Payment
              </h3>
              <p className="text-body text-textSecondary">
                Please wait while we process your payment...
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between text-sm">
                <span className="text-textSecondary">Amount:</span>
                <span className="font-semibold text-textPrimary">
                  {PaymentService.formatPrice(price)}
                </span>
              </div>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-heading text-textPrimary mb-2">
                Payment Successful!
              </h3>
              <p className="text-body text-textSecondary">
                You now have access to this {itemType.toLowerCase()}
              </p>
            </div>
            
            {transactionHash && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  <strong>Transaction Hash:</strong>
                  <br />
                  <code className="text-xs break-all">{transactionHash}</code>
                </p>
              </div>
            )}

            <ActionLink
              variant="primary"
              onClick={handleClose}
              className="w-full"
            >
              Continue
            </ActionLink>
          </div>
        );

      case 'error':
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h3 className="text-heading text-textPrimary mb-2">
                Payment Failed
              </h3>
              <p className="text-body text-textSecondary">
                {error || 'Something went wrong with your payment'}
              </p>
            </div>

            <div className="flex space-x-3">
              <ActionLink
                variant="secondary"
                onClick={handleClose}
                className="flex-1"
              >
                Cancel
              </ActionLink>
              <ActionLink
                variant="primary"
                onClick={() => setStep('details')}
                className="flex-1"
              >
                Try Again
              </ActionLink>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      {renderContent()}
    </Modal>
  );
}
