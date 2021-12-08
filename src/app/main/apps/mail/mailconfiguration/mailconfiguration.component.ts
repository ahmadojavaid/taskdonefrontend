import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
@Component({
  selector: 'app-mailconfiguration',
   animations   : fuseAnimations,
  templateUrl: './mailconfiguration.component.html',
  styleUrls: ['./mailconfiguration.component.scss']
})
export class MailconfigurationComponent implements OnInit {
  constructor() 
  { 
		
  }
  

  ngOnInit() {
  }
}