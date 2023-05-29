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
        await reply.delete();
        return true; // delete current context because the message has the wa.me/settings replied message
    }
    // else if (regex.test(context.text)) {
    //     await context.delete();
    // }

    return regex.test(context.text); // auto delete the context
}

module.exports = { settingsUrl };
