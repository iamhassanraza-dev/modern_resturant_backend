/**
 * Enhanced Password Validation Utility
 * Provides comprehensive password validation with multiple security checks
 */

/**
 * Validate password strength and return errors if any
 * @param {string} password - Password to validate
 * @returns {{ valid: boolean, errors: string[] }}
 */
function isStrongPassword(password) {
    const errors = [];

    // Basic validation
    if (!password || typeof password !== 'string') {
        errors.push("Password must be a non-empty string.");
        return { valid: false, errors };
    }

    // Length check (minimum 8, maximum 128)
    if (password.length < 8) {
        errors.push("Password must be at least 8 characters long.");
    } else if (password.length > 128) {
        errors.push("Password must not exceed 128 characters.");
    }

    // Character type requirements
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>[\]\\|`~]/.test(password);
    const hasSpaces = /\s/.test(password);

    if (!hasUppercase) errors.push("Password must include at least one uppercase letter.");
    if (!hasLowercase) errors.push("Password must include at least one lowercase letter.");
    if (!hasNumbers) errors.push("Password must include at least one number.");
    if (!hasSpecialChars) errors.push("Password must include at least one special character.");
    if (hasSpaces) errors.push("Password must not contain spaces.");

    // Common password check
    const commonPasswords = [
        'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
        'admin', 'letmein', 'welcome', 'monkey', '1234567890', 'dragon',
        'master', 'hello', 'freedom', 'whatever', 'qazwsx', 'trustno1',
        'jordan', 'jennifer', 'zxcvbnm', 'asdfgh', 'hunter', 'buster',
        'soccer', 'harley', 'andrew', 'tigger', 'sunshine', 'iloveyou',
        '2000', 'charlie', 'robert', 'thomas', 'hockey', 'ranger',
        'daniel', 'starwars', 'klaster', '112233', 'george', 'computer',
        'michelle', 'jessica', 'pepper', '1234', 'zxcvbn', '555555',
        '111111', '131313', '777777', 'pass', 'maggie',
        '159753', 'aaaaaa', 'ginger', 'princess', 'joshua', 'cheese',
        'amanda', 'summer', 'love', 'ashley', 'nicole', 'chelsea',
        'biteme', 'matthew', 'access', 'yankees', '987654321', 'dallas',
        'austin', 'thunder', 'taylor', 'matrix', 'mobilemail', 'mom',
        'preston', 'scooter', 'raiders', 'merlin', 'teamo',
        'lakers', 'andrea', 'knight', 'tigers', 'purple', 'superman',
        'mickey', 'shadow', 'melissa', '121212', 'patrick', 'hannah',
        '123123', 'sarah', 'danielle', 'brittany', 'samantha',
        'elizabeth', 'stephanie', 'lauren', 'rachel', 'emily', 'megan',
        'amber', 'crystal', 'tiffany', 'christina', 'heather',
        'password1', 'password12', 'password1234',
        'admin123', 'admin1234', 'root123', 'root1234',
        'user123', 'user1234', 'test123', 'test1234',
        'guest123', 'guest1234', 'demo123', 'demo1234',
        'temp123', 'temp1234', 'temp12345', 'temp123456',
        'qwerty123', 'qwerty1234', 'qwerty12345', 'qwerty123456',
        'asdf123', 'asdf1234', 'asdf12345', 'asdf123456',
        'zxcv123', 'zxcv1234', 'zxcv12345', 'zxcv123456',
        '123456a', '123456ab', '123456abc', '123456abcd',
        'abcdef1', 'abcdef12', 'abcdef123', 'abcdef1234',
        'qwerty1', 'qwerty12', 'qwerty123', 'qwerty1234',
        'asdfgh1', 'asdfgh12', 'asdfgh123', 'asdfgh1234',
        'zxcvbn1', 'zxcvbn12', 'zxcvbn123', 'zxcvbn1234'
    ];

    if (commonPasswords.includes(password.toLowerCase())) {
        errors.push("Password is too common and easily guessable.");
    }

    // Sequential character check
    const sequences = [
        '123', '234', '345', '456', '567', '678', '789', '890',
        'abc', 'bcd', 'cde', 'def', 'efg', 'fgh', 'ghi', 'hij',
        'jkl', 'klm', 'lmn', 'mno', 'nop', 'opq', 'pqr', 'qrs',
        'rst', 'stu', 'tuv', 'uvw', 'vwx', 'wxy', 'xyz',
        'qwe', 'wer', 'ert', 'rty', 'tyu', 'yui', 'uio', 'iop',
        'asd', 'sdf', 'dfg', 'fgh', 'ghj', 'hjk', 'jkl',
        'zxc', 'xcv', 'cvb', 'vbn', 'bnm'
    ];
    const lowerPassword = password.toLowerCase();
    if (sequences.some(seq => lowerPassword.includes(seq))) {
        errors.push("Password contains sequential patterns (e.g., abc, 123).");
    }

    // Repeated character check
    if (/(.)\1{2,}/.test(password)) {
        errors.push("Password contains 3 or more repeating characters.");
    }

    // Keyboard pattern check
    const keyboardPatterns = [
        'qwerty', 'asdfgh', 'zxcvbn', 'qwertyuiop', 'asdfghjkl',
        'zxcvbnm', 'qwertyuiopasdfghjklzxcvbnm', '1234567890',
        'abcdefghijklmnopqrstuvwxyz'
    ];
    if (keyboardPatterns.some(pattern => lowerPassword.includes(pattern))) {
        errors.push("Password contains keyboard pattern (e.g., qwerty, asdfgh).");
    }

    // Personal information patterns
    const personalPatterns = [
        /\b(19|20)\d{2}\b/, // Years 1900-2099
        /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/i,
        /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i,
        /\b(birthday|birth|date|name|username|email)\b/i
    ];
    if (personalPatterns.some(pattern => pattern.test(password))) {
        errors.push("Password must not contain personal information (e.g., year, month, name).");
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

module.exports = {
    isStrongPassword
};
