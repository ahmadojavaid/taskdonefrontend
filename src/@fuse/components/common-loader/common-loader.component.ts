import { Component,Input } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector   : 'fuse-common-loader',
    templateUrl: './common-loader.component.html',
    styleUrls  : ['./common-loader.component.scss']
})
export class FuseCommonLoaderComponent{
    @Input() loading: boolean;
    constructor(private spinner: NgxSpinnerService){
    }
}
