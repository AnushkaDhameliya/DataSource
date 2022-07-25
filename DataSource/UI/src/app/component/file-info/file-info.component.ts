import { Component, OnInit } from '@angular/core';
import { VariableService } from '../../service/variable.service';
import { DataSourceService } from '../../service/data-source.service';
import { CrudService } from '../../service/crud.service';

@Component({
  selector: 'app-file-info',
  templateUrl: './file-info.component.html',
  styleUrls: ['./file-info.component.css']
})
export class FileInfoComponent implements OnInit {

  public information = '';

  constructor(public variable: VariableService, public dataSource: DataSourceService, public crud: CrudService) { }

  ngOnInit(): void {
  }

}
