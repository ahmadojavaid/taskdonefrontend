import { Component,OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-scratchboard',
  templateUrl: './scratchboard.component.html',
  styleUrls: ['./scratchboard.component.scss']
})
export class ScratchboardComponent implements OnInit {
  boardValue : any[];
  constructor() {}

  ngOnInit() {}

  boardValues(items){
    this.boardValue = items;
  }

}
