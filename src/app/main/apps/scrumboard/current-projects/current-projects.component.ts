import { fuseAnimations } from './../../../../../@fuse/animations/index';
import { takeUntil } from 'rxjs/operators';
//import { ScrumboardService } from 'app/main/apps/scrumboard/scrumboard.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-current-projects',
  templateUrl: './current-projects.component.html',
  styleUrls: ['./current-projects.component.scss'],
  animations : fuseAnimations
})
export class CurrentProjectsComponent implements OnInit, OnDestroy {

    boards: any[];
    private _unsubscribeAll: Subject<any>;
  constructor(
    private  _router: Router
  ) {
    this._unsubscribeAll = new Subject();
  }


  ngOnInit(): void {
    // this._scrumboardService.onBoardsChanged
    // .pipe(takeUntil(this._unsubscribeAll))
    // .subscribe(boards => {
    //     this.boards = boards;
    // });
  }

  ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

}
