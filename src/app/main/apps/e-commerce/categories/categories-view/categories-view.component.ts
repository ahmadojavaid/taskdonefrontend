import { CategoriesService } from './../categories.service';
import { fuseAnimations } from '@fuse/animations';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-categories-view',
  templateUrl: './categories-view.component.html',
  styleUrls: ['./categories-view.component.scss'],
  animations : fuseAnimations
})
export class CategoriesViewComponent implements OnInit {

  constructor(private categoriesService: CategoriesService) { }
  displayedColumns = ['id', 'name'];
  dataSource;
  categories: PeriodicElement[] = [];
  temp;
  ngOnInit(): void {
    this.categoriesService.getCategories().subscribe(
        response => {
            console.log(response);
            this.temp = response;
            this.categories = this.temp.Result;
            console.log(this.categories);
            this.dataSource = this.categories;
            console.log(this.dataSource);
        }
    );
    
    
  } 

}

export interface PeriodicElement {
    id: any;
    name: any;
  }
  
  const ELEMENT_DATA: PeriodicElement[] = [
    {id: 1, name: 'Hydrogen'},
    {id: 2, name: 'Helium'},
    {id: 3, name: 'Lithium'},
    {id: 4, name: 'Beryllium'},
    {id: 5, name: 'Boron'},
    {id: 6, name: 'Carbon'},
    {id: 7, name: 'Nitrogen'},
    {id: 8, name: 'Oxygen'},
    {id: 9, name: 'Fluorine'},
    {id: 10, name: 'Neon'},
  ];
