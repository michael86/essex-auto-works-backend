export type User = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  passwordHash: string;
  role: string;
  emailVerified: boolean;
};
