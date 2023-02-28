import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, startWith, Observable, of, filter } from 'rxjs';
import { RouterService } from 'src/app/services/router/router.service';
import { ItemType } from 'src/app/type/models/type';
import { ItemTypeService } from 'src/app/type/services/type/type.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Licence, LicenceType } from '../../../licence/models/licences';
import { LicenceService } from '../../../licence/services/licence/licence.service';
import { IUser } from '../../../user/models/user';
import { UserService } from '../../../user/services/user/user.service';
import { LicenceTypeService } from '../../services/type/type.service';
import { ToastService } from '../../../services/toast/toast.service';

@Component({
  selector: 'app-licence-creation',
  templateUrl: './licence-creation.component.html',
  styleUrls: ['./licence-creation.component.scss']
})
export class LicenceCreationComponent {

  public licence:Licence = {
    value: '',
    description: '',
    user: {},
    item: {},
    type: {id:1} as ItemType,
  } as unknown as Licence;

  public types:LicenceType[];

  form:FormGroup

  constructor(private toast:ToastService, private service:LicenceService, private typeService:LicenceTypeService, private userService:UserService, private router:RouterService, private builder:FormBuilder, private route:ActivatedRoute){
    this.typeService.get().subscribe(
      res=>this.types = res
    )
    this.form = builder.group({
      value: ['', [Validators.required, Validators.minLength(10)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
    })
  }

  ngOnInit(){

  }

  post(){
    if(this.form.valid)
      this.service.post(this.licence).subscribe(
        res => {
          this.router.navigateTo(`/licence/${res}`)
          this.toast.setSuccess()
        }
      ) 
  }
}
