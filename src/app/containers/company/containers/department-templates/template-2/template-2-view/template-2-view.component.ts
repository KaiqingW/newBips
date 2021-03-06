import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { WebsiteService } from 'app/core/services/website.service';

@Component({
    selector: 'template-2-view',
    templateUrl: './template-2-view.component.html',
    styleUrls: ['./template-2-view.component.scss'],
})

export class Template2ViewComponent implements OnInit, OnChanges {
    @Input() row;
    @Input() isEdit: boolean = false;

    @Output() onEditContent = new EventEmitter<any>();

    company_id: number;
    templateForm: FormGroup;

    constructor(private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private websiteService: WebsiteService
    ) {
        this.company_id = + this.route.snapshot.paramMap.get('cid');
    }

    ngOnInit() {
    }

    ngOnChanges() {
    }

    getBackground(column) {
        if (!column || !column.background_image || !column.background_image.url) return {};
        return {
            "background-image": `linear-gradient(0deg, rgba(60, 65, 60, 0.4), rgba(77, 75, 75, 0.4)), url(${column.background_image.url})`
        }
    }

    onNavTo(url) {
        // this.router.navigate([url])
        window.location.href = url;
    }

    getBackgroundColor() {
        return this.isEdit ? 'grey' : 'white';
    }

    onDelete(row) {
        this.websiteService.deleteColumn(this.company_id, row.columns[0].row_id, row.id).subscribe(res => {
            console.log(res);
        });
        this.websiteService.removeRow.next();
    }

    onEdit(row) {
        console.log('template view', row);
        this.onEditContent.emit(row);
    }
}