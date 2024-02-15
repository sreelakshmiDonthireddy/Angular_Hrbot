import { Component,  } from '@angular/core';
import { Login } from '../models/login';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  userForm: FormGroup = new FormGroup({
    email: new FormControl(),
    password: new FormControl()
  });

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    const email = this.userForm.get('email')?.value;
    const password = this.userForm.get('password')?.value;

    this.http.get<Login[]>('./assets/data.json').subscribe(data => {
      const foundUser = data.find(user => user.email === email && user.password === password);
      if (foundUser) {
        console.log('Login successful');
        this.userForm.reset(); 
        this.router.navigate(['/home']); 
      } else {
        console.log('Invalid email or password');
      }
    });
  }
}
