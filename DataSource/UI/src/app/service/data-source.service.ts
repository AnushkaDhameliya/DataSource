import { Injectable } from '@angular/core';
import { VariableService } from './variable.service';
import { CrudService } from './crud.service';
import {TableUtil} from '../tableUtil';

@Injectable({
  providedIn: 'root'
})
export class DataSourceService {

  constructor(private variable: VariableService, private crud: CrudService) { }

  public openPopup(title = 'Data Source', action='input') {
    this.variable.popupFlag = true;
    /*this.variable.outputTable = {
      data: [],
      header: []
    };
    if (this.variable.listOfDraggedFiles.action && this.variable.listOfDraggedFiles.action.includes('merge')) {
      /*this.http.post('/action', {body: this.variable.listOfDraggedFiles.data}).subscribe((resp) => {
        console.log('Success', resp);
      });* /
      let maxDataCount = 0;
      this.variable.listOfDraggedFiles.data.map(data => {
        maxDataCount = maxDataCount < data.data.length ? data.data.length : maxDataCount; 
      })
      console.log(maxDataCount);
      for (let i = 0; i < maxDataCount; i++) {
        let outputData = [];
        this.variable.listOfDraggedFiles.data.map(selData => {
          outputData = {
            ...outputData,
            ...selData.data[i]
          };
        });
        this.variable.outputTable.data.push(outputData);
      }
      this.variable.outputTable.header = Object.keys(this.variable.outputTable.data[0]);
    }*/
    this.setPopupDetails(title, action);
  }

  public setPopupDetails(title = null, action = null) {
    this.variable.popupTitle = title;
    this.variable.popupAction = action;
  }

  public closePopup() {
    this.variable.popupFlag = false;
    this.setPopupDetails();
  }

  public showInfo(resp: any) {
    this.variable.selectedData = resp;
    this.variable.popupTitle = 'About ' + resp.fileDetail.filename;
    this.variable.popupAction = 'file-info';
  }

  public showData(resp: any) {
    if (resp.data) {
      this.variable.selectedData = resp;
      this.variable.popupTitle = 'Details ';
    } else {
      this.variable.selectedData = resp;
      try {
        this.variable.popupTitle = 'Data ' + resp.fileDetail ? resp.fileDetail.filename : '';
      } catch (e) {
        this.variable.popupTitle = 'Data in detail';
      }
    }
    this.variable.popupAction = 'file-data';
  }

  public showHead(resp: any) {
    if (resp.data) {
      this.variable.selectedData = resp;
      this.variable.popupTitle = 'Details ';
    } else {
      this.variable.selectedData = resp;
      this.variable.popupTitle = 'Data ' + resp.fileDetail.filename;
    }
    this.variable.popupAction = 'file-head';
  }

  public backToList() {
    this.variable.popupAction = 'input';
    this.variable.popupTitle = 'CHOOSE FILE';
  }

  public backToAction() {
    this.variable.popupAction = 'action';
    this.variable.popupTitle = 'MERGE ACTION';
  }

  public backToDetail() {
    this.variable.popupAction = 'detail';
    this.variable.popupTitle = 'Details of : ' + this.variable.selectedRecordForDetail.fileDetail.filename;
  }

  public selectFile(resp) {
    this.variable.listOfDraggedFiles.data.push(resp);
    document.querySelector("#node-" + this.variable.selectedNode + " .title-box .iconInfo").innerHTML = resp.fileDetail.filename;
    this.variable.popupFlag = false;
  }

