import { Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export interface ScheduleWithInfo extends ScheduleModel {
  userInfo?: {
    name: string;
    phone: string;
  };
  roomInfo?: {
    roomNumber: number;
  };
}

@Schema({ timestamps: true })
export class ScheduleModel {
  _id: Types.ObjectId;

  @Prop({ type: Date, required: true })
  reservationDate: Date;

  @Prop({ type: Boolean, default: true })
  active: boolean;

  @Prop({ type: Boolean })
  paid: boolean;

  @Prop({ type: () => Types.ObjectId, ref: 'Room', required: true })
  roomId: Types.ObjectId;

  @Prop({ type: Date, default: null })
  deletedAt: Date;
}

export const ScheduleSchema = SchemaFactory.createForClass(ScheduleModel);
