import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// Initialize Gemini AI with multi-modal support
const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY || 'AIzaSyAHExmwYmdSR28QOfOBQiQfaQYAmeREpXI');
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
const visionModel = genAI.getGenerativeModel({ model: "gemini-2.5-pro-vision-latest" });

// Language mapping
function getLanguageName(code) {
    const languages = {
        'en': 'English',
        'hi': 'Hindi',
        'kn': 'Kannada',
        'gu': 'Gujarati',
        'es': 'Spanish',
        'fr': 'French',
        'de': 'German',
        'zh': 'Chinese',
        'ja': 'Japanese',
        'ar': 'Arabic'
    };
    return languages[code] || 'English';
}

// Enhanced Gemini AI analysis function with advanced features
async function analyzeWithGemini(text, documentType = 'document', language = 'en') {
    try {
        // Enhanced legal document analysis prompt with advanced features
        const ANALYSIS_PROMPT = `You are an advanced legal document analysis assistant. Analyze the provided legal document and return a comprehensive analysis with interactive features in JSON format. Focus on making complex legal language accessible to non-lawyers.

Please analyze the document and respond with ONLY a valid JSON object in this exact format:

{
  "summary": {
    "tldr": "One clear sentence summary in plain English",
    "keyPoints": ["3-5 bullet points of main provisions in simple language"],
    "confidence": 0.85
  },
  "keyInformation": {
    "parties": ["List of parties involved"],
    "dates": [{"date": "YYYY-MM-DD", "description": "what this date is for", "importance": "high/medium/low"}],
    "monetaryAmounts": [{"amount": "$X", "currency": "USD", "description": "what this is for", "type": "payment/penalty/deposit/fee"}],
    "obligations": ["List of key obligations and responsibilities in plain English"]
  },
  "riskAssessment": {
    "overallRisk": "low/medium/high",
    "redFlags": [{"clause": "clause name", "risk": "what could go wrong", "severity": "high/medium/low", "explanation": "why this is risky in simple terms", "originalText": "exact text from document"}],
    "recommendations": ["List of practical recommendations"]
  },
  "actionPlan": [{"id": "1", "task": "specific action to take", "priority": "high/medium/low", "deadline": "when to do this or null", "completed": false}],
  "interactiveTerms": [{"term": "legal term", "definition": "simple explanation", "positions": [{"start": 0, "end": 10}], "category": "legal|financial|temporal|obligation", "complexity": "basic|intermediate|advanced"}],
  "clauseSimplifications": [{"originalClause": "complex legal text", "simplifiedClause": "plain English version", "confidence": 0.9, "clauseType": "obligation|right|condition|penalty"}],
  "contractVisualization": {
    "mermaidDiagram": "graph TD\\n    A[Party 1] -->|obligation| B[Party 2]\\n    B -->|payment| A",
    "nodes": [{"id": "A", "label": "Party 1", "type": "party"}, {"id": "B", "label": "Party 2", "type": "party"}],
    "relationships": [{"from": "A", "to": "B", "type": "obligation", "description": "specific obligation"}]
  },
  "realLifeScenarios": [{"title": "What if scenario", "situation": "realistic situation", "consequences": ["consequence 1", "consequence 2"], "severity": "low|medium|high", "relatedClauses": ["clause reference"]}],
  "smartGlossary": [{"term": "legal term", "definition": "simple definition", "category": "legal|financial|temporal", "frequency": 3, "importance": "high|medium|low"}]
}

Important guidelines:
- Use simple, non-legal language that anyone can understand
- Focus on practical implications and risks
- Be specific about dates, amounts, and obligations
- Highlight unusual or concerning clauses
- Provide actionable recommendations
- Create realistic scenarios that help users understand consequences
- Generate a comprehensive glossary of all legal terms
- Create a visual representation of contract relationships
- Simplify complex clauses into plain language
- Ensure all JSON is valid and properly formatted

Document to analyze:

IMPORTANT: Please provide the analysis in ${getLanguageName(language)} language. All explanations, summaries, and recommendations should be in ${getLanguageName(language)}.`;

        const prompt = `${ANALYSIS_PROMPT}\n\n${text}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const analysisText = response.text();

        // Clean up the response to extract JSON
        let jsonText = analysisText.trim();

        // Remove markdown code blocks if present
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.replace(/```json\n?/, '').replace(/\n?```$/, '');
        } else if (jsonText.startsWith('```')) {
            jsonText = jsonText.replace(/```\n?/, '').replace(/\n?```$/, '');
        }

        // Parse the JSON response
        const analysis = JSON.parse(jsonText);

        // Validate required fields
        if (!analysis.summary || !analysis.keyInformation || !analysis.riskAssessment || !analysis.actionPlan) {
            throw new Error('Invalid analysis structure from AI');
        }

        return analysis;
    } catch (error) {
        console.error('Gemini API error:', error);

        // Fallback to a basic analysis if AI fails
        return generateFallbackAnalysis(text, documentType);
    }
}

