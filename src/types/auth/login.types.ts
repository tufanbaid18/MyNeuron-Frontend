export type LoginRequest = {
  email: string;
  password: string;
};

export type ResetPasswordPayload = {
  token: string;
  new_password: string;
  confirm_password: string;
};
