import EventEmitter from 'events';
import {Logger} from 'tslog';
import {Domain} from './services/domain';
import {Whois} from './services/whois';

const CHECK_INTERVAL = 1000 * 60 * 0.5; // 0.5 minute
export default class DomainMonitor {
	private domains = new Map<string, Domain>();
	private whois = new Whois();
	private emitter: EventEmitter;
	private logger: Logger;
	private timer: ReturnType<typeof setInterval> | null = null;

	constructor(emitter: EventEmitter, logger: Logger) {
		this.emitter = emitter;
		this.logger = logger;
		this.domains = new Map<string, Domain>();
		this.check = this.check.bind(this);
	}

	protected async check() {
		this.logger.info('checking domains');
		for (const domain of this.domains.values()) {
			let data;
			if (domain.expiringSoon) {
				data = await domain.getDomain();
			}
			console.log(`${domain.domainName}: ${domain.expired ? 'expired' : 'not expired'}`);
			if (data) console.log(`${domain.domainName}:`, data);
			if (domain.expired) {
				this.emitter.emit('domainExpired', domain);
			}
		}
	}

	protected save(domain: Domain) {
		global.nconf.set(
			'domains',
			Array.from(this.domains.keys()).filter(domainName => domainName !== domain.domainName)
		);
		global.nconf.set('removedDomains', [...global.nconf.get('removedDomains'), domain.domainName]);
		global.nconf.save();
	}

	protected handleEvents() {
		this.emitter.on('domainExpired', (domain: Domain) => {
			this.logger.info(`domain ${domain.domainName} expired`);
			// We no longer need to monitor this domain
			this.domains.delete(domain.domainName);
			this.save(domain);
			this.emitter.emit('buyDomain', domain);
		});
	}

	public async start() {
		this.logger.info('starting domain monitor');

		await this.handleEvents();
		this.domains = new Map(
			Array.from(nconf.get('domains'), (domainName: string) => {
				return [domainName, new Domain(domainName, this.whois, this.logger)];
			})
		);
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
