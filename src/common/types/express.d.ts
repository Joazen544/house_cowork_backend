import { User } from '../../modules/users/entities/user.entity';
import { House } from '../../modules/houses/entities/house.entity';

declare global {
  namespace Express {
    interface Request {
      currentUser?: User | null;
      currentHouse?: House | null;
    }
  }
}
