import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

    private show_error:boolean = false
    private error_message = ''
    private show_success:boolean = false
    private success_message = ''

    constructor(private router:Router) {

    }

    public showSuccess(){
        return this.show_success
    }

    public showError(){
        return this.show_error
    }

    public setSuccess(message?:string, time?:number){
        this.success_message = message ? message : "L'opéation s'est déroulée avec succès."
        this.show_success = true
        setTimeout(()=>{
            this.show_success = false
        }, time ? time*1000 : 10000)
    }

    public setError(message:string, time?:number){
        this.error_message = message
        this.show_error = true

        setTimeout(()=>{
            this.show_error = false
        }, time ? time*1000 : 10000)
    }

    public successMessage(){
        return this.success_message
    }

    public errorMessage(){
        return this.error_message
    }

}
