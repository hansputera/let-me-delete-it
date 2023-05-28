## Rule JSON Format
```js
{
    "match": "some-regex match here",
    "name": "rule name",
    "description": "describe the rule here", // it's optional field, you can leave it empty
    "activate": true, // u should set this value as boolean
    "onPM": true, // this rule is applied on private message/chat?
    "onGroup": true, // this rule is applied on group chat?

    // if you want more flexibility on your custom rule
    "script": {
        "target": "file-script-name-without-extension", // script file name listed on "rule_scripts" folder
        "exec": "function-name" // the function that will executed
    }
}
```