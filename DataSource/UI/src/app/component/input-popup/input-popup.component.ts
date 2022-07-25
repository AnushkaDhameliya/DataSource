import { Component, OnInit } from '@angular/core';
import { VariableService } from '../../service/variable.service';
import { CrudService } from '../../service/crud.service';
import { DataSourceService } from '../../service/data-source.service';

@Component({
  selector: 'app-input-popup',
  templateUrl: './input-popup.component.html',
  styleUrls: ['./input-popup.component.css']
})
export class InputPopupComponent implements OnInit {

  constructor(public variable: VariableService, public crud: CrudService, public dataSource: DataSourceService) { }

  ngOnInit(): void {
    // this.crud.getData('./'+this.variable.popupSubTitle);
    this.crud.getData('/getData');
  }

}
