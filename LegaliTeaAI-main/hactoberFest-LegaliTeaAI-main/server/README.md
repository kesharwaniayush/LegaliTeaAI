# 🖥️ LegaliTea Server Architecture

## 📁 **Directory Structure**

```
server/
├── app.js                 # Express app configuration
├── server.js             # Server entry point
├── routes/
│   ├── analysis.js       # AI analysis endpoints
│   └── health.js         # Health check endpoints
├── services/
│   └── aiService.js      # DigitalOcean Gradient AI integration
├── middleware/
│   ├── errorHandler.js   # Global error handling
│   ├── requestLogger.js  # Request logging
│   ├── rateLimiter.js    # Rate limiting
│   └── validation.js     # Request validation
├── utils/
│   ├── languageUtils.js  # Language utilities
│   └── fallbackAnalysis.js # Fallback analysis
└── README.md             # This file
```

## 🚀 **Key Improvements**

### **1. Modular Architecture**

- **Separation of Concerns**: Each module has a single responsibility
- **Maintainable Code**: Easy to update and extend individual components
- **Testable**: Each module can be unit tested independently
- **Scalable**: Easy to add new features and endpoints

### **2. Enhanced Error Handling**

- **Global Error Handler**: Centralized error processing
- **Specific Error Types**: Different handling for validation, AI, and system errors
- **Production Safety**: Sensitive error details hidden in production
- **Structured Responses**: Consistent error response format

### **3. Request Validation**

- **Input Sanitization**: Validates all incoming requests
- **Type Checking**: Ensures correct data types
- **Length Limits**: Prevents oversized requests
- **Email Validation**: Proper email format checking

### **4. Performance & Security**

- **Rate Limiting**: Prevents API abuse (100 requests per 15 minutes)
- **Request Logging**: Detailed request/response logging with timing
- **Memory Monitoring**: Health endpoint shows memory usage
- **CORS Configuration**: Proper cross-origin request handling

### **5. Dual AI Provider System**

- **Primary Provider**: DigitalOcean Gradient AI with Llama 3.3-70B model
- **Fallback Provider**: Static analysis for reliability
- **Intelligent Routing**: Automatic provider switching with error handling
- **Service Layer**: Clean separation between routes and AI logic
- **Graceful Degradation**: Multiple fallback levels including static analysis
- **Multiple AI Methods**: Support for different AI operations across providers
- **Language Support**: Multi-language prompt generation

## 🤖 **AI Provider Architecture**

### **Dual Provider System**

The LegaliTea server implements a sophisticated dual AI provider system for maximum reliability and performance:

```
Client Request → AI Service Router → Provider Selection → Response Normalization → Client Response
                                   ↓
                    ┌─────────────────────────────────┐
                    │  Primary: DigitalOcean Gradient │
                    │  Model: Llama 3.3-70B          │
                    │  Timeout: 30s                   │
                    │  Max Retries: 3                 │
                    └─────────────────────────────────┘
                                   ↓ (on failure)
                    ┌─────────────────────────────────┐
                    │  Fallback: Static Analysis      │
                    │  Pre-built responses            │
                    │  Timeout: 25s                   │
                    │  Max Retries: 2                 │
                    └─────────────────────────────────┘
                                   ↓ (on failure)
                    ┌─────────────────────────────────┐
                    │  Static Fallback Analysis       │
                    │  Pre-built responses            │
                    │  Always available               │
                    └─────────────────────────────────┘
```

### **Provider Features**

#### **DigitalOcean Gradient AI (Primary)**

- **Model**: Llama 3.3-70B Instruct
- **Strengths**: Advanced reasoning, legal domain knowledge, cost-effective
- **Use Cases**: Complex legal analysis, detailed explanations, scenario generation
- **Configuration**: Requires `DIGITALOCEAN_ACCESS_TOKEN`

#### **Static Analysis (Fallback)**

- **Type**: Pre-built analysis templates
- **Strengths**: Always available, no API dependencies, instant response
- **Use Cases**: Fallback when AI service is unavailable
- **Configuration**: No configuration required

### **Intelligent Routing Logic**

```javascript
// Provider selection algorithm
async function selectProvider(requestType) {
  if (gradientAvailable && !isRateLimited("gradient")) {
    return "gradient";
  } else {
    return "static";
  } else {
    return "static";
  }
}
```

### **Error Handling & Fallbacks**

- **Network Errors**: Automatic retry with exponential backoff
- **Rate Limiting**: Switch to alternative provider
- **Invalid Responses**: Response validation and re-routing
- **Timeouts**: Cancel request and fallback to next provider
- **Authentication Errors**: Log error and switch providers immediately

## 🔧 **API Endpoints**

### **Health Endpoints**

```
GET /api/health          # Basic health check
GET /api/health/detailed # Detailed system information
```

### **Analysis Endpoints**

```
POST /api/analyze           # Main document analysis
POST /api/explain-term      # Term explanation
POST /api/generate-scenarios # Scenario generation
POST /api/generate-quiz     # Quiz generation
POST /api/save              # Save analysis
```

## 📊 **Request/Response Examples**

### **Document Analysis**

```javascript
// Request
POST /api/analyze
{
  "text": "This is a legal document...",
  "documentType": "contract",
  "language": "en"
}

// Response
{
  "summary": { ... },
  "keyInformation": { ... },
  "riskAssessment": { ... },
  "actionPlan": [ ... ],
  // ... additional analysis data
}
```

