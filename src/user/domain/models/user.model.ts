import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Roles } from '../enums/user.enum';

@Schema({ timestamps: true })
export class UserModel {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  phone: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: true })
  passwordHash: string;

  @Prop({ type: String, enum: Roles })
  role: string;

  @Prop({ type: Date, default: null })
  deletedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
