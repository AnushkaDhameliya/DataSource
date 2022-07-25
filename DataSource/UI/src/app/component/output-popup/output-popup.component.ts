import { Component, OnInit } from '@angular/core';
import { VariableService } from '../../service/variable.service';
import { DataSourceService } from '../../service/data-source.service';
import { CrudService } from '../../service/crud.service';

@Component({
  selector: 'app-output-popup',
  templateUrl: './output-popup.component.html',
  styleUrls: ['./output-popup.component.css']
})
export class OutputPopupComponent implements OnInit {

  public viewData: boolean = true;

  constructor(public variable: VariableService, public dataSource: DataSourceService, public crud: CrudService) { }

  ngOnInit(): void {
  }

}
