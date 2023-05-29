/** @typedef {import('gampang').Context} Context */

/**
 * WA.Settings handler
 * @param {Context} context WhatsApp Gampang Context
 */
async function settingsUrl(context)
{
    const regex = /wa\.me\/settings/gi;

    const reply = context.getReply();
    if (reply && regex.test(reply.text)) {
        await context.client.raw.sendMessage(reply.raw.key.remoteJid, {
            delete: reply.raw.key,
        }).catch(() => {});
        return true; // delete current context because the message has the wa.me/settings replied message
    }
    // else if (regex.test(context.text)) {
    //     await context.delete();
    // }

    if (!regex.test(context.text)) {
        throw new Error('no pass');
    } else {
        return true;
    }
}

module.exports = { settingsUrl };
