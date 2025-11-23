"use strict";
const vm = require('vm');
process.on('message', ({ code, context }) => {
    const sandbox = { ...context };
    vm.createContext(sandbox);
    try {
        const result = vm.runInContext(code, sandbox, { timeout: 1000 });
        process.send({ data: result });
    }
    catch (error) {
        process.send({ error: error.message });
    }
});
//# sourceMappingURL=worker.js.map