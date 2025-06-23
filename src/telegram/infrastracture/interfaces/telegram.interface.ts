import { ModuleMetadata } from '@nestjs/common';

export interface ITelegramOptions {
  chatId: string; //так как взаимодействуем только с 1 каналом
  token: string;
}

export interface ITelegramModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: any[]) => Promise<ITelegramOptions> | ITelegramOptions;
  inject?: any[];
}