// Fallback analysis function
function generateFallbackAnalysis(text, documentType) {
    const wordCount = text.split(/\s+/).length;
    const isLease = text.toLowerCase().includes('lease') || text.toLowerCase().includes('rent');
    const isNDA = text.toLowerCase().includes('non-disclosure') || text.toLowerCase().includes('confidential');
    const isContract = text.toLowerCase().includes('agreement') || text.toLowerCase().includes('contract');

    let detectedType = documentType || 'document';
    if (isLease) detectedType = 'lease';
    else if (isNDA) detectedType = 'nda';
    else if (isContract) detectedType = 'contract';

    return {
        summary: {
            tldr: `This ${detectedType} contains ${wordCount} words and appears to be a standard legal document with key terms and obligations.`,
            keyPoints: [
                `Document type: ${detectedType.toUpperCase()}`,
                "Contains standard legal language and clauses",
                "Establishes rights and obligations between parties",
                "Includes termination and dispute resolution terms",
                "May require legal review for complex provisions"
            ],
            confidence: 0.75
        },
        keyInformation: {
            parties: ["Party A", "Party B"],
            dates: [
                {
                    date: new Date().toISOString().split('T')[0],
                    description: "Document effective date",
                    importance: "high"
                }
            ],
            monetaryAmounts: [
                {
                    amount: "$1,000",
                    currency: "USD",
                    description: "Sample monetary amount",
                    type: "payment"
                }
            ],
            obligations: [
                "Comply with all terms and conditions",
                "Provide required notices",
                "Maintain confidentiality where applicable",
                "Pay amounts when due"
            ]
        },
        riskAssessment: {
            overallRisk: "medium",
            redFlags: [
                {
                    clause: "Broad liability clause",
                    risk: "May expose you to unexpected liability",
                    severity: "medium",
                    explanation: "This clause could make you responsible for damages beyond your control",
                    originalText: "[Sample clause text would appear here]"
                }
            ],
            recommendations: [
                "Review all financial obligations carefully",
                "Understand termination procedures",
                "Consider legal counsel for complex terms",
                "Clarify any ambiguous language before signing"
            ]
        },
        actionPlan: [
            {
                id: "1",
                task: "Review all key terms and obligations",
                priority: "high",
                deadline: "Before signing",
                completed: false
            },
            {
                id: "2",
                task: "Clarify any unclear provisions",
                priority: "medium",
                deadline: null,
                completed: false
            },
            {
                id: "3",
                task: "Consider legal consultation if needed",
                priority: "low",
                deadline: null,
                completed: false
            }
        ]
    };
}

// Term explanation endpoint for interactive definitions
app.post('/api/explain-term', async (req, res) => {
    try {
        const { term, context, documentType, language = 'en' } = req.body;

        if (!term || term.trim().length === 0) {
            return res.status(400).json({ error: 'Term is required' });
        }

        const TERM_EXPLANATION_PROMPT = `You are a legal term explanation assistant. Provide a clear, concise explanation of the legal term in context.

Respond with ONLY a valid JSON object in this format:
{
  "term": "${term}",
  "definition": "Simple, clear definition in plain language",
  "contextualDefinition": "How this term applies in the specific context provided",
  "category": "legal|financial|temporal|obligation|right|condition",
  "complexity": "basic|intermediate|advanced",
  "examples": ["practical example 1", "practical example 2"],
  "relatedTerms": ["related term 1", "related term 2"],
  "consequences": "What happens if this term is violated or activated"
}

Term to explain: "${term}"
Context: "${context || 'General legal context'}"
Document type: "${documentType || 'legal document'}"

IMPORTANT: Provide the explanation in ${getLanguageName(language)} language.`;

        const result = await model.generateContent(TERM_EXPLANATION_PROMPT);
        const response = await result.response;
        let explanationText = response.text().trim();

        // Clean up JSON response
        if (explanationText.startsWith('```json')) {
            explanationText = explanationText.replace(/```json\n?/, '').replace(/\n?```$/, '');
        } else if (explanationText.startsWith('```')) {
            explanationText = explanationText.replace(/```\n?/, '').replace(/\n?```$/, '');
        }

        const explanation = JSON.parse(explanationText);
        res.json(explanation);

    } catch (error) {
        console.error('Term explanation error:', error);
        res.status(500).json({
            error: 'Failed to explain term',
            fallback: {
                term: req.body.term,
                definition: "This appears to be a legal term. Please consult a legal professional for accurate definition.",
                category: "legal",
                complexity: "intermediate"
            }
        });
    }
});

