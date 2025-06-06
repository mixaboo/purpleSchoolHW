import { RoomViews } from '../enums/room.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export class RoomCharacteristics {
  @Prop()
  size: number;

  @Prop()
  bedsCount: number;

  @Prop()
  babyBedAvailable: boolean;

  @Prop({ enum: RoomViews })
  view: RoomViews;
}

@Schema({ timestamps: true })
export class RoomModel {
  @Prop()
  number: number;

  @Prop()
  roomType: string;

  @Prop({ type: () => [RoomCharacteristics], _id: false })
  characteristics: RoomCharacteristics;

  @Prop({ default: null })
  deletedAt: Date;
}

export const RoomSchema = SchemaFactory.createForClass(RoomModel);
