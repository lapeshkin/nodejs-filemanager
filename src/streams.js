import { Readable, Writable } from 'node:stream';
import * as utils from './utils.js';

let context = {};

export function setContext(ctx) {
	context = ctx;
}

export class ConsoleInputStream extends Readable {
	constructor(options) {
		super(options);

		process.stdin.on('data', (chunk) => {
			this.push(chunk);
		});

		process.stdin.on('end', () => {
			this.push(null);
		});
	}

    _read(size) {}
}

export class ConsoleOutputStream extends Writable {
	_write(chunk, encoding, callback) {

		const input = chunk.toString().trim();
		utils.processInput(input);
		callback();
	}
}

