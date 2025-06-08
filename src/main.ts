import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // удаляет не определённые в DTO свойства
      forbidNonWhitelisted: true, // выбрасывает ошибку при наличии лишних свойств
      transform: true, // автоматически преобразует примитивы
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
