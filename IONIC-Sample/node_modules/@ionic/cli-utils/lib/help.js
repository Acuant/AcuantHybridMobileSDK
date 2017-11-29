"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = require("chalk");
const stringWidth = require("string-width");
const guards_1 = require("../guards");
const backends_1 = require("./backends");
const format_1 = require("./utils/format");
const errors_1 = require("./errors");
const HELP_DOTS_WIDTH = 25;
function showHelp(env, inputs) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        // If there are no inputs then show global command details.
        if (inputs.length === 0) {
            return env.log.msg(yield getFormattedHelpDetails(env, env.namespace, inputs));
        }
        const [, slicedInputs, cmdOrNamespace] = yield env.namespace.locate(inputs);
        if (!guards_1.isCommand(cmdOrNamespace)) {
            let extra = '';
            if (!env.project.directory) {
                extra = '\nYou may need to be in an Ionic project directory.';
            }
            if (slicedInputs.length > 0) {
                throw new errors_1.FatalException(`Unable to find command: ${chalk_1.default.green(inputs.join(' '))}${extra}\n`);
            }
        }
        env.log.msg(yield formatHelp(env, cmdOrNamespace, inputs));
    });
}
exports.showHelp = showHelp;
function formatHelp(env, cmdOrNamespace, inputs) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        // If the command is located on the global namespace then show its help
        if (!guards_1.isCommand(cmdOrNamespace)) {
            return getFormattedHelpDetails(env, cmdOrNamespace, inputs);
        }
        const command = cmdOrNamespace;
        return formatCommandHelp(env, command.metadata);
    });
}
function namespaceIsDeprecated(cmdMetadataList) {
    const deprecatedCommands = cmdMetadataList.filter(cmd => cmd.deprecated);
    return deprecatedCommands.length === cmdMetadataList.length;
}
function getFormattedHelpDetails(env, ns, inputs) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const cmdMetadataList = yield ns.getCommandMetadataList();
        const formatList = (details) => details.map(hd => `    ${hd}\n`).join('');
        const globalCmds = yield getCommandDetails(env, ns, cmdMetadataList.filter(cmd => cmd.type === 'global'));
        const projectCmds = yield getCommandDetails(env, ns, cmdMetadataList.filter(cmd => cmd.type === 'project'));
        return `${yield formatNamespaceHeader(env, ns, cmdMetadataList)}

  ${chalk_1.default.bold('Usage')}:

${yield formatUsage(env, ns)}

` + (globalCmds.length > 0 ? `  ${chalk_1.default.bold('Global Commands')}:\n\n${formatList(globalCmds)}\n` : '')
            + (projectCmds.length > 0 ? `  ${chalk_1.default.bold('Project Commands')}:\n\n${env.project.directory ? formatList(projectCmds) : '    You are not in a project directory.\n'}\n` : '');
    });
}
function formatNamespaceHeader(env, ns, cmdMetadataList) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (ns.root) {
            return formatHeader(env);
        }
        return `
  ${chalk_1.default.bold.green('ionic ' + ns.name)} ${chalk_1.default.bold('-')} ${namespaceIsDeprecated(cmdMetadataList) ? chalk_1.default.yellow.bold('(deprecated)') + ' ' : ''}${chalk_1.default.bold(ns.description)}${formatLongDescription(ns.longDescription)}`;
    });
}
function formatHeader(env) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const config = yield env.config.load();
        const isLoggedIn = yield env.session.isLoggedIn();
        const now = new Date();
        const prefix = config.backend === backends_1.BACKEND_PRO && isLoggedIn ? chalk_1.default.blue('PRO') + ' ' : '';
        const version = env.plugins.ionic.meta.version;
        const suffix = now.getMonth() === 9 && now.getDate() === 31 ? ' 🎃' : '';
        return `   _             _
  (_) ___  _ __ (_) ___
  | |/ _ \\| '_ \\| |/ __|
  | | (_) | | | | | (__
  |_|\\___/|_| |_|_|\\___|  CLI ${prefix}${version}${suffix}\n`;
    });
}
function formatUsage(env, ns) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let name = ns.name;
        if (!ns.root) {
            name = `ionic ${name}`; // TODO: recurse back ns chain
        }
        const options = ['--help', '--verbose', '--quiet', '--no-interactive', '--confirm'];
        const usageLines = [
            `<command> ${chalk_1.default.dim('[<args>]')} ${options.map(opt => chalk_1.default.dim('[' + opt + ']')).join(' ')} ${chalk_1.default.dim('[options]')}`,
        ];
        return usageLines.map(u => `    ${chalk_1.default.dim('$')} ${chalk_1.default.green(name + ' ' + u)}`).join('\n') + '\n';
    });
}
function getCommandDetails(env, ns, commands) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const config = yield env.config.load();
        commands = commands.filter(cmd => showIt(cmd, config.backend));
        const [cmdDetails, nsDetails] = yield Promise.all([
            getListOfCommandDetails(env, commands.filter(cmd => cmd.namespace === ns)),
            getListOfNamespaceDetails(env, commands.filter(cmd => cmd.namespace !== ns)),
        ]);
        const details = [...cmdDetails, ...nsDetails];
        details.sort();
        return details;
    });
}
function formatCommandHelp(env, cmdMetadata) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (!cmdMetadata.fullName) {
            cmdMetadata.fullName = cmdMetadata.name;
        }
        const displayCmd = 'ionic ' + cmdMetadata.fullName;
        const wrappedDescription = format_1.wordWrap(cmdMetadata.description, { indentation: displayCmd.length + 5 });
        return `
  ${chalk_1.default.bold(chalk_1.default.green(displayCmd) + ' - ' + wrappedDescription)}${formatLongDescription(cmdMetadata.longDescription)}
  ` +
            (yield formatCommandUsage(env, cmdMetadata)) +
            (yield formatCommandInputs(env, cmdMetadata.inputs)) +
            (yield formatCommandOptions(env, cmdMetadata.options)) +
            (yield formatCommandExamples(env, cmdMetadata.exampleCommands, cmdMetadata.fullName));
    });
}
function getListOfCommandDetails(env, commands) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const fillStringArray = format_1.generateFillSpaceStringList(commands.map(cmd => cmd.fullName), HELP_DOTS_WIDTH, chalk_1.default.dim('.'));
        return commands.map((cmd, index) => {
            const description = (cmd.deprecated ? chalk_1.default.yellow.bold('(deprecated)') + ' ' : '') + cmd.description + `${cmd.aliases.length > 0 ? chalk_1.default.dim(' (alias' + (cmd.aliases.length === 1 ? '' : 'es') + ': ') + cmd.aliases.map((a) => chalk_1.default.green(a)).join(', ') + chalk_1.default.dim(')') : ''}`;
            const wrappedDescription = format_1.wordWrap(description, { indentation: HELP_DOTS_WIDTH + 6 });
            return `${chalk_1.default.green(cmd.fullName || '')} ${fillStringArray[index]} ${wrappedDescription}`;
        });
    });
}
function getListOfNamespaceDetails(env, commands) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const config = yield env.config.load();
        const nsDescMap = new Map();
        const grouped = commands.reduce((nsMap, cmd) => {
            if (showIt(cmd, config.backend)) {
                nsDescMap.set(cmd.namespace.name, cmd.namespace.description);
                let l = nsMap.get(cmd.namespace.name);
                if (!l) {
                    l = [];
                    nsMap.set(cmd.namespace.name, l);
                }
                l.push(cmd);
            }
            return nsMap;
        }, new Map());
        const entries = [...grouped.entries()];
        const fillStringArray = format_1.generateFillSpaceStringList(entries.map(v => v[0] + ' <subcommand>'), HELP_DOTS_WIDTH, chalk_1.default.dim('.'));
        return entries.map((v, i) => {
            const subcommands = v[1].map(c => chalk_1.default.green(c.name)).join(', ');
            const wrappedDescription = format_1.wordWrap(`${namespaceIsDeprecated(v[1]) ? chalk_1.default.yellow.bold('(deprecated)') + ' ' : ''}${nsDescMap.get(v[0])} ${chalk_1.default.dim('(subcommands:')} ${subcommands}${chalk_1.default.dim(')')}`, { indentation: HELP_DOTS_WIDTH + 6 });
            return `${chalk_1.default.green(v[0] + ' <subcommand>')} ${fillStringArray[i]} ${wrappedDescription}`;
        });
    });
}
function formatCommandUsage(env, cmdMetadata) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const formatInput = (input) => {
            if (!env.flags.interactive && input.required !== false) {
                return '<' + input.name + '>';
            }
            return '[<' + input.name + '>]';
        };
        const options = yield filterOptionsForHelp(env, cmdMetadata.options);
        const usageLine = `${chalk_1.default.dim('$')} ${chalk_1.default.green('ionic ' + cmdMetadata.fullName + (typeof cmdMetadata.inputs === 'undefined' ? '' : ' ' + cmdMetadata.inputs.map(formatInput).join(' ')))} ${options.length > 0 ? chalk_1.default.green('[options]') : ''}`;
        return `
  ${chalk_1.default.bold('Usage')}:

    ${usageLine}
  `;
    });
}
function formatLongDescription(longDescription) {
    if (!longDescription) {
        return '';
    }
    longDescription = longDescription.trim();
    longDescription = format_1.wordWrap(longDescription, { indentation: 4 });
    return '\n\n    ' + longDescription;
}
function formatCommandInputs(env, inputs = []) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (inputs.length === 0) {
            return '';
        }
        const fillStrings = format_1.generateFillSpaceStringList(inputs.map(input => input.name), HELP_DOTS_WIDTH, chalk_1.default.dim('.'));
        function inputLineFn({ name, description }, index) {
            const optionList = chalk_1.default.green(`${name}`);
            const wrappedDescription = format_1.wordWrap(description, { indentation: HELP_DOTS_WIDTH + 6 });
            return `${optionList} ${fillStrings[index]} ${wrappedDescription}`;
        }
        return `
  ${chalk_1.default.bold('Inputs')}:

    ${inputs.map(inputLineFn).join(`
    `)}
  `;
    });
}
function formatOptionDefault(opt) {
    if (typeof opt.default === 'string') {
        return chalk_1.default.dim(' (default: ') + chalk_1.default.green(opt.default) + chalk_1.default.dim(')');
    }
    else {
        return '';
    }
}
function formatOptionLine(opt) {
    const showInverse = opt.type === Boolean && opt.default === true && opt.name.length > 1;
    const optionList = (showInverse ? chalk_1.default.green(`--no-${opt.name}`) : chalk_1.default.green(`-${opt.name.length > 1 ? '-' : ''}${opt.name}`)) +
        (!showInverse && opt.aliases && opt.aliases.length > 0 ? ', ' +
            opt.aliases
                .map((alias) => chalk_1.default.green(`-${alias}`))
                .join(', ') : '');
    const optionListLength = stringWidth(optionList);
    const fullLength = optionListLength > HELP_DOTS_WIDTH ? optionListLength + 1 : HELP_DOTS_WIDTH;
    const wrappedDescription = format_1.wordWrap(opt.description + formatOptionDefault(opt), { indentation: HELP_DOTS_WIDTH + 6 });
    return `${optionList} ${Array(fullLength - optionListLength).fill(chalk_1.default.dim('.')).join('')} ${wrappedDescription}`;
}
function showIt(thing, backend) {
    return thing.visible !== false && (!thing.backends || thing.backends.includes(backend));
}
function filterOptionsForHelp(env, options = []) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const config = yield env.config.load();
        return options.filter(opt => showIt(opt, config.backend));
    });
}
function formatCommandOptions(env, options = []) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        options = yield filterOptionsForHelp(env, options);
        if (options.length === 0) {
            return '';
        }
        const basicOptions = options.filter(o => !o.advanced);
        const advancedOptions = options.filter(o => o.advanced);
        const basicOptionsOutput = basicOptions.length > 0 ? `
  ${chalk_1.default.bold('Options')}:

    ${basicOptions.map(formatOptionLine).join(`
    `)}
  ` : '';
        const advancedOptionsOutput = advancedOptions.length > 0 ? `
  ${chalk_1.default.bold('Advanced Options')}:

    ${advancedOptions.map(formatOptionLine).join(`
    `)}
  ` : '';
        return basicOptionsOutput + advancedOptionsOutput;
    });
}
function formatCommandExamples(env, exampleCommands, commandName) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (!Array.isArray(exampleCommands)) {
            return '';
        }
        const exampleLines = exampleCommands.map(cmd => {
            const sepIndex = cmd.indexOf(' -- ');
            if (sepIndex === -1) {
                cmd = chalk_1.default.green(cmd);
            }
            else {
                cmd = chalk_1.default.green(cmd.substring(0, sepIndex)) + cmd.substring(sepIndex);
            }
            const wrappedCmd = format_1.wordWrap(cmd, { indentation: 12, append: ' \\' });
            return `${chalk_1.default.dim('$')} ${chalk_1.default.green('ionic ' + commandName)} ${wrappedCmd}`;
        });
        return `
  ${chalk_1.default.bold('Examples')}:

    ${exampleLines.join(`
    `)}
  `;
    });
}
