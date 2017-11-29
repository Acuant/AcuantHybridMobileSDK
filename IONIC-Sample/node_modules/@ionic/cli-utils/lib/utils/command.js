"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dargs = require("dargs");
const typeDefaults = new Map()
    .set(String, null)
    .set(Boolean, false);
function minimistOptionsToArray(options, fnOptions = {}) {
    if (typeof fnOptions.ignoreFalse === 'undefined') {
        fnOptions.ignoreFalse = true;
    }
    if (fnOptions.useDoubleQuotes) {
        fnOptions.useEquals = true;
    }
    let results = dargs(options, fnOptions);
    results.splice(results.length - options._.length); // take out arguments
    if (fnOptions.useDoubleQuotes) {
        results = results.map(r => r.replace(/^(\-\-[A-Za-z0-9-]+)=(.+\s+.+)$/, '$1="$2"'));
    }
    return results;
}
exports.minimistOptionsToArray = minimistOptionsToArray;
/**
 * Takes a Minimist command option and normalizes its values.
 */
function normalizeOption(option) {
    if (!option.type) {
        option.type = String;
    }
    if (!option.default) {
        option.default = typeDefaults.get(option.type);
    }
    if (!option.aliases) {
        option.aliases = [];
    }
    return option;
}
function metadataToMinimistOptions(metadata) {
    const options = {
        string: ['_'],
        boolean: [],
        alias: {},
        default: {}
    };
    if (!metadata.options) {
        return { boolean: true, string: '_' };
    }
    const schema = metadataToEnvCmdOptsSchema(metadata);
    for (let opt of schema) {
        const envvar = process.env[opt.envvar];
        if (typeof envvar !== 'undefined') {
            if (opt.option.type === Boolean) {
                opt.option.default = envvar && envvar !== '0' ? true : false;
            }
            else {
                opt.option.default = envvar;
            }
        }
    }
    for (let option of metadata.options) {
        const normalizedOption = normalizeOption(option);
        if (normalizedOption.type === String) {
            options.string.push(normalizedOption.name);
        }
        else if (normalizedOption.type === Boolean) {
            options.boolean.push(normalizedOption.name);
        }
        options.default[normalizedOption.name] = normalizedOption.default;
        options.alias[normalizedOption.name] = normalizedOption.aliases;
    }
    return options;
}
exports.metadataToMinimistOptions = metadataToMinimistOptions;
function metadataToEnvCmdOptsSchema(metadata) {
    if (!metadata.options) {
        return [];
    }
    const schema = [];
    const fullName = metadata.fullName ? metadata.fullName : metadata.name;
    const prefix = `IONIC_CMDOPTS_${fullName.toUpperCase().split(' ').join('_')}`;
    for (let option of metadata.options) {
        schema.push({ envvar: `${prefix}_${option.name.toUpperCase().split('-').join('_')}`, option });
    }
    return schema;
}
exports.metadataToEnvCmdOptsSchema = metadataToEnvCmdOptsSchema;
/**
 * Filter command line options that match a given "intent", which are specified
 * in the command's metadata.
 *
 * To filter options that have no intent specified in the command's metadata,
 * exclude the intentName parameter.
 *
 * @param metadata
 * @param options The options to filter.
 * @param indentName
 *
 * @return The filtered options.
 */
function filterOptionsByIntent(metadata, options, intentName) {
    const r = Object.keys(options).reduce((allOptions, optionName) => {
        const metadataOptionFound = (metadata.options || []).find((mdOption) => (mdOption.name === optionName || (mdOption.aliases || []).includes(optionName)));
        if (metadataOptionFound) {
            if (intentName && metadataOptionFound.intents && metadataOptionFound.intents.includes(intentName)) {
                allOptions[optionName] = options[optionName];
            }
            else if (!intentName && !metadataOptionFound.intents) {
                allOptions[optionName] = options[optionName];
            }
        }
        return allOptions;
    }, {});
    r._ = options._;
    if (options['--']) {
        r['--'] = options['--'];
    }
    return r;
}
exports.filterOptionsByIntent = filterOptionsByIntent;
