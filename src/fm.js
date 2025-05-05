import { homedir } from 'node:os';
import * as streams from './streams.js';
import * as utils from './utils.js';

const appContext = {};

const args = utils.parseArgs();

const input = new streams.ConsoleInputStream();
const output = new streams.ConsoleOutputStream();

//appContext['curPath'] = homedir();
appContext['curPath'] = 'c:\\rs\\test2\\FileManager\\src';
appContext['userName'] = args['username'];

utils.setContext(appContext);

appContext['operations'] = await utils.initModules(appContext);

process.stdout.write(`Welcome to the File Manager, ${args['username']}!\n\n`);

utils.printPrompt();
input.pipe(output);


