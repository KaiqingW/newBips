import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray, ReactiveFormsModule } from "@angular/forms";
import { WebsiteService } from '../../../../core/services/website.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-add-department',
    templateUrl: './add-department-page.component.html',
    styles: ['./add-department-page.component.scss']
})

export class AddDepartmentPageComponent implements OnInit, OnDestroy {
    selectTemplateForm: FormGroup;
    componentStyle = {};
    componentStylerow = {};
    colStyle = {};
    rows = [];
    company_id: number;
    departement_id: number;
    sub: Subscription;
    removeRowSub: Subscription;
    updateRowSub: Subscription;
    isLoading: boolean = false;

    constructor(
        private fb: FormBuilder,
        private websiteService: WebsiteService,
        private route: ActivatedRoute
    ) {
        this.company_id = +this.route.snapshot.paramMap.get('cid');
        this.departement_id = +this.route.snapshot.paramMap.get('dId');
        this.createSelectTemplateForm();
        this.getRows();
    }

    ngOnInit() {
        this.subscribeRowSubject();
        this.subscribeRemoveRow();
        this.subscribeUpdateRow();
        setTimeout(() => {

            this.componentStylerow = {
                component: {
                    // "background-image": "url('https://3v6x691yvn532gp2411ezrib-wpengine.netdna-ssl.com/wp-content/uploads/2019/05/imagetext01.jpg')",
                    "background-color": "white",
                    "background-repeat": "no-repeat, repeat",
                    width: "100%",
                    "min-height": "273px",
                    display: "flex",
                    "flex-wrap": "wrap",
                    "justify-content": "space-evenly",
                    "box-sizing": "border-box",
                    "flex-direction": "row",
                    "align-items": "center",
                    "padding": "1vw 13vw"
                },
                title: {
                    'font-size': "34px",
                    "padding": "1vw",
                    //custom
                    width: "100%"
                },
                content: {
                    "padding": "1vw",
                    //custom
                    width: "35vw"
                },
                image: {
                    width: "120px",
                    height: "120px"
                }
            }

            this.colStyle = {
                component: {
                    // preset
                    "background-repeat": "no-repeat, repeat",
                    // width:"100%",
                    display: "flex",
                    "justify-content": "center",
                    "box-sizing": "border-box",
                    "flex-direction": "column",
                    "align-items": "center",
                    "padding": "1vw",
                    //custom
                    "background-color": "white",
                    "width": "288px"
                    // "background-image": "url('https://3v6x691yvn532gp2411ezrib-wpengine.netdna-ssl.com/wp-content/uploads/2019/05/imagetext01.jpg')",

                    // "min-height":"273px",

                },
                title: {
                    // preset 
                    "padding": "1vw",

                    //custom
                    'font-size': "1.5vw",
                },
                content: {
                    "padding": "1vw",
                },
                image: {

                    //custom
                    width: "120px",
                }
            }
        }, 2000);
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
        this.removeRowSub.unsubscribe();
    }

    subscribeRemoveRow() {
        this.removeRowSub = this.websiteService.removeRow.subscribe(() => {
            this.getRows();
        })
    }

    subscribeUpdateRow() {
        this.updateRowSub = this.websiteService.updateRowSubject.subscribe((rowData) => {
            console.log('main page', rowData);
            this.updateRow(rowData);
        })
    }

    subscribeRowSubject() {
        this.sub = this.websiteService.rowSubject.subscribe((rowData) => {
            console.log(rowData);
            this.addRow(rowData);
        })
    }

    updateRow(rowData) {
        this.isLoading = true;
        this.websiteService.updateRow(this.company_id, rowData.id, rowData).subscribe(res => {
            this.isLoading = false;
        })
    }

    addRow(rowData) {
        this.isLoading = true;
        this.websiteService.addRow(this.company_id, this.departement_id, rowData).subscribe(
            row => {
                this.isLoading = false;
                this.removeDummyRow();
                this.addNewRowToExistData(row);
            }
        )
    }

    removeDummyRow() {
        this.rows.pop();
    }

    addNewRowToExistData(row) {
        this.rows.push(row);
    }

    getRows() {
        this.websiteService.getRows(this.company_id, this.departement_id).subscribe(
            rows => {
                console.log(rows);
                this.rows = rows
            }
        )
    }

    onResize(event) {
        if (event.target.innerWidth <= 800) {
            this.colStyle['component']['width'] = '80vw';
        } else {
            this.colStyle['component']['width'] = '30vw';
        }
    }


    addTemplate() {
        if (this.selectTemplateForm.invalid) {
            alert("please select a template.");
            return;
        }
        this.removePrevDummyTemplate();
        this.rows.push(this.selectTemplateForm.value);
    }

    removePrevDummyTemplate() {
        this.rows = this.rows.filter(row => {
            return !row['dummy_template'];
        })
    }

    createSelectTemplateForm() {
        this.selectTemplateForm = this.fb.group({
            template_id: [''],
            dummy_template: true
        });
    }
}
