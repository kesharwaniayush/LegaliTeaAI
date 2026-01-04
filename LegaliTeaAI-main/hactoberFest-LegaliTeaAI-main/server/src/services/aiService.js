import { getLanguageName } from '../utils/languageUtils.js';
import { generateFallbackAnalysis } from '../utils/fallbackAnalysis.js';
import 'dotenv/config';

class AIService {
    constructor() {
        // DigitalOcean AI configuration
        this.apiUrl = "https://inference.do-ai.run/v1/chat/completions";
        this.accessToken = process.env.DIGITALOCEAN_ACCESS_TOKEN;
        this.model = "openai-gpt-4o-mini";

        // Check if DigitalOcean AI is available
        this.isAvailable = !!this.accessToken;

        if (!this.isAvailable) {
            console.warn('DigitalOcean Access Token not found. AI features will use fallback analysis.');
        } else {
            console.log('🤖 DigitalOcean AI configured successfully');
        }
    }

    async analyzeDocument(text, documentType = 'document', language = 'en') {
        const prompt = this.buildAnalysisPrompt(text, language);

        // Try DigitalOcean AI
        if (this.isAvailable) {
            try {
                console.log('Using DigitalOcean AI for document analysis');
                const response = await this.callDigitalOceanAI(prompt);
                const analysis = this.parseAIResponse(response);

                if (this.validateAnalysis(analysis)) {
                    return analysis;
                }
                throw new Error('Invalid analysis structure from DigitalOcean AI');
            } catch (error) {
                console.error('DigitalOcean AI error:', error);
            }
        }

        // Fallback to static analysis
        console.log('Using fallback analysis');
        return generateFallbackAnalysis(text, documentType);
    }

    async callDigitalOceanAI(prompt) {
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.accessToken}`
        };

        const data = {
            "model": this.model,
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        };

        const response = await fetch(this.apiUrl, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`DigitalOcean AI API error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        return result.choices[0]?.message?.content || '';
    }

    parseAIResponse(responseText) {
        let jsonText = responseText.trim();

        // Remove markdown code blocks if present
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.replace(/```json\n?/, '').replace(/\n?```$/, '');
        } else if (jsonText.startsWith('```')) {
            jsonText = jsonText.replace(/```\n?/, '').replace(/\n?```$/, '');
        }

        return JSON.parse(jsonText);
    }

    validateAnalysis(analysis) {
        return analysis &&
            analysis.summary &&
            analysis.keyInformation &&
            analysis.riskAssessment &&
            analysis.actionPlan;
    }

    async explainTerm(term, context, documentType, language = 'en') {
        const prompt = this.buildTermExplanationPrompt(term, context, documentType, language);

        // Try DigitalOcean AI
        if (this.isAvailable) {
            try {
                const response = await this.callDigitalOceanAI(prompt);
                return this.parseAIResponse(response);
            } catch (error) {
                console.error('DigitalOcean AI error for term explanation:', error);
            }
        }

        // Fallback response
        return {
            term,
            definition: "This appears to be a legal term. Please consult a legal professional for accurate definition.",
            contextualDefinition: "Unable to provide context-specific definition without AI service.",
            category: "legal",
            complexity: "intermediate",
            examples: ["Please consult legal resources for examples"],
            relatedTerms: [],
            consequences: "Consult a legal professional for specific consequences"
        };
    }

    async generateScenarios(clause, documentType, language = 'en') {
        const prompt = this.buildScenarioPrompt(clause, documentType, language);

        // Try DigitalOcean AI
        if (this.isAvailable) {
            try {
                const response = await this.callDigitalOceanAI(prompt);
                return this.parseAIResponse(response);
            } catch (error) {
                console.error('DigitalOcean AI error for scenario generation:', error);
            }
        }

        // Fallback response
        return {
            scenarios: [{
                id: "fallback_1",
                title: "General Legal Scenario",
                situation: "This clause may have legal implications that require professional review",
                trigger: "Various circumstances could activate this clause",
                consequences: [
                    "Consult a legal professional for specific advice",
                    "Review the clause with qualified legal counsel",
                    "Consider potential risks and obligations"
                ],
                severity: "medium",
                likelihood: "medium",
                prevention: "Seek legal advice before signing any document",
                proTip: "Always have legal documents reviewed by a qualified attorney"
            }]
        };
    }

    async generateQuiz(documentText, difficulty = 'medium', language = 'en') {
        const prompt = this.buildQuizPrompt(documentText, difficulty, language);

        // Try DigitalOcean AI
        if (this.isAvailable) {
            try {
                const response = await this.callDigitalOceanAI(prompt);
                return this.parseAIResponse(response);
            } catch (error) {
                console.error('DigitalOcean AI error for quiz generation:', error);
            }
        }

        // Fallback quiz
        return {
            quiz: {
                title: "Basic Legal Document Quiz",
                difficulty: difficulty,
                questions: [
                    {
                        id: "q1",
                        type: "multiple_choice",
                        question: "What should you do when reviewing a legal document?",
                        options: ["Sign immediately", "Read carefully and seek advice", "Ignore complex terms", "Guess the meaning"],
                        correctAnswer: "Read carefully and seek advice",
                        explanation: "Always read legal documents carefully and consult with legal professionals when needed.",
                        points: 10,
                        category: "general"
                    },
                    {
                        id: "q2",
                        type: "true_false",
                        question: "It's safe to sign a contract without understanding all the terms.",
                        options: ["True", "False"],
                        correctAnswer: "False",
                        explanation: "Never sign a contract without fully understanding all terms and their implications.",
                        points: 10,
                        category: "general"
                    }
                ]
            }
        };
    }

    buildAnalysisPrompt(text, language) {
        return `You are an advanced legal document analysis assistant. Analyze the provided legal document and return a comprehensive analysis with interactive features in JSON format. Focus on making complex legal language accessible to non-lawyers.

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

IMPORTANT: Please provide the analysis in ${getLanguageName(language)} language. All explanations, summaries, and recommendations should be in ${getLanguageName(language)}.

${text}`;
    }

    buildTermExplanationPrompt(term, context, documentType, language) {
        return `You are a legal term explanation assistant. Provide a clear, concise explanation of the legal term in context.

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
    }

    buildScenarioPrompt(clause, documentType, language) {
        return `You are a legal scenario generator. Create realistic, practical scenarios that help users understand the consequences of legal clauses.

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
    }

    buildQuizPrompt(documentText, difficulty, language) {
        return `You are a legal education quiz generator. Create educational quiz questions based on the legal document to help users learn and test their understanding.

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
    }
}

export default new AIService();