import { Injectable } from '@angular/core';
import { VariableService } from './variable.service';
import { DataSourceService } from './data-source.service';

@Injectable({
  providedIn: 'root'
})
export class DefaultDragDropService {

  constructor(private variable: VariableService, private dataSourceService: DataSourceService) { }

  positionMobile(ev) {
    this.variable.mobile_last_move = ev;
  }

  allowDrop(ev) {
    ev.preventDefault();
  }

  drag(ev) {
    console.log("drag", ev);
    if (ev.type === "touchstart") {
      this.variable.mobile_item_selec = ev.target
        .closest(".drag-drawflow")
        .getAttribute("data-node");
    } else {
      ev.dataTransfer.setData("node", ev.target.getAttribute("data-node"));
    }
  }

  drop(ev) {
    console.log("drop", ev);
    if (ev.type === "touchend") {
      let parentdrawflow = document
        .elementFromPoint(
          this.variable.mobile_last_move.touches[0].clientX,
          this.variable.mobile_last_move.touches[0].clientY
        )
        .closest("#drawflow");
      if (parentdrawflow != null) {
        this.addNodeToDrawFlow(
          this.variable.mobile_item_selec,
          this.variable.mobile_last_move.touches[0].clientX,
          this.variable.mobile_last_move.touches[0].clientY
        );
      }
      this.variable.mobile_item_selec = "";
    } else {
      ev.preventDefault();
      let data = ev.dataTransfer.getData("node");
      this.addNodeToDrawFlow(data, ev.clientX, ev.clientY);
    }
  }

