import { Command } from '@ionic/cli-utils/lib/command';
export declare abstract class SSHBaseCommand extends Command {
    checkForOpenSSH(): Promise<void>;
}
