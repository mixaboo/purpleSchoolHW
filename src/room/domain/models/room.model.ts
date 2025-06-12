import { RoomViews } from '../enums/room.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export class RoomCharacteristics {
  @Prop({ type: Number })
  size: number;

  @Prop({ type: Number })
  bedsCount: number;

  @Prop({ type: Boolean })
  babyBedAvailable: boolean;

  @Prop({ type: String, enum: RoomViews })
  view: RoomViews;
}

@Schema({ timestamps: true })
export class RoomModel {
  @Prop({ type: Number })
  number: number;

  @Prop({ type: String })
  roomType: string;

  @Prop({ type: () => [RoomCharacteristics], _id: false })
  characteristics: RoomCharacteristics;

  @Prop({ type: Date, default: null })
  deletedAt: Date;
}

export const RoomSchema = SchemaFactory.createForClass(RoomModel);
