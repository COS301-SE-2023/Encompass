import { NgModule } from "@angular/core";
import { SearchApi } from "./search.api";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgxsModule } from "@ngxs/store";
import { SearchState } from "./search.state";

@NgModule({
    imports: [CommonModule, HttpClientModule, NgxsModule.forFeature([SearchState])],
    providers: [SearchApi],
})

export class SearchModule{}