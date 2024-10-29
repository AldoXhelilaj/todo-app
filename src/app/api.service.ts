import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import config from '../auth_config.json'
import { AuthService } from "@auth0/auth0-angular";
import { BehaviorSubject, Observable, retry, switchMap, take, takeLast } from "rxjs";



@Injectable({
    providedIn: 'root'
})

export class ApiService {
    constructor(public http: HttpClient, private auth: AuthService) {

        this.auth.isAuthenticated$.subscribe(auth => {
            this.isAuthenticatedSubject.next(auth)
        })
    }

    public isAuthenticatedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    ping$() {
        return this.auth.getAccessTokenSilently().pipe(
            take(1),
            switchMap(token => {
                const headers = new HttpHeaders({
                    Authorization: `Bearer ${token}`
                })
                console.log(headers)
                return this.http.get(`${config.apiUri}/api/external`, { headers })
            })
        )
    }


    isAuthenticatedSync(): Observable<boolean> {
        return this.isAuthenticatedSubject.asObservable()

    }
}