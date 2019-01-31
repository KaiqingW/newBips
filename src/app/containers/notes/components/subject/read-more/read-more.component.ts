import { Component, OnInit, ViewChild, Pipe } from '@angular/core';
import { Input, ElementRef, AfterViewInit } from '@angular/core';
//to detect changes after view init
import { ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'read-more',
    templateUrl: './read-more.component.html',
    styleUrls: ['./read-more.component.css']
  })
  export class ReadMoreComponent implements OnInit, AfterViewInit
  {
      //the text that need to be put in the container
    @Input() text: string;

    //maximum height of the container
    maxHeight: number = 52;

    //set these to false to get the height of the expended container 
    public isCollapsed: boolean = false;
    public isCollapsable: boolean = false;
    constructor(private elementRef: ElementRef, private cdRef:ChangeDetectorRef
      ) { }

  ngAfterViewInit() {
      //try block for if current Height is null
        try{
            let currentHeight = this.elementRef.nativeElement.getElementsByTagName('div')[0].offsetHeight;
            if (currentHeight > this.maxHeight) {
                this.isCollapsed = true;
                this.isCollapsable = true;
                //reflect changes to html div
                this.cdRef.detectChanges();
            }
        }
        catch(e){
            // empty description
        }
    }
  ngOnInit() {
  }
  }