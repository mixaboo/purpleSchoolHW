import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Types } from 'mongoose';

export interface ScheduleModel extends Base {}
export class ScheduleModel extends TimeStamps {
  @prop()
  reservationDate: Date;

  @prop()
  active: boolean;

  @prop()
  paid: boolean;

  @prop({ type: () => Types.ObjectId })
  roomId: Types.ObjectId;

  @prop()
  deletedAt: Date;
}
