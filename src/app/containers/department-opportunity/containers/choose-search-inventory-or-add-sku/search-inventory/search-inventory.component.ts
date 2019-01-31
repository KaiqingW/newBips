import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { InventoryService } from 'app/core/services/inventory.service';
import { MatChipInputEvent } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { DialogService } from 'app/core/services/dialog.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DepartmentOpportunityService } from 'app/core/services/department-opportunity.service';
import { Location } from '@angular/common';

@Component({
  selector: 'search-inventory',
  templateUrl: './search-inventory.component.html',
  styleUrls: ['./search-inventory.component.scss']
})
export class SearchInventoryComponent implements OnInit {

  emailCtrl: FormControl = new FormControl();
  finalInput;
  
  // for angular material mat-autocomplete
  filteredProducts: Observable<any[]>;

  companyId = 0;
  productItemNumList: Array<string> = [];
  selectedProductId;
  selectedUserName;
  productImageUrl;
  // for angular material mat-chip-list and input
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  // separator to separate user input as chips
  separatorKeysCodes = [ENTER, COMMA];

  crmOpportunityProjectId;
  prevSalesProjectId;
  oppoSubjectId;
  oppoProductProjectId;

  constructor(
    private inventoryService: InventoryService,
    private dialogService: DialogService,
    private route: ActivatedRoute,
    private departmentOpportunityService: DepartmentOpportunityService,
    private location: Location,
    private router: Router,
    
  ) { 
    this.companyId = +localStorage.getItem("currentLoginCompanyId");
    this.crmOpportunityProjectId = this.route.snapshot.queryParams['crmOpportunityProjectId'];
    this.prevSalesProjectId = this.route.snapshot.paramMap.get('oppoPrevProjectId');    
    this.oppoSubjectId = this.route.snapshot.paramMap.get('oppoSubjectId');    
    this.oppoProductProjectId = this.route.snapshot.paramMap.get('oppoProjectId');    
    
    this.emailCtrl.valueChanges.subscribe(
      (term)=>{
        this.onSearch(term);
        this.finalInput = term;
      }
    )
  }

  ngOnInit() {
    // add listener to the save button in the header tool bar
    setTimeout(() => {
      const buttonClick = document.getElementById('header-submit-edit');
      buttonClick.addEventListener('click', () => {
          if (this.productItemNumList.length == 1) {
              this.onSave();
          } else if (this.productItemNumList.length == 0) {
              let message = "Please search a product from the inventory!";                    
              this.dialogService.openAlertDialog(message);
          } 
      });
    }, 0);
  }

  // search inventory starts
  onSearch(value){
    this.inventoryService.searchProductFuzzy(this.companyId, "headline", value).subscribe(
      res=>{
          this.filteredProducts = res.data;   
          console.log(this.filteredProducts);    
      }
    )
  }

    // for adding new chips after input token ends
    add(event: MatChipInputEvent): void {
      setTimeout(e => {
      const input = event.input;
      const value = this.selectedUserName || event.value;
      
      if ((value || '').trim()) {
          //     value = value.trim().toLowerCase();
          if (!this.productItemNumList.includes(value)) {
              // because the array will only have one user name, when input new user, 
              // just use the new user to replace the old one, editted by yali
              this.productItemNumList[0] = value;
          }
      }
      
      // Reset the input value
      if (input) {
          input.value = '';
      }
      this.selectedUserName = '';
      }, 0);
  }

  // remove email from productItemNumList
  remove(email: any): void {
      const index = this.productItemNumList.indexOf(email);
      if (index >= 0) {
      this.productItemNumList.splice(index, 1);
      }

      this.selectedProductId = null;
      this.productImageUrl = null;
      
  }

  getSlectedProductInfo(value){
      // record the contact_id of the user, send back to backend for add share and owner
      this.selectedProductId = value.id;

      if (value.images.length != 0) {
          this.productImageUrl = value.images[0].url;
      } else {
          this.productImageUrl = "assets/images/bottle.png";
      }
      // if((!this.phoneNumberList.includes(value.phone))&&(value.phone !== "")){
      //     this.phoneNumberList.push(value.phone);
      // }

  }

  // In default, add function add runs before selectOption.
  // To change the event order, set timeout in add function and use selectedUserName  to pass the clicked value from autocomplete list
  selectOption(event) {
      this.selectedUserName = event.option.value;
  }
  // search end

  onSave() {
    console.log(this.productItemNumList);
    console.log(this.selectedProductId);
    let request = {
      "sku_product_id" : this.selectedProductId,
    }

    this.departmentOpportunityService.updateProjectSKUProduct(this.companyId, this.crmOpportunityProjectId, request).subscribe(
      res => {
        this.router.navigate([`/company/${this.companyId}/department-opportunity/opportunity-person-project/${this.prevSalesProjectId}/sales-opportunity-subject/${this.oppoSubjectId}/crm-opportunity-project/${this.oppoProductProjectId}`], { queryParams: { currentProcessId: 0}});
        
      }
    )
  }

}
