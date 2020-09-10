import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseModel } from 'src/core/models';

@Schema({ timestamps: true, skipVersioning: true })
export class User extends BaseModel {
  @Prop({ type: String, unique: true, index: true, required: true })
  email: string;
  @Prop({ type: String, required: true })
  hash: string;
  @Prop({ type: String, required: true })
  name: string;
  @Prop({ type: Boolean, default: false })
  emailVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
