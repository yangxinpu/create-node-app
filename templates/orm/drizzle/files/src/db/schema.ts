import { {{drizzleTableFn}}, {{drizzleIdImport}}, varchar } from '{{drizzleCoreModule}}'

export const users = {{drizzleTableFn}}('users', {
  id: {{drizzleIdColumn}},
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
})