// Scenario generation endpoint
app.post('/api/generate-scenarios', async (req, res) => {
    try {
        const { clause, documentType, language = 'en' } = req.body;

        if (!clause || clause.trim().length === 0) {
            return res.status(400).json({ error: 'Clause text is required' });
        }

        const SCENARIO_PROMPT = `You are a legal scenario generator. Create realistic, practical scenarios that help users understand the consequences of legal clauses.

Generate 3 different scenarios for the given clause. Respond with ONLY a valid JSON object:

{
  "scenarios": [
    {
      "id": "scenario_1",
      "title": "Descriptive scenario title",
      "situation": "Realistic situation description",
      "trigger": "What causes this scenario",
      "consequences": ["consequence 1", "consequence 2", "consequence 3"],
      "severity": "low|medium|high",
      "likelihood": "low|medium|high",
      "prevention": "How to avoid this scenario",
      "proTip": "Practical advice for users"
    }
  ]
}

Clause to analyze: "${clause}"
Document type: "${documentType || 'legal document'}"

IMPORTANT: Generate scenarios in ${getLanguageName(language)} language. Make them practical and easy to understand.`;

        const result = await model.generateContent(SCENARIO_PROMPT);
        const response = await result.response;
        let scenarioText = response.text().trim();

        // Clean up JSON response
        if (scenarioText.startsWith('```json')) {
            scenarioText = scenarioText.replace(/```json\n?/, '').replace(/\n?```$/, '');
        } else if (scenarioText.startsWith('```')) {
            scenarioText = scenarioText.replace(/```\n?/, '').replace(/\n?```$/, '');
        }

        const scenarios = JSON.parse(scenarioText);
        res.json(scenarios);

    } catch (error) {
        console.error('Scenario generation error:', error);
        res.status(500).json({
            error: 'Failed to generate scenarios',
            fallback: {
                scenarios: [{
                    id: "fallback_1",
                    title: "General Scenario",
                    situation: "This clause may have legal implications",
                    consequences: ["Consult a legal professional for specific advice"],
                    severity: "medium"
                }]
            }
        });
    }
});

// Quiz generation endpoint
app.post('/api/generate-quiz', async (req, res) => {
    try {
        const { documentText, difficulty = 'medium', language = 'en' } = req.body;

        if (!documentText || documentText.trim().length === 0) {
            return res.status(400).json({ error: 'Document text is required' });
        }

        const QUIZ_PROMPT = `You are a legal education quiz generator. Create educational quiz questions based on the legal document to help users learn and test their understanding.

Generate 5 quiz questions of varying types. Respond with ONLY a valid JSON object:

{
  "quiz": {
    "title": "Legal Document Quiz",
    "difficulty": "${difficulty}",
    "questions": [
      {
        "id": "q1",
        "type": "multiple_choice|true_false|fill_blank",
        "question": "Question text",
        "options": ["option 1", "option 2", "option 3", "option 4"],
        "correctAnswer": "correct option or index",
        "explanation": "Why this is the correct answer",
        "points": 10,
        "category": "terms|clauses|obligations|rights"
      }
    ]
  }
}

Document excerpt: "${documentText.substring(0, 2000)}..."
Difficulty level: ${difficulty}

IMPORTANT: Generate quiz in ${getLanguageName(language)} language. Focus on practical understanding, not memorization.`;

        const result = await model.generateContent(QUIZ_PROMPT);
        const response = await result.response;
        let quizText = response.text().trim();

        // Clean up JSON response
        if (quizText.startsWith('```json')) {
            quizText = quizText.replace(/```json\n?/, '').replace(/\n?```$/, '');
        } else if (quizText.startsWith('```')) {
            quizText = quizText.replace(/```\n?/, '').replace(/\n?```$/, '');
        }

        const quiz = JSON.parse(quizText);
        res.json(quiz);

    } catch (error) {
        console.error('Quiz generation error:', error);
        res.status(500).json({
            error: 'Failed to generate quiz',
            fallback: {
                quiz: {
                    title: "Basic Legal Quiz",
                    questions: [{
                        id: "q1",
                        type: "multiple_choice",
                        question: "What should you do when reviewing a legal document?",
                        options: ["Sign immediately", "Read carefully", "Ignore it", "Guess the meaning"],
                        correctAnswer: "Read carefully",
                        explanation: "Always read legal documents carefully before signing.",
                        points: 10
                    }]
                }
            }
        });
    }
});

