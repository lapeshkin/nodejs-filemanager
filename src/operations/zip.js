import path from 'node:path';
import { createReadStream, createWriteStream } from 'node:fs';
import zlib from 'node:zlib';
import stream from 'node:stream/promises';

let context = {};

export function setContext(ctx) {
    context = ctx;
}

export async function compress(path_to_file, path_to_destination) {

	const filePath = path.resolve(context.curPath, path_to_file);
	const destPath = path.resolve(context.curPath, path_to_destination);
	
	const rs = createReadStream(filePath);
	const ws = createWriteStream(destPath);

	try {
		const brotliCompress = zlib.createBrotliCompress();	
		await stream.pipeline(rs, brotliCompress, ws);
	} catch(err) {
		process.stdout.write(`Error compressing file '${filePath}'! ${err}\n`);
	}

}

export async function decompress(path_to_file, path_to_destination) {

	const filePath = path.resolve(context.curPath, path_to_file);
	const destPath = path.resolve(context.curPath, path_to_destination);
	
	const rs = createReadStream(filePath);
	const ws = createWriteStream(destPath);

	try {
		const brotliDecompress = zlib.createBrotliDecompress();	
		await stream.pipeline(rs, brotliDecompress, ws);
	} catch(err) {
		process.stdout.write(`Error decompressing file '${filePath}'! ${err}\n`);
	}

}