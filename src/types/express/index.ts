export type ApiResponse<T = undefined> = {
  status: "SUCCESS" | "ERROR";
  message: string;
  code: string;
  data?: T;
};
