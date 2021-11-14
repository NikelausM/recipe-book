import { Injectable } from "@angular/core";

// Following is the same as providing in app module:
// @Injectable({
//   providedIn: 'root'
// })
export class LoggingService {
  lastLog: string;

  printLog(message: string) {
    console.log(message);
    console.log(this.lastLog);
    this.lastLog = message;
  }
  
}