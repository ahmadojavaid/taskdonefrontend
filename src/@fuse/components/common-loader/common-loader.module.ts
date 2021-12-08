import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { NgxSpinnerModule } from 'ngx-spinner';

import { FuseCommonLoaderComponent } from '@fuse/components/common-loader/common-loader.component';

@NgModule({
    declarations: [
      FuseCommonLoaderComponent
    ],
    imports: [
      CommonModule,
      MatProgressSpinnerModule,
      NgxSpinnerModule
    ],
    exports: [
        FuseCommonLoaderComponent
    ],
})
export class FuseCommonLoaderModule
{
}
