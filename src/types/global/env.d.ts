declare namespace NodeJS {
  interface ProcessEnv {
    DB_HOST: string;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    DB_PORT: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    PORT: string;
    NODE_ENV?: "production" | "development";
  }
}
