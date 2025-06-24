import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './domain/models/user.model';
import { UserService } from './application/services/user.service';
import { UserController } from './presentation/controllers/user.controller';

@Module({
  providers: [UserService],
  controllers: [UserController],
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema, collection: 'User' },
    ]),
  ],
  exports: [UserService],
})
export class UserModule {}
