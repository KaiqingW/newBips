import { Component, OnInit, ElementRef } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { TemplateService } from "app/core/services/template.service";

@Component({
  selector: "app-description",
  templateUrl: "./description.component.html",
  styleUrls: ["./description.component.scss"]
})
export class DescriptionComponent implements OnInit {
  textContent1;
  textContent2;
  textContent3;
  textContent4;
  textContent5;

  imageContent1;
  imageContent2;
  imageContent3;
  imageContent4;

  hasContent = false;

  chooseTemplateMode = false;
  selectedTemplate;

  templateID;
  departmentID;

  result = [];

  constructor(
    private routes: ActivatedRoute,
    private templateService: TemplateService,
    private ref: ElementRef
  ) {
    this.routes.params.subscribe((params: Params) => {
      this.departmentID = params["id"];
      this.templateService
        .getTemplate(this.routes.parent.snapshot.params['cid'], this.departmentID)
        .subscribe(res => {
          if (res.templates.length === 0) {
            this.templateID = 0;
            return;
          } else {
            this.hasContent = true;
            res.templates.map(el => {
              this.templateID = el.template_id;
            });
          }
        });
    });
  }

  ngOnInit() {
    this.routes.params.subscribe((params: Params) => {
      this.departmentID = params["id"];
      console.log(this.departmentID);
      this.templateService
        .getTemplate(this.routes.parent.snapshot.params['cid'], this.departmentID)
        .subscribe(res => {
          if (res.templates.length === 0) {
            this.clearContent();
            this.hasContent = false;
            return;
          }
          this.hasContent = true;
          res.templates.map(el => {
            this.templateID = el.template_id;
            if (el.part.includes("textContent")) {
              let part = el.part.split("textContent-")[1];
              document
                .getElementById(`textContent-${part}`)
                .getElementsByClassName("textContent")[0].innerHTML =
                el.content;
            } else if (el.part.includes("imageContent")) {
              let part = el.part.split("imageContent-")[1];
              document
                .getElementById(`imageContent-${part}`)
                .getElementsByClassName("imageContent")[0]
                .setAttribute("src", el.content);
            }
          });
        });
    });
  }

  clearContent() {
    const textContent = document.getElementsByClassName("textContent");
    for (let i = 0; i < textContent.length; i++) {
      textContent[i].innerHTML = "";
    }
    const imageContent = document.getElementsByClassName("imageContent");
    for (let i = 0; i < imageContent.length; i++) {
      imageContent[i].setAttribute("src", "");
    }
  }

  chooseTemplate(event) {
    const templateID = event.target.getAttribute("alt").split("template-")[1];
    this.selectedTemplate = templateID;
  }

  onConfirmTemplate() {
    this.templateID = +this.selectedTemplate;
    this.chooseTemplateMode = false;
    const hideImageContent = document.getElementsByClassName("imageContent");
    for (let i = 0; i < hideImageContent.length; i++) {
      hideImageContent[i].setAttribute("src", "");
    }
  }

  onCancelTemplate() {
    this.selectedTemplate = 0;
    this.chooseTemplateMode = false;
  }

  selectTemplate() {
    this.chooseTemplateMode = true;
  }

  appendTextContent1() {
    document
      .getElementById("textContent-1")
      .getElementsByClassName("textContent")[0].innerHTML = this.textContent1;
  }

  appendTextContent2() {
    document
      .getElementById("textContent-2")
      .getElementsByClassName("textContent")[0].innerHTML = this.textContent2;
  }

  appendTextContent3() {
    document
      .getElementById("textContent-3")
      .getElementsByClassName("textContent")[0].innerHTML = this.textContent3;
  }

  appendTextContent4() {
    document
      .getElementById("textContent-4")
      .getElementsByClassName("textContent")[0].innerHTML = this.textContent4;
  }

  appendTextContent5() {
    document
      .getElementById("textContent-5")
      .getElementsByClassName("textContent")[0].innerHTML = this.textContent5;
  }

  onSaveTextContent1(event) {
    this.textContent1 = event.html;
    this.appendTextContent1();
  }

  onSaveTextContent2(event) {
    this.textContent2 = event.html;
    this.appendTextContent2();
  }

  onSaveTextContent3(event) {
    this.textContent3 = event.html;
    this.appendTextContent3();
  }

  onSaveTextContent4(event) {
    this.textContent4 = event.html;
    this.appendTextContent4();
  }
  onSaveTextContent5(event) {
    this.textContent5 = event.html;
    this.appendTextContent5();
  }

  onSaveImageContent1(event) {
    this.imageContent1 = event;
    const image1 = document
      .getElementById("imageContent-1")
      .getElementsByClassName("imageContent")[0];
    image1.setAttribute("src", this.imageContent1);
  }

  onSaveImageContent2(event) {
    this.imageContent2 = event;
    const image = document
      .getElementById("imageContent-2")
      .getElementsByClassName("imageContent")[0];
    image.setAttribute("src", this.imageContent2);
  }

  onSaveImageContent3(event) {
    this.imageContent3 = event;
    const image = document
      .getElementById("imageContent-3")
      .getElementsByClassName("imageContent")[0];
    image.setAttribute("src", this.imageContent3);
  }

  onSaveImageContent4(event) {
    this.imageContent4 = event;
    const image = document
      .getElementById("imageContent-4")
      .getElementsByClassName("imageContent")[0];
    image.setAttribute("src", this.imageContent4);
  }



  onSaveForm() {
    const textContent = document.getElementsByClassName("textContent");
    const imageContent = document.getElementsByClassName("imageContent");
    for (let i = 0; i < textContent.length; i++) {
      this.result.push({
        part: `textContent-${i + 1}`,
        content: textContent[i].innerHTML,
        templateID: this.templateID
      });
    }
    for (let i = 0; i < imageContent.length; i++) {
      this.result.push({
        part: `imageContent-${i + 1}`,
        content: imageContent[i].getAttribute("src"),
        templateID: this.templateID
      });
    }
    this.templateService
      .addTemplate(this.routes.parent.snapshot.params['cid'], this.departmentID, { result: this.result })
      .subscribe(res => {
        alert(res[0]);
        this.result = [];
      });
  }

  preview() {
    const companyID = this.routes.parent.snapshot.params['cid'];
    const categoryID = this.routes.snapshot.params['id'];
    window.open(`http://localhost:4200/description/${companyID}/${categoryID}`);
  }
}
