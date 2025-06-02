export enum RoomViews {
  Garden,
  Seaside,
  Backyard,
  Pool,
}

export class RoomModel {
  _id: string;
  number: number;
  size: number;
  bedsCount: number;
  view: RoomViews;
  babyBedAvailable: boolean;
}
