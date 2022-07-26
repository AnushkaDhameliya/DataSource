import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { VariableService } from './variable.service';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  public dataFormat = {
    spreadsheet: ['xlsx','csv'],
    database: ['sql'],
    text: ['txt']
  };

  constructor(public http: HttpClient, public variable: VariableService) { }

  public getData(url) {
    this.variable.uploadedDataList = [];
    this.getDataObservable(url).subscribe(resp => {
      //@ts-ignore
      this.variable.uploadedDataList = resp.filter(data => this.dataFormat[this.variable.popupSubTitle.trim().toLowerCase()].includes(data.fileDetail.fileType));
      //@ts-ignore
      this.variable.uploadedDataListBckUp = resp.filter(data => this.dataFormat[this.variable.popupSubTitle.trim().toLowerCase()].includes(data.fileDetail.fileType));
    });
  }

  public getDataObservable(url) {
    return this.http.get(url);
  }

  public uploadData(e: any) {
    // console.log(e.target.files[0]['name']);
    console.log(e.target.value);
    console.log(e.target.result);
    const fileName = e.target.files[0]['name'];
    const fileDetails = {
      filename: fileName,
      fileType: fileName.split('.')[fileName.split('.').length - 1],
      filePath: "C:\\Users\\onkar\\Downloads\\" + fileName
    };
    // console.log(fileDetails);
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
          information: '',
          separator: '',
          header: Object.keys(data[0]).map(key => {
            return {'columnHeader': key}
          })
        };
        this.http.post('/getData', uploadedFileData).subscribe((resp) => {
          // console.log('Success');
          this.getData('/getData');
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
          self.getData('/getData');
        });
      };
      fileReader.readAsText(file);
    }
  }

  public deleteRecord(resp: any) {
    // console.log(resp);
    if (confirm('Do you really want to delete ' + resp.fileDetail.filename + ' database?')) {
      this.http.delete('/getData/'+resp.id).subscribe((resp) => {
        this.getData('/getData');
      });
    }
  }

  public updateInformation(data) {
    this.variable.selectedData.information = data;
    const uploadedDataList = JSON.parse(localStorage.getItem('mockData'));
    uploadedDataList.forEach(resp => {
      if (resp.id === this.variable.selectedData.id) {
        resp['information'] = this.variable.selectedData.information;
      }
    });
    localStorage.setItem('mockData', JSON.stringify(uploadedDataList));
    this.getData('/getData');
    this.variable.popupAction = 'input';
  }

  public updateHeader() {
    const uploadedDataList = JSON.parse(localStorage.getItem('mockData'));
    uploadedDataList.forEach(resp => {
      if (resp.id === this.variable.selectedData.id) {
        resp['header'] = this.variable.selectedData.header;
      }
    });
    localStorage.setItem('mockData', JSON.stringify(uploadedDataList));
    this.getData('/getData');
  }

  public updateContent(actionEvent, character = null) {
    const uploadedDataList = JSON.parse(localStorage.getItem('mockData'));
    if (actionEvent === 'speicalChar') {
      uploadedDataList.forEach(resp => {
        if (resp.id === this.variable.selectedData.id) {
          if (this.variable.headersQuestion.q1 === 'Yes') {
            resp['data'] = this.variable.selectedData.data.split('\n').map(info => info.split(this.variable.selectedData.choiceOfSeparator)).slice(1);
          } else {
            resp['data'] = this.variable.selectedData.data.split('\n').map(info => info.split(this.variable.selectedData.choiceOfSeparator));
          }
        }
      });
    } else {
      uploadedDataList.forEach(resp => {
        if (resp.id === this.variable.selectedData.id) {
          this.variable.selectedData.data.split('\n').map((info, index) => {
            this.variable.columnSeparatorArray.map((range,indexj) => {
              resp['data'][index][indexj] = info.substring(range.columnHeader);
            })
          })
        }
      });
    }
    localStorage.setItem('mockData', JSON.stringify(uploadedDataList));
    this.getData('/getData');
  }

  public handleMergeAction(url, data) {
    return this.http.post(url, data);
  }
}
