import path from 'node:path';
import crypto from 'node:crypto';
import { createReadStream } from 'node:fs';
import stream from 'node:stream/promises';

let context = {};

export function setContext(ctx) {
    context = ctx;
}

export async function hash(path_to_file) {

	const curPath = path.resolve(context.curPath, path_to_file);

	const hash = crypto.createHash('sha256');
	try {
		const rs = createReadStream(curPath);
		await stream.pipeline(rs, hash);
		process.stdout.write(hash.digest('hex'));
		process.stdout.write('\n');
	} catch(err) {
		process.stdout.write(`Error calculating file hash '${curPath}'! ${err}\n`);
	}
  
}

