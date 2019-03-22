import { NgModule } from '@angular/core';
import { ListTreeComponent } from './list-tree.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListLeafComponent } from './list-leaf/list-leaf.component';
import { UploadImgModule } from 'app/components/upload-img/upload-img.module';
import { UploadSingleImgModule } from '../upload-single-img/upload-single-img.module';
import { UploadSingleImg2Module } from '../upload-single-img2/upload-single-img2.module';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

@NgModule({
  declarations: [
    ListTreeComponent,
    ListLeafComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    UploadImgModule,
    UploadSingleImgModule,
    UploadSingleImg2Module,
    FroalaEditorModule.forRoot(), 
    FroalaViewModule.forRoot()
  ],
  exports: [
    ListTreeComponent
  ]
})

export class ListTreeModule {

}
