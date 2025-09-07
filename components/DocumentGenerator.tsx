'use client';

import { useState } from 'react';
import { DOCUMENT_TEMPLATES } from '@/lib/constants';
import { InputGroup, InputField } from './InputGroup';
import { ActionLink } from './ActionLink';
import { Modal } from './Modal';
import { formatPrice } from '@/lib/utils';
import { generateLegalDocument } from '@/lib/openai';

interface DocumentGeneratorProps {
  onGenerate: (templateId: string, inputs: Record<string, string>) => void;
}

export function DocumentGenerator({ onGenerate }: DocumentGeneratorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDocument, setGeneratedDocument] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const currentTemplate = DOCUMENT_TEMPLATES.find(t => t.id === selectedTemplate);

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    if (!currentTemplate) return;

    setIsGenerating(true);
    try {
      const document = await generateLegalDocument(currentTemplate.title, inputs);
      setGeneratedDocument(document);
      setShowPreview(true);
      onGenerate(currentTemplate.id, inputs);
    } catch (error) {
      console.error('Error generating document:', error);
      alert('Failed to generate document. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePurchase = () => {
    // Simulate purchase flow
    alert(`Purchase ${currentTemplate?.title} for ${formatPrice(currentTemplate?.price || 0)}`);
  };

  const resetForm = () => {
    setSelectedTemplate(null);
    setInputs({});
    setGeneratedDocument(null);
    setShowPreview(false);
  };

  if (!selectedTemplate) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-display mb-4">Document Generator</h2>
          <p className="text-body text-white text-opacity-90 mb-8">
            Generate professional legal documents tailored to your situation
          </p>
        </div>

        <div className="grid gap-4">
          {DOCUMENT_TEMPLATES.map((template) => (
            <div
              key={template.id}
              className="info-card cursor-pointer hover:scale-105 transform transition-all duration-200"
              onClick={() => setSelectedTemplate(template.id)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-heading mb-2">{template.title}</h3>
                  <p className="text-sm text-white text-opacity-80 capitalize">
                    {template.category} • {formatPrice(template.price)}
                  </p>
                </div>
                <div className="text-2xl">📄</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-display">{currentTemplate?.title}</h2>
        <ActionLink variant="secondary" onClick={resetForm}>
          Back to Templates
        </ActionLink>
      </div>

      <div className="legal-content">
        <p className="text-body mb-6">
          Fill out the information below to generate your {currentTemplate?.title.toLowerCase()}.
        </p>

        <div className="space-y-4">
          {currentTemplate?.fields.map((field) => (
            <InputGroup
              key={field}
              label={field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            >
              <InputField
                placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                value={inputs[field] || ''}
                onChange={(e) => handleInputChange(field, e.target.value)}
                multiline={field.includes('description') || field.includes('address')}
              />
            </InputGroup>
          ))}
        </div>

        <div className="flex gap-4 mt-8">
          <ActionLink
            variant="primary"
            onClick={handleGenerate}
            disabled={isGenerating || !Object.keys(inputs).length}
          >
            {isGenerating ? 'Generating...' : `Generate for ${formatPrice(currentTemplate?.price || 0)}`}
          </ActionLink>
        </div>
      </div>

      <Modal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title="Document Preview"
        className="max-w-2xl"
      >
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm text-textPrimary">
              {generatedDocument}
            </pre>
          </div>
          
          <div className="flex gap-4">
            <ActionLink variant="primary" onClick={handlePurchase}>
              Purchase & Download
            </ActionLink>
            <ActionLink variant="secondary" onClick={() => setShowPreview(false)}>
              Close Preview
            </ActionLink>
          </div>
        </div>
      </Modal>
    </div>
  );
}
