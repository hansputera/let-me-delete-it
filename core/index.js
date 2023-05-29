const { Client, SessionManager } = require('gampang');
const { RuleReader } = require('./rule_reader.js');
const config = require('@config/bot.js');
const ruleConfig = require('@config/rule.js');

const session = new SessionManager(config.sessionPath, 'folder');
const client = new Client(session, {
    qr: {
        store: 'file',
        options: {
            dest: config.qrPath,
        },
    },
});
const ruleReader = new RuleReader(
    ruleConfig.rulesPath,
    ruleConfig.ruleScriptsPath,
);

client.on('ready', () => {
    console.log(client.raw.user.id, 'is ready');

    ruleReader.load();
});

client.on('message', async (ctx) => {
    console.log(ctx.text);
    const rules = [...ruleReader.rules.values()].map(r => ruleReader.findRule(r.name));

    try {
        const ruleExec = await Promise.race(rules.map(r => r.scriptFn(ctx)));
        if (ruleExec) {
            await ctx.client.raw.sendMessage(ctx.raw.key.remoteJid, {
                delete: ctx.raw.key,
            }).catch(() => {});
            // await ctx.delete();
        }
    } catch (e) {
        console.log('Rule execute failures:', e);
    }
});

client.launch();
