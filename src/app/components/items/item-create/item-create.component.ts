import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartItemModel } from 'src/app/models/cart-item.model';
import { Category } from 'src/app/models/category.model';
import { ItemModel } from 'src/app/models/item.model';
import { ShopService } from 'src/app/services/shop.service';


@Component({
  selector: 'app-item-create',
  templateUrl: './item-create.component.html',
  styleUrls: ['./item-create.component.css'],
})
export class ItemCreateComponent implements OnInit {
  item!: ItemModel;
  categories!: Category[]
  form!: FormGroup;
  itemId!: string | null;
  private mode = 'create';
  imagePreview!: string;
  authStatusSub!: Subscription;

  constructor(public shopService: ShopService, public route: ActivatedRoute) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, { validators: [Validators.required] }),
      price: new FormControl(null, { validators: [Validators.required] }),
      category: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, { validators: [Validators.required] }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('itemId')) {
        this.mode = 'edit';
        this.itemId = paramMap.get('itemId');
        this.shopService.getItemById(this.itemId!).subscribe((itemData) => {
          this.item = {
            _id: itemData._id,
            name: itemData.name,
            price: itemData.price,
            category: itemData.category,
            imagePath: itemData.imagePath,
          };
          this.form.setValue({
            name: this.item.name,
            price: this.item.price,
            category: this.item.category,
            image: this.item.imagePath,
          });
        });
      } else {
        this.mode = 'create';
        this.itemId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files?.item(0);
    this.form.patchValue({ image: file });
    this.form.get<string>('image')?.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file as Blob);
  }

  onItemAdd() {
    if (this.form.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.shopService.createItem(
        this.form.value.name,
        this.form.value.price,
        this.form.value.category,
        this.form.value.image
      );
    } else {
      this.shopService.updateItem(
        this.itemId!,
        this.form.value.name,
        this.form.value.price,
        this.form.value.category,
        this.form.value.image
      );
    }
    this.form.reset();
  }
}
