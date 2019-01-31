import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Account, AccountService} from 'app/core/services/account.service';
import { MatChipInputEvent } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { NotesService } from 'app/core/services/notes.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CompanyService } from 'app/core/services/company.service';
import { AuthService } from 'app/core/services/auth.service';
import { OrdersService } from 'app/core/services/orders.service';
import { Location } from '@angular/common';

@Component({
  selector: 'share-order',
  templateUrl: './share-order.component.html',
  styleUrls: ['./share-order.component.scss']
})
export class ShareOrderComponent implements OnInit, OnDestroy {

  currentLoginCompanyId;
  accountId;

  // the company id of the account
  // editted by yali
  accountCompanyId;

  orderId;
  // shared users' emails that needed sent to order by url
  sharedEmail = [];
  // get contacts of the account
  contacts;
  accountName;
  loginedCompanyName;

  // get the user info by search the input email
  sharedUser;
  currentUser;
  
  // employeeOfLoginedCompany is the employee array of the current logined company
  employeeOfLoginedCompany;
  // separate shared users to three groups
  contactList = [];
  colleagueList = [];
  otherList = [];

  constructor( public route: ActivatedRoute,
    private router: Router,
    private service: AccountService,
    private notesService: NotesService,
    private dialog: MatDialog,
    private companyService : CompanyService,
    private authService: AuthService,
    private location: Location,
    private ordersService: OrdersService
  ) { 
      this.currentLoginCompanyId = this.route.snapshot.paramMap.get('cid');
      this.accountId = this.route.snapshot.paramMap.get('cusid');
      console.log(this.accountId);

      this.orderId = this.route.snapshot.paramMap.get('oId');

      this.getCurrentUser();
      // get info of current logined company
      this.getLoginedCompanyName();


      if(!this.accountId){
        let Account$ = this.ordersService.getCustomerAccount();
        if(Account$ && Account$.id){
          this.accountId = this.ordersService.getCustomerAccount().id;
        }
      }
      // get employee array of the current logined company by currentLoginCompanyId
      this.companyService.getCompanyEmployee(this.currentLoginCompanyId).subscribe(
        res=>{
          this.employeeOfLoginedCompany = res;
          console.log(res);
        }
      );

     
  }

  ngOnInit() {
    this.getContacts();

    // this.sharedEmail = ["yali@orcasmart.com", "jack@orcasmart.com"];
    setTimeout(() => {
      const buttonClick = document.getElementById("header-submit-edit");
      buttonClick.addEventListener("click", () => {
        this.getSharedEmail(this.contactList, this.sharedEmail);

        // right now, only share order to account's contact
        // if need to share order to your colleague, need to share the account to him , then he will see the orders
        // editted by yali
        // this.getSharedEmail(this.colleagueList, this.sharedEmail);
        
        this.getSharedEmail(this.otherList, this.sharedEmail);

        if (this.orderId) {
          // console.log(this.sharedEmail);
          this.shareOrder(this.sharedEmail);
        } else {
          this.saveToLocalSharedContacts(this.sharedEmail);
        }
        
        this.location.back();
        // this.router.navigate([`/company/${this.currentLoginCompanyId}/crm/account/${this.accountId}/purchase-orders/orders/new`, {sharedEmail: this.sharedEmail}]);
          // this.onSave();
      });
      console.log(this.route.snapshot.url);
      let url = this.route.snapshot.url[1].path;
      if(url.includes('new')){
        const cancelButtonClick = document.getElementById("header-cancel");
        cancelButtonClick.addEventListener("click", () => {
            this.location.back();
        });
      }
    }, 0);
  }

  // onSave() {
  //   this.router.navigateByUrl(`/company/${this.currentLoginCompanyId}/crm/account/${this.accountId}/share-order/orders/new`);
  // }

  ngOnDestroy(){
    const old_element = document.getElementById("header-submit-edit");
    var new_element = old_element.cloneNode(true);
    old_element.parentNode.replaceChild(new_element, old_element);

    const old_element2 = document.getElementById("header-cancel");
    var new_element2 = old_element2.cloneNode(true);
    old_element2.parentNode.replaceChild(new_element2, old_element2);
  }

