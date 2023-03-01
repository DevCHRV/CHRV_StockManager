import { Component } from '@angular/core';
import { UserListDataSource } from './user-list-datasource';
import { Role, User } from '../../models/user';
import { FormControl } from '@angular/forms';
import { UserService } from '../../services/user/user.service';
import { RouterService } from '../../../services/router/router.service';
import { ToastService } from '../../../services/toast/toast.service';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {
  dataSource: UserListDataSource = new UserListDataSource([]);
  public roles: Role[] = [];
  public sortBy = new FormControl<string>('id');
  public isAsc = new FormControl<boolean>(true);
  public filterBy = new FormControl<boolean|null>(null);
  public searchBy = new FormControl<string>('');

  public is_total:boolean = true

  constructor(private users:UserService, private router:RouterService, private toast:ToastService) {

  }

  ngOnInit(): void {
    this.dataSource = new UserListDataSource([])
    this.users.get().subscribe(
      res => {
        this.dataSource = new UserListDataSource(res)
        this._mergeRoles();
      }
    );
    //this.roleService.get().subscribe(res=>this.roles = res)
  }

  toggleBadgeVisibility(){
    this.is_total = !this.is_total
  }

  getType(){
    return {total: this.dataSource.data.length, active:this.dataSource.data.filter(u=>u.isActive).length, role:null}
  }


  goTo(id:number){
    this.router.navigateTo(`/user/${id}`)
  }

  deactivate(user:User){
    user.isActive = false;
    this.users.put(user).pipe(
      tap(res => this.toast.setSuccess(`Le compte de l'utilisateur '${user.username}' a été désactivé !`)),
      catchError(error=>{
      user.isActive=true
      return of(null)
      })).subscribe()
  }

  activate(user:User){
    user.isActive = true;
    this.users.put(user).pipe(
      tap(res => this.toast.setSuccess(`Le compte de l'utilisateur '${user.username}' a été réactivé !`)),
      catchError(error=>{
        user.isActive=false
        return of(null)
      })).subscribe()
  }

  setAsc(asc:boolean){
    this.isAsc.setValue(asc)
  }

  resetFilter(){
    this.filterBy.setValue(null)
  }

  checkNotNull(event:any){
    let value = event.target.value
    if(value==null || value=='null')
      this.resetFilter()
  }


  private _mergeRoles(){
    for(const user of this.dataSource.data){
      for(const role of user.roles){
        if(this.roles.find(r=>r.id==role.id))
          continue
        else
          this.roles.push(role)
      }
    }
  }
}
