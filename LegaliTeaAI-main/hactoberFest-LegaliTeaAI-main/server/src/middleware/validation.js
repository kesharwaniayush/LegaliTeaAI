// Request validation middleware

const validateAnalysisRequest = (req, res, next) => {
  let { text, documentType, language } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text is required and must be a string' });
  }

  if (text.trim().length === 0) {
    return res.status(400).json({ error: 'Text cannot be empty' });
  }

  if (text.length > 50000) {
    // return res.status(400).json({
    //     error: 'Text too long. Maximum 50,000 characters allowed.'
    // });
    text = text.slice(0, 50000); // Truncate text to 50,000 characters
  }

  if (language && typeof language !== 'string') {
    return res.status(400).json({ error: 'Language must be a string' });
  }

  if (documentType && typeof documentType !== 'string') {
    return res.status(400).json({ error: 'Document type must be a string' });
  }

  next();
};

const validateTermRequest = (req, res, next) => {
  const { term, context, language } = req.body;

  if (!term || typeof term !== 'string') {
    return res.status(400).json({ error: 'Term is required and must be a string' });
  }

  if (term.trim().length === 0) {
    return res.status(400).json({ error: 'Term cannot be empty' });
  }

  if (context && typeof context !== 'string') {
    return res.status(400).json({ error: 'Context must be a string' });
  }

  if (language && typeof language !== 'string') {
    return res.status(400).json({ error: 'Language must be a string' });
  }

  next();
};

const validateScenarioRequest = (req, res, next) => {
  const { clause, documentType, language } = req.body;

  if (!clause || typeof clause !== 'string') {
    return res.status(400).json({ error: 'Clause is required and must be a string' });
  }

  if (clause.trim().length === 0) {
    return res.status(400).json({ error: 'Clause cannot be empty' });
  }

  if (documentType && typeof documentType !== 'string') {
    return res.status(400).json({ error: 'Document type must be a string' });
  }

  if (language && typeof language !== 'string') {
    return res.status(400).json({ error: 'Language must be a string' });
  }

  next();
};

const validateQuizRequest = (req, res, next) => {
  const { documentText, difficulty, language } = req.body;

  if (!documentText || typeof documentText !== 'string') {
    return res.status(400).json({ error: 'Document text is required and must be a string' });
  }

  if (documentText.trim().length === 0) {
    return res.status(400).json({ error: 'Document text cannot be empty' });
  }

  if (difficulty && !['easy', 'medium', 'hard'].includes(difficulty)) {
    return res.status(400).json({ error: 'Difficulty must be easy, medium, or hard' });
  }

  if (language && typeof language !== 'string') {
    return res.status(400).json({ error: 'Language must be a string' });
  }

  next();
};

const validateSaveRequest = (req, res, next) => {
  const { email, analysis } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required and must be a string' });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (!analysis || typeof analysis !== 'object') {
    return res.status(400).json({ error: 'Analysis is required and must be an object' });
  }

  next();
};

export {
  validateAnalysisRequest,
  validateTermRequest,
  validateScenarioRequest,
  validateQuizRequest,
  validateSaveRequest
};