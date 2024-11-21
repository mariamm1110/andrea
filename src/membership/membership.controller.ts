import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';

@Controller('membership')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Post(':userId/subscribe')
  subscribe(
    @Param('userId') userId:string,
    @Body('password') password: string
  ) {
    return this.membershipService.subscribe(userId, password);
  }

  @Post(':userId/unsubscribe')
  unsubscribe(@Param('userId') userId:string) {
    return this.membershipService.unsubscribe(userId);
  }

  @Get(':userId/content')
  @Auth(ValidRoles.hiddenUser)
  getExclusiveContent(@Param('userId') userId: string) {
    return this.membershipService.getExclusiveContent(userId);
  }
}
