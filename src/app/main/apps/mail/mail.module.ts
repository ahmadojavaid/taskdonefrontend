import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
    MatButtonModule, MatCheckboxModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatRippleModule, MatSelectModule, MatToolbarModule
} from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule } from '@fuse/components';

import { MailService } from 'app/main/apps/mail/mail.service';
import { MailComponent } from 'app/main/apps/mail/mail.component';
import { MailListComponent } from 'app/main/apps/mail/mail-list/mail-list.component';
import { MailListItemComponent } from 'app/main/apps/mail/mail-list/mail-list-item/mail-list-item.component';
import { MailDetailsComponent } from 'app/main/apps/mail/mail-details/mail-details.component';
import { MailMainSidebarComponent } from 'app/main/apps/mail/sidebars/main/main-sidebar.component';
import { MailComposeDialogComponent } from 'app/main/apps/mail/dialogs/compose/compose.component';
import { MailconfigurationComponent } from './mailconfiguration/mailconfiguration.component';
import { GmailComponent } from './mailconfiguration/gmail/gmail.component';
import { YahooComponent } from './mailconfiguration/yahoo/yahoo.component';
import { CustomComponent } from './mailconfiguration/custom/custom.component';
import { OutlookComponent } from './mailconfiguration/outlook/outlook.component';
import { MatSnackBarModule } from '@angular/material';;

const routes: Routes = [
    {
        path : 'mail-configuration',
        component: MailconfigurationComponent
    },  
    {
        path : 'mail-configuration/gmail',
        component: GmailComponent
    },
    {
        path : 'mail-configuration/yahoo',
        component: YahooComponent
    },
    {
        path : 'mail-configuration/outlook',
        component: OutlookComponent
    },
    {
        path : 'mail-configuration/custom',
        component: CustomComponent
    },{
        path     : 'label/:labelHandle',
        component: MailComponent,
        resolve  : {
            mail: MailService
        }
    },
    {
        path     : 'label/:labelHandle/:mailId',
        component: MailComponent,
        resolve  : {
            mail: MailService
        }
    },
    {
        path     : 'filter/:filterHandle',
        component: MailComponent,
        resolve  : {
            mail: MailService
        }
    },
    {
        path     : 'filter/:filterHandle/:mailId',
        component: MailComponent,
        resolve  : {
            mail: MailService
        }
    },
    {
        path     : ':folderHandle',
        component: MailComponent,
        resolve  : {
            mail: MailService
        }
    },
    {
        path     : ':folderHandle/:mailId',
        component: MailComponent,
        resolve  : {
            mail: MailService
        }
    },
    {
        path      : '**',
        redirectTo: 'inbox'
    }
];

@NgModule({
    declarations   : [
        MailComponent,
        MailListComponent,
        MailListItemComponent,
        MailDetailsComponent,
        MailMainSidebarComponent,
        MailComposeDialogComponent,
        MailconfigurationComponent,
        GmailComponent,
        YahooComponent,
        CustomComponent,
        OutlookComponent
    ],
    imports        : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatCheckboxModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatRippleModule,
        MatSelectModule,
        MatToolbarModule,
        MatSnackBarModule,


        TranslateModule,

        FuseSharedModule,
        FuseSidebarModule
    ],
    providers      : [
        MailService
    ],
    entryComponents: [
        MailComposeDialogComponent
    ]
})
export class MailModule
{
}
