import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs';
import { Observable } from "rxjs/Observable";

export enum Role {
    Admin = 1,
    Parent,
    Child
}

export interface IChild {

    id?: number;
    fname: string;
    lname: string;
    email: string;
    password: string;
    viewFlag: boolean;
    imageUrl: string;
    telephone: string;
    userRole: Role;
    parent_Id:number;
    address: {
        street: string;
        city: string;
        country: string;
    }

}



@Injectable()
export class TrackApi {
    private baseUrl = 'http://trackapi.gear.host/api';
    //private baseUrl = 'http://localhost:28529/api';
    //head = new Headers({ 'Content-Type': 'application/json' });
//http://localhost:28529/api/parent/GetByEmail
    constructor(private http: Http) {

    }


    getChilds(): Observable<IChild[]> {
        return this.http.get(`${this.baseUrl}/child`)
            .map((res: Response) => {
                return res.json();
            })

    }

    addChild(body: IChild): Observable<IChild> {
        let bodyString = JSON.stringify(body); // Stringify payload
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this.http.post(`${this.baseUrl}/Child`, bodyString, { headers: headers })
            .map((res: Response) => {
                console.log("Response From Api: " + res.json());
                return res.json();
            })
    }


   UpdateChild(child: IChild): Observable<IChild> {
        let bodyString = JSON.stringify(child); // Stringify payload
        let headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        return this.http.put(`${this.baseUrl}/child/${child.id}`, bodyString, { headers: headers }).map((res: Response) => {
                console.log("Response From put Api: " + res.json());
                return res.json();
            })
    }


}