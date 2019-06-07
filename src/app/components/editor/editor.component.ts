import { Component, ElementRef, AfterViewInit, Output, EventEmitter, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import * as Quill from 'quill';
// import { BADRESP } from 'dns';

@Component({
  selector: 'editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  // providers: [{
  //   provide: NG_VALUE_ACCESSOR,
  //   useExisting: forwardRef(() => EditorComponent),
  //   multi: true
  // }]
})

export class EditorComponent implements AfterViewInit {

  @Output() onContentChanged: EventEmitter<any> = new EventEmitter();
  @Output() onEditor = new EventEmitter();
  // @Output() onSelectionChanged: EventEmitter<any> = new EventEmitter();
  @Input() defaultValue = '';
  @Input() defaultContent = '';

  editor: any;

  // store latest word
  latestWord: any;

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit() {
    const editorElement = this.elementRef.nativeElement.querySelector('#editor');
    this.editor = new Quill(editorElement, {
      modules: {
        toolbar: [
          //['image','','','bold','italic', 'underline',{ 'color': [] }]

          ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
          ['blockquote', 'code-block'],

          [{ 'header': 1 }, { 'header': 2 }],               // custom button values
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
          [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
          [{ 'direction': 'rtl' }],                         // text direction

          [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

          [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
          [{ 'font': [] }],
          [{ 'align': [] }],

          ['clean']                                         // remove formatting button

        ]
      },
      placeholder: 'Type the text here...',
      theme: 'snow',
    });

    console.log("editor here !!!!!!!!!", this.defaultValue);
    if (this.defaultValue) {
      this.editor.clipboard.dangerouslyPasteHTML(this.defaultValue["body"]);
    }

    if (this.defaultContent) {
      this.editor.clipboard.dangerouslyPasteHTML(this.defaultContent);
    }

    this.editor.on('text-change', (delta, oldDelta, source) => {
      // var characterRemaining;
      // characterRemaining = 200 - this.editor.getLength() + 1;
      //show remaining character at id counter
      // document.getElementById("counter").innerHTML = "Charachters Remaining: " + characterRemaining;
      //limit character in quill editor
      // const limit = 200;
      // if (this.editor.getLength() > limit) {
      //   this.editor.deleteText(limit, this.editor.getLength());
      // }
      const html = editorElement.children[0].innerHTML;
      const text = this.editor.getText();
      var strSplit = text.split(' ');
      this.latestWord = strSplit[strSplit.length - 1];
      // maximum possible word
      if (this.latestWord.length > 27) {
        this.editor.insertText(text.length - 2, ' ', 'bold', true);
      }
      const content = this.editor.getContents();
      this.onContentChanged.emit({
        editor: this.editor,
        html: html,
        text: text,
        content: content,
        delta: delta,
        oldDelta: oldDelta,
        source: source
      });
      // console.log('editor: ',this.editor);
      //   console.log('html: ',html);
      //     console.log('text: ',text);
      //     console.log('content: ', content);
      //       console.log('delta: ',delta);
      //         console.log('oldDelta: ',oldDelta);
      //             console.log('source: ',source);
    });

    this.onEditor.emit(this.editor);
  }

}
