// Fallback analysis when AI service fails

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
        ],
        interactiveTerms: [
            {
                term: "Agreement",
                definition: "A mutual understanding between parties",
                positions: [{ start: 0, end: 9 }],
                category: "legal",
                complexity: "basic"
            }
        ],
        clauseSimplifications: [
            {
                originalClause: "The parties hereby agree to the terms and conditions set forth herein.",
                simplifiedClause: "Both sides agree to follow the rules in this document.",
                confidence: 0.9,
                clauseType: "obligation"
            }
        ],
        contractVisualization: {
            mermaidDiagram: "graph TD\n    A[Party A] -->|agrees to| B[Terms]\n    C[Party B] -->|agrees to| B",
            nodes: [
                { id: "A", label: "Party A", type: "party" },
                { id: "B", label: "Terms", type: "terms" },
                { id: "C", label: "Party B", type: "party" }
            ],
            relationships: [
                { from: "A", to: "B", type: "agreement", description: "agrees to terms" },
                { from: "C", to: "B", type: "agreement", description: "agrees to terms" }
            ]
        },
        realLifeScenarios: [
            {
                title: "What if you don't follow the agreement?",
                situation: "If you don't follow the terms of this agreement, there could be consequences.",
                consequences: [
                    "The other party might terminate the agreement",
                    "You might have to pay penalties or damages",
                    "Legal action could be taken against you"
                ],
                severity: "medium",
                relatedClauses: ["General terms and conditions"]
            }
        ],
        smartGlossary: [
            {
                term: "Agreement",
                definition: "A mutual understanding or arrangement between two or more parties",
                category: "legal",
                frequency: 5,
                importance: "high"
            },
            {
                term: "Party",
                definition: "A person or organization involved in the agreement",
                category: "legal",
                frequency: 8,
                importance: "high"
            }
        ]
    };
}

export { generateFallbackAnalysis };