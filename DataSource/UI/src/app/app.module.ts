import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from "./app.component";
import { HelloComponent } from "./hello.component";
import { TesteComponent } from "./teste/teste.component";
import { ApiInterceptor } from './interceptor/api.interceptor';
// var styleDrawflow = require("drawflow/dist/drawflow.min.css");
import { SidemenuComponent } from './component/sidemenu/sidemenu.component';
import { InputPopupComponent } from './component/input-popup/input-popup.component';
import { ActionPopupComponent } from './component/action-popup/action-popup.component';
import { AnalysisPopupComponent } from './component/analysis-popup/analysis-popup.component';
import { TransformationPopupComponent } from './component/transformation-popup/transformation-popup.component';
import { OutputPopupComponent } from './component/output-popup/output-popup.component';
import { FileInfoComponent } from './component/file-info/file-info.component';
import { FileHeadComponent } from './component/file-head/file-head.component';
import { FileDataComponent } from './component/file-data/file-data.component';
import { DetailComponent } from './component/detail/detail.component';

@NgModule({
  imports: [BrowserModule, FormsModule, HttpClientModule],
  declarations: [AppComponent, HelloComponent, TesteComponent, SidemenuComponent, InputPopupComponent, ActionPopupComponent, AnalysisPopupComponent, TransformationPopupComponent, OutputPopupComponent, FileInfoComponent, FileHeadComponent, FileDataComponent, DetailComponent],
  bootstrap: [AppComponent],
  entryComponents: [TesteComponent],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true}
  ]
})

export class AppModule {}
