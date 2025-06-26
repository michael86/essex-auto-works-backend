export const getResetPasswordHtml = (name: string, token: string): string => {
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? process.env.FRONTEND_URL_DEV
      : process.env.FRONTEND_URL_PROD;

  return `
        <html>
          <body>
            <h1>Hi ${name}!</h1>
            <p>A Password reset request was received, if this wasn't you, please ignore this email.</p>
            <p>Please <a href="${baseUrl}/auth/reset-password/${token}">click here to reset your password</a>.</p>
            <p>This link will expire in 1 hour.</p>
          </body>
        </html>
      `;
};
