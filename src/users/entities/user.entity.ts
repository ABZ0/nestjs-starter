import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from 'src/core/entities';
import { toHash } from 'src/core/utils';

@Schema({ timestamps: true, id: false, versionKey: false })
export class User extends BaseEntity {
  @Prop({ type: String, required: true, unique: true, index: true })
  email: string;
  @Prop({ type: String, required: true, set: (val: string) => toHash(val) })
  password: string;
  @Prop({ type: Boolean, default: false })
  emailVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
