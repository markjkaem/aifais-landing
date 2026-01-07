## 2024-05-24 - Weak Origin Validation
**Vulnerability:** The codebase used `origin.includes(host)` to validate CSRF tokens/origins. This allowed attackers to bypass protection by registering domains that contained the target domain as a substring (e.g., `evil-target.com` bypasses `target.com`).
**Learning:** `String.prototype.includes` is insufficient for security validations involving domains or URLs.
**Prevention:** Always parse URLs using the `URL` API and strictly compare the `host` property. Ensure protocol validation is also included.
