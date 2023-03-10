import { Component } from '@angular/core';
import { UnitListDataSource } from './unit-list-datasource';
import { FormControl } from '@angular/forms';
import { Unit } from '../../models/unit';
import { RouterService } from '../../../services/router/router.service';
import { UnitService } from '../../services/unit/unit.service';

@Component({
  selector: 'app-unit-list',
  templateUrl: './unit-list.component.html',
  styleUrls: ['./unit-list.component.scss']
})
export class UnitListComponent {
  public sortBy = new FormControl<string>('name');
  public isAsc = new FormControl<boolean>(true);

  public searchBy = new FormControl<string>('');

  public units:Unit[] = [];
  dataSource: UnitListDataSource = new UnitListDataSource([]);

  constructor(private unit:UnitService, private router:RouterService) {

  }

  ngOnInit(): void {
    this.dataSource = new UnitListDataSource([])
    this.unit.get().subscribe(
      res => {
        this.dataSource = new UnitListDataSource(res)
      }
    );
  }

  orderBy(property:string){
    if(this.sortBy.value == property){
      this.isAsc.patchValue(!this.isAsc.value)
      this.sortBy.patchValue(property)
    } else {
      this.isAsc.patchValue(true)
      this.sortBy.patchValue(property)
    }
  }

  goTo(id:number){
    this.router.navigateTo(`/unit/${id}`)
  }

  goToCreation(){
    this.router.navigateTo(`/unit/create`)
  }

  setAsc(asc:boolean){
    this.isAsc.setValue(asc)
  }
}
