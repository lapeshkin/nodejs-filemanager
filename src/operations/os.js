import { EOL, cpus, homedir, userInfo, arch } from 'node:os';

export async function os(command) {

	switch (command) {
		case '--homedir':
			process.stdout.write(homedir()+'\n');
			break;
		case '--username':
			process.stdout.write(userInfo().username+'\n');
			break;
		case '--EOL':
			process.stdout.write(JSON.stringify(EOL)+'\n');
			break;
		case '--cpus':
			printCPUInfo();
			break;
		case '--architecture':
			process.stdout.write(arch()+'\n');
			break;
		default:
			process.stdout.write(`Unknown command\n`);
	}	

}

function printCPUInfo() {

	const cpusInfo = cpus();

	process.stdout.write(`Number CPUs: ${cpusInfo.length}\n`);

	cpusInfo.forEach((cpu, n) => {
		process.stdout.write(`CPU ${n + 1}:\n`);
		process.stdout.write(`\tClock: ${cpu.speed / 1000} GHz\n`);
		process.stdout.write(`\tModel: ${cpu.model}\n`);
	});
}