/**
 * Basic model for the first step of register; contains the same attributes as the form does.
 */
export interface RegisterBasicModel {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}
