import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 })
});
export {
  users
};
