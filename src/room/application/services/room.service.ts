import { Injectable } from '@nestjs/common';

@Injectable()
export class RoomService {
  constructor() {}

  async get(roomId): Promise<any> {
    return false;
  }

  async delete(roomId): Promise<any> {
    return false;
  }

  async create(room): Promise<any> {
    return false;
  }
}
