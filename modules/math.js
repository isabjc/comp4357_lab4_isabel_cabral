'use strict';

class Math {
    constructor() {
        this.PI = 3.1416;
    }

    area(r) {
        return this.PI * r * r;
    }
}

module.exports = Math;