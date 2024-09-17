import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { handleDBExceptions } from 'src/common/exceptions/db-exception-handler';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Model } from './entities/model.entity';
import { CreateModelDto } from './dto/create-model.dto';
import { UpdateModelDto } from './dto/update-model.dto';


@Injectable()
export class ModelsService {

  private readonly logger =  new Logger('ModelsService');

  constructor(
    @InjectRepository(Model)
    private readonly modelRepository: Repository<Model>,

  ){}

  async create(createModelDto: CreateModelDto) {
    try{

      
      const model = this.modelRepository.create({
        ...createModelDto
        
      });

      await this.modelRepository.save(model);
      return model;
    }catch(error){

      handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const {limit=10, offset=0}= paginationDto;

    const models= await this.modelRepository.find({
      take: limit,
      skip: offset,
      
    });

    return models;

  }

  async findOne(term: string) {
    let model: Model;
    
    model = await this.modelRepository.findOneBy({id: term});

    if(!model)
      throw new NotFoundException(`Model with id ${term} not found`);

    return model;
  }

  async update(id: string, updateModelDto: UpdateModelDto) {
    
    const model = await this.modelRepository.preload({id, ...updateModelDto});

    if(!model) throw new NotFoundException(`Model with id ${id} not found`);

    try{

      await this.modelRepository.save(model);

      return model;

    }catch(error){
      handleDBExceptions(error);
    }

    
  }

  async remove(id: string) {
    const model = await this.findOne(id);

    await this.modelRepository.remove(model);
  }

  async deleteAllModels(){
    const query = this.modelRepository.createQueryBuilder('model');

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