  addNodeToDrawFlow(name, pos_x, pos_y) {
    if (this.variable.editor.editor_mode === "fixed") {
      return false;
    }
    pos_x =
      pos_x *
        (this.variable.editor.precanvas.clientWidth /
          (this.variable.editor.precanvas.clientWidth * this.variable.editor.zoom)) -
      this.variable.editor.precanvas.getBoundingClientRect().x *
        (this.variable.editor.precanvas.clientWidth /
          (this.variable.editor.precanvas.clientWidth * this.variable.editor.zoom));
    pos_y =
      pos_y *
        (this.variable.editor.precanvas.clientHeight /
          (this.variable.editor.precanvas.clientHeight * this.variable.editor.zoom)) -
      this.variable.editor.precanvas.getBoundingClientRect().y *
        (this.variable.editor.precanvas.clientHeight /
          (this.variable.editor.precanvas.clientHeight * this.variable.editor.zoom));

    switch (name) {
      case "spreadsheet":
        let spreadsheet = `
        <div>
          <div class="title-box"><i class="fas fa-file-excel"></i><span id="spreadsheet" class="iconInfo"> SpreadSheet</span></div>
        </div>
        `;
        this.variable.editor.addNode(
          "spreadsheet",
          0,
          1,
          pos_x,
          pos_y,
          "spreadsheet",
          {},
          spreadsheet
        );
        break;
      case "database":
        let database = `
        <div>
          <div class="title-box"><i class="fas fa-server"></i> <span id="database" class="iconInfo"> Database</span></div>
        </div>
        `;
        this.variable.editor.addNode(
          "database",
          0,
          1,
          pos_x,
          pos_y,
          "database",
          {},
          database
        );
        break;
      case "text":
        let text = `
        <div>
          <div class="title-box"><i class="fas fa-file-alt"></i> <span id="text" class="iconInfo"> Text</span></div>
        </div>
        `;
        this.variable.editor.addNode(
          "text",
          0,
          1,
          pos_x,
          pos_y,
          "text",
          {},
          text
        );
        break;
      case "merge":
        let merge = `
        <div>
          <div class="title-box"><i class="fas fa-network-wired"></i> <span id="text" class="iconInfo"> Merge</span></div>
        </div>
        `;
        this.variable.editor.addNode(
          "merge",
          1,
          1,
          pos_x,
          pos_y,
          "Merge",
          {},
          merge
        );
        break;
      case "sort":
        let sort = `
        <div>
          <div class="title-box"><i class="fas fa-sort"></i> <span id="text" class="iconInfo"> Sort</span></div>
        </div>
        `;
        this.variable.editor.addNode(
          "sort",
          1,
          1,
          pos_x,
          pos_y,
          "sort",
          {},
          sort
        );
        break;
      case "projection":
        let projection = `
        <div>
          <div class="title-box"><i class="fas fa-sort"></i> <span id="text" class="iconInfo">Projection</span></div>
        </div>
        `;
        this.variable.editor.addNode(
          "projection",
          1,
          1,
          pos_x,
          pos_y,
          "projection",
          {},
          projection
        );
        break;
      case "decision_tree":
        let decision_tree = `
        <div>
          <div class="title-box"><i class="fas fa-network-wired"></i> <span id="text" class="iconInfo">Decision Tree</span></div>
        </div>
        `;
        this.variable.editor.addNode(
          "decision_tree",
          1,
          1,
          pos_x,
          pos_y,
          "decision_tree",
          {},
          decision_tree
        );
        break;
      case "regression":
        let regression = `
        <div>
          <div class="title-box"><i class="fas fa-sort"></i> <span id="text" class="iconInfo">Regression</span></div>
        </div>
        `;
        this.variable.editor.addNode(
          "regression",
          1,
          1,
          pos_x,
          pos_y,
          "regression",
          {},
          regression
        );
        break;
      case "correlation":
        let correlation = `
        <div>
          <div class="title-box"><i class="fas fa-sort"></i> <span id="text" class="iconInfo">Correlation</span></div>
        </div>
        `;
        this.variable.editor.addNode(
          "correlation",
          1,
          1,
          pos_x,
          pos_y,
          "correlation",
          {},
          correlation
        );
        break;
      case "uppercase":
        let uppercase = `
        <div>
          <div class="title-box">Upper Case [TEXT]</div>
        </div>
        `;
        this.variable.editor.addNode(
          "uppercase",
          1,
          1,
          pos_x,
          pos_y,
          "uppercase",
          {},
          uppercase
        );
        break;
      case "lowercase":
        let lowercase = `
        <div>
          <div class="title-box">Lower Case [text]</div>
        </div>
        `;
        this.variable.editor.addNode(
          "lowercase",
          1,
          1,
          pos_x,
          pos_y,
          "lowercase",
          {},
          lowercase
        );
        break;
      case "encode":
        let encode = `
        <div>
          <div class="title-box"><span id="text" class="iconInfo">Encode</span> [Text]</div>
        </div>
        `;
        this.variable.editor.addNode(
          "encode",
          1,
          1,
          pos_x,
          pos_y,
          "encode",
          {},
          encode
        );
        break;
      case "spreadsheetOutput":
        let spreadsheetOutput = `
        <div>
          <div class="title-box"><i class="fas fa-file-excel"></i><span id="spreadsheetOutput" class="iconInfo">Result.csv</span></div>
        </div>
        `;
        this.variable.editor.addNode(
          "spreadsheetOutput",
          1,
          0,
          pos_x,
          pos_y,
          "spreadsheetOutput",
          {},
          spreadsheetOutput
        );
        break;
      case "databaseOutput":
        let databaseOutput = `
        <div>
          <div class="title-box"><i class="fas fa-server"></i><span id="databaseOutput" class="iconInfo"> Database Output</span></div>
        </div>
        `;
        this.variable.editor.addNode(
          "databaseOutput",
          1,
          0,
          pos_x,
          pos_y,
          "databaseOutput",
          {},
          databaseOutput
        );
        break;
      case "textOutput":
        let textOutput = `
        <div>
          <div class="title-box"><i class="fas fa-file-alt"></i><span id="textOutput" class="iconInfo"> Text Output</span></div>
        </div>
        `;
        this.variable.editor.addNode(
          "textOutput",
          1,
          0,
          pos_x,
          pos_y,
          "textOutput",
          {},
          textOutput
        );
        break;
      default:
    }
  }

  changeModule(event) {
    let all = document.querySelectorAll(".menu ul li");
    for (let i = 0; i < all.length; i++) {
      all[i].classList.remove("selected");
    }
    event.target.classList.add("selected");
  }

