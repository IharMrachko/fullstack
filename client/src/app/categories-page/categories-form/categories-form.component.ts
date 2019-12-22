import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CategoriesService} from "../../shared/services/categories.service";
import {switchMap} from "rxjs/operators";
import {of} from "rxjs";
import {MaterialService} from "../../shared/classes/material.service";
import {Category} from "../../shared/interfaces";
import {error} from "util";

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.scss']
})
export class CategoriesFormComponent implements OnInit {

  @ViewChild('input', {static: false}) inputRef: ElementRef;
  form: FormGroup;
  imagePreview: string| ArrayBuffer;
  image: File;
  isNew = true;
  category: Category;

  constructor(private route: ActivatedRoute,
              private categoryService: CategoriesService,
              private router: Router) { }

  ngOnInit() {
     this.form = new FormGroup({
       name: new FormControl(null, Validators.required)
     });

     this.form.disable();

    this.route.params
      .pipe(
        switchMap(
          (params: Params) => {
            if(params['id']){

              this.isNew = false;
           return this.categoryService.getById(params['id'])
            }
           return  of(null)
          }
        )
      )
      .subscribe(
        category =>{
          if(category !==null){
            this.category = category;
            this.form.patchValue({
              name: category.name
            });
            this.imagePreview = category.imageSrc;
            MaterialService.updateTextInputs();
          }
          this.form.enable()
        }

      )
  }

  onSubmit() {
    let obs$;
     this.form.disable();
     if(this.isNew){
      obs$ = this.categoryService.create(this.form.value.name, this.image)
     } else {
      obs$ = this.categoryService.update(this.category._id, this.form.value.name, this.image)
     }
     obs$.subscribe(
       category => {
         this.category = category;
         MaterialService.toast('Изменения сохранены');
         this.form.enable();
       }, error => {
         MaterialService.toast(error.error.message);
         this.form.enable();
       }
     )
  }

  triggerClick() {
     this.inputRef.nativeElement.click()
  }

  onFileUpload(fileInput: any) {
     const file = <File>fileInput.target.files[0];
     this.image = file;

     const reader = new FileReader();

     reader.onload = () => {
       this.imagePreview = reader.result
     }
     reader.readAsDataURL(file)
  }

  deleteCategory() {
    const desicion = window.confirm(`Вы уверены, что хотите удалить категорию "${this.category.name}"`);
    if(desicion){
      this.categoryService.delete(this.category._id)
        .subscribe(
          response => MaterialService.toast(response.message),
          error => MaterialService.toast(error.error.message),
          () => this.router.navigate(['/categories'])
        )
    }
  }
}
