import { Injectable } from '@nestjs/common';

@Injectable()
export class ScheduleService {
  constructor() {}

  async get(scheduleId): Promise<any> {
    return false;
  }

  async delete(scheduleId): Promise<any> {
    return false;
  }

  async create(schedule): Promise<any> {
    return false;
  }
}
