export const getTokenTimeRemaining = (tokenDate: Date) => {
  const expiresAt = new Date(tokenDate);
  const timeNow = new Date();
  return expiresAt.getTime() - timeNow.getTime();
};

//Slow down malicious requests.
export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
