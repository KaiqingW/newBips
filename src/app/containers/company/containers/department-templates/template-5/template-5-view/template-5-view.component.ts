import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { InventoryService } from 'app/core/services/inventory.service';
import { ActivatedRoute } from '@angular/router';
import { WebsiteService } from 'app/core/services/website.service';

@Component({
  selector: 'template-5-view',
  templateUrl: './template-5-view.component.html',
  styleUrls: ['./template-5-view.component.scss']
})


export class Template5ViewComponent implements OnInit {

  @Input() row;
  @Input() isEdit;

  @Output() onEditContent = new EventEmitter<any>();

  categories;

  company_id;

  constructor(private inventoryService: InventoryService,
    private route: ActivatedRoute,
    private websiteService: WebsiteService
  ) { }

  ngOnInit() {
    console.log(this.row);
    this.company_id = +this.route.snapshot.paramMap.get('cid');
    this.inventoryService.getCategories(this.company_id, 'product').subscribe(res => {
      this.categories = res;
    })
  }

  getBackgroundColor() {
    return this.isEdit === true ? 'grey' : 'white';
  }

  getRowBackground(row) {
    if (!row || !row.background_image || !row.background_image.url) {
      return {};
    }
    return {
      "background-image": `url(${row.background_image.url})`
    }
  }

  onDelete(row) {
    if (!row.columns[0]) {
      this.websiteService.deleteColumn(this.company_id, 0, row.id).subscribe(res => {
        console.log(res);
      });
    } else {
      this.websiteService.deleteColumn(this.company_id, row.columns[0].row_id, row.id).subscribe(res => {
        console.log(res);
      });
    }
    this.websiteService.removeRow.next();
  }

  onEdit(row) {
    this.onEditContent.emit(row);
  }
}
