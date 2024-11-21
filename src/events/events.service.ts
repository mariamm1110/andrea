import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { handleDBExceptions } from 'src/common/exceptions/db-exception-handler';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Event } from './entities/event.entity';
import { Model } from 'src/models/entities/model.entity';
import { Photo } from 'src/photos/entities/photo.entity';
import { PhotosController } from 'src/photos/photos.controller';

@Injectable()
export class EventsService {

  private readonly logger =  new Logger('EventsService');

  constructor(
    @InjectRepository(Event) private readonly eventRepository: Repository<Event>,
    @InjectRepository(Model) private readonly modelRepository: Repository<Model>,
    @InjectRepository(Photo) private readonly userRepository: Repository<Photo>,
    @InjectRepository(Photo) private readonly photoRepository: Repository<Photo>

  ){}

  async create(createEventDto: CreateEventDto) {
    const { name, location, eventDate, modelIds, photoIds } = createEventDto;

    const event = this.eventRepository.create({ name, location, eventDate});

    if (modelIds && modelIds.length > 0) {
      const models = await this.modelRepository.findBy({ id: In(modelIds) });
      event.models = models;
    }

    if (photoIds && photoIds.length > 0) {
      const photos = await this.userRepository.findBy({ id: In(photoIds) });
      event.photos = photos;
    }

    try {
      await this.eventRepository.save(event);
      return event;
    } catch (error) {
      throw new BadRequestException('Error creating event', error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const {limit=10, offset=0}= paginationDto;

    const events= await this.eventRepository.find({
      take: limit,
      skip: offset,
      relations: ['models', 'photos'],
      
    });

    return events;

  }

  async findOne(term: string) {
    let event: Event;
    
    event = await this.eventRepository.findOne({
      where: { id: term },
      relations: ['models', 'photos']
    });

    if(!event)
      throw new NotFoundException(`Event with id ${term} not found`);

    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto) {

    const {modelIds, photoIds, ...rest} = updateEventDto;
    
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['models', 'photos']
    })

    if(!event) throw new NotFoundException(`Event with id ${id} not found`);

    Object.assign(event, rest);

    if (modelIds && modelIds.length > 0) {
      const models = await this.modelRepository.findBy({ id: In(modelIds) });
      event.models = models;
    }

    // Update the photos if photoIds are provided
    if (photoIds && photoIds.length > 0) {
        const photos = await this.photoRepository.findBy({ id: In(photoIds) });
        event.photos = photos;
    }

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
