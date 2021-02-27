import {HttpHeaders} from '@angular/common/http';

/**
 * Environment/global variables using for different purposes
 */
export const environment = {
  url: 'http://localhost:8080/insulin',
  tokenHeader: 'Jwt-Token',
  bearer: 'Bearer',
  authorization: 'Authorization',
  oneMinuteInMs: 60000,
  httpOptions: {
    headers: new HttpHeaders({'Content-Type': 'application/json'}),
    withCredentials: true,
    observe: 'response' as 'response'
  }
};
