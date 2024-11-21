import { BadRequestException, Injectable } from '@nestjs/common';
import { Photo } from 'src/photos/entities/photo.entity';
import { Product } from 'src/products/entities/product.entity';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-10-28.acacia',
  });


  async createCheckoutSession(items: (Photo | Product)[]) {
    const lineItems = items.map((item) => {
      if (!item.title || !item.price) {
        throw new BadRequestException('Item must have a valid title and price');
      }

      let imageUrl: string | undefined;
      if( item instanceof Photo) {
        imageUrl = item.url;
      } else if (item instanceof Product && item.images && item.images.length > 0) {
        imageUrl = item.images[0].url;
      }

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.title,
            images: imageUrl ? [imageUrl] : [],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: 1,
      };
    });

    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: process.env.STRIPE_SUCCESS_URL,
        cancel_url: process.env.STRIPE_CANCEL_URL,
      });

      return { url: session.url };
    } catch (error) {
      throw new BadRequestException('Error creating checkout session', error.message);
    }
  }

  // Handle Stripe Webhook
  async handleWebhook(payload: Buffer, signature: string) {
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_ENDPOINT_SECRET,
      );

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Payment successful!', session);
        // Add custom business logic here
      } else {
        console.log(`Unhandled event type: ${event.type}`);
      }

      return { received: true };
    } catch (err) {
      console.error(`Webhook error: ${err.message}`);
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }
  }
}
