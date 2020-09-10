import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
import { ObjectId, toHexString } from '../utils';

export class BaseVm {
  @Transform((val: ObjectId) => toHexString(val))
  _id: string;
  updatedAt: Date;
  createdAt: Date;
  @Exclude()
  @ApiHideProperty()
  id;
  @ApiHideProperty()
  @Exclude()
  __v;

  constructor(partial: Partial<any>) {
    if (partial.toJSON) {
      Object.assign(this, partial.toJSON());
    } else {
      Object.assign(this, partial);
    }
  }
}
