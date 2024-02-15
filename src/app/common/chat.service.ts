import { Injectable } from "@angular/core";
import { DataService } from "./data.service";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ChatService {
  constructor(private dataServ: DataService) {}
  generateChat(text: any) {
    const url = 'https://conversationalai.mouritech.net/trinet/gpt-response';
    const params = this.dataServ.construct_and_get_query_params({
      query: text,
    });

    return this.dataServ.get(url, params);
  }
}
