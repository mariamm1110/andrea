import { Module } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { PhotosController } from './photos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Photo } from './entities/photo.entity';
import { Model } from 'src/models/entities/model.entity';

@Module({

  imports: [
    TypeOrmModule.forFeature([Photo, Model, Event])
  ],
  controllers: [PhotosController],
  providers: [PhotosService],
})
export class PhotosModule {}
