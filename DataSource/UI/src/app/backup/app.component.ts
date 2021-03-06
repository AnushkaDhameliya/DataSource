import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { TesteComponent } from "./teste/teste.component";
import Drawflow from "drawflow";
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import {TableUtil} from './tableUtil';
// import * as $ from 'jquery';

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})

export class AppComponent implements OnInit {

  @ViewChild(TesteComponent, { read: TemplateRef }) testeComponent: any;
  id: any = null;
  editor: any = null;
  transform: string = "";
  public primaryKey: string = "";
  public foreignKey: string = "";
  public selectedCoumns: any = [];
  mobile_item_selec: string = "";
  mobile_last_move: any = null;
  public popupFlag = false;
  public popupFlagExport = false;
  public popupFlagAction = false;
  public title = "";
  public responseData : any = [];
  public showTableView: 'list' | 'detail' | 'information' | 'header' = 'list';
  public selectedData : any = [];
  public selectedCols = [];
  public exportColumns = [];
  public selectedColumns = [];
  public selectedNode = null;
  public outputTable = [];
  public outputTableHeaders = [];
  public information = '';
  public actionEvent = '';
  public actionEventData: any = null;
  public headers = [];
  public headerAction = '';
  public actionCommonColumns = [];
  public showDetailData = false;
  public showDetailDataAction: 'info' | 'header' | 'data' = 'info';
  public showDetailDataInfo = false;
  public separatorList = [' ',',',';',"'",'"','!','@','~','#','$'];
  public choiceOfSeparator = '';
  public choiceOfSeparatorOther = '';
  public devideHeaders = [];
  public headerTxtInfo = [];
  public columnSeparatorArray = [{
    columnHeader: '',
    charRange: ''
  }];
  public headersQuestion = {
    q1: 'No',
    q2: ''
  };

  constructor(private sanitizer: DomSanitizer, public http: HttpClient) {
  }

  ngOnInit(): void {
    this.id = document.getElementById("drawflow");
    this.editor = new Drawflow(this.id);
    this.registerEvents(this.editor);
    this.editor.reroute = true;
    this.editor.drawflow = this.drawflow();
    this.editor.start();

    const elements = document.getElementsByClassName("drag-drawflow");
    for (let i = 0; i < elements.length; i++) {
      elements[i].addEventListener("touchend", this.drop, false);
      elements[i].addEventListener("touchmove", this.positionMobile, false);
      elements[i].addEventListener("touchstart", this.drag, false);
    }
    this.fetchLoadData();
  }

