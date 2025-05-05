import fs from 'node:fs/promises';
import path from 'node:path';
import url from 'node:url';

let context = {};

export function setContext(ctx) {
    context = ctx;
}

export const parseArgs = () => {

	const args = process.argv.slice(2);
	const result = {};

	for (const arg of args) {
		if (arg.startsWith('--')) {
			const [key, value] = arg.slice(2).split('=');
			result[key] = value ?? ''; 
		}
	}

	return result;
}

export async function initModules(context) {

    const modulesDir = path.join(path.dirname(url.fileURLToPath(import.meta.url)), 'operations');
    
	let operations = {};
    const modules = [];    

    const files = await fs.readdir(modulesDir);
  
	for (const file of files) {
		if (file.endsWith('.js')) {

			const filePath = path.join(modulesDir, file);
			const module = await import(url.pathToFileURL(filePath));

			operations = Object.assign(operations, module);

		if (typeof module.setContext === 'function') {
			module.setContext(context);
		}

		modules.push(module);
		}
	}

	return operations;

}

export function printPrompt() {
    process.stdout.write(`You are currently in ${context.curPath}\n`);
    process.stdout.write('>: ');

}

function parseInput(input) {
    const tokens = input.trim().split(/\s+/);
    const command = tokens.shift(); 
    const args = tokens;
    return { command, args };
}

export async function processInput(input) {

	const { command, args } = parseInput(input);

	if (command === '.exit') {
		process.stdout.write(`\nThank you for using File Manager, ${context.userName}, goodbye!\n`);
		process.exit(0);
	} 

	if (context.operations[command]) {
		await context.operations[command](...args); 
	} else {
		process.stdout.write(`Invalid input: ${command}\n`);
	}

	printPrompt();

}



