"use strict";

export class Api {
    constructor() {
    }

    get(url) {
        return axios.get(`${url}`);
    }
}