  saveToLocalSharedContacts(arr) {
    let i=0;
    for (i=0; i<arr.length; i++) {
      this.ordersService.addLocalSharedContacts(arr[i]);
    }
  }

  shareOrder(sharedEmail) {
    let emails = {
      "emails": sharedEmail,
      "company_id": this.accountCompanyId
    };
    this.ordersService.shareOrder(this.currentLoginCompanyId, this.orderId, emails).subscribe(
      (res) => {
        console.log("share order");
      },
      (err) => {

      }
    )
  }

  getCurrentUser() {
    this.authService.getCurrentUser().subscribe(
      res => {
        this.currentUser = res.user;
      }
    );
  }

  getLoginedCompanyName() {
    this.companyService.getCompany(this.currentLoginCompanyId).subscribe(
      res => {
        this.loginedCompanyName = res.name;
      }
    );
  }
  // get contacts array of the account
  getContacts() {
    this.service.getAccount(this.currentLoginCompanyId, this.accountId).subscribe(
      res=>{
        this.accountName = res.name;
        this.accountCompanyId = res.company_id;
        this.contacts = res.contacts;
        console.log(res.contacts);
      }
    )
  }

  // onSearch(value){
  //   this.notesService.getUserEmailList(value).subscribe(
  //       res=>{
  //       }
  //   ) 
  // }

  checkInfo(value) {
    // search the user from #searchBox.value (email)
    
    this.notesService.getSpecificUser(value, 'email').subscribe(
      res=>{
        if (res.data[0]) {
          this.sharedUser = res.data[0];
          console.log(res);

        } else {
          alert("This user is not in Orca System! Please Sign up first.");
        }
        
        if (res.data[0]) {
          this.openDialog();
        }
      }
    );
  }

  openDialog() {
    const dialogRef = this.dialog.open(ShareDialogComponent, {
      width:'700px',
      data:{
        sharedUser: this.sharedUser,         
        }
    });
    this.closeDialog(dialogRef);
  }

  closeDialog(dialogRef) {
    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        // check whether sharedUser is the contacts of this account, employee of logined company, logistic company       
        let flag1 = this.pushToArr(this.sharedUser, this.contacts, this.contactList);
        let flag2 = this.pushToArr(this.sharedUser, this.employeeOfLoginedCompany, this.colleagueList);
              
        if (!flag1 && !flag2) {      
          let flag = false;
          let j;
          for (j=0; j<this.otherList.length; j++) {
            if (this.otherList[j].email == this.sharedUser.email) {
              flag = true;
            }
          }
          if (!flag) {
            this.otherList.push(this.sharedUser);
           
          }        
        }  
      }
    })
  }

  pushToArr(sharedUser, checkArr, resultArr) {

    let resultFlag;
    let i;
    let flag = false;
    for (i=0; i<checkArr.length; i++) {
      if (checkArr[i].email == sharedUser.email) {
        
        let j;
        for (j=0; j<resultArr.length; j++) {
          if (resultArr[j].email == sharedUser.email) {
            flag = true;
          }
        }
        if (!flag) {
          resultArr.push(sharedUser);
          resultFlag = true;
          return resultFlag;
        }        
      }
    }
    return flag;

  }

  getSharedEmail(inputArr, outputArr) {
    let i=0;
    for (i=0; i<inputArr.length; i++) {
      outputArr.push(inputArr[i].email);
    }
  }

  deleteSharedUser(category, i) {
    if (category == "contact") {
      this.deleteFromArr(i, this.contactList);
    } else if (category == "colleague") {
      this.deleteFromArr(i, this.colleagueList);
    } else if (category == "third") {
      this.deleteFromArr(i, this.otherList);
    }
  }

  deleteFromArr(i, arr) {
    arr.splice(i, 1);
  }

}

@Component({
  selector:'share-dialog',
  templateUrl:'share-dialog.component.html',
})

export class ShareDialogComponent {


  constructor(
      private route: ActivatedRoute,
      private router: Router,
      public dialogRef: MatDialogRef<ShareDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) {
          
       }

  onNoClick(): void {
      this.dialogRef.close();
  }
  
}