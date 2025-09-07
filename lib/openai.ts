import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

export async function generateLegalContent(
  category: string,
  topic: string,
  contentType: 'card' | 'guide' | 'template'
): Promise<string> {
  try {
    const prompt = `Generate ${contentType} content for legal rights information about ${topic} in the ${category} category. 
    
    Requirements:
    - Use simple, clear language that non-lawyers can understand
    - Include specific actionable steps
    - Highlight key rights and protections
    - Format with bullet points and clear sections
    - Keep it concise but comprehensive
    - Include "what to do" and "what not to do" sections where relevant
    
    Format the response in markdown for easy reading.`;

    const completion = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        {
          role: 'system',
          content: 'You are a legal expert who specializes in explaining complex legal concepts in simple, actionable terms for everyday people. Always provide accurate, helpful information while encouraging users to seek professional legal advice for specific situations.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || 'Unable to generate content at this time.';
  } catch (error) {
    console.error('Error generating legal content:', error);
    throw new Error('Failed to generate legal content');
  }
}

export async function generateLegalDocument(
  templateType: string,
  userInputs: Record<string, string>
): Promise<string> {
  try {
    const prompt = `Generate a ${templateType} document using the following information:
    
    ${Object.entries(userInputs)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n')}
    
    Requirements:
    - Use proper legal document formatting
    - Include all necessary legal language
    - Make it professional but understandable
    - Include placeholders for signatures and dates where appropriate
    - Add a disclaimer that this is a template and legal advice should be sought
    
    Format as a complete, ready-to-use document.`;

    const completion = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        {
          role: 'system',
          content: 'You are a legal document specialist who creates professional, legally sound document templates. Always include appropriate disclaimers and encourage users to have documents reviewed by qualified attorneys.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 1500,
      temperature: 0.3,
    });

    return completion.choices[0]?.message?.content || 'Unable to generate document at this time.';
  } catch (error) {
    console.error('Error generating legal document:', error);
    throw new Error('Failed to generate legal document');
  }
}
