import { Component, OnInit, OnDestroy } from '@angular/core';
import { VariableService } from '../../service/variable.service';
import { DataSourceService } from '../../service/data-source.service';
import { CrudService } from '../../service/crud.service';

@Component({
  selector: 'app-file-head',
  templateUrl: './file-head.component.html',
  styleUrls: ['./file-head.component.css']
})
export class FileHeadComponent implements OnInit, OnDestroy {

  public actionEvent = '';
  public changeHeaders = false;
  public changeHeadersValue: any[] = [];

  constructor(public variable: VariableService, public dataSource: DataSourceService, public crud: CrudService) { }

  ngOnInit(): void {
  }

  public handleChangeHeader() {
    this.changeHeaders = !this.changeHeaders;
    this.variable.selectedData.header.map(head => {
      this.changeHeadersValue.push({columnHeader: ''});
    });
  }

  ngOnDestroy(): void {
    this.actionEvent = '';
    this.changeHeaders = false;
    this.changeHeadersValue = [];
  }

}
