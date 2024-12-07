
import { appLogDir, BaseDirectory } from "@tauri-apps/api/path";
import { exists, writeTextFile, stat } from "@tauri-apps/plugin-fs";
import dayjs from "dayjs";

const loggerSettings = {
    maxLogLevel: 'info',
    prependTimestamp: true,
    appendLogLevel: true,
    appendFilepath: "relative",
    appendFunction: true,
    appendLine: true,
    writeDebugToFile: false,
    maxLogFileSize: 1024 * 1024 * 10, // 10MB
};

let logDir = "";

export default class Logger {
    private maxLogLevel: string;
    private prependTimestamp: boolean;
    private appendLogLevel: boolean;
    private appendFilepath: string;
    private appendFunction: boolean;
    private appendLine: boolean;
    private writeDebugToFile: boolean = false;

    private maxLogFileSize: number;

    private fileName: string;


    private logFile: string;
    private logCount: number = 0;

    constructor(fileName: string) {
        this.maxLogLevel = loggerSettings.maxLogLevel;
        this.prependTimestamp = loggerSettings.prependTimestamp;
        this.appendLogLevel = loggerSettings.appendLogLevel;
        this.appendFilepath = loggerSettings.appendFilepath;
        this.appendFunction = loggerSettings.appendFunction;
        this.appendLine = loggerSettings.appendLine;
        this.writeDebugToFile = loggerSettings.writeDebugToFile;

        this.maxLogFileSize = loggerSettings.maxLogFileSize;

        this.fileName = fileName;
        this.logFile = '';
    }

    public async init() {
        this.logFile = `log_${dayjs().format('YYYY-MM-DD')}${this.logCount > 0 ? `-${this.logCount}` : ''}.txt`;
        console.log('Log directory: ' + logDir);
    }

    private log(message: string, level: string) {
        if (level === 'error') {
            console.error(message);
        } else {
            console.log(message);
        }
    }

    private async writeToFile(message: string) {
        // Check if log file exists
        if (!(await exists(this.logFile, { baseDir: BaseDirectory.AppLog }))) {
            // Create log file
            await writeTextFile(this.logFile, message, {
                append: false,
                baseDir: BaseDirectory.AppLog,
            });
        }
        // Check if log file exceeds max size
        await this.checkLogFileSize();

        // Append message to log file
        await writeTextFile(this.logFile, message, {
            append: true,
            baseDir: BaseDirectory.AppLog,
          });
    }

    private async checkLogFileSize() {
        const stats = await stat(this.logFile, { baseDir: BaseDirectory.AppLog });
        if (stats.size >= this.maxLogFileSize) {
            this.logCount++;
            this.logFile = logDir + `/log_${dayjs().format('YYYY-MM-DD')}${this.logCount > 0 ? `-${this.logCount}` : ''}.txt`;
        }
    }

    private formatMessage(message: string, level: string) {
        // Format message
        let formattedMessage = message;
        if (this.prependTimestamp) {
            formattedMessage = `[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] ${formattedMessage}`;
        }
        if (this.appendLogLevel) {
            formattedMessage = `[${level.toUpperCase()}] ${formattedMessage}`;
        }
        if (this.appendFilepath === 'relative') {
            formattedMessage = `[${this.fileName}] ${formattedMessage}`;
        } else if (this.appendFilepath === 'absolute') {
            formattedMessage = `[${this.fileName}] ${formattedMessage}`;
        }


        return message;
    }

    public info(message: string) {
        const formattedMessage = this.formatMessage(message, 'info');
        this.log(formattedMessage, 'info');
        this.writeToFile(formattedMessage);
    }

    public warn(message: string) {
        const formattedMessage = this.formatMessage(message, 'warn');
        this.log(formattedMessage, 'warn');
        this.writeToFile(formattedMessage);
    }

    public error(message: string, error: Error) {
        message = `${message}: ${JSON.stringify(error)}`;
        const formattedMessage = this.formatMessage(message, 'error');
        this.log(formattedMessage, 'error');
        this.writeToFile(formattedMessage);
    }

    public debug(message: string) {
        const formattedMessage = this.formatMessage(message, 'debug');
        this.log(formattedMessage, 'debug');
        if(this.writeDebugToFile) {
            this.writeToFile(formattedMessage);
        }
    }
}