  public saveAction(funParam?: any) {
    this.variable.listOfDraggedFiles.actionCommonColumns = this.variable.actionCommonColumns;
    this.variable.listOfDraggedFiles.action = this.variable.popupSubTitle;
    if (this.variable.popupSubTitle === 'merge') {
      const param = {
        "ActionName" : "Merge",
        "fileList" : this.variable.listOfDraggedFiles.data.map(data => data.fileDetail.filePath),
        "mergeColumn" : this.variable.listOfDraggedFiles.actionCommonColumns[0],
        "sortColumnNames" : [],
        "projectColumns" : [],
        "outputFileName" : "",
        "encodingColumns" : [],
        "x_columns" : [],
        "y_columns" : "",
        "jsonData" : ""
      };
      this.crud.handleMergeAction('/action/', param).subscribe(resp => {
        console.log(resp);
        this.variable.outputTable.data = resp;
        // @ts-ignore
        this.variable.stateWiseData.merge = resp;
        this.variable.outputTable.header = Object.keys(resp[0]);
      });
      document.querySelector("#node-" + this.variable.selectedNode + " .title-box .iconInfo").innerHTML = 'Merge <br/>Common Fields: ' + this.getActionSummary();

    } else if (this.variable.popupSubTitle === 'sort' || this.variable.popupSubTitle === 'projection' || this.variable.popupSubTitle === 'encode') {
      let param = {};
      if (this.variable.popupSubTitle !== 'encode') {
        param = {
          "ActionName" : (this.variable.popupSubTitle === 'sort') ? "Sort" : "Projection",
          "sortColumnNames" : (this.variable.popupSubTitle === 'sort') ? funParam : [],
          "fileList": [],
          "mergeColumn" : "",
          "projectColumns" : (this.variable.popupSubTitle === 'projection') ? funParam : [],
          "outputFileName" : "",
          "encodingColumns" : [],
          "x_columns" : [],
          "y_columns" : "",
          "jsonData" : this.variable.outputTable.data.length ? JSON.stringify(this.variable.outputTable.data) : JSON.stringify([])
        };
      } else {
        param = {
          "ActionName" : "Encode",
          "fileList": [],
          "mergeColumn" : "",
          "projectColumns" : [],
          "outputFileName" : "",
          "sortColumnNames" : [],
          "x_columns" : [],
          "y_columns" : "",
          "encodingColumns" : funParam,
          "jsonData" : this.variable.outputTable.data.length ? JSON.stringify(this.variable.outputTable.data) : JSON.stringify([])
        }
      }
      this.crud.handleMergeAction('/action/', param).subscribe(resp => {
        console.log(resp);
        this.variable.outputTable.data = resp;
        // @ts-ignore
        this.variable.stateWiseData[this.variable.popupSubTitle] = resp;
        this.variable.outputTable.header = Object.keys(resp[0]);
      });
    } else if (this.variable.popupSubTitle === 'decision tree') {
      const param = {
        "ActionName" :  "Decision Tree" ,
        "fileList": [],
        "mergeColumn" : "",
        "projectColumns" : [],
        "outputFileName" : "",
        "encodingColumns" : [],
        "jsonData" : this.variable.outputTable.data.length ? JSON.stringify(this.variable.outputTable.data) : JSON.stringify([])
      };
      this.crud.handleMergeAction('/action/', param).subscribe(resp => {
        console.log(resp);
        this.variable.accuracy = resp['accuracy'];
      });
    } else if (this.variable.popupSubTitle === 'correlation') {
      const param = {
        "ActionName" : "Correlation",
        "fileList": [],
        "mergeColumn" : "",
        "projectColumns" : [],
        "outputFileName" : "C:/Users/onkar/Desktop/graph/output2.png",
        "sortColumnNames" : [],
        "encodingColumns" : [],
        "jsonData" : this.variable.outputTable.data.length ? JSON.stringify(this.variable.outputTable.data) : JSON.stringify([])
      }
      this.crud.handleMergeAction('/action/', param).subscribe(resp => {
        console.log(resp);
        // @ts-ignore
        this.variable.stateWiseData[this.variable.popupSubTitle] = resp;
        if(typeof resp === 'string') {
          //@ts-ignore
          this.variable.Correlation_matrix_encodedString = 'data:image/jpeg;base64,' + JSON.parse(resp).Correlation_matrix_encodedString.substring(2, resp['Correlation_matrix_encodedString'].length - 1);
          this.variable.High_Correaltion_graph_encodedString = 'data:image/jpeg;base64,' + JSON.parse(resp).High_Correaltion_graph_encodedString.substring(2, resp['High_Correaltion_graph_encodedString'].length - 1);
          this.variable.Low_Correaltion_graph_encodedString = 'data:image/jpeg;base64,' + JSON.parse(resp).Low_Correaltion_graph_encodedString.substring(2, resp['Low_Correaltion_graph_encodedString'].length - 1);
          this.variable.Medium_Correaltion_graph_encodedString = 'data:image/jpeg;base64,' + JSON.parse(resp).Medium_Correaltion_graph_encodedString.substring(2, resp['Medium_Correaltion_graph_encodedString'].length - 1);
        } else {
          this.variable.Correlation_matrix_encodedString = 'data:image/jpeg;base64,' + resp['Correlation_matrix_encodedString'].substring(2, resp['Correlation_matrix_encodedString'].length - 1);
          this.variable.High_Correaltion_graph_encodedString = 'data:image/jpeg;base64,' + resp['High_Correaltion_graph_encodedString'].substring(2, resp['High_Correaltion_graph_encodedString'].length - 1);
          this.variable.Low_Correaltion_graph_encodedString = 'data:image/jpeg;base64,' + resp['Low_Correaltion_graph_encodedString'].substring(2, resp['Low_Correaltion_graph_encodedString'].length - 1);
          this.variable.Medium_Correaltion_graph_encodedString = 'data:image/jpeg;base64,' + resp['Medium_Correaltion_graph_encodedString'].substring(2, resp['Medium_Correaltion_graph_encodedString'].length - 1);
        }
        if (this.variable.popupSubTitle !== 'decision tree'){
          // @ts-ignore
          this.variable.outputTable.data = typeof resp.jsonData === 'string' ? JSON.parse(resp.jsonData) : resp.jsonData;
          this.variable.outputTable.header = Object.keys(this.variable.outputTable.data[0]);
        }
      });
    }
    this.variable.actionCommonColumns = [];
    this.variable.popupFlag = false;
  }

  public getActionSummary() {
    let summary = '';
    this.variable.listOfDraggedFiles.data.map((file, index) => {
      summary = summary + ' ' + file.fileDetail.filename + ' [' + this.variable.listOfDraggedFiles.actionCommonColumns[index] + ']<br/>';
    });
    return summary;
  }

  public getFirstTextLine(data) {
    try {
      return data.split('\n')[0];
    } catch(e) {
      return '';
    }
  }

  public isString(data) {
    return typeof data === 'string';
  }

  public addNewLineWithBr(data) {
    return data.replace('\n', '<br/>')
  }

  public saveHeadersWithColumnSeparate() {
    this.variable.selectedData.header = this.getFirstTextLine(this.variable.selectedData.data).split(this.variable.selectedData.choiceOfSeparator === 'other' ? this.variable.selectedData.choiceOfSeparatorOther : this.variable.selectedData.choiceOfSeparator).map(option => {return{'columnHeader': option}});
  }

  public exportTable() {
    TableUtil.exportTableToExcel("outputTable");
  }

  public getDataHeader(data) {
    return Object.keys(data);
  }
}
