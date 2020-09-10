import { Transform } from 'class-transformer';
import { CombinedVm } from 'src/core/models';
import { User } from '../models';
import { UserVm } from './user-vm.model';

export class UserPaginationVm extends CombinedVm {
  @Transform((val: User) => new UserVm(val))
  content: UserVm[];
  count: number;
}