  public uploadData(e: any) {
    // console.log(e.target.files[0]['name']);
    const fileName = e.target.files[0]['name'];
    const fileDetails = {
      filename: fileName,
      fileType: fileName.split('.')[fileName.split('.').length - 1]
    };
    console.log(fileDetails);
    if (fileDetails.fileType === 'csv' || fileDetails.fileType === 'xlsx') {
      /* wire up file reader */
      // @ts-ignore
      const target: DataTransfer = <DataTransfer>(<unknown>event.target);
      if (target.files.length !== 1) {
        throw new Error('Cannot use multiple files');
      }
      const reader: FileReader = new FileReader();
      reader.readAsBinaryString(target.files[0]);
      reader.onload = (e: any) => {
        /* create workbook */
        const binarystr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });

        /* selected the first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        /* save data */
        const data = XLSX.utils.sheet_to_json(ws); // to get 2d array pass 2nd parameter as object {header: 1}
        const uploadedFileData = {
          fileDetail: fileDetails,
          data: data,
          header: Object.keys(data[0])
        };
        this.http.post('/getData', uploadedFileData).subscribe((resp) => {
          console.log('Success');
          this.fetchLoadData();
        });
      };
    } else if (fileDetails.fileType === 'txt' || fileDetails.fileType === 'sql') {
      let file = e.target.files[0];
      let fileReader: FileReader = new FileReader();
      let self = this;
      fileReader.onloadend = function (x) {
        console.log(fileReader.result);
        const data = fileReader.result;
        const uploadedFileData = {
          fileDetail: fileDetails,
          data: data,
          header: []
        };
        self.http.post('/getData', uploadedFileData).subscribe((resp) => {
          console.log('Success');
          self.fetchLoadData();
        });
      };
      fileReader.readAsText(file);
    }
  }

  public fetchLoadData() {
    this.http.get('/getData').subscribe((resp) => {
      this.responseData = resp;
      this.columnSeparatorArray = [{columnHeader: '', charRange: ''}];
      console.log(resp);
    });
  }

  public getSpecData(responseData, fileType) {
    if (this.title === 'SpreadSheet') {
      this.responseData = responseData.filter(resp => 'csv,xlsx'.includes(resp.fileDetail.fileType));
    } else if (this.title === 'Database') {
      this.responseData = responseData.filter(resp => 'sql'.includes(resp.fileDetail.fileType));
    } else if (this.title === 'Text') {
      this.responseData = responseData.filter(resp => 'txt'.includes(resp.fileDetail.fileType));
    } else {
      this.responseData = responseData;
    }
    return this.responseData;
  }

  positionMobile(ev) {
    this.mobile_last_move = ev;
  }

  allowDrop(ev) {
    ev.preventDefault();
  }

  drag(ev) {
    console.log("drag", ev);
    if (ev.type === "touchstart") {
      this.mobile_item_selec = ev.target
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
          this.mobile_last_move.touches[0].clientX,
          this.mobile_last_move.touches[0].clientY
        )
        .closest("#drawflow");
      if (parentdrawflow != null) {
        this.addNodeToDrawFlow(
          this.mobile_item_selec,
          this.mobile_last_move.touches[0].clientX,
          this.mobile_last_move.touches[0].clientY
        );
      }
      this.mobile_item_selec = "";
    } else {
      ev.preventDefault();
      let data = ev.dataTransfer.getData("node");
      this.addNodeToDrawFlow(data, ev.clientX, ev.clientY);
    }
  }

  addNodeToDrawFlow(name, pos_x, pos_y) {
    if (this.editor.editor_mode === "fixed") {
      return false;
    }
    pos_x = pos_x * (this.editor.precanvas.clientWidth / (this.editor.precanvas.clientWidth * this.editor.zoom)) - this.editor.precanvas.getBoundingClientRect().x * (this.editor.precanvas.clientWidth / (this.editor.precanvas.clientWidth * this.editor.zoom));
    pos_y = pos_y * (this.editor.precanvas.clientHeight / (this.editor.precanvas.clientHeight * this.editor.zoom)) - this.editor.precanvas.getBoundingClientRect().y * (this.editor.precanvas.clientHeight / (this.editor.precanvas.clientHeight * this.editor.zoom));
    switch (name) {
      case "decision_tree":
        let decision_tree = `
        <div>
          <div class="title-box"><i class="fas fa-network-wired"></i> decision_tree</div>
        </div>
        `;
        this.editor.addNode(
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
      case "projection":
        let projection = `
        <div>
          <div class="title-box"><i class="fas fa-sort"></i> Projection</div>
        </div>
        `;
        this.editor.addNode(
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
      case "regression":
        let regression = `
        <div>
          <div class="title-box"><i class="fas fa-sort"></i> Regression</div>
        </div>
        `;
        this.editor.addNode(
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
      case "action":
        let action = `
        <div>
          <div class="title-box"><i class="fas fa-location"></i> Select Action</div>
          <div class="box">
              <select df-channel>
                <option value="merge">Merge</option>
                <option value="filter">Filter</option>
                <option value="export">Export</option>
                <option value="searchWithin">SearchWithin</option>
              </select>
            </div>
          </div>
        </div>
        `;
        this.editor.addNode(
          "action",
          1,
          1,
          pos_x,
          pos_y,
          "action",
          {},
          action
        );
        break;
      case "merge":
        let merge = `
        <div>
          <div class="title-box"><i class="fas fa-network-wired"></i> <span id="text" class="iconInfo"> Merge</span></div>
        </div>
        `;
        this.editor.addNode(
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
          this.editor.addNode(
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
      case "text":
        let text = `
        <div>
          <div class="title-box"><i class="fas fa-file-alt"></i> <span id="text" class="iconInfo"> Text</span></div>
        </div>
        `;
        this.editor.addNode(
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
      case "database":
        let database = `
        <div>
          <div class="title-box"><i class="fas fa-server"></i> <span id="database" class="iconInfo"> Database<span></div>
        </div>
        `;
        this.editor.addNode(
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
      case "spreadsheet":
        let spreadsheet = `
        <div>
          <div class="title-box"><i class="fas fa-file-excel"></i><span id="spreadsheet" class="iconInfo"> SpreadSheet</span></div>
        </div>
        `;
        this.editor.addNode(
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
      case "textOutput":
        let textOutput = `
        <div>
          <div class="title-box"><i class="fas fa-file-alt"></i><span id="textOutput" class="iconInfo"> Text Output</span></div>
        </div>
        `;
        this.editor.addNode(
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
      case "databaseOutput":
        let databaseOutput = `
        <div>
          <div class="title-box"><i class="fas fa-server"></i><span id="databaseOutput" class="iconInfo"> Database Output</span></div>
        </div>
        `;
        this.editor.addNode(
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
      case "spreadsheetOutput":
        let spreadsheetOutput = `
        <div>
          <div class="title-box"><i class="fas fa-file-excel"></i><span id="spreadsheetOutput" class="iconInfo">export.csv</span></div>
        </div>
        `;
        this.editor.addNode(
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
      case "uppercase":
        let uppercase = `
        <div>
          <div class="title-box">Upper Case [TEXT]</div>
        </div>
        `;
        this.editor.addNode(
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
        this.editor.addNode(
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
          <div class="title-box">Encode [Text]</div>
        </div>
        `;
        this.editor.addNode(
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
      case "facebook":
        let facebook = `
        <div>
          <div class="title-box"><i class="fab fa-facebook"></i> Facebook Message</div>
        </div>
        `;
        this.editor.addNode(
          "facebook",
          0,
          1,
          pos_x,
          pos_y,
          "facebook",
          {},
          facebook
        );
        break;
      case "slack":
        let slackchat = `
          <div>
            <div class="title-box"><i class="fab fa-slack"></i> Slack chat message</div>
          </div>
          `;
        this.editor.addNode(
          "slack",
          1,
          0,
          pos_x,
          pos_y,
          "slack",
          {},
          slackchat
        );
        break;
      case "github":
        let githubtemplate = `
          <div>
            <div class="title-box"><i class="fab fa-github "></i> Github Stars</div>
            <div class="box">
              <p>Enter repository url</p>
            <input type="text" df-name>
            </div>
          </div>
          `;
        this.editor.addNode(
          "github",
          0,
          1,
          pos_x,
          pos_y,
          "github",
          { name: "" },
          githubtemplate
        );
        break;
      case "telegram":
        let telegrambot = `
          <div>
            <div class="title-box"><i class="fab fa-telegram-plane"></i> Telegram bot</div>
            <div class="box">
              <p>Send to telegram</p>
              <p>select channel</p>
              <select df-channel>
                <option value="channel_1">Channel 1</option>
                <option value="channel_2">Channel 2</option>
                <option value="channel_3">Channel 3</option>
                <option value="channel_4">Channel 4</option>
              </select>
            </div>
          </div>
          `;
        this.editor.addNode(
          "telegram",
          1,
          0,
          pos_x,
          pos_y,
          "telegram",
          { channel: "channel_3" },
          telegrambot
        );
        break;
      case "aws":
        let aws = `
          <div>
            <div class="title-box"><i class="fab fa-aws"></i> Aws Save </div>
            <div class="box">
              <p>Save in aws</p>
              <input type="text" df-db-dbname placeholder="DB name"><br><br>
              <input type="text" df-db-key placeholder="DB key">
              <p>Output Log</p>
            </div>
          </div>
          `;
        this.editor.addNode(
          "aws",
          1,
          1,
          pos_x,
          pos_y,
          "aws",
          { db: { dbname: "", key: "" } },
          aws
        );
        break;
      case "log":
        let log = `
            <div>
              <div class="title-box"><i class="fas fa-file-signature"></i> Save log file </div>
            </div>
            `;
        this.editor.addNode("log", 1, 0, pos_x, pos_y, "log", {}, log);
        break;
      case "google":
        let google = `
            <div>
              <div class="title-box"><i class="fab fa-google-drive"></i> Google Drive save </div>
            </div>
            `;
        this.editor.addNode("google", 1, 0, pos_x, pos_y, "google", {}, google);
        break;
      case "email":
        let email = `
            <div>
              <div class="title-box"><i class="fas fa-at"></i> Send Email </div>
            </div>
            `;
        this.editor.addNode("email", 1, 0, pos_x, pos_y, "email", {}, email);
        break;

      case "template":
        let template = `
            <div>
              <div class="title-box"><i class="fas fa-code"></i> Template</div>
              <div class="box">
                Ger Vars
                <textarea df-template></textarea>
                Output template with vars
              </div>
            </div>
            `;
        this.editor.addNode(
          "template",
          1,
          1,
          pos_x,
          pos_y,
          "template",
          { template: "Write your template" },
          template
        );
        break;
      case "multiple":
        let multiple = `
            <div>
              <div class="box">
                Multiple!
              </div>
            </div>
            `;
        this.editor.addNode(
          "multiple",
          3,
          4,
          pos_x,
          pos_y,
          "multiple",
          {},
          multiple
        );
        break;
      case "personalized":
        let personalized = `
            <div>
              Personalized
            </div>
            `;
        this.editor.addNode(
          "personalized",
          1,
          1,
          pos_x,
          pos_y,
          "personalized",
          {},
          personalized
        );
        break;
      case "dbclick":
        let dbclick = `
        <div>
          <div class="title-box"><i class="fas fa-mouse"></i> Db Click</div>
          <div class="box dbclickbox" [innerHTML]="'<app-teste></app-teste>'"</div>
        </div>
        `;
        this.editor.addNode(
          "dbclick",
          1,
          1,
          pos_x,
          pos_y,
          "dbclick",
          { name: "" },
          dbclick
        );
        break;

      default:
    }
  }

  public showpopup(e) {
    console.log("SHAZAM");
    e.target.closest(".drawflow-node").style.zIndex = "9999";
    e.target.children[0].style.display = "block";
    this.transform = this.editor.precanvas.style.transform;
    this.editor.precanvas.style.transform = "";
    this.editor.precanvas.style.left = this.editor.canvas_x + "px";
    this.editor.precanvas.style.top = this.editor.canvas_y + "px";
    console.log(this.transform);
    this.editor.editor_mode = "fixed";
  }

  public closemodal(e) {
    e.target.closest(".drawflow-node").style.zIndex = "2";
    e.target.parentElement.parentElement.style.display = "none";
    //document.getElementById("modalfix").style.display = "none";
    this.editor.precanvas.style.transform = this.transform;
    this.editor.precanvas.style.left = "0";
    this.editor.precanvas.style.top = "0";
    this.editor.editor_mode = "edit";
  }

  public changeModule(event) {
    let all = document.querySelectorAll(".menu ul li");
    for (let i = 0; i < all.length; i++) {
      all[i].classList.remove("selected");
    }
    event.target.classList.add("selected");
  }

  public registerEvents(editor: any): void {
    editor.on("nodeCreated", id => {
      console.log("Node created " + id);
    });

    editor.on("nodeRemoved", id => {
      console.log("Node removed " + id);
    });

    editor.on("nodeSelected", id => {
      const dataInnerHTML = editor.container.querySelector('#node-'+id+' .title-box .iconInfo') ? editor.container.querySelector('#node-'+id+' .title-box .iconInfo').innerHTML : '';
      console.log("Node selected ", id, dataInnerHTML);
      this.showTableView = 'list';
      this.fetchLoadData();
      if (dataInnerHTML.includes('export.csv')) {
        // this.popupFlagExport = true;
        // console.log(this.selectedData);
      } else if (dataInnerHTML.includes('Merge')) {
        this.popupFlagAction = true;
        this.actionEvent = 'Merge';
        console.log(this.selectedData);
        this.http.post('/action', {body: 'data'}).subscribe((resp) => {
          console.log('Success');
        });
      } else if (dataInnerHTML.includes('.csv') || dataInnerHTML.includes('.xlsx')) {
        this.actionEvent = 'Detail Information of ' + dataInnerHTML;
        this.popupFlagAction = true;
        this.actionEventData = this.selectedData[parseInt(id) - 1];
        console.log(this.selectedData);
      } else if (!dataInnerHTML.includes('Output')) {
        this.selectedNode = id;
        if (dataInnerHTML.includes('SpreadSheet')) {
          this.popupFlag = true;
          this.title = 'SpreadSheet';
        } else if (dataInnerHTML.includes('Database')) {
          this.popupFlag = true;
          this.title = 'Database';
        } else if (dataInnerHTML.includes('Text')) {
          this.popupFlag = true;
          this.title = 'Text';
        }
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

  public drawflow(): any {
    return {
      drawflow: {
        Home: {
          data: {}
        },
      }
    };
  }

  public showInformationDetailMode(resp: any) {
    this.showTableView = 'information';
    this.selectedData = resp;
  }

  public showHeaderDetailMode(resp: any) {
    this.showTableView = 'header';
    this.devideHeaders = [];
    if (resp.choiceOfSeparator && !resp.choiceOfSeparator.includes(this.separatorList)) {
      this.separatorList.push(resp.choiceOfSeparator);
    }
    this.choiceOfSeparator = resp.choiceOfSeparator ? resp.choiceOfSeparator : '';
    this.selectedData = resp;
  }

  public selectFile(resp: any) {
    this.selectedData[this.selectedNode - 1] = resp;
    document.querySelector("#node-" + this.selectedNode + " .title-box .iconInfo").innerHTML = resp.fileDetail.filename;
    this.popupFlag = false;
  }

  public showViewDetailMode(resp: any) {
    this.showTableView = 'detail';
    this.selectedData = resp;
    this.exportColumns = resp.header.map(col => ({title: col.header, dataKey: col.field}));
    this.selectedCols = resp.header;
    this.selectedColumns = resp.header;
  }

  public deleteRecord(resp: any) {
    // console.log(resp);
    if (confirm('Do you really want to delete ' + resp.fileDetail.filename + ' database?')) {
      this.http.delete('/getData/'+resp.id).subscribe((resp) => {
        console.log('Success');
        this.fetchLoadData();
      });
    }
  }

  public showOutput() {
    this.popupFlagExport = true;
    this.outputTable.length = 0;
    console.log(this.selectedData);
    let maxCount = this.selectedData[0].data.length > this.selectedData[1].data.length ? this.selectedData[0].data.length : this.selectedData[1].data.length;
    if (this.selectedData[0].data.length > this.selectedData[1].data.length) {
      this.selectedData[0].data.forEach((data, index) => {
        this.outputTable.push({
          ...data,
          ...this.selectedData[1].data[index]
        });
      });
      this.outputTableHeaders = Object.keys(this.outputTable[0]);
      console.log(this.outputTable);
    } else  {
      this.selectedData[1].data.forEach((data, index) => {
        this.outputTable.push({
          ...data,
          ...this.selectedData[0].data[index]
        });
      });
      this.outputTableHeaders = Object.keys(this.outputTable[0]);
      console.log(this.outputTable);
    }
  }

  public exportTable() {
    TableUtil.exportTableToExcel("outputTable");
  }

  public updateInformation() {
    // console.log(this.responseData);
    // console.log(this.selectedData.id);
    this.responseData.forEach(resp => {
      if (resp.id === this.selectedData.id) {
        resp['information'] = this.information;
      }
    });
    this.information = '';
    localStorage.setItem('mockData', JSON.stringify(this.responseData));
  }

  public updateHeaders() {
    this.responseData.forEach(resp => {
      if (resp.id === this.selectedData.id) {
        resp['header'] = this.headers;
      }
    });
    this.headers.length = 0;
    localStorage.setItem('mockData', JSON.stringify(this.responseData));
  }

  public onChangeColumnSelection(event, value) {
    console.log(event.target.checked, value);
    if (event.target.checked && !this.selectedCoumns.includes(value)) {
      this.selectedCoumns.push(value)
    } else {
      if (this.selectedCoumns.includes(value)) {
        this.selectedCoumns.splice(this.selectedCoumns.indexOf(value), 1);
      }
    }
    console.log(this.selectedCoumns);
  }

  public splitHeaders(event: any){
    console.log(event.target.value);
    // Getting headers from input text or sql
    if (this.selectedData.fileDetail.fileType === 'txt' || this.selectedData.fileDetail.fileType === 'sql') {
      this.devideHeaders = this.selectedData.data.split('\n')[0].split(event.target.value);
      this.devideHeaders = this.devideHeaders.filter(header => header);
      const mock = JSON.parse(localStorage.getItem('mockData'));
      mock.forEach(data => {
        if (data.id == this.selectedData.id) {
          data.header = this.devideHeaders;
        }
      });
      localStorage.setItem('mockData', JSON.stringify(mock))
      this.fetchLoadData();
    }
  }

  public saveChoiceOfSeparator() {
    if (this.selectedData.fileDetail.fileType === 'txt' || this.selectedData.fileDetail.fileType === 'sql') {
      const choiceOfSeparator = this.choiceOfSeparator === 'other' ? this.choiceOfSeparatorOther : this.choiceOfSeparator;
      let devideHeaders = this.selectedData.data.split('\n')[0].split(choiceOfSeparator);
      const uploadFiledata = this.selectedData.data.split('\n').map(info => info.split(choiceOfSeparator));
      // console.log(uploadFiledata);
      this.selectedData.data = uploadFiledata;
      devideHeaders = devideHeaders.filter(header => header);
      this.devideHeaders = devideHeaders.map(header => {
        return {
          title: header,
          column: ''
        }
      });
      this.selectedData.header = this.devideHeaders;
      this.selectedData.choiceOfSeparator = choiceOfSeparator;
      const mock = JSON.parse(localStorage.getItem('mockData'));
      mock.forEach(data => {
        if (data.id == this.selectedData.id) {
          data.header = this.devideHeaders;
          data.data = uploadFiledata;
          data.choiceOfSeparator = choiceOfSeparator;
        }
      });
      localStorage.setItem('mockData', JSON.stringify(mock))
      this.fetchLoadData();
    }
  }

  public saveChoiceOfSeparator1() {
    if (this.selectedData.fileDetail.fileType === 'txt' || this.selectedData.fileDetail.fileType === 'sql') {
      const choiceOfSeparator = this.choiceOfSeparator === 'other' ? this.choiceOfSeparatorOther : this.choiceOfSeparator;
      let devideHeaders = this.selectedData.data.split('\n')[0].split(choiceOfSeparator);
      const uploadFiledata = this.selectedData.data.split('\n').map(info => info.split(choiceOfSeparator));
      // console.log(uploadFiledata);
      if (this.headersQuestion.q1 === 'Yes') {
        this.selectedData.data = uploadFiledata.shift();
      }
      devideHeaders = devideHeaders.filter(header => header);
      this.devideHeaders = devideHeaders.map(header => {
        return {
          title: header,
          column: ''
        }
      });
      this.selectedData.header = this.devideHeaders;
      this.selectedData.choiceOfSeparator = choiceOfSeparator;
      const mock = JSON.parse(localStorage.getItem('mockData'));
      mock.forEach(data => {
        if (data.id == this.selectedData.id) {
          data.header = this.devideHeaders;
          data.data = uploadFiledata;
          data.choiceOfSeparator = choiceOfSeparator;
        }
      });
      localStorage.setItem('mockData', JSON.stringify(mock))
      this.fetchLoadData();
    }
  }

  public saveHeader() {
    const mock = JSON.parse(localStorage.getItem('mockData'));
    mock.forEach(data => {
      if (data.id == this.selectedData.id) {
        data.header = this.devideHeaders;
      }
    });
    localStorage.setItem('mockData', JSON.stringify(mock))
    this.fetchLoadData();
  }

  public getFirstTextLine(data) {
    return data.split('\n')[0];
  }

  public handleDataSeparator(id) {
    let responseData = JSON.parse(localStorage.getItem('mockData'));
    responseData.forEach(resp => {
      if (resp.id === this.selectedData.id) {
        let allLines = typeof resp.data === 'string' ? resp.data.split('\n') : resp.data;
        resp['header'] = this.columnSeparatorArray;
        let dataObj = [];
        allLines.map((line, index) => {
          dataObj[index] = {};
          this.columnSeparatorArray.map(col => {
            dataObj[index][col.columnHeader] = line.slice(parseInt(col.charRange.split(',')[0]), parseInt(col.charRange.split(',')[1]));
          });
        });
        resp['data'] = dataObj;
      }
    });
    localStorage.setItem('mockData', JSON.stringify(responseData));
    this.fetchLoadData();
  }

  public handleDataSeparator1(id) {
    let responseData = JSON.parse(localStorage.getItem('mockData'));
    responseData.forEach(resp => {
      if (resp.id === this.selectedData.id) {
        let allLines = typeof resp.data === 'string' ? resp.data.split('\n') : resp.data;
        if (this.headersQuestion.q1 === 'Yes') {
          allLines = allLines.shift();
        }
        resp['header'] = this.columnSeparatorArray;
        let dataObj = [];
        allLines.map((line, index) => {
          dataObj[index] = {};
          this.columnSeparatorArray.map(col => {
            dataObj[index][col.columnHeader] = line.slice(parseInt(col.charRange.split(',')[0]), parseInt(col.charRange.split(',')[1]));
          });
        });
        resp['data'] = dataObj;
      }
    });
    localStorage.setItem('mockData', JSON.stringify(responseData));
    this.fetchLoadData();
  }

  public addHeaders(id, headers) {
    let responseData = JSON.parse(localStorage.getItem('mockData'));
    if (this.headersQuestion.q2 === 'columnSeparate') {
      this.saveChoiceOfSeparator1();
    } else {
      this.handleDataSeparator1(id);
    }
    responseData = JSON.parse(localStorage.getItem('mockData'));
    responseData.forEach(resp => {
      if (resp.id === this.selectedData.id) {
        let allLines = typeof resp.data === 'string' ? resp.data.split('\n') : resp.data;
        resp['header'] = headers;
      }
    });
    localStorage.setItem('mockData', JSON.stringify(responseData));
    this.fetchLoadData();
  }
}
