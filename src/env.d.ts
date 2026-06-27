/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    runtime: {
      env: {
        DB: unknown;
        SESSION_SECRET: string;
        ADMIN_EMAIL: string;
        ADMIN_PASSWORD_HASH: string;
      };
    };
  }
}
