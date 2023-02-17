import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl,   FormGroup, Validators } from '@angular/forms';
import axios from 'axios';
import { AuthService } from '../../services/auth/auth.service';
import { ToastService } from '../../../services/toast/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form: FormGroup

  constructor(private toast:ToastService, private auth:AuthService, private builder: FormBuilder){
    this.form = builder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  login(){
    if(this.form.valid)
      this.auth.login(this.form.value, '/').subscribe(
        res=> this.toast.setSuccess(`Connecté en tant que ${this.auth.getFirstname()} ${this.auth.getLastname()}`)
      )
  }
}