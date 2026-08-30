# Production security verification checklist

Before merging `security-hardening-2026-08-30` into `main`, verify all items below against the actual running application and server code.

- [ ] Supabase Auth is the only authentication authority.
- [ ] Protected server routes derive identity from the verified Supabase session/token.
- [ ] `usuario_premium`, client `isPremium`, client `plan`, client `role`, and client `userId` cannot grant authorization.
- [ ] Premium routes enforce `profiles.plan = 'pro'` server-side.
- [ ] Admin routes enforce `profiles.role = 'admin'` server-side.
- [ ] Users cannot update their own `role` or `plan` through browser-accessible database operations.
- [ ] No passwords or authentication tokens are stored in localStorage/sessionStorage.
- [ ] Gemini, ElevenLabs, Supabase service-role and other private keys exist only in server environment variables/secrets.
- [ ] Health/status endpoints do not expose secrets or sensitive configuration.
- [ ] Helmet/security headers are enabled.
- [ ] CORS allows only intended production origins.
- [ ] Rate limits cover authentication and expensive AI/audio endpoints.
- [ ] JSON/request size limits are appropriate for each endpoint.
- [ ] Zod (or equivalent) validates all security-sensitive request bodies.
- [ ] Anamnesis data is scoped to the authenticated user and is not written to normal logs.
- [ ] LGPD consent is collected before processing sensitive user information.
- [ ] Payment/webhook events are verified before changing Premium state.
- [ ] No fake authentication, hard-coded admin accounts, or simulated Premium unlock remain.
- [ ] `npm run build` passes.
- [ ] `npm run lint` passes, or remaining failures are documented and fixed before release.
- [ ] `npm audit` has no unresolved production-critical vulnerabilities.
- [ ] Repository search finds no real secrets.
- [ ] Repository search finds no security-sensitive use of `usuario_premium`.
- [ ] Unauthenticated protected requests return an authentication error.
- [ ] Non-admin users receive 403 from admin routes.
- [ ] Non-PRO users cannot access Premium resources.
- [ ] Forged client flags cannot bypass authorization.

Do not merge until every applicable item is verified.