import path from 'node:path';
import { createReadStream } from 'node:fs';
import fs from 'node:fs/promises';

let context = {};

export function setContext(ctx) {
	context = ctx;
}

export async function up() {
	const curPath = path.resolve(context.curPath, '../');
	context.curPath = curPath;
}

export async function ls() {
	const files = await fs.readdir(context.curPath);

	files.forEach(f=>process.stdout.write(`${f}\n`));
}

export async function cd(path_to_directory) {
	let curPath = path.resolve(context.curPath, path_to_directory);

	try {
		const stats = await fs.stat(curPath);
	} catch (err) {
		process.stdout.write(`Error changing directory '${curPath}'\n`);
		curPath = context.curPath;
	}	

	context.curPath = curPath;
}

export async function cat(path_to_file) {

	const curPath = path.resolve(context.curPath, path_to_file);

	return new Promise((resolve) => {
			const rs = createReadStream(curPath);
			rs.on("error", (error) => {
				process.stdout.write(`File ${curPath} not found!\n`);
				resolve();
		});	

		rs.on("data", (chunk) => {
			process.stdout.write(chunk);
		});

		rs.on("end", () => {
			process.stdout.write('\n');
			resolve();
		});	
	});	
}

export async function add(path_to_file) {

	const curPath = path.resolve(context.curPath, path_to_file);

	try {
		await fs.writeFile(curPath, '');
		process.stdout.write(`File ${curPath} created successfully\n`);
	} catch (err) {
		process.stdout.write(`Error file creation '${curPath}'! ${err}\n`);
	}
}

export async function mkdir(path_to_dir) {

	const curPath = path.resolve(context.curPath, path_to_dir);

	try {
		await fs.mkdir(curPath, { recursive: true });
		process.stdout.write(`Directory ${curPath} created successfully\n`);
	} catch (err) {
		process.stdout.write(`Error directory creation '${curPath}'! ${err}\n`);
	}
}

export async function rn(oldFilename, newFilename) {

	const oldPath = path.resolve(context.curPath, oldFilename);
	const newPath = path.resolve(context.curPath, newFilename);

	try {
		await fs.rename(oldPath, newPath);
	} catch (err) {
		process.stdout.write(`Error file renaming! ${err}\n`);
	}
}

