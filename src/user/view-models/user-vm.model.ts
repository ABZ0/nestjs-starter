import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { BaseVm } from 'src/core/models';

export class UserVm extends BaseVm {
  email: string;
  name: string;
  emailVerified: boolean;
  @Exclude()
  @ApiHideProperty()
  hash;
}
