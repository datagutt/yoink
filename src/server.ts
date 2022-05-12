import EventEmitter from 'events';
import path from 'path';
import DomainBuyer from './DomainBuyer';
import DomainMonitor from './DomainMonitor';
import {Domain} from './services/domain';
import Logger from './singletons/logger';
const nconf = require('nconf');

const logger = Logger.getChildLogger({
	name: 'yoink ~ server',
});

const ENV = process.env.NODE_ENV || 'production';

logger.info('Loading config file...');
nconf.argv().env();
nconf.file('default', path.join('config', path.sep, `${ENV}.json`));
nconf.defaults({
	port: 3000,
	domains: [],
	removedDomains: [],
});
//nconf.save();

// @ts-ignore
global.nconf = nconf;

class Server {
	protected monitor: DomainMonitor;
	protected buyer: DomainBuyer;
	protected domains: Domain[] = [];
	protected emitter: EventEmitter;

	// Can only be initiated asynchronously
	protected constructor() {
		this.emitter = new EventEmitter();
		this.monitor = new DomainMonitor(this.emitter, logger);
		this.buyer = new DomainBuyer(this.emitter, logger);
		this.monitor.start();
		this.buyer.start();
	}

	public static async build(): Promise<Server> {
		return new Server();
	}

	close() {}
}
(async () => {
	let server: Server;
	try {
		server = await Server.build();
	} catch (ex) {
		logger.error('unable to start -', ex);
		process.exit(1);
	}

	logger.info('✔ yoink has started successfully');
	process.on('SIGINT', () => {
		logger.warn('told to disconnect');

		server.close();
		process.exit(0);
	});
})();

process.on('unhandledRejection', error => logger.error('yoink was unable to handle this promise rejection', error));
process.on('uncaughtException', error => logger.error('yoink was unable to handle this exception', error));
