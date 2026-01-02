/**
 * Sanitizes a string by replacing characters that could be used for XSS attacks.
 * If the input is not a string, it is returned unchanged.
 * @param input The value to sanitize.
 * @returns The sanitized string, or the original value if not a string.
 */
export function sanitizeInput<T>(input: T): T {
  if (typeof input !== 'string') {
    return input;
  }

  const map: { [key: string]: string } = {
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '&': '&amp;',
  };

  const reg = /[<>"'/&]/ig;
  return input.replace(reg, (match) => map[match]) as T;
}


/**
 * Sanitizes an object by recursively sanitizing all its string values.
 * Preserves the type of the input object.
 * @param obj The object to sanitize.
 * @returns The sanitized object.
 */
export function sanitizeObject<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') {
        return sanitizeInput(obj);
    }

    if (Array.isArray(obj)) {
        return obj.map(item => sanitizeObject(item)) as T;
    }

    const sanitizedObj = { ...obj };
    for (const key in sanitizedObj) {
        if (Object.prototype.hasOwnProperty.call(sanitizedObj, key)) {
            const value = sanitizedObj[key];
            sanitizedObj[key] = sanitizeObject(value);
        }
    }
    return sanitizedObj;
}
