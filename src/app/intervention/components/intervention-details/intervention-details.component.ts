import { ChangeDetectionStrategy, Component, AfterViewInit } from '@angular/core';
import { ToastService } from '../../../services/toast/toast.service';
import { UserService } from '../../../user/services/user/user.service';
import { RouterService } from '../../../services/router/router.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../../user/models/user';
import { Observable, startWith, map, tap } from 'rxjs';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Intervention, InterventionType } from '../../models/intervention';
import { InterventionService } from '../../services/intervenction/intervention.service';
import { ItemService } from '../../../item/services/item/item.service';
import { Item } from '../../../item/models/item';
import { Licence } from '../../../licence/models/licences';
import { LicenceService } from '../../../licence/services/licence/licence.service';
import { InterventionTypeEnum } from '../../models/InterventionTypeEnum';

@Component({
  selector: 'app-intervention-details',
  templateUrl: './intervention-details.component.html',
  styleUrls: ['./intervention-details.component.scss'],
})
export class InterventionDetailsComponent {

  public intervention:Intervention;
  public itemLicences:Licence[] = [];
  public licences:Licence[];
  public users:User[];
  public types:InterventionType[];

  public filteredNotifierOptions:Observable<User[]>;
  public searchNotifierSelect = new FormControl<string>('---');

  public filteredUserOptions:Observable<User[]>;
  public searchUserSelect = new FormControl<string>('---');

  public searchLicenceSelect = new FormControl<string>('---');
  public filteredLicenceOptions:Observable<Licence[]>;

  public is_locked:boolean = true

  constructor(private toast:ToastService, private service:InterventionService, private itemService:ItemService, private userService:UserService, private licenceService:LicenceService, private router:RouterService, private builder:FormBuilder, private route:ActivatedRoute){

  }

  ngOnInit(){
    this.load()
  }

  put(){
    this.service.put(this.intervention).subscribe(
      res => {
        this.is_locked = true
        this.load()
      }
    )
  }

  updateDate(){
    this.intervention.actualDate = new Date(Date.now())
  }

  toggleLock(){
    this.is_locked = !this.is_locked
  }

  load(){
    this.service.getById(this.route.snapshot.paramMap.get('intervention_id')!).subscribe(
      res => {
        this.intervention = res
      }
    )
  }

  isLicenceIntervention(){
    return this.intervention.type.id == InterventionTypeEnum.InstallationLicence || this.intervention.type.id == InterventionTypeEnum.DesinstallationLicence
  }
}
