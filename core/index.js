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
    const rules = [...ruleReader.rules.values()]
        .filter(r => r.activated)
        .map(r => ruleReader.findRule(r.name));

    await Promise.any(rules.filter(r => r.rule.regex?.length && r.rule.flags)
        .map(async r => {
            const reg = new RegExp(r.rule.regex, r.rule.flags.join(''));
            if (reg.test(ctx.text)) {
                await ctx.client.raw.sendMessage(ctx.raw.key.remoteJid, {
                    delete: ctx.raw.key,
                }).catch(() => {});

                return true;
            }

            throw new Error('no pass');
        })).catch(() => {});
    try {
        const ruleExec = await Promise.any(rules.map(r => r.scriptFn(ctx))).catch(() => undefined);
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
