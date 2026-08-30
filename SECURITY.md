# Security and production requirements

This project must treat the server as the source of truth for identity, authorization, Premium access, and administrator privileges.

## Required rules

- Never trust `usuario_premium`, `role`, user IDs, payment status, or other authorization flags supplied by the browser.
- API credentials (`GEMINI_API_KEY`, `ELEVENLABS_API_KEY`) and session secrets must remain server-side and must never be committed.
- Authentication must be backed by a real identity/user store. Do not use `localStorage` as the source of truth for authentication or authorization.
- Passwords must only be stored as strong password hashes (never plaintext).
- Premium access must be derived server-side from the authenticated user and a trusted subscription/payment state.
- Administrative endpoints must enforce authorization on the server and return `403` for authenticated users without the required role.
- Sensitive anamnesis data must be minimized, validated, access-controlled, and excluded from unnecessary logs.
- Production APIs must use request-size limits, validation, rate limiting, secure HTTP headers, and safe error responses.
- Payment webhooks must verify the provider's signature before changing subscription state.

## Production gate

Do not declare the application production-ready until automated tests demonstrate that a Free user cannot obtain Premium data by modifying browser state or request parameters, and that a non-admin cannot access administrative endpoints.
