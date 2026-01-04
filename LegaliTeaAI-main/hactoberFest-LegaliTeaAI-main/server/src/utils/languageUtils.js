// Language mapping utilities

function getLanguageName(code) {
    const languages = {
        'en': 'English',
        'hi': 'Hindi',
        'kn': 'Kannada',
        'gu': 'Gujarati',
        'es': 'Spanish',
        'fr': 'French',
        'de': 'German',
        'it': 'Italian',
        'pt': 'Portuguese',
        'nl': 'Dutch',
        'ru': 'Russian',
        'zh': 'Chinese',
        'ja': 'Japanese',
        'ko': 'Korean',
        'ar': 'Arabic'
    };
    return languages[code] || 'English';
}

function getSupportedLanguages() {
    return [
        { code: 'en', name: 'English', nativeName: 'English' },
        { code: 'es', name: 'Spanish', nativeName: 'Español' },
        { code: 'fr', name: 'French', nativeName: 'Français' },
        { code: 'de', name: 'German', nativeName: 'Deutsch' },
        { code: 'it', name: 'Italian', nativeName: 'Italiano' },
        { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
        { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
        { code: 'ru', name: 'Russian', nativeName: 'Русский' },
        { code: 'zh', name: 'Chinese', nativeName: '中文' },
        { code: 'ja', name: 'Japanese', nativeName: '日本語' },
        { code: 'ko', name: 'Korean', nativeName: '한국어' },
        { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
        { code: 'ar', name: 'Arabic', nativeName: 'العربية' }
    ];
}

function isLanguageSupported(code) {
    const supportedCodes = getSupportedLanguages().map(lang => lang.code);
    return supportedCodes.includes(code);
}

export {
    getLanguageName,
    getSupportedLanguages,
    isLanguageSupported
};