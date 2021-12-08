import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';

@Component({
    selector     : 'fuse-navigation',
    templateUrl  : './navigation.component.html',
    styleUrls    : ['./navigation.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FuseNavigationComponent implements OnInit
{
    @Input()
    layout = 'vertical';

    @Input()
    navigation: any;
	userinbox: any;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     */
    constructor(
        private _fuseNavigationService: FuseNavigationService
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Load the navigation either from the input or from the service
        this.navigation = this.navigation || this._fuseNavigationService.getCurrentNavigation();
		
		
		if (localStorage.getItem("userToken") === null) 
		{
		let loginUserId = localStorage.getItem('userToken');	
		this.userinbox = this.getUserinbox();
		/* setTimeout(()=>{    
			if(this.userinbox.statusCode == true)
			{
				if(Object.keys(this.userinbox.Result).length >0)
				{	
					let inboxs = this.userinbox.Result;
					for (let key of Object.keys(inboxs)) {  
					  let mealData = inboxs[key];					  
							this.navigation[0]['children'][2]['children'].push({
								id        : mealData.mailRef,
								title     : mealData.inbox_name,
								type      : 'item',
								url       : '/apps/mail/mail-inbox/'+mealData.mailRef,
								exactMatch: true,
							});
					}	
				}	
			}		 
			  
		 }, 3000); */
		}
        // Subscribe to the current navigation changes
        this._fuseNavigationService.onNavigationChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.navigation = this._fuseNavigationService.getCurrentNavigation();
            });
    }
	
	
	public getUserinbox()
	{		
		this._fuseNavigationService.getUserInbox().subscribe((data:  Array<object>) => {			
			this.userinbox  =  data;
		});		
	}	
}
