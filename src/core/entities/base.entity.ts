import { Document } from 'mongoose';
import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class BaseEntity extends Document {
  @Prop({ type: Date })
  createdAt: Date;
  @Prop({ type: Date })
  updatedAt: Date;
}
