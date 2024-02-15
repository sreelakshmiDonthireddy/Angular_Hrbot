import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { MatStepperModule } from '@angular/material/stepper';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogueComponent } from './dialogue/dialogue.component';
import { DislikeComponent } from './dislike/dislike.component';
import {NgxTypedJsModule} from 'ngx-typed-js';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    DialogueComponent,
    DislikeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatTableModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatStepperModule,
    MatExpansionModule,
    MatDialogModule,
    MatCardModule,
    MatIconModule,
    DragDropModule,
    CdkTableModule,
    CdkTreeModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgxTypedJsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
