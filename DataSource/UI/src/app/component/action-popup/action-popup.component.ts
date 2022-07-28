import { Component, OnInit } from '@angular/core';
import { VariableService } from '../../service/variable.service';
import { DataSourceService } from '../../service/data-source.service';
import { CrudService } from '../../service/crud.service';

@Component({
  selector: 'app-action-popup',
  templateUrl: './action-popup.component.html',
  styleUrls: ['./action-popup.component.css']
})
export class ActionPopupComponent implements OnInit {

  public sortColumnNames = '';
  public selectedCheckboxes = [];

  constructor(public variable: VariableService, public dataSource: DataSourceService, public crud: CrudService) { }

  ngOnInit(): void {
  }

  public onCheckboxChange(e) {
    if (e.target.checked) {
      this.selectedCheckboxes.push(e.target.value);
    } else {
      this.selectedCheckboxes.splice(this.selectedCheckboxes.indexOf(e.target.value),1);
    }
  }

}
