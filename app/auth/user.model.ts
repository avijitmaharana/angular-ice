export class User {
    constructor(public email: string, public id: string, private _token: string, private _tokenExpirationTime: Date) { }

    get token() {
        if (!this._tokenExpirationTime || new Date > this._tokenExpirationTime) {
            return null;
        }
        return this._token;
    }
}