import { UpdateProductComponent } from './../update-product/update-product.component';
import { ProductService } from './../../../../services/product.service';
import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Product, ProductTypes } from 'src/app/interfaces/product';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-maintain-product',
  templateUrl: './maintain-product.component.html',
  styleUrls: ['./maintain-product.component.scss']
})
export class MaintainProductComponent implements AfterViewInit {

  Products: any;

  displayedColumns: string[] = ['productBarcode','productName', 'productDescription', 'productType', 'productImage', 'inventoryProduct', 'update'];
  dataSource = new MatTableDataSource<Product>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private ProductService : ProductService,private formBuilder: FormBuilder, public dialog: MatDialog) { }

  observeTypes: Observable<ProductTypes[]> = this.ProductService.getproductTypes();
  typesData: ProductTypes[];
  selectedOption : number;

  // mode = 'indeterminate';
  // value = 50;
  // displayProgressSpinner = false;
  // spinnerWithoutBackdrop = false;
  // // Display progress spinner for 4 secs on click of button
  // showProgressSpinner = () => {
  //   this.displayProgressSpinner = true;
  //   setTimeout(() => {
  //     this.displayProgressSpinner = false;
  //   }, 4000);
  // };


  ngOnInit(): void {

    this.observeTypes.subscribe(data => {
      this.typesData = data;
      console.log(this.typesData);
    }, (err: HttpErrorResponse) => {
      console.log(err);
    });
    this.selectedOption = 1;
    this.getProducts(this.selectedOption);

  }


  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

   //all products (based on type)
  getProducts(selected : number)
  {
    if(selected == 1)
    {
      this.ProductService.getProducts().subscribe(res=>
        {
          this.Products = res;
          console.log(this.Products);
          //add 'data' in order to filter
          this.dataSource.data = this.Products;

        })
    }
    else if(selected == 2)
    {
      this.ProductService.getIngredients().subscribe(res=>
        {
          this.Products = res;
          console.log(this.Products);
          //add 'data' in order to filter
          this.dataSource.data = this.Products;

        })
    }
    else if(selected == 3)
    {
      this.ProductService.getPackages().subscribe(res=>
        {
          this.Products = res;
          console.log(this.Products);
          //add 'data' in order to filter
          this.dataSource.data = this.Products;

        })
    }
    else if(selected == 4)
    {
      this.ProductService.getDesserts().subscribe(res=>
        {
          this.Products = res;
          console.log(this.Products);
          //add 'data' in order to filter
          this.dataSource.data = this.Products;

        })
    }
    else if(selected == 5)
    {
      this.ProductService.getSides().subscribe(res=>
        {
          this.Products = res;
          console.log(this.Products);
          //add 'data' in order to filter
          this.dataSource.data = this.Products;
        })
    }
  }

  //For Update
  viewProductUpdate: any;
  getOneProduct(ProductName: string)
  {
    return this.ProductService.getOneProduct(ProductName).subscribe(res => {
      this.viewProductUpdate = res;
      console.log ("View Product Update ", this.viewProductUpdate)
      const dialogRef = this.dialog.open(UpdateProductComponent, {
       disableClose: true,
       width: '1300px',
       height: '460px',
       data:{
            ProductId : this.viewProductUpdate.productId,
            ProductName : this.viewProductUpdate.productName,
            ProductBarcode: this.viewProductUpdate.productBarcode,
            ProductDescription : this.viewProductUpdate.productDescription,
            ProductImage : this.viewProductUpdate.productImage,
            ProductNames : this.viewProductUpdate.productNames,
            Quantities : this.viewProductUpdate.quantities,
            ProductTypeId: this.viewProductUpdate.productTypeId,
            ProductStatusId: this.viewProductUpdate.productStatusId
          }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');

     });


    });
  }

}
