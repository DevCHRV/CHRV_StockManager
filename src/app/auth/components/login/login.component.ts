import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl,   FormGroup, Validators } from '@angular/forms';
import axios from 'axios';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form: FormGroup

  constructor(private auth:AuthService, private builder: FormBuilder){
    this.form = builder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  login(){
    this.auth.login(this.form.value, '/').subscribe()
  }
}