export const getTokenTimeRemaining = (tokenDate: Date) => {
  const expiresAt = new Date(tokenDate);
  const timeNow = new Date();
  return expiresAt.getTime() - timeNow.getTime();
};
