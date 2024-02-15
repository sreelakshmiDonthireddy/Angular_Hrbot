import { Injectable } from "@angular/core";
import { map, catchError } from "rxjs/operators";
import { HttpClient, HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class DataService {
  constructor(private httpClient: HttpClient) {}
  get(url: string, params: any, headers = {}) {
    return this.httpClient.get(url, { params, headers: headers }).pipe(
      map((response) => response),

      catchError(this.handleError)
    );
  }

  public construct_and_get_query_params(queryParams: any) {
    let params = new HttpParams();

    for (const key of Object.keys(queryParams)) {
      params = params.set(key, queryParams[key]);
    }

    return params;
  }

  private handleError(error: Response) {
    return Promise.resolve(error);
  }
}
