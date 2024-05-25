declare namespace Express {
    import { User } from './models/user';
    export interface Request {
      user?: User;
      // Alse tried as 
      // user: string
      // user?: string
      // user: any ...
    }
}