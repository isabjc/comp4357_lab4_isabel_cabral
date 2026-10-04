'use strict';

const Math = require('./modules/math');

class App {
    run() {
        const math = new Math();
        console.log(`Hello Isabel. The area is ${math.area(5)}`);
    }
}

const app = new App();
app.run();