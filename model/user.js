"use strict";

// User Class to store useername and list of messages 
module.exports = class User {
    constructor(name,msg) {
        this._name = name;
        this._arr = [msg];
    }
    get name() {
      return this._name;
    }
    get arr() {
        return this._arr;
    }
    get arrLen() {
        return (this._arr).length;
    }
    addMessage(msg)
    {
        this._arr.push(msg);
        return;
    }
    removeMessage()
    {
        this._arr.shift();
        return;
    }
}