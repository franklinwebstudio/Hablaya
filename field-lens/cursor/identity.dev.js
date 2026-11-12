// JS twin of identity.dev.ts so Next/Turbopack can resolve the
// "./identity.dev.js" import from identity.ts during local development.
// Keep values in sync with identity.dev.ts. A published app never uses this.

export const DEV_VIEWER = {
  sub: "user:dev",
  email: "dev@example.com",
  name: "Dev Viewer",
  teamId: 1,
  teamRole: "admin",
};
