import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { FilesModule } from './files/files.module';
import { ModelsModule } from './models/models.module';
import { EventsModule } from './events/events.module';
import { PhotosModule } from './photos/photos.module';
import { Event } from './events/entities/event.entity';
import { Model } from './models/entities/model.entity';
import { Photo } from './photos/entities/photo.entity';
import { User } from './auth/entities/user.entity';
import { PaymentsModule } from './payments/payments.module';
import { MembershipModule } from './membership/membership.module';
import { AdminModule } from './admin/admin.module';



@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      entities: [Event, Model, Photo, User, Photo],
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    ProductsModule,
    FilesModule,
    ModelsModule,
    EventsModule,
    PhotosModule,
    PaymentsModule,
    MembershipModule,
    AdminModule,

  
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
