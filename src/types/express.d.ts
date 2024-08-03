import { User } from 'src/resources/users/entities/user.entity';
import { House } from 'src/houses/entities/house.entity';

declare global {
  namespace Express {
    interface Request {
      currentUser?: User | null;
      currentHouse?: House | null;
    }
  }
}
