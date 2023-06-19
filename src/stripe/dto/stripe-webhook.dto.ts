export class StripeWebhookDto {
  data: {
    object: {
      metadata: {
        orderId: string;
      };
    };
    id: string;
  };
  type: string;
}
