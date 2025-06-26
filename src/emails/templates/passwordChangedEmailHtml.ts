export const getPasswordChangedHtml = (name: string): string => {
  return `
      <html>
        <body>
          <h1>Hi ${name}!</h1>
          <p>Your password was recently changed. If this wasn't you, please reset your password immediately.</p>
          <p>If it was you, no further action is needed. You can now log in with your new password.</p>
        </body>
      </html>
    `;
};
