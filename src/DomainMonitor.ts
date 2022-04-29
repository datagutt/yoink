import EventEmitter from 'events';
import {Logger} from 'tslog';
import {Domain} from './services/domain';
import {Whois} from './services/whois';

const CHECK_INTERVAL = 1000 * 60 * 1; // 1 minute
export default class DomainMonitor {
	private domains = new Map<string, Domain>();
	private whois = new Whois();
	private emitter: EventEmitter;
	private logger: Logger;
	private timer: NodeJS.Timer | null = null;

	constructor(emitter: EventEmitter, logger: Logger) {
		this.emitter = emitter;
		this.logger = logger;
		this.domains = new Map<string, Domain>();
		this.check = this.check.bind(this);
	}

	protected async check() {
		this.logger.info('checking domains');
		for (const domain of this.domains.values()) {
			await domain.getDomain();
			console.log(`${domain.domainName}: ${domain.expired ? 'expired' : 'not expired'}`);
		}
	}
	public async start() {
		this.logger.info('starting domain monitor');

		this.domains = nconf.get('domains').map((domainName: string) => new Domain(domainName, this.whois, this.logger));
		this.timer = setInterval(this.check, CHECK_INTERVAL);

		await this.check();

		this.logger.info('domain monitor started');
	}
}
