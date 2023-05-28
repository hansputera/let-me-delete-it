const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { Rule } = require('./rule.js');

/**
 * @class RuleReader
 */
class RuleReader
{
    /**
     * @constructor
     * @param {string} rulesPath Rule's path
     * @param {string} ruleScriptsPath Rule script's path
     */
    constructor(rulesPath, ruleScriptsPath)
    {
        this.rulesPath = rulesPath;
        this.ruleScriptsPath = ruleScriptsPath;

        this.#validateProps();

        /** @type {Map<string, Rule>} */
        this.rules = new Map();

        /** @type {Map<string, Map<string, Function>>} */
        this.scripts = new Map();
    }

    load() {
        this.#validateProps(); // revalidate props

        this.rules.clear();
        for (const ruleFile of fs.readdirSync(this.rulesPath)) {
            if (!ruleFile.endsWith('.js')) return;

            const ruleJson = JSON.parse(fs.readFileSync(
                path.resolve(this.rulesPath, ruleFile)
            ));

            if (Array.isArray(ruleJson)) {
                ruleJson.forEach(json => {
                    this.rules.set(json.name, new Rule(...json));
                });
            } else {
                this.rules.set(ruleJson.name, new Rule(...ruleJson));
            }
        }
    }

    /**
     * Find registed rules
     * @param {string} name Rule's name
     * @return {{ rule: Rule, scriptFn: Function | undefined; }}
     */
    findRule(name)
    {
        const rule = this.rules.get(name.toLowerCase());
        if (!rule) return undefined;

        let script;
        if (rule.script)
        {
            const scriptRef = this.findScript(rule.script.target);

            script = scriptRef?.get(rule.script.exec);
        }

        return { rule, scriptFn: script };
    }

    /**
     * @param {string} name Script file name
     * @param {boolean} reload Reload the script condition
     * @return {Map<string, Function>}
     */
    findScript(name, reload = false)
    {
        name = name.toLowerCase();

        if (this.scripts.has(name) && !Boolean(reload))
            return this.scripts.get(name);
        
        const resolvedScriptPath = require.resolve(this.ruleScriptsPath, name);
        const imports = require(resolvedScriptPath);

        this.scripts.set(name, new Map(imports));
        return this.findScript(name);
    }

    #validateProps() {
        assert.ok(fs.existsSync(this.rulesPath));
        assert.ok(fs.existsSync(this.ruleScriptsPath));

        const [stat1, stat2] = [fs.statSync(this.rulesPath), fs.statSync(this.ruleScriptsPath)];
        assert.ok(stat1.isDirectory());
        assert.ok(stat2.isDirectory());
    }
}

module.exports = { RuleReader };
