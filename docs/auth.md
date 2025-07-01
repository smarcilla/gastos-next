# Authentication

This project uses **NextAuth v5** with the Google provider. Sessions use the
`jwt` strategy and last for one hour. The JWT is rotated on every request
(`updateAge: 0`).

To run the app you must provide the following environment variables:

```
GOOGLE_CLIENT_ID=<your client id>
GOOGLE_CLIENT_SECRET=<your client secret>
```

The authentication endpoints are exposed under `/api/auth/*` by the
`src/nextauth.ts` configuration.
