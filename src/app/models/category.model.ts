import { ItemModel } from "./item.model";

export enum Categorys {
  'milk & eggs' = 'Milk & Eggs',
  'meat & fish' = 'Meat & Fish',
  'fruits & vegetables' = 'Fruits & Vegetables'
}

export interface Category {
  name: ItemModel["category"]
}
