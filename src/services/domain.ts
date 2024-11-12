import {Logger} from 'tslog';
import {IMappedWhoisData, Whois} from './whois';

const checkIfAvailable = (whoisData: IMappedWhoisData | null) => {
	if (!whoisData) {
		return false;
	}

	if (Object.keys(whoisData).length === 0) {
		return false;
	}

	const text = whoisData.text ?? '';

	if (!/\S/.test(text) || /not found|no match/i.test(text)) {
		return true;
	}

	const status = whoisData.domainStatus;

	if (Array.isArray(status) && (status.length === 0 || status.includes('available') || status.includes('free'))) {
		return true;
	}

	return false;
};

export class Domain {
	public domainName: string = '';
	private data: IMappedWhoisData = {};
	private whois: Whois;
	private logger: Logger;

	constructor(domainName: string, whois: Whois, logger: Logger) {
		this.domainName = domainName;
		this.whois = whois;
		this.logger = logger;
	}

	isExpired(): boolean {
		return this.data && checkIfAvailable(this.data);
	}

	isExpiringSoon(): boolean {
		const expiryDate = this.data?.expiryDate;
		if (!expiryDate) {
			return true;
		}

		const now = new Date();
		const diff = expiryDate.getTime() - now.getTime();
		const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
		return days <= 30;
	}

	get expired(): boolean {
		return this.isExpired();
	}

	get expiringSoon(): boolean {
		return this.isExpiringSoon();
	}

	async getDomain(): Promise<IMappedWhoisData | null> {
		const whoisData = await this.whois.whois(this.domainName);

		if (whoisData === null) {
			this.logger.error(`Could not get whois data for ${this.domainName}`);
			return null;
		}

		this.data = whoisData ?? {};
		return this.data;
	}
}
