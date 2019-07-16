import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { WebsiteService } from '../../../../../core/services/website.service';
@Component({
    selector: 'template-5',
    templateUrl: './template-5.component.html',
    styleUrls: ['./template-5.component.scss'],
})

export class Template5Component implements OnInit, OnChanges {
    @Input() row;
    @Input() isEdit: boolean = false;
    company_id: number;
    editMode = false;
    templateForm: FormGroup;

    constructor(private fb: FormBuilder,
        private route: ActivatedRoute,
        private websiteService: WebsiteService,
        private router: Router
    ) {
        this.company_id = + this.route.snapshot.paramMap.get('cid');
    }

    ngOnInit() {
    }

    ngOnChanges() {
        if (this.row.dummy_template) {
            this.createTemplateForm();
        }
    }

    getRowBackground(row) {
        return {
            "background-image": `url(${row.background_image.url})`
        }
    }

    onNavTo(url) {
        this.router.navigate([url])
    }

    getColumnBackground(column) {
        return {
            "background-image": `linear-gradient(0deg, rgba(60, 65, 60, 0.4), rgba(77, 75, 75, 0.4)), url(${column.background_image.url})`
        }
    }

    getColumnPicture(column) {
        if (column.image && column.image.url) {
            return column.image.url;
        }
        return "";
    }

    createTemplateForm() {
        this.templateForm = this.fb.group({
            template_id: 5,
            title: [""],
            description: [""],
            background_image_id: [""],
            image_id: [""],
            columns: this.fb.array([])
        });

        this.createRowObj();
        this.createColumnsObj(3);
        this.createColumns(3);

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

        this.updateRowBackgroundImage(imgs[0].url);
    }

    updateRowBackgroundImage(url) {
        this.row['background_image']['url'] = url;
    }

    onGetImageChange(imgs, index: number) {
        (<FormArray>this.templateForm.get('columns')).at(index).patchValue({
            image_id: imgs[0].id
        });
        this.updateColumnImage(imgs[0].url, index);
    }

    updateColumnImage(url, index) {
        console.log(url, this.row.columns[index]);
        this.row.columns[index]['image'].url = url;
    }

    onGetBackgroundImageChange(imgs, index: number) {
        (<FormArray>this.templateForm.get('columns')).at(index).patchValue({
            background_image_id: imgs[0].id
        });
    }

    onEdit(row) {
        console.log(row);
        let columns = new FormArray([]);
        for (let column of row.columns) {
            columns.push(new FormGroup({
                style: new FormControl(column.style),
                title: new FormControl(column.title),
                description: new FormControl(column.description),
                link: new FormControl(column.link),
                link_description: new FormControl(column.link_description),
                background_image: new FormControl(column.background_image),
                image_id: new FormControl(column.image.id),
                image: new FormGroup({
                    id: new FormControl(column.image.id),
                    url: new FormControl(column.image.url)
                })
            }))
        }
        this.templateForm = this.fb.group({
            template_id: 5,
            title: row.title,
            description: row.description,
            category_id: row.category_id,
            id: row.id,
            columns: columns,
            background_image: row.background_image,
            background_image_id: row.background_image.id
        });
        console.log(this.templateForm);
        this.isEdit = true;
        this.editMode = true;
    }

    onSave() {
        if (!this.editMode) {
            this.websiteService.rowSubject.next(this.templateForm.value);
        }
        else {
            console.log('save', this.templateForm.value);
            this.websiteService.updateRowSubject.next(this.templateForm.value);
            this.isEdit = false;
        }
    }

    onCancel() {
        this.editMode = false;
        this.isEdit = false;
    }
}