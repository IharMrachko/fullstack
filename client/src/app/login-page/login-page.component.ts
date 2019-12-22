import {Component, Injectable, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../shared/services/auth.service";
import {User} from "../shared/interfaces";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {MaterialService} from "../shared/classes/material.service";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})

export class LoginPageComponent implements OnInit, OnDestroy {

  form: FormGroup;
  submitted = false;
  aSub: Subscription;

  constructor(private auth: AuthService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    });
   this.route.queryParams.subscribe((params: Params) => {
       if(params['registered']){
         MaterialService.toast('Теперь вы можете зайти в систему используя свои данные')

       } else if (params['accessDenied']){
         MaterialService.toast('Авторизируйтесь в системе')
       } else if (params['sessionFailed']){
         MaterialService.toast('Пожалуйста, войдите в систему заново!')
       }
   });
  }
  ngOnDestroy(){
    if (this.aSub){
    this.aSub.unsubscribe();
    }
  }

  onSubmit() {

    if (this.form.invalid) {
      return;
    }
    this.submitted = true;
    const user: User = {
      email: this.form.value.email,
      password: this.form.value.password
    };
  this.aSub =  this.auth.login(user).subscribe(() => {
      this.form.reset();
      this.router.navigate(['/overview']);
      this.submitted = false;
    }, error => {
      MaterialService.toast(error.error.message);
      this.submitted = false;
    });
  }
}
