import { User } from 'src/modules/users/entities/user.entity';
import { House } from 'src/modules/houses/entities/house.entity';

declare global {
  namespace Express {
    interface Request {
      currentUser?: User | null;
      currentHouse?: House | null;
    }
  }
}
