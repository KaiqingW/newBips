import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { WebsiteService } from '../../../../../core/services/website.service';
@Component({
    selector: 'template-8',
    templateUrl: './template-8.component.html',
    styleUrls: ['./template-8.component.scss'],
})

export class Template8Component implements OnInit, OnChanges {
    @Input() row;
    @Input() isEdit: boolean = false;
    company_id: number;
    templateForm: FormGroup;

    constructor(private fb: FormBuilder,
        private route: ActivatedRoute,
        private websiteService: WebsiteService
    ) {
        this.company_id = + this.route.snapshot.paramMap.get('cid');
    }

    ngOnInit() {
    }

    ngOnChanges(){
        if (this.row.dummy_template) {
            this.createTemplateForm();
        }
    }

    getColumnBackground(column) {
        return {
            "background-image": `linear-gradient(0deg, rgba(60, 65, 60, 0.4), rgba(77, 75, 75, 0.4)), url(${column.background_image.url})`
        }
    }

    getColumnPicture(column){
        if(column.image && column.image.url){
            return column.image.url;
        }
        return "";
    }

    createTemplateForm() {
        this.templateForm = this.fb.group({
            template_id: 8,
            title: [""],
            description: [""],
            background_image_id: [""],
            image_id: [""],
            columns: this.fb.array([])
        });
        this.createRowObj();
        this.createColumnsObj(1);
        this.createColumns(1);
    }

    createRowObj() {
        this.row['background_image'] = {};
    }

    createColumnsObj(numOfColumns: number) {
        this.row['columns'] = [];
        for (var i = 0; i < numOfColumns; i++) {
            this.createColumnObj();
        }
    }

    createColumnObj() {
        this.row.columns.push({
            title: "",
            description: "",
            image: {},
            background_image: {}
        })
    }

    createColumns(numOfColumns: number) {
        let column = this.templateForm.get('columns') as FormArray;
        for (var i = 0; i < numOfColumns; i++) {
            column.push(this.createColumn());
        }
    }

    createColumn(): FormGroup {
        return this.fb.group({
            style: [""],
            title: [""],
            description: [""],
            image_id: [""],
            background_image_id: [""],
            link: [""],
            link_description: [""]
        });
    }
    
    onGetRowImg(imgs) {
        this.templateForm.patchValue({
            background_image_id: imgs[0].id
        });
    }

    onGetImageChange(imgs, index: number) {
        (<FormArray>this.templateForm.get('columns')).at(index).patchValue({
            image_id: imgs[0].id
        });
        this.updateColumnImage(imgs[0].url, index);
    }

    updateColumnImage(url, index){
        this.row.columns[index]['image']['url'] = url;
    }

    onGetBackgroundImageChange(imgs, index: number) {
        (<FormArray>this.templateForm.get('columns')).at(index).patchValue({
            background_image_id: imgs[0].id
        });
    }

    onSave() {
        this.websiteService.rowSubject.next(this.templateForm.value);
    }
    // componentStyle = {
    //     component: {
    //         //preset
    //         "background-repeat": "no-repeat, repeat",
    //         "background-size": "cover",
    //         " background-position": "50% center",
    //         "width": "100%",
    //         "min-height": "400px",
    //         display: "flex",
    //         // "justify-content": "center",
    //         "box-sizing": "border-box",
    //         "flex-direction": "row",
    //         "align-items": "center",
    //         "justify-content" : 
    //         "padding": "1vw 13vw",
    //         ///////////////

    //         //custom
    //         // "background-image": "url('https://orcasmart.com/assets/images/banner/campers.jpg')",
    //         "background-color": "white",
    //         color: "white",
    //         // height: "500px",


    //     },
    //     title: {
    //         // preset
    //         "padding": "1vw",

    //         //custom
    //         'font-size': "5vw",
    //     },
    //     content: {
    //         // preset
    //         "padding": "1vw",
    //     }
    // };
}