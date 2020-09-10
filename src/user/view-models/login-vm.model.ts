import { Transform } from 'class-transformer';
import { CombinedVm } from 'src/core/models';
import { User } from '../models';
import { UserVm } from './user-vm.model';

export class LoginVm extends CombinedVm {
  @Transform((val: User) => new UserVm(val))
  user: UserVm;
  token: string;
}
