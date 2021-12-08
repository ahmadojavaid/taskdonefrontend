import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatCheckboxModule, MatChipsModule, MatDatepickerModule, MatDialogModule,MatCardModule,MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatProgressBarModule, MatRippleModule, MatSidenavModule, MatToolbarModule, MatTooltipModule,MatTableModule,MatAutocompleteModule,MatProgressSpinnerModule, MatTabsModule } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { NgxDnDModule } from '@swimlane/ngx-dnd';
import { MomentModule } from 'ngx-moment';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseMaterialColorPickerModule,FuseCommonLoaderModule } from '@fuse/components';
import { CurrentProjectsComponent } from 'app/main/apps/current-projects/current-projects.component';
import { TablularListComponent } from 'app/main/apps/scrumboard/tablular-list/tablular-list.component';
import { TabularService } from 'app/main/apps/scrumboard/tablular-list/services/tabular.service';

const routes: Routes = [
    {
        path     : '**',
        component: CurrentProjectsComponent
    }
];

@NgModule({
  imports: [
      CommonModule,

      MatButtonModule,
      MatCheckboxModule,
      MatChipsModule,
      MatDatepickerModule,
      MatCardModule,
      MatDialogModule,
      MatFormFieldModule,
      MatIconModule,
      MatInputModule,
      MatListModule,
      MatMenuModule,
      MatProgressBarModule,
      MatRippleModule,
      MatSidenavModule,
      MatToolbarModule,
      MatTooltipModule,
      MatTableModule,
      MatAutocompleteModule,
      MatProgressSpinnerModule,
      MatSelectModule,
      MatGridListModule,
      MatTabsModule,
      MatSnackBarModule,
      NgxDnDModule,
      MomentModule,

      FuseSharedModule,
      FuseConfirmDialogModule,
      FuseMaterialColorPickerModule,
      FuseCommonLoaderModule,

      RouterModule.forChild(routes)
  ],
  declarations: [
    CurrentProjectsComponent
  ],
  providers:[
    TabularService
  ],
  entryComponents:[]
})

export class CurrentProjectsModule {}
