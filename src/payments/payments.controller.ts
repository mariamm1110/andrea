import { BadRequestException, Body, Controller, Post, Req, Headers } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Request } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}


  @Post('create-checkout-session')
  async createCheckoutSession(@Body('items') items: any[]) {
    if (!items || items.length === 0) {
      throw new BadRequestException('No items provided for checkout session');
    }

    return this.paymentsService.createCheckoutSession(items);
  }

  
  @Post('webhook')
  async handleWebhook(
    @Req() req: Request,
    @Headers('stripe-signature') signature: string,
  ) {
    if (!signature) {
      throw new BadRequestException('Stripe signature is missing');
    }

    const rawBody = req.body  // Convert the raw body to a Buffer
    return this.paymentsService.handleWebhook(rawBody, signature);
  }
  
}
