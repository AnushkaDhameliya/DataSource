import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { TesteComponent } from "./teste/teste.component";
import Drawflow from "drawflow";
import { DefaultDragDropService } from './service/default-drag-drop.service';
import { VariableService } from './service/variable.service';
import { DataSourceService } from './service/data-source.service';
import { CrudService } from './service/crud.service';

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {

  @ViewChild(TesteComponent, { read: TemplateRef }) testeComponent: any;

  constructor(private sanitizer: DomSanitizer,
              private dragDropService: DefaultDragDropService,
              private dataSourceService: DataSourceService,
              public crud: CrudService,
              private variable: VariableService) {}

  ngOnInit(): void {
    this.variable.id = document.getElementById("drawflow");
    this.variable.editor = new Drawflow(this.variable.id);
    this.variable.listOfDraggedFiles = {
      data: [],
      action: null,
      actionCommonColumns: []
    };
    this.dragDropService.registerEvents(this.variable.editor);
    this.variable.editor.reroute = true;
    this.variable.editor.drawflow = this.dragDropService.drawflow();
    this.variable.editor.start();

    const elements = document.getElementsByClassName("drag-drawflow");
    for (let i = 0; i < elements.length; i++) {
      elements[i].addEventListener("touchend", this.dragDropService.drop, false);
      elements[i].addEventListener("touchmove", this.dragDropService.positionMobile, false);
      elements[i].addEventListener("touchstart", this.dragDropService.drag, false);
    }
  }

}
