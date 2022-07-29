import { Component, OnInit } from '@angular/core';
import { VariableService } from '../../service/variable.service';
import { CrudService } from '../../service/crud.service';
import { DataSourceService } from '../../service/data-source.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

  constructor(public variable: VariableService, public crud: CrudService, public dataSource: DataSourceService) { }

  ngOnInit(): void {
    
  }

  public getDataHeader(data) {
    return Object.keys(data);
  }

}
