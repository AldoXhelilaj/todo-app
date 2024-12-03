import { Injectable } from "@angular/core";
import { Observable, TimeoutInfo } from "rxjs";
import { TimeoutErrorCtor } from "rxjs/internal/operators/timeout";

@Injectable({providedIn: 'root'})

export class IntervalService {


    customObservable(count:number):Observable<number>{
        return  new Observable<number>(observer => {
            
            let counter= 0
        const intervalSub  = setInterval(() => {
                observer.next(counter++);

                if(counter > count) {
                    observer.complete()
                    clearInterval(intervalSub)
                }


            },1000)

            return () => {
                
            
                clearInterval(intervalSub)
            }
        })
    }
}