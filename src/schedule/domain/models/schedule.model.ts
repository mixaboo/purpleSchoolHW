import { Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class ScheduleModel {
  @Prop()
  reservationDate: Date;

  @Prop({ default: true })
  active: boolean;

  @Prop()
  paid: boolean;

  @Prop({ type: () => Types.ObjectId, required: true })
  roomId: Types.ObjectId;

  @Prop({ default: null })
  deletedAt: Date;
}

export const ScheduleSchema = SchemaFactory.createForClass(ScheduleModel);
