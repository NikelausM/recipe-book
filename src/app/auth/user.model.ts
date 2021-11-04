/**
 * Interface representing a user's data.
 */
export interface UserData {
  email: string;
  id: string;
}

/**
 * Interface representing a user's data, including private properties.
 * 
 * This interface is only meant to be used to define the properties of a JavaScript object (possibly created from a parsed JSON string).
 */
export interface UserDataAll extends UserData {
  _token: string;
  _tokenExpirationDate: Date;
}

export class User implements UserData {
  constructor(
    public email: string, 
    public id: string, 
    private _token: string, 
    private _tokenExpirationDate: Date) {

  }

  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }

    return this._token;
  }

  get tokenExpirationDate() {
    return this._tokenExpirationDate;
  }
}