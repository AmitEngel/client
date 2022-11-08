export interface OrderModel {
  _id?: string;
  owner: string;
  cartId: string;
  priceTotal: number;
  dateCreated: Date;
  city: string;
  street: string;
  desiredShippingDate: Date;
  lastFourDigits: number;
}
