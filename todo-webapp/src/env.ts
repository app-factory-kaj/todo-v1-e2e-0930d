// Typed read of window._env_, the platform's runtime config.
//
// todo-webapp has no sign-in and its one dependency (todo-api) is a sibling
// component reached same-origin at /api — never a window._env_ key (see
// react-webapp's Constraints: "There is no API_BASE_URL and no <UPSTREAM>_URL
// in window._env_ for a sibling service"). This app declares no
// `configurations.env` entries either, so there is nothing this SPA needs from
// the browser at all: the type is empty on purpose.
type Env = Record<string, never>;

declare global {
  interface Window {
    _env_: Env;
  }
}

if (!window._env_) {
  throw new Error(
    "window._env_ not set — /env-config.js failed to load. " +
      "The platform mounts this file; if you see this locally, host " +
      "/env-config.js from your dev server.",
  );
}

export const env: Env = window._env_;
