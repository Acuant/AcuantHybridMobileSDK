"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = require("chalk");
const cli_utils_1 = require("@ionic/cli-utils");
const command_1 = require("@ionic/cli-utils/lib/command");
const errors_1 = require("@ionic/cli-utils/lib/errors");
const lib_1 = require("@ionic/cli-framework/lib");
let LoginCommand = class LoginCommand extends command_1.Command {
    preRun(inputs, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const [email,] = inputs;
            const config = yield this.env.config.load();
            if (yield this.env.session.isLoggedIn()) {
                const extra = !inputs[0] || !inputs[1] ? 'Prompting for new credentials.' : 'Attempting login.';
                this.env.log.warn(`You are already logged in${config.user.email ? ' as ' + chalk_1.default.bold(config.user.email) : ''}! ${this.env.flags.interactive ? extra : ''}`);
            }
            else {
                this.env.log.msg(`Log into your Ionic account\n` +
                    `If you don't have one yet, create yours by running: ${chalk_1.default.green(`ionic signup`)}\n`);
            }
            if (options['email'] || options['password']) {
                const extra = this.env.flags.interactive ? 'You will be prompted to provide credentials. Alternatively, you can try this:' : 'Try this:';
                this.env.log.warn(`${chalk_1.default.green('email')} and ${chalk_1.default.green('password')} are command arguments, not options. ${extra}\n` +
                    `${chalk_1.default.green('ionic login ' + (options['email'] ? options['email'] : email) + ' *****')}\n`);
            }
            // TODO: combine with promptToLogin ?
            if (!inputs[0]) {
                const email = yield this.env.prompt({
                    type: 'input',
                    name: 'email',
                    message: 'Email:',
                    default: options['email'],
                    validate: v => lib_1.validators.email(v),
                });
                inputs[0] = email;
            }
            if (!inputs[1]) {
                const password = yield this.env.prompt({
                    type: 'password',
                    name: 'password',
                    message: 'Password:',
                });
                inputs[1] = password;
            }
        });
    }
    run(inputs, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const [email, password] = inputs;
            const config = yield this.env.config.load();
            if (yield this.env.session.isLoggedIn()) {
                this.env.log.info('Logging you out.');
                yield this.env.runCommand(['logout']);
                yield this.env.telemetry.resetToken();
            }
            try {
                yield this.env.session.login(email, password);
            }
            catch (e) {
                if (e instanceof errors_1.SessionException && config.backend === cli_utils_1.BACKEND_LEGACY) {
                    this.env.log.warn(`Logging into Ionic Pro?\n` +
                        `We noticed your CLI is still configured for Ionic Cloud. Fix this with the following command:\n` +
                        `    ${chalk_1.default.green('ionic config set -g backend pro')}`);
                }
                throw e;
            }
            this.env.log.ok('You are logged in!');
            if (config.backend === cli_utils_1.BACKEND_PRO && !config.git.setup) {
                yield this.env.runCommand(['ssh', 'setup']);
            }
        });
    }
};
LoginCommand = tslib_1.__decorate([
    command_1.CommandMetadata({
        name: 'login',
        type: 'global',
        backends: [cli_utils_1.BACKEND_LEGACY, cli_utils_1.BACKEND_PRO],
        description: 'Login with your Ionic ID',
        longDescription: `
Authenticate with Ionic servers and retrieve a user token, which is stored in the CLI config.

Alternatively, set the ${chalk_1.default.green('IONIC_EMAIL')} and ${chalk_1.default.green('IONIC_PASSWORD')} environment variables, and the CLI will automatically authenticate you.

If you need to create an Ionic account, use ${chalk_1.default.green('ionic signup')}.
  `,
        exampleCommands: ['', 'john@example.com', 'hello@example.com secret'],
        inputs: [
            {
                name: 'email',
                description: 'Your email address',
                validators: [lib_1.validators.email],
                private: true,
            },
            {
                name: 'password',
                description: 'Your password',
                private: true,
            }
        ],
        options: [
            {
                name: 'email',
                description: '',
                private: true,
                visible: false,
            },
            {
                name: 'password',
                description: '',
                private: true,
                visible: false,
            },
        ],
    })
], LoginCommand);
exports.LoginCommand = LoginCommand;
