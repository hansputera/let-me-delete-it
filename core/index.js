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

client.launch();
