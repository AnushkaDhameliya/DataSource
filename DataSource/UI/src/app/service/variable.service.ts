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
    q1: 'Yes',
    q2: ''
  };
  public accuracy = null;
  public encodeString = null;
  public Correlation_matrix_encodedString = null;
  public High_Correaltion_graph_encodedString = null;
  public Low_Correaltion_graph_encodedString= null;
  public Medium_Correaltion_graph_encodedString = null;
  public separatorList = [' ',',',';',"'",'"','!','@','~','#','$'];
  public selectedRecordForDetail = null;
  public stateWiseData = {
    'merge': [],
    'sort': [],
    'projection': [],
    'decision_tree': [],
    'regression':[],
    'correlation':[],
    'uppercase':[],
    'lowercase':[],
    'encode':[]
  };

  constructor() {}

}
