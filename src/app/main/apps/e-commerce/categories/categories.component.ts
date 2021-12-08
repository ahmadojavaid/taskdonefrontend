import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { fuseAnimations } from '@fuse/animations';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  animations   : fuseAnimations
})
export class CategoriesComponent implements OnInit {
    newCtegory: FormControl;
    form: FormGroup;
    baseUrl = environment.baseUrl;
  constructor(private http: HttpClient,
    private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.createUserForm();
      
  }
  onSubmit(): void {
    const data = this.form.getRawValue();
    const body = {
        categoryName: data.category
    };
    console.log(body);
      this.http.post(this.baseUrl + '/category', body).subscribe(
          response => {
              console.log(response);
          }
      );
  }
  createUserForm(): FormGroup {
    return this._formBuilder.group({
      category   : ['', Validators.required]
    });
}

}
