import { Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class ScheduleModel {
  @Prop({ type: Date, required: true })
  reservationDate: Date;

  @Prop({ type: Boolean, default: true })
  active: boolean;

  @Prop({ type: Boolean })
  paid: boolean;

  @Prop({ type: () => Types.ObjectId, required: true })
  roomId: Types.ObjectId;

  @Prop({ type: Date, default: null })
  deletedAt: Date;
}

export const ScheduleSchema = SchemaFactory.createForClass(ScheduleModel);
