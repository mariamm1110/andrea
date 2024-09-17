import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Model } from 'src/models/entities/model.entity';

@Module({
  imports: 
  [
    TypeOrmModule.forFeature([Event, Model])
  ],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