  registerEvents(editor: any): void {
    editor.on("nodeCreated", id => {
      console.log("Node created " + id);
    });

    editor.on("nodeRemoved", id => {
      console.log("Node removed " + id);
    });

    editor.on("nodeSelected", id => {
      console.log("Node selected " + id);
      this.variable.selectedNode = id;
      const dataInnerHTML = editor.container.querySelector('#node-'+id+' .title-box .iconInfo') ? editor.container.querySelector('#node-'+id+' .title-box .iconInfo').innerHTML : '';
      console.log("Node selected ", id, dataInnerHTML);
      // Input Popup Event Trigger
      if (['spreadsheet','database','text'].indexOf(dataInnerHTML.toLowerCase().trim()) !== -1) {
        this.variable.popupSubTitle = dataInnerHTML.toLowerCase().trim();
        this.dataSourceService.openPopup('CHOOSE FILE','input');
      }
      // Action Popup Event Trigger
      else if (['merge','sort','projection'].indexOf(dataInnerHTML.toLowerCase().trim()) !== -1) {
        if (this.variable.stateWiseData[dataInnerHTML.toLowerCase().trim()].length) {
          this.variable.popupSubTitle = 'detail';
          this.variable.selectedRecordForDetail = this.variable.stateWiseData[dataInnerHTML.toLowerCase().trim()];
          this.dataSourceService.showData(this.variable.selectedRecordForDetail);
          this.dataSourceService.openPopup('Details of : ' + dataInnerHTML.toLowerCase().trim(), 'detail');
        } else {
          this.variable.popupSubTitle = dataInnerHTML.toLowerCase().trim();
          if (!this.variable.listOfDraggedFiles.action) {
            this.variable.listOfDraggedFiles.action = [];
          }
          if(typeof this.variable.listOfDraggedFiles.action === 'string'){
            this.variable.listOfDraggedFiles.action = [ this.variable.listOfDraggedFiles.action];
          }
          this.variable.listOfDraggedFiles.action.push(dataInnerHTML.toLowerCase().trim());
          this.dataSourceService.openPopup(dataInnerHTML.toLowerCase().trim()+' Action','action');
          this.variable.actionCommonColumns = this.variable.listOfDraggedFiles.actionCommonColumns;
        }
      }
      // Transformation Popup Event Trigger
      else if (['uppercase','lowercase','encode'].indexOf(dataInnerHTML.toLowerCase().trim()) !== -1) {
        if (this.variable.stateWiseData[dataInnerHTML.toLowerCase().trim()].length) {
          this.variable.popupSubTitle = 'detail';
          this.variable.selectedRecordForDetail = this.variable.stateWiseData[dataInnerHTML.toLowerCase().trim()];
          this.dataSourceService.showData(this.variable.selectedRecordForDetail);
          this.dataSourceService.openPopup('Details of : ' + dataInnerHTML.toLowerCase().trim(), 'detail');
        } else {
          this.variable.popupSubTitle = dataInnerHTML.toLowerCase().trim();
          this.dataSourceService.openPopup('Transformation: ' + this.variable.popupSubTitle, 'transformation');
        }
      }
      // Analysis Popup Event Trigger
      else if (['decision tree','regression','correlation'].indexOf(dataInnerHTML.toLowerCase().trim()) !== -1) {
        this.variable.popupSubTitle = dataInnerHTML.toLowerCase().trim();
        this.dataSourceService.saveAction();
        // this.dataSourceService.openPopup('Analysis: ' + this.variable.popupSubTitle, 'analysis');
      }
      else if((dataInnerHTML.toLowerCase().trim().includes("csv") || dataInnerHTML.toLowerCase().trim().includes("xlsx")) && !dataInnerHTML.toLowerCase().trim().includes("common fields")) {
        const iteratedTable = this.variable.uploadedDataList.filter(data => data.fileDetail.filename.toLowerCase().trim() === dataInnerHTML.toLowerCase().trim())[0];
        if (iteratedTable) {
          this.variable.popupSubTitle = 'detailData';
          this.variable.selectedRecordForDetail = iteratedTable.data;
        } else {
          this.variable.popupSubTitle = 'detail';
          this.variable.selectedRecordForDetail = this.variable.outputTable.data;
        }
        this.dataSourceService.showData(this.variable.selectedRecordForDetail);
        this.dataSourceService.openPopup('Details of : ' + dataInnerHTML.toLowerCase().trim().replaceAll('<br>', ''), 'detail');
      } else if(dataInnerHTML.toLowerCase().trim().includes("common fields")) {
        this.variable.selectedRecordForDetail = [];
        this.variable.popupSubTitle = 'detail';
        this.variable.selectedRecordForDetail = this.variable.stateWiseData.merge;
        this.dataSourceService.showData(this.variable.selectedRecordForDetail);
        this.dataSourceService.openPopup('Details of : ' + dataInnerHTML.toLowerCase().trim().replaceAll('<br>', ''), 'detail');
      }
    });

    editor.on("moduleCreated", name => {
      console.log("Module Created " + name);
    });

    editor.on("moduleChanged", name => {
      console.log("Module Changed " + name);
    });

    editor.on("connectionCreated", connection => {
      console.log("Connection created");
      console.log(connection);
    });

    editor.on("connectionRemoved", connection => {
      console.log("Connection removed");
      console.log(connection);
    });

    editor.on("mouseMove", position => {
      // console.log("Position mouse x:" + position.x + " y:" + position.y);
    });

    editor.on("nodeMoved", id => {
      console.log("Node moved " + id);
    });

    editor.on("zoom", zoom => {
      console.log("Zoom level " + zoom);
    });

    editor.on("translate", position => {
      console.log("Translate x:" + position.x + " y:" + position.y);
    });

    editor.on("addReroute", id => {
      console.log("Reroute added " + id);
    });

    editor.on("removeReroute", id => {
      console.log("Reroute removed " + id);
    });
  }

  drawflow(): any {
    return {
      drawflow: {
        Home: {
          data: { }
        }
      }
    };
  }
}
