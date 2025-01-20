import EventEmitter from 'events';
import {Logger} from 'tslog';
import {Domain} from './services/domain';
import {Vercel} from './services/providers/vercel';
export default class DomainBuyer {
	private emitter: EventEmitter;
	private logger: Logger;

	constructor(emitter: EventEmitter, logger: Logger) {
		this.emitter = emitter;
		this.logger = logger;
	}

	public async start() {
		const maxPrice = global.nconf.get('maxPrice') || 50;
		const vercel = new Vercel(
			global.nconf.get('vercel:teamId'),
			global.nconf.get('vercel:token'),
			this.emitter,
			this.logger
		);

		this.logger.info('starting domain buyer');

		this.emitter.on('buyDomain', async (domain: Domain) => {
			this.logger.info(`buying domain ${domain.domainName}`);
			// Get expected price
			const expectedPrice = await vercel.checkPrice(domain.domainName);
			if (expectedPrice === 0) {
				this.logger.error(`Could not get expected price for ${domain.domainName}`);
				return;
			}
			if (!maxPrice) {
				this.logger.error('Max price not set');
				return;
			}
			if (expectedPrice >= maxPrice) {
				this.logger.warn(`Price for ${domain.domainName} is too high: ${expectedPrice}. Max price is ${maxPrice}`);
				return;
			}
			if (domain) vercel.buyDomain(domain.domainName, expectedPrice);
		});

		this.logger.info('domain buyer started');
	}

	public close() {
		this.logger.info('closing domain buyer');
	}
}
