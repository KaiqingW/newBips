import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
    selector: 'orders-icon-card',
    templateUrl: './icon-card.component.html',
    styleUrls: ['./icon-card.component.scss']
})

export class IconCardComponent implements OnInit, OnChanges {
    @Input() items;
    icon_pics = [
        'assets/images/icons/ground-shipping.png',
        "assets/images/icons/container-shipping.png",
        "assets/images/icons/customs.png",
        "assets/images/icons/ground-shipping.png",
        "assets/images/icons/received.png",
        "assets/images/icons/finish.png"
    ]
    
    constructor() { }

    ngOnInit() {

    }

    ngOnChanges(){
        if(this.items){
            this.items.forEach(item => {
                item.container_information.sort(this.sortContainerInfo)
            })
        }
    }

    sortContainerInfo(item1, item2){
        return item1.type - item2.type
    }

    navToItem(item) {
        // this.sendNav.emit(item);
    }

    getPic(type, shipping_method){
        if(type == 1 && shipping_method == 'air') return 'assets/images/icons/airplane.png';
        return this.icon_pics[type];
    }
}