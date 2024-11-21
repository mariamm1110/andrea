import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {

  constructor(

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ){}


  async create(CreateUserDto: CreateUserDto) {
    
    
    try {
      const {password, roles, ...userData}= CreateUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      await this.userRepository.save(user);
      delete user.password;

      return {
        ...user,
        token: this.getJwtToken({id: user.id, roles: user.roles})
      };
    }catch(error){
      this.handleDBErrors(error);
    }
  }

  async login (loginUserDto: LoginUserDto){

    const {password, email}=loginUserDto

    const user = await this.userRepository.findOne({

      where: {email},

      select: {email: true, password: true, id: true, roles: true}
    });

    if(!user)
      throw new UnauthorizedException('not valid credentials');

    if(!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('not valid credentials');

    return {
      ...user,
      token: this.getJwtToken({id: user.id, roles: user.roles})
    }
  }

  async checkAuthStatus(user: User){
    return {
      ...user,
      token:this.getJwtToken({id: user.id, roles: user.roles})
    };

  }

  private getJwtToken(payload: JwtPayload){

    const token = this.jwtService.sign(payload);
    return token;

  }

  private handleDBErrors(error:any): never{
    if(error.code === '23505')
      throw new BadRequestException(error.detail)
    console.log(error)

    throw new InternalServerErrorException('pls check your logs')
  }
}
