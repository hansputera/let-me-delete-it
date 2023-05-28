class Util
{
    /**
     * Test the string is regex
     * @param {string} str Regex-string
     * @return {boolean}
     */
    static isRegex(str)
    {
        try {
            new RegExp(str);
            return true;
        } catch {
            return false;
        }
    }
}

module.exports = { Util };
