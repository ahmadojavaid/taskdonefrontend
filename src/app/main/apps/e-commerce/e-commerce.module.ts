
import { CategoriesService } from './categories/categories.service';
import { MakeOrderService } from './make-order/make-order.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CdkTableModule } from '@angular/cdk/table';
import { MatButtonModule, MatChipsModule, MatFormFieldModule,
    MatIconModule, MatInputModule, MatPaginatorModule, MatRippleModule, MatSelectModule, MatSnackBarModule, MatSortModule, MatTableModule, MatTabsModule } from '@angular/material';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AgmCoreModule } from '@agm/core';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';

import { EcommerceDashboardComponent } from 'app/main/apps/e-commerce/dashboard/dashboard.component';
import { EcommerceDashboardService } from 'app/main/apps/e-commerce/dashboard/dashboard.service';
import { EcommerceProductsComponent } from 'app/main/apps/e-commerce/products/products.component';
import { EcommerceProductsService } from 'app/main/apps/e-commerce/products/products.service';
import { EcommerceProductComponent } from 'app/main/apps/e-commerce/product/product.component';
import { EcommerceProductService } from 'app/main/apps/e-commerce/product/product.service';
import { EcommerceOrdersComponent } from 'app/main/apps/e-commerce/orders/orders.component';
import { EcommerceOrdersService } from 'app/main/apps/e-commerce/orders/orders.service';
import { EcommerceOrderComponent } from 'app/main/apps/e-commerce/order/order.component';
import { EcommerceOrderService } from 'app/main/apps/e-commerce/order/order.service';
import { MakeBookingsComponent } from './make-order/make-bookings.component';
import { OrderSelectProductComponent } from './make-order/order-select-product/order-select-product.component';
import { OrderEnterUserComponent } from './make-order/order-enter-user/order-enter-user.component';
import {FileUploadModule} from 'primeng/fileupload';
import { CategoriesComponent } from './categories/categories.component';
import { CategoriesViewComponent } from './categories/categories-view/categories-view.component';


const routes: Routes = [
    {
        path     : 'dashboard',
        component: EcommerceDashboardComponent,
        resolve  : {
            data: EcommerceDashboardService
        }
    },
    {
        path     : 'products',
        component: EcommerceProductsComponent,
        resolve  : {
            data: EcommerceProductsService
        }
    },
    {
        path     : 'products/:id',
        component: EcommerceProductComponent,
        resolve  : {
            data: EcommerceProductService
        }
    },
    {
        path     : 'products/:id/:handle',
        component: EcommerceProductComponent,
        resolve  : {
            data: EcommerceProductService
        }
    },
    {
        path     : 'orders',
        component: EcommerceOrdersComponent,
        resolve  : {
            data: EcommerceOrdersService
        }
    },
    {
        path     : 'orders/:id',
        component: EcommerceOrderComponent,
        resolve  : {
            data: EcommerceOrderService
        }
    },
    
    {
        path     : 'categories',
        component: CategoriesComponent
    },
    {
        path     : 'categories-view',
        component: CategoriesViewComponent
    },
    {
    
        path     : 'make-order',
        component: MakeBookingsComponent, children: [
            {
                path     : '', redirectTo: 'order-enter-user', pathMatch: 'full'
            },
            {
                path     : 'order-enter-user',
                component: OrderEnterUserComponent
            },
            {
                path     : 'order-select-product/:id',
                component: OrderSelectProductComponent
            }
            
        ]

    },
    
];

@NgModule({
    declarations: [
        EcommerceDashboardComponent,
        EcommerceProductsComponent,
        EcommerceProductComponent,
        EcommerceOrdersComponent,
        EcommerceOrderComponent,
        MakeBookingsComponent,
        OrderSelectProductComponent,
        OrderEnterUserComponent,
        CategoriesComponent,
        CategoriesViewComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        CdkTableModule,
        MatButtonModule,
        MatChipsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatPaginatorModule,
        MatRippleModule,
        MatSelectModule,
        MatSortModule,
        MatSnackBarModule,
        MatTableModule,
        MatTabsModule,

        NgxChartsModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyD81ecsCj4yYpcXSLFcYU97PvRsE_X8Bx8'
        }),

        FuseSharedModule,
        FuseWidgetModule,
        FileUploadModule,
        
    ],
    providers   : [
        EcommerceDashboardService,
        EcommerceProductsService,
        EcommerceProductService,
        EcommerceOrdersService,
        EcommerceOrderService,
        CategoriesService
    ]
})
export class EcommerceModule
{
}
