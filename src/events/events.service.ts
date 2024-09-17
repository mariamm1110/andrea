import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { handleDBExceptions } from 'src/common/exceptions/db-exception-handler';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Event } from './entities/event.entity';

@Injectable()
export class EventsService {

  private readonly logger =  new Logger('EventsService');

  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,

  ){}

  async create(createEventDto: CreateEventDto) {
    try{

      
      const event = this.eventRepository.create({
        ...createEventDto
        
      });

      await this.eventRepository.save(event);
      return event;
    }catch(error){

      handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const {limit=10, offset=0}= paginationDto;

    const events= await this.eventRepository.find({
      take: limit,
      skip: offset,
      
    });

    return events;

  }

  async findOne(term: string) {
    let event: Event;
    
    event = await this.eventRepository.findOneBy({id: term});

    if(!event)
      throw new NotFoundException(`Event with id ${term} not found`);

    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    
    const event = await this.eventRepository.preload({id, ...updateEventDto});

    if(!event) throw new NotFoundException(`Event with id ${id} not found`);

    try{

      await this.eventRepository.save(event);

      return event;

    }catch(error){
      handleDBExceptions(error);
    }

    
  }

  async remove(id: string) {
    const event = await this.findOne(id);

    await this.eventRepository.remove(event);
  }

  async deleteAllEvents(){
    const query = this.eventRepository.createQueryBuilder('event');

    try{

      return await query
      .delete()
      .where({})
      .execute();

    }catch(error){
      handleDBExceptions(error);
    }
  }

}
