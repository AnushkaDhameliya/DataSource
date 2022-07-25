import { Component, OnInit } from '@angular/core';
import { VariableService } from '../../service/variable.service';
import { DataSourceService } from '../../service/data-source.service';

@Component({
  selector: 'app-file-data',
  templateUrl: './file-data.component.html',
  styleUrls: ['./file-data.component.css']
})
export class FileDataComponent implements OnInit {

  constructor(public variable: VariableService, public dataSource: DataSourceService) { }

  ngOnInit(): void {
  }

}
