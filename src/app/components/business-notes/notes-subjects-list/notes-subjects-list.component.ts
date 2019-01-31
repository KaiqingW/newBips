import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdersService } from 'app/core/services/orders.service';
import { BusinessNotesService } from 'app/core/services/business-notes.service';
import { CompanyService } from 'app/core/services/company.service';

@Component({
  selector: 'notes-subjects-list',
  templateUrl: './notes-subjects-list.component.html',
  styleUrls: ['./notes-subjects-list.component.scss']
})
export class NotesSubjectsListComponent implements OnInit, OnDestroy {

  orderId: number;
  companyId: number;
  itemId: number;
  productId: number;
  crmId: number;

  modelName: String;
  notesSubjects: any;

  vendorName = "";
  vendorId;
  private sub: any;
  public: number;
  isLoading: boolean = false;

  //store next url to fetch more leads
  next: '';
  //count mouse wheel
  countMouseWheel = 0;
  // set naximum refresh height
  refreshHeight = 400;
  richTextNote;
  
  constructor(
    private route: ActivatedRoute,
    private ordersService: OrdersService,
    private router: Router,
    private businessNotesService: BusinessNotesService,
    private companyService: CompanyService
  ) {
    this.isLoading = true;
    this.sub = this.route.parent.params.subscribe(params => {
      if (params["vendor_company_id"]) {
        this.vendorId = +params["vendor_company_id"];
        this.public = 1;
      } else {
        this.public = 0;
      }

      this.vendorName = this.route.snapshot.paramMap.get('vendorName');
      this.route.params.subscribe(params => {
        this.orderId = +params.oId;
        this.companyId = +params.cid;
        this.itemId = +params.iId;
        this.productId = +params.pid;
        this.crmId = +params.cusid;
      });
    })

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  ngOnInit() {
    // console.log(this.vendorName);
    if (this.vendorName) {
      this.companyService.searchCompany(this.vendorName).subscribe(
        res => {
          this.vendorId = res.data[0].id;
          // console.log(this.vendorId);
          if (this.orderId) {
            this.modelName = "order_item";
            this.getBusinessNotesSubjectList(this.vendorId, this.modelName, this.itemId);
          } else if (this.productId) {
            this.modelName = "product";
            this.getBusinessNotesSubjectList(this.vendorId, this.modelName, this.productId);
          } else if (this.crmId) {
            this.modelName = "crm";
            this.getBusinessNotesSubjectList(this.vendorId, this.modelName, this.crmId);
          }
        }
      );
    } else if (this.vendorId) {
      if (this.orderId) {
        this.modelName = "order_item";
        this.getBusinessNotesSubjectList(this.vendorId, this.modelName, this.itemId);
      } else if (this.productId) {
        this.modelName = "product";
        this.getBusinessNotesSubjectList(this.vendorId, this.modelName, this.productId);
      } else if (this.crmId) {
        this.modelName = "crm";
        this.getBusinessNotesSubjectList(this.vendorId, this.modelName, this.crmId);
      }
    } else {
      if (this.orderId) {
        this.modelName = "order_item";
        this.getBusinessNotesSubjectList(this.companyId, this.modelName, this.itemId);
      } else if (this.productId) {
        this.modelName = "product";
        this.getBusinessNotesSubjectList(this.companyId, this.modelName, this.productId);
      } else if (this.crmId) {
        this.modelName = "crm";
        this.getBusinessNotesSubjectList(this.companyId, this.modelName, this.crmId);
      }
    }
  }

  getBusinessNotesSubjectList(companyId, modelName, modelNameID) {
    this.businessNotesService.getBusinessNotesSubjectList(companyId, this.modelName, modelNameID)
      .subscribe(
        res => {
          console.log('!');

          this.notesSubjects = res;
          console.log(this.notesSubjects);
          this.isLoading = false;

        }
      )
  }

  getFirstImg(desciption) {
    let des = JSON.parse(desciption);

    for (var i = 0; i < des.length; i++) {
      if (des[i].img) {
        return des[i].img;
      }
    }
    return false;
  }

  getNoteContent(desciption) {
    return JSON.parse(desciption);
  }

  getIfUnread(note) {
    console.log(note);
    return note.is_unread;
  }

  onSelecedNote(notes_subject) {
    this.router.navigate([`./notesSubjectDetail/${notes_subject.id}`], { relativeTo: this.route });
  }


  //scroll to get more leads
  onMouseWheel(evt) {
    // this.countMouseWheel
    // console.log(evt);
    if (evt.target.scrollTop > this.refreshHeight) {
      //get my next page of leads
      if (this.next != null) {

        this.refreshHeight = this.refreshHeight + 900;

        // this.service.getLeadListnext(this.next).subscribe(
        //     res => {
        //         this.notesSubjects = res.data;
        //         // console.log(res.data);
        //         for (var i = 0; i < this.notesSubjects.length; i++) {
        //             this.notesSubjects.push(this.notesSubjects[i]);
        //         }
        //         this.next = res.paging.next;
        //     }, err => {
        //         this.isLoading = false;
        //     }
        // )

      }
    }
  }
}