### **Term Explanation**

```javascript
// Request
POST /api/explain-term
{
  "term": "indemnify",
  "context": "The contractor shall indemnify...",
  "documentType": "contract",
  "language": "en"
}

// Response
{
  "term": "indemnify",
  "definition": "To protect someone from legal responsibility...",
  "contextualDefinition": "In this contract context...",
  "category": "legal",
  "complexity": "intermediate",
  "examples": [ ... ],
  "relatedTerms": [ ... ]
}
```

## 🛡️ **Security Features**

### **Rate Limiting**

- **Window**: 15 minutes
- **Limit**: 100 requests per IP
- **Headers**: Rate limit info in response headers
- **Memory Store**: In-memory storage (use Redis in production)

### **Input Validation**

- **Text Length**: Maximum 50,000 characters
- **Required Fields**: Validates required parameters
- **Type Checking**: Ensures correct data types
- **Email Format**: Validates email addresses

### **Error Handling**

- **Sanitized Errors**: No sensitive information exposed
- **Status Codes**: Proper HTTP status codes
- **Logging**: All errors logged for debugging
- **Fallback**: Graceful degradation when services fail

## 🔄 **Development Workflow**

### **Starting the Server**

```bash
# Development
npm run server

# Production
NODE_ENV=production npm run server
```

### **Environment Variables**

```env
# Required
DIGITALOCEAN_ACCESS_TOKEN=your_digitalocean_access_token
# GEMINI_API_KEY=your_gemini_api_key  # No longer needed

# Optional
NODE_ENV=development
PORT=3001
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

### **Adding New Endpoints**

1. Create route handler in `routes/`
2. Add validation middleware in `middleware/validation.js`
3. Implement business logic in `services/`
4. Add error handling as needed
5. Update this documentation

### **Adding New AI Features**

1. Add method to `aiService.js` with dual provider support
2. Create prompt builder method compatible with both AI providers
3. Implement provider routing logic (Gradient → Static fallback)
4. Add route handler with error handling
5. Add validation middleware
6. Test with all fallback scenarios (provider failures, timeouts, invalid responses)

## 📈 **Monitoring & Logging**

### **Request Logging**

- **Format**: `timestamp - METHOD path - STATUS - duration`
- **Colors**: Green for success, red for errors
- **Timing**: Response time in milliseconds

### **Health Monitoring**

- **Basic**: Status, uptime, version
- **Detailed**: Memory usage, system info, service status
- **AI Providers**: DigitalOcean Gradient AI connection status
- **Provider Performance**: Response times and success rates for each AI provider
- **Fallback Tracking**: Monitor provider switching frequency and reasons

### **Error Tracking**

- **Console Logging**: All errors logged to console
- **Stack Traces**: Available in development mode
- **Error Categories**: Validation, AI service, system errors

## 🧪 **Testing**

### **Manual Testing**

```bash
# Health check
curl http://localhost:3001/api/health

# Document analysis
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"text":"Sample legal text","language":"en"}'
```

### **AI Provider Testing**

```bash
# Test with DigitalOcean Gradient AI (primary)
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"text":"Sample contract text","language":"en"}'

# Test provider fallback (remove DIGITALOCEAN_ACCESS_TOKEN temporarily)
unset DIGITALOCEAN_ACCESS_TOKEN
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"text":"Sample contract text","language":"en"}'

# Test all providers failing (remove both API keys)
unset DIGITALOCEAN_ACCESS_TOKEN
# unset GEMINI_API_KEY  # No longer needed
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"text":"Sample contract text","language":"en"}'
```

### **Error Testing**

```bash
# Rate limiting
for i in {1..105}; do curl http://localhost:3001/api/health; done

# Validation errors
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{}'

# Provider-specific errors
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"text":"","language":"invalid"}'
```

## 🚀 **Production Deployment**

### **Environment Setup**

```bash
# Set production environment
export NODE_ENV=production

# Set API keys
# export VITE_GEMINI_API_KEY=your_production_key  # No longer needed

# Start server
npm run server
```

### **Production Considerations**

- **AI Provider Management**: Monitor usage quotas and costs for both providers
- **Rate Limiting**: Use Redis for distributed rate limiting across providers
- **Logging**: Use structured logging (Winston, Bunyan) with provider-specific metrics
- **Monitoring**: Add APM tools (New Relic, DataDog) with AI provider performance tracking
- **Load Balancing**: Use nginx or cloud load balancers with health checks
- **Database**: Implement proper Supabase integration
- **Caching**: Add Redis for response caching and provider status caching
- **Failover Strategy**: Implement circuit breakers for AI provider failures

## 🔮 **Future Enhancements**

### **Planned Features**

- **Database Integration**: Full Supabase implementation
- **User Authentication**: JWT-based auth system
- **File Upload**: Direct file upload handling
- **Caching**: Redis-based response caching
- **WebSocket**: Real-time analysis updates
- **Metrics**: Prometheus/Grafana monitoring

### **Scalability Improvements**

- **Microservices**: Split into smaller services
- **Queue System**: Background job processing
- **CDN Integration**: Static asset delivery
- **Auto-scaling**: Kubernetes deployment
- **Multi-region**: Global deployment strategy

---

This refactored server architecture provides a solid foundation for the LegaliTea application with improved maintainability, security, and scalability.
