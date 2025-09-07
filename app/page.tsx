'use client';

import { useState, useEffect } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { AppShell } from '@/components/AppShell';
import { CategoryGrid } from '@/components/CategoryGrid';
import { LegalContentCard } from '@/components/LegalContentCard';
import { DocumentGenerator } from '@/components/DocumentGenerator';
import { ActionLink } from '@/components/ActionLink';
import { InfoCard } from '@/components/InfoCard';
import { ToastContainer } from '@/components/Toast';
import { LoadingSpinner, ContentSkeleton, CategorySkeleton } from '@/components/LoadingSpinner';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useToast } from '@/hooks/useToast';
import { SAMPLE_LEGAL_CONTENT } from '@/lib/constants';
import { CategoryType, LegalContent } from '@/lib/types';
import { FileText, Scale, Users } from 'lucide-react';

type ViewState = 'home' | 'category' | 'content' | 'generator';

export default function HomePage() {
  const { setFrameReady } = useMiniKit();
  const toast = useToast();
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [selectedContent, setSelectedContent] = useState<LegalContent | null>(null);
  const [purchasedContent, setPurchasedContent] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    setFrameReady();
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [setFrameReady]);

  const handleCategorySelect = async (category: CategoryType) => {
    setIsLoading(true);
    try {
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setSelectedCategory(category);
      setCurrentView('category');
    } catch (error) {
      toast.error('Failed to load category', 'Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContentSelect = async (content: LegalContent) => {
    setIsLoading(true);
    try {
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 300));
      setSelectedContent(content);
      setCurrentView('content');
    } catch (error) {
      toast.error('Failed to load content', 'Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = async (contentId: string) => {
    setIsLoading(true);
    try {
      // Simulate purchase process
      await new Promise(resolve => setTimeout(resolve, 1500));
      setPurchasedContent(prev => new Set([...prev, contentId]));
      toast.success('Purchase successful!', 'You now have access to this content.');
    } catch (error) {
      toast.error('Purchase failed', 'Please try again or contact support.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentGenerate = (templateId: string, inputs: Record<string, string>) => {
    console.log('Generating document:', templateId, inputs);
  };

  const handleBack = () => {
    switch (currentView) {
      case 'category':
        setCurrentView('home');
        setSelectedCategory(null);
        break;
      case 'content':
        setCurrentView('category');
        setSelectedContent(null);
        break;
      case 'generator':
        setCurrentView('home');
        break;
      default:
        setCurrentView('home');
    }
  };

  const getTitle = () => {
    switch (currentView) {
      case 'category':
        return `${selectedCategory?.charAt(0).toUpperCase()}${selectedCategory?.slice(1)} Rights`;
      case 'content':
        return selectedContent?.title || 'Legal Content';
      case 'generator':
        return 'Document Generator';
      default:
        return 'PocketLegal';
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4">
              <div className="flex justify-center mb-4">
                <Scale className="w-16 h-16 text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-4">Know Your Rights</h1>
              <p className="text-lg text-white text-opacity-90 max-w-2xl mx-auto">
                Your rights, simplified and actionable, right in your pocket. 
                Get instant access to legal information and tools.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <InfoCard onClick={() => setCurrentView('generator')}>
                <div className="flex items-center space-x-4">
                  <FileText className="w-8 h-8 text-accent" />
                  <div>
                    <h3 className="text-heading">Generate Documents</h3>
                    <p className="text-sm text-white text-opacity-80">
                      Create legal letters and forms
                    </p>
                  </div>
                </div>
              </InfoCard>

              <InfoCard>
                <div className="flex items-center space-x-4">
                  <Users className="w-8 h-8 text-accent" />
                  <div>
                    <h3 className="text-heading">Legal Support</h3>
                    <p className="text-sm text-white text-opacity-80">
                      Connect with legal professionals
                    </p>
                  </div>
                </div>
              </InfoCard>
            </div>

            {/* Categories */}
            <div>
              <h2 className="text-display mb-6 text-center">Browse by Category</h2>
              <CategoryGrid onCategorySelect={handleCategorySelect} />
            </div>

            {/* Featured Content */}
            <div>
              <h2 className="text-display mb-6 text-center">Featured Rights</h2>
              <div className="grid gap-4">
                {SAMPLE_LEGAL_CONTENT.slice(0, 2).map((content) => (
                  <InfoCard 
                    key={content.id}
                    onClick={() => handleContentSelect(content)}
                    variant="summary"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-heading mb-2">{content.title}</h3>
                        <p className="text-sm text-white text-opacity-80 capitalize">
                          {content.category} rights
                        </p>
                      </div>
                      <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-semibold">
                        ${(content.price / 100).toFixed(2)}
                      </span>
                    </div>
                  </InfoCard>
                ))}
              </div>
            </div>
          </div>
        );

      case 'category':
        const categoryContent = SAMPLE_LEGAL_CONTENT.filter(
          content => content.category === selectedCategory
        );
        
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-display mb-4">
                {selectedCategory?.charAt(0).toUpperCase()}{selectedCategory?.slice(1)} Rights
              </h2>
              <p className="text-body text-white text-opacity-90">
                Essential legal rights and information for {selectedCategory} situations
              </p>
            </div>

            <div className="grid gap-4">
              {categoryContent.map((content) => (
                <InfoCard 
                  key={content.id}
                  onClick={() => handleContentSelect(content)}
                  variant="summary"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-heading mb-2">{content.title}</h3>
                      <p className="text-sm text-white text-opacity-80">
                        {content.contentType} • Click to access
                      </p>
                    </div>
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-semibold">
                      ${(content.price / 100).toFixed(2)}
                    </span>
                  </div>
                </InfoCard>
              ))}
            </div>

            {categoryContent.length === 0 && (
              <InfoCard>
                <div className="text-center py-8">
                  <p className="text-body text-white text-opacity-80">
                    More content coming soon for this category!
                  </p>
                </div>
              </InfoCard>
            )}
          </div>
        );

      case 'content':
        if (!selectedContent) return null;
        
        return (
          <div className="space-y-6">
            <LegalContentCard
              content={selectedContent}
              onPurchase={handlePurchase}
              isPurchased={purchasedContent.has(selectedContent.id)}
            />
            
            <div className="text-center">
              <ActionLink 
                variant="secondary" 
                onClick={() => setCurrentView('generator')}
              >
                Generate Related Documents
              </ActionLink>
            </div>
          </div>
        );

      case 'generator':
        return (
          <DocumentGenerator onGenerate={handleDocumentGenerate} />
        );

      default:
        return null;
    }
  };

  if (isInitialLoading) {
    return (
      <AppShell title="PocketLegal">
        <LoadingSpinner message="Loading your legal rights..." />
      </AppShell>
    );
  }

  return (
    <ErrorBoundary onError={(error, errorInfo) => {
      console.error('App error:', error, errorInfo);
      toast.error('Application Error', 'Something went wrong. Please refresh the page.');
    }}>
      <AppShell
        title={getTitle()}
        showBack={currentView !== 'home'}
        onBack={handleBack}
      >
        {isLoading && <LoadingSpinner variant="overlay" message="Loading..." />}
        {renderContent()}
        <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
      </AppShell>
    </ErrorBoundary>
  );
}
