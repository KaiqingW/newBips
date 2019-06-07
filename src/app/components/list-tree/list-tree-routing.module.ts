import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DescriptionComponent } from './description/description.component';
import { TemplateService } from 'app/core/services/template.service';
import { ListTreeComponent } from './list-tree.component';
import { ProdcutCategorySettingComponent } from 'app/containers/company/containers/product-category-setting/product-category-setting.component';
import { ShopDepartmentCategoryHeader } from 'app/core/models/header';

const listTreeRouting: Routes = [
  {
    path: ':cid/company-setting/shop-department-setting',
    component: ProdcutCategorySettingComponent,
    children: [
      {
        path: 'edit/:id',
        component: DescriptionComponent
      }
    ]
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(listTreeRouting),
  ],
  exports: [
    RouterModule
  ],
  providers: [
    TemplateService
  ]
})

export class ListTreeRoutingModule {
}