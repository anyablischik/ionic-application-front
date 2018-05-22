import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ErrorResponse} from "../../models/ErrorResponse";

@Injectable()
export class CoreProvider {
    apiRoot: string = 'http://template.docker/api';
    httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    constructor(public http: HttpClient) {

    }

    postRequest(url: string, data: any | null, responseType?: any, httpOptions: {} = this.httpOptions): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.post(`${this.apiRoot}` + url, data, httpOptions)
                .subscribe(res => {
                        resolve(responseType ? this._convertResponseToType(res, responseType) : res);
                    },
                    error => {
                        console.log(error);
                        reject(this._convertBadResponse(error))
                    })
        })
    }

    getRequest(url: string, responseType?: any, httpOptions: {} = this.httpOptions) {
        return new Promise((resolve, reject) => {
            this.http.get(`${this.apiRoot}` + url, httpOptions)
                .subscribe(res => {
                        console.log(res)
                        resolve(this._convertResponseToType(res, responseType));
                    },
                    error => {
                        console.log(error);
                        reject(this._convertBadResponse(error))
                    })
        })
    }

    private _convertResponseToType(response, type) {
        if (!Array.isArray(response)) {
            return new type(response);
        }

        return response.map(item => new type(item));
    }

    private _convertBadResponse(response): ErrorResponse {
        return {
            title: response.statusText,
            message: response.error.message,
            errors: response.error.errors,
            statusCode: response.status,
            url: response.url
        };
    }
}
