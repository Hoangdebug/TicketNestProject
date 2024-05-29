declare namespace Express {
  import { User } from './models/user';
  export interface Request {
    user?: User;
    files?: any;
  }
}