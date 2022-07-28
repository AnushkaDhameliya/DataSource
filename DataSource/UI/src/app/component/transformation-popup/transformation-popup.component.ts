import { Component, OnInit } from '@angular/core';
import { VariableService } from '../../service/variable.service';
import { DataSourceService } from '../../service/data-source.service';
import { CrudService } from '../../service/crud.service';

@Component({
  selector: 'app-transformation-popup',
  templateUrl: './transformation-popup.component.html',
  styleUrls: ['./transformation-popup.component.css']
})

export class TransformationPopupComponent implements OnInit {

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
