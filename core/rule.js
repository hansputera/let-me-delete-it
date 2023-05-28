const assert = require('node:assert');
const { Util } = require('./util.js');

class Rule
{
    /**
     * @constructor
     * @param {{ name: string, description: string, onPM: boolean, onGroup: boolean, activate: boolean, match: string, script: { target: string, exec: string }}} param0 Rule::_constructor props
     */
    constructor({ name, description, onPM, onGroup, activate, match, script })
    {
        this.name = name;
        this.description = description || 'No rule description';
        this.onPM = Boolean(onPM);
        this.onGroup = Boolean(onGroup);
        this.activated = Boolean(activate);
        
        this.regex = match;
        this.script = script;

        this.#validateProps();
    }

    #validateProps() {
        assert.ok(Util.isRegex(this.regex));
        if (typeof this.script === 'object' && !Array.isArray(this.script)) {
            assert.ok(Reflect.has(this.script, 'target'));
            assert.ok(Reflect.has(this.script, 'exec'));

            assert.strictEqual(typeof this.script.target, 'string');
            assert.strictEqual(typeof this.script.exec, 'string');
        }
    }
}

module.exports = { Rule };
