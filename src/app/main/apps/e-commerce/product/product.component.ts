import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';

import { Product } from 'app/main/apps/e-commerce/product/product.model';
import { EcommerceProductService } from 'app/main/apps/e-commerce/product/product.service';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { environment } from 'environments/environment';

@Component({
    selector     : 'e-commerce-product',
    templateUrl  : './product.component.html',
    styleUrls    : ['./product.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class EcommerceProductComponent implements OnInit, OnDestroy
{
    product: Product;
    pageType: string;
    productForm: FormGroup;
    fileToUpload;
    filestring = [] ;
    categoryList;
    selectedCategory = 2;
    baseUrl = environment.baseUrl;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {EcommerceProductService} _ecommerceProductService
     * @param {FormBuilder} _formBuilder
     * @param {Location} _location
     * @param {MatSnackBar} _matSnackBar
     */
    constructor(
        private _ecommerceProductService: EcommerceProductService,
        private _formBuilder: FormBuilder,
        private _location: Location,
        private _matSnackBar: MatSnackBar
    )
    {
        // Set the default
        this.product = new Product();

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }
    /*File uploading */
    msgs = [];
    
    uploadedFiles: any[] = [];
    handleFileInput(files: FileList): void {
        //  console.log(files);
          this.fileToUpload = files.item(0);
          console.log(this.fileToUpload);
          const reader = new FileReader();
          reader.onload = this._handleReaderLoaded.bind(this);
          reader.readAsBinaryString(files.item(0));
        }
        _handleReaderLoaded(readerEvt): void {
          const binaryString = readerEvt.target.result;
           this.filestring.push(btoa(binaryString));
          
          
     }

    onUpload(event): void {
        console.log(event.files);
        const files = event.files;
        //  console.log(files);
        this.fileToUpload = files[0];
        console.log(this.fileToUpload);
        const reader = new FileReader();
        reader.onload = this._handleReaderLoaded.bind(this);
            
        const delay = (amount: number) => {
            return new Promise((resolve) => {
              setTimeout(resolve, amount);
            });
          };
          
        // tslint:disable-next-line:typedef
        async function loop() {    
          for (let i = 0; i < files.length; i ++) {
                
                    reader.readAsBinaryString(files[i]);       
                    await delay(2000); 
                }    
            }
            loop();
        
       
    
        this.msgs = [];
        this.msgs.push({severity: 'info', summary: 'File Uploaded', detail: ''});
    }
    //

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Subscribe to update product on changes
        this._ecommerceProductService.onProductChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(product => {

                if ( product )
                {
                    this.product = new Product(product);
                    this.pageType = 'edit';
                    console.log(product);
                    this._ecommerceProductService.getCategories();
                    setTimeout(() => {
                        this.categoryList = this._ecommerceProductService.categories;
                    console.log(this.categoryList);    
                    }, 2000);
                    // console.log(this._ecommerceProductService.categorySelected);
                     // this.selectedCategory = this._ecommerceProductService.categorySelected.id;
                    //  console.log(this.selectedCategory);
                   // console.log(this.product.categories[0]);
                   // this.selectedCategory = this.product.categories[0].id;
                   console.log(this.product.categories);
                   this.selectedCategory = Number(this.product.categories);
                   console.log(this.selectedCategory);
                    
                    
                }
                else
                {
                    this.pageType = 'new';
                    this.product = new Product();
                    this._ecommerceProductService.getCategories();
                    setTimeout(() => {
                        this.categoryList = this._ecommerceProductService.categories;
                    console.log(this.categoryList);    
                    }, 2000);
                    this.selectedCategory = 0;
                    
                    
                }

                this.productForm = this.createProductForm();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create product form
     *
     * @returns {FormGroup}
     */
    createProductForm(): FormGroup
    {
        return this._formBuilder.group({
            id              : [this.product.id],
            name            : [this.product.name],
            handle          : [this.product.handle],
            description     : [this.product.description],
            categories      : [this.selectedCategory],
            tags            : [this.product.tags],
            images          : [this.filestring],
            priceTaxExcl    : [this.product.priceTaxExcl],
            priceTaxIncl    : [this.product.priceTaxIncl],
            taxRate         : [this.product.taxRate],
            comparedPrice   : [this.product.comparedPrice],
            quantity        : [this.product.quantity],
            sku             : [this.product.sku],
            width           : [this.product.width],
            height          : [this.product.height],
            depth           : [this.product.depth],
            weight          : [this.product.weight],
            extraShippingFee: [this.product.extraShippingFee],
            active          : [this.product.active]
        });
    }

    /**
     * Save product
     */
    saveProduct(): void
    {
        const data = this.productForm.getRawValue();
        data.handle = FuseUtils.handleize(data.name);

        this._ecommerceProductService.saveProduct(data)
            .then(() => {

                // Trigger the subscription with new data
                this._ecommerceProductService.onProductChanged.next(data);

                // Show the success message
                this._matSnackBar.open('Product saved', 'OK', {
                    verticalPosition: 'top',
                    duration        : 2000
                });
            });
    }

    /**
     * Add product
     */
    addProduct(): void
    {
        const data = this.productForm.getRawValue();
        data.handle = FuseUtils.handleize(data.name);

        this._ecommerceProductService.addProduct(data)
            .then(() => {

                // Trigger the subscription with new data
                this._ecommerceProductService.onProductChanged.next(data);

                // Show the success message
                this._matSnackBar.open('Product added', 'OK', {
                    verticalPosition: 'top',
                    duration        : 2000
                });

                // Change the location with new one
                this._location.go('apps/e-commerce/products/' + this.product.id + '/' + this.product.handle);
            });
    }
}
