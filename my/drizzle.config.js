import { defineConfig } from "drizzle-kit";
var stdin_default = defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL
  }
});
export {
  stdin_default as default
};
