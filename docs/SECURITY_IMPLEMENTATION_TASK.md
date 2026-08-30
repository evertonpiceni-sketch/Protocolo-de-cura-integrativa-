# Security integration task

Work only on `security-hardening-2026-08-30` until verification is complete.

## Required implementation

1. Supabase Auth is the source of authenticated identity.
2. Server-side authorization reads `profiles` using the authenticated user id.
3. Premium access is granted only when `profiles.plan = 'pro'`.
4. Admin access is granted only when `profiles.role = 'admin'`.
5. Ignore client-provided `usuario_premium`, `isPremium`, `role`, `plan`, and `userId` for authorization.
6. Remove legacy authentication/password storage from localStorage/sessionStorage.
7. Keep Gemini, ElevenLabs, Supabase service-role and other secrets server-side only.
8. Add Helmet/security headers, restrictive CORS, rate limiting and request-size limits.
9. Validate critical request bodies with Zod (or equivalent).
10. Do not log complete anamnesis or other sensitive personal data.
11. Ensure anamnesis endpoints operate only on the authenticated user's data.
12. Ensure ordinary users cannot change their own `role` or `plan` through client-accessible database operations.
13. Do not simulate payment. Premium must not be unlocked by a client-side payment flag.
14. Run build/lint/audit and authorization bypass tests before merging.

## Required verification

- unauthenticated request to protected endpoint is rejected;
- normal authenticated user cannot access admin endpoint;
- normal authenticated user cannot obtain Premium by sending `usuario_premium=true`;
- normal authenticated user cannot change `role=user` to `admin`;
- normal authenticated user cannot change `plan=free` to `pro`;
- oversized/malformed payloads are rejected;
- rate limiting works;
- no real secrets are committed;
- no authentication credentials remain in browser storage;
- `usuario_premium` is not an authorization source;
- production build succeeds.

Do not claim completion unless the implementation and verification are both demonstrable.