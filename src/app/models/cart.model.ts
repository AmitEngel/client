import { CartItemModel } from './cart-item.model';

export class CartModel {
  constructor(
    public items: CartItemModel[],
    public _id?: string,
    public owner?: string,
    public dateCreated?: Date,
  ) {}
}
