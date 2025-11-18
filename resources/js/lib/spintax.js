// --- FRONTEND SPINTAX ENGINE ---

/**
 * Recursively expands ALL levels of spintax and returns a random result
 */
export function processSpintax(text) {
    // Keep processing until no more spintax patterns exist
    while (/\{([^{}]+)\}/.test(text)) {
        text = text.replace(/\{([^{}]+)\}/g, (_, options) => {
            const parts = options.split('|');
            return parts[Math.floor(Math.random() * parts.length)];
        });
    }
    return text;
}

/**
 * Count total spintax variations (recursive)
 */
/**
 * Count variations with support for nested spintax
 */
export function countVariations(text) {
    const stack = [1]; // Stack to track multiplication at each nesting level
    let currentOptions = 1;
    let depth = 0;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];

        if (char === '{') {
            if (depth > 0) {
                stack.push(1); // New nesting level
            }
            depth++;
            currentOptions = 1;
        } else if (char === '}') {
            depth--;
            if (depth === 0) {
                stack[stack.length - 1] *= currentOptions;
            } else {
                const nested = stack.pop() * currentOptions;
                currentOptions = nested;
            }
        } else if (char === '|' && depth > 0) {
            currentOptions++;
        }
    }

    return stack[0];
}
/**
 * Generate N unique spintax samples
 */
export function generateSamples(text, count = 100) {
    const samples = new Set();
    let attempts = 0;
    const maxAttempts = count * 10;

    while (samples.size < count && attempts < maxAttempts) {
        const variation = processSpintax(text);
        samples.add(variation);
        attempts++;
    }

    return [...samples];
}
