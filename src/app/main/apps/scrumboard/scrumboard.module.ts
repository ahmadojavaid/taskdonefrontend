import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatCheckboxModule, MatChipsModule, MatDatepickerModule, MatDialogModule,MatCardModule,MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatProgressBarModule, MatRippleModule, MatSidenavModule, MatToolbarModule, MatTooltipModule,MatTableModule,MatAutocompleteModule,MatProgressSpinnerModule, MatTabsModule } from '@angular/material';
import {MatSnackBarModule} from '@angular/material/snack-bar';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { NgxDnDModule } from '@swimlane/ngx-dnd';
import { MomentModule } from 'ngx-moment';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { FileSaverModule } from 'ngx-filesaver';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseMaterialColorPickerModule,FuseCommonLoaderModule } from '@fuse/components';

import { Ng4GeoautocompleteModule } from 'ng4-geoautocomplete';

import { BoardResolve, ScrumboardService } from 'app/main/apps/scrumboard/scrumboard.service';
import { TaskboardService } from 'app/main/apps/scrumboard/scratchboard/services/taskboard.service';
import { ScrumboardComponent } from 'app/main/apps/scrumboard/scrumboard.component';
import { ScrumboardBoardComponent } from 'app/main/apps/scrumboard/board/board.component';
import { ScrumboardBoardListComponent } from 'app/main/apps/scrumboard/board/list/list.component';
import { ScrumboardBoardCardComponent } from 'app/main/apps/scrumboard/board/list/card/card.component';
import { ScrumboardBoardEditListNameComponent } from 'app/main/apps/scrumboard/board/list/edit-list-name/edit-list-name.component';
import { ScrumboardBoardAddCardComponent } from 'app/main/apps/scrumboard/board/list/add-card/add-card.component';
import { ScrumboardBoardAddListComponent } from 'app/main/apps/scrumboard/board/add-list/add-list.component';
import { ScrumboardCardDialogComponent } from 'app/main/apps/scrumboard/board/dialogs/card/card.component';
import { ScrumboardLabelSelectorComponent } from 'app/main/apps/scrumboard/board/dialogs/card/label-selector/label-selector.component';
import { ScrumboardEditBoardNameComponent } from 'app/main/apps/scrumboard/board/edit-board-name/edit-board-name.component';
import { ScrumboardBoardSettingsSidenavComponent } from 'app/main/apps/scrumboard/board/sidenavs/settings/settings.component';
import { ScrumboardBoardColorSelectorComponent } from 'app/main/apps/scrumboard/board/sidenavs/settings/board-color-selector/board-color-selector.component';
import { ScratchboardComponent } from './scratchboard/scratchboard.component';
import { EditBoardNameComponent } from './scratchboard/edit-board-name/edit-board-name.component';
import { TaskboardComponent } from './scratchboard/taskboard/taskboard.component';
import { ChoosePersonComponent } from './scratchboard/taskboard/choose-person/choose-person.component';
import { StausDialogComponent } from './scratchboard/taskboard/staus-dialog/staus-dialog.component';
import { RelationsColsComponent } from './scratchboard/taskboard/relational-cols/relations-cols/relations-cols.component';
import { AutocompleteModule } from 'ng2-input-autocomplete';
import { TablularListComponent } from './tablular-list/tablular-list.component';
import { CurrentProjectsComponent } from './current-projects/current-projects.component';


const routes: Routes = [
    {
        path     : 'boards',
        component: ScrumboardComponent,
        resolve  : {
            scrumboard: ScrumboardService
        }
    },
    {
        path     : 'boards/:boardId/:boardUri',
        component: ScrumboardBoardComponent,
        resolve  : {
            board: BoardResolve
        }
    },
    {
		path : 'boards/tabularlist',
		component: TablularListComponent
	 },
  	{
  		path : 'boards/tabular',
  		component: ScratchboardComponent
  	},
    {
        path      : '**',
        redirectTo: 'boards'
    }
];

@NgModule({
    declarations   : [
        ScrumboardComponent,
        ScrumboardBoardComponent,
        ScrumboardBoardListComponent,
        ScrumboardBoardCardComponent,
        ScrumboardBoardEditListNameComponent,
        ScrumboardBoardAddCardComponent,
        ScrumboardBoardAddListComponent,
        ScrumboardCardDialogComponent,
        ScrumboardLabelSelectorComponent,
        ScrumboardEditBoardNameComponent,
        ScrumboardBoardSettingsSidenavComponent,
        ScrumboardBoardColorSelectorComponent,
        ScratchboardComponent,
        EditBoardNameComponent,
        TaskboardComponent,
        CurrentProjectsComponent,
        ChoosePersonComponent,
        StausDialogComponent,
        RelationsColsComponent,
        TablularListComponent
    ],
    imports        : [
        RouterModule.forChild(routes),

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
        NgxDnDModule,
        MomentModule,
        MatButtonToggleModule,
        MatSnackBarModule,
        FileSaverModule,

        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseMaterialColorPickerModule,
        FuseCommonLoaderModule,

        FroalaEditorModule.forRoot(),
        FroalaViewModule.forRoot(),
        AutocompleteModule.forRoot(),
        Ng4GeoautocompleteModule.forRoot()
    ],
    providers      : [
        ScrumboardService,
        BoardResolve,
        TaskboardService
    ],
    entryComponents: [
            ScrumboardCardDialogComponent,
            ChoosePersonComponent,
            StausDialogComponent,
            RelationsColsComponent
          ]
})
export class ScrumboardModule
{
}
