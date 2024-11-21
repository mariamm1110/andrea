import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Model } from 'src/models/entities/model.entity';
import { Photo } from 'src/photos/entities/photo.entity';
import { Event } from './entities/event.entity';

@Module({
  imports: 
  [
    TypeOrmModule.forFeature([Event, Model, Photo])
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService]
})
export class EventsModule {}
