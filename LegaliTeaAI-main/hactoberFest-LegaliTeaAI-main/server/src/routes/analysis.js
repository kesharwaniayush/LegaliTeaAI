import express from 'express';
import aiService from '../services/aiService.js';
import { validateAnalysisRequest, validateTermRequest, validateScenarioRequest, validateQuizRequest, validateSaveRequest } from '../middleware/validation.js';

const router = express.Router();

// Main document analysis endpoint
router.post('/analyze', validateAnalysisRequest, async (req, res, next) => {
    try {
        const { text, documentType, language = 'en' } = req.body;

        console.log(`Analyzing document with DigitalOcean AI in ${language}...`);
        const analysis = await aiService.analyzeDocument(text, documentType, language);

        res.json(analysis);
    } catch (error) {
        next(error);
    }
});

// Term explanation endpoint
router.post('/explain-term', validateTermRequest, async (req, res, next) => {
    try {
        const { term, context, documentType, language = 'en' } = req.body;

        console.log(`Explaining term "${term}" in ${language}...`);
        const explanation = await aiService.explainTerm(term, context, documentType, language);

        res.json(explanation);
    } catch (error) {
        next(error);
    }
});

// Scenario generation endpoint
router.post('/generate-scenarios', validateScenarioRequest, async (req, res, next) => {
    try {
        const { clause, documentType, language = 'en' } = req.body;

        console.log(`Generating scenarios for clause in ${language}...`);
        const scenarios = await aiService.generateScenarios(clause, documentType, language);

        res.json(scenarios);
    } catch (error) {
        next(error);
    }
});

// Quiz generation endpoint
router.post('/generate-quiz', validateQuizRequest, async (req, res, next) => {
    try {
        const { documentText, difficulty = 'medium', language = 'en' } = req.body;

        console.log(`Generating quiz with difficulty ${difficulty} in ${language}...`);
        const quiz = await aiService.generateQuiz(documentText, difficulty, language);

        res.json(quiz);
    } catch (error) {
        next(error);
    }
});

// Save analysis endpoint
// router.post('/save', validateSaveRequest, async (req, res, next) => {
//     try {
//         const { email, analysis } = req.body;

//         // For now, simulate saving to database
//         // In a real implementation, you would save to Supabase here
//         const mockId = Math.random().toString(36).substring(2, 15);
//         const expiresAt = new Date();
//         expiresAt.setHours(expiresAt.getHours() + 24);

//         console.log(`Saving analysis for ${email} with ID: ${mockId}`);

//         res.json({
//             id: mockId,
//             expires_at: expiresAt.toISOString(),
//             message: 'Analysis saved successfully'
//         });
//     } catch (error) {
//         next(error);
//     }
// });

export default router;