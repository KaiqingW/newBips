import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { BusinessNotesService } from 'app/core/services/business-notes.service';
import { OrdersService } from 'app/core/services/orders.service';

import { Location } from '@angular/common';
import { ImageService } from 'app/core/services/image.service';
import { CompanyService } from 'app/core/services/company.service';
import { DialogService } from 'app/core/services/dialog.service';
import { QuoteService } from 'app/core/services/quote.service';
import { SharedService } from 'app/core/services/shared.service';

@Component({
  selector: 'add-notes-subject',
  templateUrl: './add-notes-subject.component.html',
  styleUrls: ['./add-notes-subject.component.scss'],
})
export class AddNotesSubjectComponent implements OnInit, OnDestroy {

  companyId: number;
  itemId: number;
  productId: number;
  crmId: number;

  noteForm: FormGroup;
  selectedImgIndex: number;
  imgsMap = new Map<number, string>();
  obj;
  modelName;
  modalOpen = false;

  imgSrc = '';
  subNotesArr = [];
  selectedFile = null;
  subNoteForm: FormGroup;

  vendorName = "";
  vendorId;
  private sub: any;
  public: number;
  show_select : boolean = false;
  currentWholeUrl;
  

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private ordersService: OrdersService,
    private location: Location,
    private imageService: ImageService,
    private businessNotesService: BusinessNotesService,
    private companyService: CompanyService,
    private dialogService: DialogService,
    private quoteService: QuoteService,
    private sharedService: SharedService
  ) {
    this.sub = this.route.parent.params.subscribe(params => {
      if (params["vendor_company_id"]) {
        this.vendorId = +params["vendor_company_id"];
        this.companyId = this.vendorId;
        this.public = 1;
        this.show_select = false;
      } else {
        this.companyId = + this.route.snapshot.paramMap.get('cid');
        this.public = 0;
        this.show_select = true;
      }
      this.vendorName = this.route.snapshot.paramMap.get('vendorName');
      this.itemId = + this.route.snapshot.paramMap.get('iId');
      console.log(this.route);
      this.productId = + this.route.snapshot.paramMap.get('pid');
      this.crmId = + this.route.snapshot.paramMap.get('cusid');

      this.currentWholeUrl = document.URL;
     
      console.log(this.currentWholeUrl);
      this.createNoteForm();
    });


  }

  ngOnInit() {

    setTimeout(() => {
      const buttonClick = document.getElementById("header-submit-edit");
      buttonClick.addEventListener("click", () => {
        // sometimes both noteForm.invalid and noteForm.valid are false;
        if (this.noteForm.valid) {
          this.onSave();
        }else{
          let message = 'Please fill all fields!';
          this.dialogService.openAlertDialog(message);
        }
      });
    }, 0);

  }

  ngOnDestroy(){
    this.sub.unsubscribe();
  }

  createNoteForm() {
    this.noteForm = this.fb.group({
      public: [this.public],
      name: [""],
      description: this.fb.array([
        this.initSubNote()
      ])
    });
  }

  initSubNote() {
    return this.fb.group({
      img: [''],
      text: [''],
    });
  }

  onSave() {
    if (this.vendorId) {
      // this.companyService.searchCompany(this.vendorName).subscribe(
      //   res => {
      //     this.vendorId = res.data[0].id;
      //     console.log(this.vendorId);

      //     if(this.noteForm.valid){
      //       this.setImgInfoToFormData();
      //       this.noteForm.value.description = JSON.stringify(this.noteForm.value.description);

      //       if (this.itemId) {
      //         this.modelName="order_item";
      //         this.addBusinessNotesSubject(this.vendorId, this.modelName, this.itemId);
      //       } else if (this.productId) {
      //         this.modelName = "product";
      //         this.addBusinessNotesSubject(this.vendorId, this.modelName, this.productId);
      //       } else if (this.crmId) {
      //         this.modelName = "crm";
      //         this.addBusinessNotesSubject(this.vendorId, this.modelName, this.crmId);
      //       }
      //     }
      //   }
      // );

      if (this.noteForm.valid) {
        this.setImgInfoToFormData();
        this.noteForm.value.description = JSON.stringify(this.noteForm.value.description);

        if (this.itemId) {
          this.modelName = "order_item";
          this.addBusinessNotesSubject(this.vendorId, this.modelName, this.itemId);
        } else if (this.productId) {
          this.modelName = "product";
          this.addBusinessNotesSubject(this.vendorId, this.modelName, this.productId);
        } else if (this.crmId && this.currentWholeUrl.toLowerCase().includes('salesentity')) {
          this.modelName = "crm";
          this.addBusinessNotesSubject(this.vendorId, this.modelName, this.crmId);
        }else if(this.crmId){
          this.modelName = "crm";
          this.addBusinessNotesSubject(this.vendorId, this.modelName, this.crmId);
        }
      }

    } else {
      if (this.noteForm.valid) {
        this.setImgInfoToFormData();

        this.noteForm.value.description = JSON.stringify(this.noteForm.value.description.map(this.replaceLinbeBreak));

        if (this.itemId) {
          this.modelName = "order_item";
          this.addBusinessNotesSubject(this.companyId, this.modelName, this.itemId);
        } else if (this.productId) {
          this.modelName = "product";
          this.addBusinessNotesSubject(this.companyId, this.modelName, this.productId);
        }else if (this.crmId && this.currentWholeUrl.toLowerCase().includes('salesentity')) {
          this.modelName = "salesentity";
          localStorage.setItem('quoteNotes', JSON.stringify(this.noteForm.value));
        } else if (this.crmId) {
          this.modelName = "crm";
          this.addBusinessNotesSubject(this.companyId, this.modelName, this.crmId);
        }
      }
    }

  }

  addBusinessNotesSubject(companyId, modelName, modelNameId) {
    this.businessNotesService.addBusinessNotesSubject(companyId, modelName, modelNameId, this.noteForm.value).subscribe(
      (res) => {
        // console.log(123);
        this.location.back();
      }
    );
  }

  setImgInfoToFormData() {
    this.imgsMap.forEach((imgUrl, index) => {
      this.noteForm.value.description[index].img = imgUrl;
    });
  }


  onFileSelected(event, index) {
    if (event.target.files[0]) {
      this.selectedImgIndex = index;
      this.selectedFile = <File>event.target.files[0];
      this.onAddImg(index);
    }
  }

  onAddImg(index) {
    const fd = new FormData();
    fd.append('image', this.selectedFile, this.selectedFile.name);

    this.imageService.uploadImage(fd).subscribe(
      (res) => {
        // this.noteForm.value.description[index].img = res.url;
        this.imgsMap.set(index, res.url);
      },
      (err) => {
      }
    );
  }

  onAddMore() {
    const control = <FormArray>this.noteForm.controls['description'];
    control.push(this.initSubNote());
  }

  getImg(i) {
    let res = this.imgsMap.get(i);
    return res;
  }

  openModal() {
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
  }

  onDelete(i) {
    if (this.noteForm.controls.description['controls'].length > 1) {
      const control = <FormArray>this.noteForm.controls['description'];
      control.removeAt(i);
      this.imgsMap.delete(i);
    }
  }

   // replace \n using <br>, editted by yali
   replaceLinbeBreak(value) {
    value.text = value.text.replace(/(\n)+/g, '<br>')
    return value;
  }

}