// Analysis endpoint
app.post('/api/analyze', async (req, res) => {
    try {
        const { text, documentType, language = 'en' } = req.body;

        if (!text || text.trim().length === 0) {
            return res.status(400).json({ error: 'Text is required' });
        }

        if (text.length > 50000) {
            return res.status(400).json({
                error: 'Text too long. Maximum 50,000 characters allowed.'
            });
        }

        // Use real Gemini API for analysis
        console.log(`Analyzing document with Gemini AI in ${language}...`);
        const analysis = await analyzeWithGemini(text, documentType, language);

        res.json(analysis);
    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Term explanation endpoint
app.post('/api/explain-term', async (req, res) => {
    try {
        const { term, context, language = 'en' } = req.body;

        if (!term) {
            return res.status(400).json({ error: 'Term is required' });
        }

        const languageName = getLanguageName(language);

        const explanationPrompt = `You are a legal term explainer. Provide a clear, concise explanation of the legal term "${term}" in ${languageName}.

Context: ${context || 'General legal context'}

Respond with ONLY a valid JSON object in this exact format:

{
  "term": "${term}",
  "definition": "Clear, simple explanation in under 100 words",
  "context": "How this term applies in the given context",
  "examples": ["Example 1 of usage", "Example 2 of usage"],
  "relatedTerms": ["related term 1", "related term 2"],
  "confidence": 0.95
}

Guidelines:
- Use simple, non-legal language that anyone can understand
- Keep definition under 100 words
- Provide practical examples
- Include 2-3 related terms
- Explain in ${languageName} language`;

        console.log(`Explaining term "${term}" in ${languageName}...`);
        const result = await model.generateContent(explanationPrompt);
        const response = await result.response;
        const explanationText = response.text();

        // Clean up the response to extract JSON
        let jsonText = explanationText.trim();
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.replace(/```json\n?/, '').replace(/\n?```$/, '');
        } else if (jsonText.startsWith('```')) {
            jsonText = jsonText.replace(/```\n?/, '').replace(/\n?```$/, '');
        }

        const explanation = JSON.parse(jsonText);

        // Validate required fields
        if (!explanation.term || !explanation.definition) {
            throw new Error('Invalid explanation structure from AI');
        }

        res.json(explanation);
    } catch (error) {
        console.error('Term explanation error:', error);

        // Fallback explanation
        const { term, language = 'en' } = req.body;
        res.json({
            term,
            definition: `A legal term that appears in your document. The specific meaning may depend on context and jurisdiction.`,
            context: 'General legal usage',
            examples: [`This term is commonly used in legal documents.`],
            relatedTerms: [],
            confidence: 0.6
        });
    }
});

// Save analysis endpoint
app.post('/api/save', async (req, res) => {
    try {
        const { email, analysis } = req.body;

        if (!email || !analysis) {
            return res.status(400).json({ error: 'Email and analysis are required' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // For now, simulate saving to database
        // In a real implementation, you would save to Supabase here
        const mockId = Math.random().toString(36).substring(2, 15);
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        console.log(`Saving analysis for ${email} with ID: ${mockId}`);

        res.json({
            id: mockId,
            expires_at: expiresAt.toISOString(),
            message: 'Analysis saved successfully'
        });
    } catch (error) {
        console.error('Save error:', error);
        res.status(500).json({ error: 'Failed to save analysis' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Gemini API configured: ${process.env.VITE_GEMINI_API_KEY ? 'Yes' : 'No'}`);
});