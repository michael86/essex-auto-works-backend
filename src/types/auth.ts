export type InsertUser = (
  firstname: string,
  lastname: string,
  email: string,
  password: string
) => Promise<string | null>;
