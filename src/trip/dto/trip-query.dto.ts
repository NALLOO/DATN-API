import { OrderByEnum } from '../enum/order-by.enum';

export class TripQueryDTO {
  startProvinceId?: string;

  endProvinceId?: string;

  page?: string;

  limit?: string;

  orderBy?: OrderByEnum;

  date?: Date;

}
