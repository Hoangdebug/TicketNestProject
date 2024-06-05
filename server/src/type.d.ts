declare namespace Express {
  import { User } from './models/user';
  import { Event } from './models/event';
  import { Ticket } from './models/ticket';
  import { Order } from './models/order';

  export interface Request {
    user?: User;
    files?: any;
    event? : Event;
    ticket? : Ticket;
    order? : Order;
    seat?: Seat;
  }
}