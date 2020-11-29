import { randomBytes } from 'crypto';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from 'src/core/entities';
import { Document, Types } from 'mongoose';
import { User } from './user.entity';

@Schema({ timestamps: true, skipVersioning: true, id: false })
export class EmailToken extends BaseEntity {
  @Prop({ default: randomBytes(32).toString('hex'), unique: true })
  code: string;
  @Prop({ type: Types.ObjectId, ref: User.name })
  userId: Types.ObjectId;

  get expired(): boolean {
    // valid for 1 day
    return (
      this.createdAt.getTime() < new Date().getTime() - 24 * 60 * 60 * 1000
    );
  }
}

export const EmailTokenSchema = SchemaFactory.createForClass(EmailToken);
