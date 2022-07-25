import { Component, OnInit } from '@angular/core';
import { VariableService } from '../../service/variable.service';
import { DefaultDragDropService } from '../../service/default-drag-drop.service';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.css']
})

export class SidemenuComponent implements OnInit {

  constructor(public variable: VariableService,
              public dragDropService: DefaultDragDropService) { }

  ngOnInit(): void {
  }
}
