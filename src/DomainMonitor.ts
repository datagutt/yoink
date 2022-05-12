import EventEmitter from 'events';
import {Logger} from 'tslog';
import {Domain} from './services/domain';
import {Whois} from './services/whois';

const CHECK_INTERVAL = 1000 * 60 * 10; // 10 minutes
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
			if (domain.expiringSoon) {
				await domain.getDomain();
			}
			console.log(`${domain.domainName}: ${domain.expired ? 'expired' : 'not expired'}`);
			if (domain.expired) {
				this.emitter.emit('domainExpired', domain);
			}
		}
	}

	protected handleEvents() {
		this.emitter.on('domainExpired', (domain: Domain) => {
			this.logger.info(`domain ${domain.domainName} expired`);
			// We no longer need to monitor this domain
			this.domains.delete(domain.domainName);
			this.emitter.emit('buyDomain', domain);
		});
	}

	public async start() {
		this.logger.info('starting domain monitor');

		this.domains = nconf.get('domains').map((domainName: string) => new Domain(domainName, this.whois, this.logger));
		this.timer = setInterval(this.check, CHECK_INTERVAL);

		this.logger.info('domain monitor started');

		await this.check();
	}

	public close() {
		this.logger.info('closing domain monitor');
		if (this.timer) {
			clearInterval(this.timer);
		}
	}
}
