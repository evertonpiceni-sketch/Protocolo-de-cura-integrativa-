# Authentication → Premium/Admin contract

The application uses Supabase Auth as the persistent identity provider and the `profiles` table as the authorization record.

## Source of truth

- Identity: `auth.users.id`
- Application profile: `profiles.id` (foreign key to `auth.users.id`)
- Administrator: `profiles.role = 'admin'`
- Premium: `profiles.plan = 'pro'`

The browser may use identity state to render UI, but UI state is **not authorization**.

## Required server behavior

Every protected API must validate the authenticated Supabase session/token server-side and obtain the user id from that verified identity. The server must then read the user's profile/authorization data and decide whether the operation is allowed.

The following client-controlled values must never grant access:

- `usuario_premium`
- `isPremium`
- `role`
- `plan`
- arbitrary `userId` values supplied by the browser

Administrative routes must require `role = admin`. Premium routes must require `plan = pro` (and any future subscription expiry/status checks). User-owned data must be scoped to the verified authenticated user id.

## Migration rule

Until the server-side authorization middleware is connected to Supabase, the application must NOT claim that Premium or Admin protection is complete. The legacy localStorage authentication and hard-coded administrative credentials must be removed before production.
