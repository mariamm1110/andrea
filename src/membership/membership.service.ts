import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class MembershipService {
    private readonly subscriptionPassword  = 'ElQueEnamoreAMiMujerYoLeEnamoroLaDeEl';

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService
    ){}

    async subscribe (userId: string, password: string) {

        console.log(`Received password: ${password}`);
        console.log(`Expected password: ${this.subscriptionPassword}`);


        const user = await this.userRepository.findOneBy({ id: userId});

        if (!user) throw new NotFoundException(`User with id ${userId} not found`);


        if(password !== this.subscriptionPassword) {
            throw new ForbiddenException('Invalid subscription password');
        }

        if (!user.roles.includes('hidden-user')) {
            user.roles = [...user.roles, 'hidden-user'];
        }

        await this.userRepository.save(user);

        const payload = {id: user.id, roles: user.roles };
        const newToken = this.jwtService.sign(payload);

        return { 
            message: `User ${user.fullName} has been suscribed`,
            token: newToken
        };
    }

    async unsubscribe (userId: string) {
        const user = await this.userRepository.findOneBy({ id:userId });

        if(!user) throw new NotFoundException(`User with id ${userId} not found`);

        if(user.roles.includes('hidden-user')){
            user.roles = user.roles.filter((role) => role !== 'hidden-user');
        }

        await this.userRepository.save(user);

        const payload = { id: user.id, roles: user.roles };
        const newToken = this.jwtService.sign(payload);

        return { 
            message: `User ${user.fullName} has been unsuscribed`,
            token: newToken
        };
    }

    async getExclusiveContent(userId: string) {
        const user = await this.userRepository.findOneBy({ id: userId});

        if (!user) {
            throw new NotFoundException(`User with id ${userId} not found`);
        }

        if(!user.roles.includes('hidden-user')) {
            throw new ForbiddenException('Access denied. You need a membership to access this content');
        }

        return { message: 'Welcome to the exclusive content'};
    }
}
