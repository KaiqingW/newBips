import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { InventoryService } from 'app/core/services/inventory.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'add-sales-pitch',
    templateUrl: './add-sales-pitch.component.html',
    styleUrls: ['./add-sales-pitch.component.scss']
})

export class AddSalesPitchComponent implements OnInit {
    imgsMap = new Map<number, any>();
    selectedImgIndex: number;
    modalOpen: boolean = false;
    @Output() sendOnDelete = new EventEmitter<any>();
    @Output() sendOnAdd = new EventEmitter<any>();
    @Output() sendRichTxt = new EventEmitter<any>();
    @Input() index: number;
    @Input() sale_pitch_number : number;
    fd = new FormData();
    company_id: number;
    img;
    @Output() sendImg = new EventEmitter<any>();

    constructor(private inventoryService: InventoryService,
        private route: ActivatedRoute) {
        this.company_id = +this.route.snapshot.paramMap.get('cid');
    }

    ngOnInit() {

    }

    // onFileSelected(event, i){
    //     if (event.target.files[0]) {
    //         this.selectedImgIndex = i;
    //         let selectedFile = <File>event.target.files[0];

    //         const myReader: FileReader = new FileReader();
    //         const image = new Image();

    //         myReader.onload = (event : ProgressEvent) => {
    //                 let url = (<FileReader>event.target).result;
    //                 this.imgsMap.set(i, url);
    //         };


    //         myReader.readAsDataURL(selectedFile);
    //         this.onAddImg(i, selectedFile);
    //       }
    // }
    onFileSelected(event) {
        if (event.target.files[0]) {
            let file = event.target.files[0];
            this.fd.append('size', file.size);
            this.fd.append('type', file.type);
            this.fd.append('image', file, file.name);
            this.fd.append('description', file.type);
            this.inventoryService.uploadImage(this.company_id, this.fd).subscribe(
                (res) => {
                    this.img = res;
                    this.sendImg.emit({
                        index: this.index,
                        image_id: this.img.id
                    });
                }
            )
        }
    }

    onAddImg(index, selectedFile) {
        const fd = new FormData();
        fd.append('image', selectedFile, selectedFile.name);
    }

    onDelete() {
        this.sendOnDelete.emit(this.index);
    }

    onAddMore() {
        this.sendOnAdd.emit();
    }

    logChange(event) {
        this.sendRichTxt.emit({ richTxt: event.html, index: this.index });
    }
}