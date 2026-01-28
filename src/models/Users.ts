// USER MODEL - User interface

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  active: boolean;
  photo?: string; // Base64 encoded image
}