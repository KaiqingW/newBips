import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { WebsiteService } from '../../../../../core/services/website.service';

@Component({
    selector: 'template-7',
    templateUrl: './template-7.component.html',
    styleUrls: ['./template-7.component.scss'],
})

export class Template7Component implements OnInit, OnChanges {
    @Input() row;
    @Input() isEdit: boolean = false;
    templateForm: FormGroup;
    company_id: number;
    sub: Subscription;
    editMode = false;

    componentStyle = {
        component: {
            //preset
            "background-repeat": "no-repeat, repeat",
            "background-size": "cover",
            " background-position": "50% center",
            "width": "100%",
            "min-height": "600px",
            display: "flex",
            "position": "relative",
            "justify-content": "center",
            "box-sizing": "border-box",
            "flex-direction": "column",
            "align-items": "center",
            "padding": "1vw 13vw",
            ///////////////

            //custom
            // "background-image": "url('https://orcasmart.com/assets/images/banner/campers.jpg')",
            // "background-color": "white",
            color: "white",
            // height: "500px",


        },
        title: {
            // preset
            "padding": "1vw",

            //custom
            'font-size': "5vw",
        },
        content: {
            // preset
            "padding": "1vw",
            "font-size": "1.5rem"
        }
    };

    constructor(private fb: FormBuilder,
        private route: ActivatedRoute,
        private websiteService: WebsiteService
    ) {
        this.company_id = + this.route.snapshot.paramMap.get('cid');
    }

    ngOnInit() {
        // this.componentStyle.component['background-image'] = "url('https://orcasmart.com/assets/images/banner/campers.jpg')";
        this.createTemplateForm();
    }

    ngOnChanges() {
        if (this.row) {
            this.getBackgroundPicture();
            this.patchFormValue();
        }
    }

    getBackgroundPicture() {
        if (this.row.dummy_template) return;
        this.componentStyle.component["background-image"] = `url(${this.row.background_image.url})`;
    }

    createTemplateForm() {
        this.templateForm = this.fb.group({
            template_id: 7,
            title: [""],
            description: [""],
            background_image_id: [""],
            link_description: [""],
            link: [""]
        });
    }

    patchFormValue() {

    }

    onSave() {
        if (!this.editMode) {
            this.websiteService.rowSubject.next(this.templateForm.value);
        }
        else {
            this.websiteService.updateRowSubject.next(this.templateForm.value);
            this.isEdit = false;
        }
    }

    onGetImageChange(imgs) {
        this.templateForm.patchValue({
            background_image_id: imgs[0].id
        });
        this.setBackgroundImg(imgs[0]);
    }

    setBackgroundImg(img) {
        this.componentStyle.component["background-image"] = `url(${img.url})`;
        console.log(this.componentStyle);
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
                background_image_id: new FormControl(column.background_image.id)
            }))
        }
        this.templateForm = this.fb.group({
            template_id: 7,
            title: row.title,
            description: row.description,
            category_id: row.category_id,
            id: row.id,
            columns: columns,
            link: row.link,
            link_description: row.link_description,
            background_image_id: row.background_image.id
        });
        console.log(this.templateForm);
        this.isEdit = true;
        this.editMode = true;
    }

    onDelete(row) {
        console.log(row);
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

    onCancel() {
        this.editMode = false;
        this.isEdit = false;
    }
}