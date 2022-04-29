import EventEmitter from 'events';
import {Logger} from 'tslog';
import {Domain} from './services/domain';
export default class DomainBuyer {
	private emitter: EventEmitter;
	private logger: Logger;

	constructor(emitter: EventEmitter, logger: Logger) {
		this.emitter = emitter;
		this.logger = logger;
	}

	public async start() {
		this.logger.info('starting domain buyer');

		this.emitter.on('buyDomain', (domain: Domain) => {
			this.logger.info(`buying domain ${domain.domainName}`);
		});

		this.logger.info('domain buyer started');
	}

	public close() {
		this.logger.info('closing domain buyer');
	}
}
