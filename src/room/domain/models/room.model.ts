import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { prop } from '@typegoose/typegoose';

export enum RoomViews {
  Garden,
  Seaside,
  Backyard,
  Pool,
}

export enum RoomTypes {
  Standard,
  Suite,
  Deluxe,
  Luxury,
}

export class RoomCharacteristics {
  @prop()
  size: number;

  @prop()
  bedsCount: number;

  @prop()
  babyBedAvailable: boolean;

  @prop({ enum: RoomViews })
  view: RoomViews;
}

export interface RoomModel extends Base {}
export class RoomModel extends TimeStamps {
  @prop()
  number: number;

  @prop()
  roomType: string;

  @prop({ type: () => [RoomCharacteristics], _id: false })
  characteristics: RoomCharacteristics;

  @prop()
  deletedAt: Date;
}
