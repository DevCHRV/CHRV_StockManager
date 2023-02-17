import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortPipe } from './pipes/sort.pipe';
import { FilterPipe } from './pipes/filter.pipe';
import { SearchPipe } from './pipes/search.pipe';



@NgModule({
  declarations: [
    SortPipe,
    FilterPipe,
    SearchPipe,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SortPipe,
    FilterPipe,
    SearchPipe,
  ]
})
export class PipeModule { }
