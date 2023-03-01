import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, merge, Subject, timer, map } from 'rxjs';
import { concatMap, finalize, take } from 'rxjs/operators';

export interface Toast{
    type: 'error'|'success', 
    message: string
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
    private toasts: Subject<Toast[]> = new Subject<Toast[]>();
    private show_error:boolean = false
    private error_message = ''
    private show_success:boolean = false
    private success_message = ''

    constructor(private router:Router) {
        this.toasts.next([])
    }

    public toast(){
        return this.toasts.asObservable()
    }

    public showSuccess(){
        return this.show_success
    }

    public showError(){
        return this.show_error
    }

    public setSuccess(message?:string, time?:number){
        this.toasts.next([{type:'success', message: message ? message : "L'opéation s'est déroulée avec succès."}])
        /*
        this.success_message = message ? message : "L'opéation s'est déroulée avec succès."
        this.show_success = true
        setTimeout(()=>{
            this.show_success = false
        }, time ? time*1000 : 10000)
        */
    }

    public removeSuccess(){
        
    }

    public setError(message:string, time?:number){
        this.toasts.next([{type:'error', message: message}])
        /*
        this.error_message = message
        this.show_error = true

        setTimeout(()=>{
            this.show_error = false
        }, time ? time*1000 : 10000)
        */
    }

    public successMessage(){
        return this.success_message
    }

    public errorMessage(){
        return this.error_message
    }
}
