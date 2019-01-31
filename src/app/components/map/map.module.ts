import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

import { MapComponent } from './map.component';
import { WarehouseService } from 'app/core/services/warehouse.service';
import { ToasterService } from 'app/core/services/toaster.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
  ],
  declarations: [
    MapComponent
  ],
  providers: [
    ToasterService
  ],
  exports: [
    MapComponent
  ]
})

export class MapModule {}
