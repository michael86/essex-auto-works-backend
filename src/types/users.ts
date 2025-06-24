export type User = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  passwordHash: string;
  role: string;
  emailVerified: boolean;
};
