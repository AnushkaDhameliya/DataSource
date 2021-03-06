import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VariableService {

  id: any = null;
  editor: any = null;
  transform: string = "";
  mobile_item_selec: string = "";
  mobile_last_move: any = null;
  
  public popupFlag: boolean = false;
  public popupTitle: string = null;
  public popupSubTitle: string = null;
  public popupAction: string = null;

  public selectedData: any = null;
  public listOfDraggedFiles: any = {
    data: [],
    action: null,
    actionCommonColumns: []
  };
  public selectedNode: any = null;

  public uploadedDataList: any[] = null;
  public uploadedDataListBckUp: any[] = null;
  public actionCommonColumns: any[] = [];
  public outputTable: any = {
    data: [],
    header: []
  };

  /*Header Section*/
  public columnSeparatorArray = [{columnHeader: '', charRange: ''}];
  public headersQuestion = {
    q1: 'No',
    q2: ''
  };
  public separatorList = [' ',',',';',"'",'"','!','@','~','#','$'];

  constructor() {}

}
