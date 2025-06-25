export const getVerificationEmailHtml = (token: string): string => {
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? process.env.FRONTEND_URL_DEV
      : process.env.FRONTEND_URL_PROD;

  return `
      <html>
        <body>
          <h1>Welcome to Essex Auto Works!</h1>
          <p>Please <a href="${baseUrl}/auth/verify-email/${token}">click here to verify your email</a>.</p>
          <p>This link will expire in 1 hour.</p>
        </body>
      </html>
    `;
};
