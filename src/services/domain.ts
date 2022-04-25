import {Logger} from 'tslog';
import {IMappedWhoisData, IWhoisData, Whois} from './whois';

const checkIfInvalid = (whoisData: IWhoisData | null) => {
	if (!whoisData) {
		return true;
	}

	if (Object.keys(whoisData).length === 0) {
		return true;
	}

	const text = whoisData['text'] ?? '';
	if (!/\S/.test(text) || /not found|no match/i.test(text)) {
		return true;
	}

	const status = whoisData['Domain Status'];
	if (Array.isArray(status) && (status.length === 0 || status.includes('available') || status.includes('free'))) {
		return true;
	}

	return false;
};

export class Domain {
	private domainName: string = '';
	private data: IMappedWhoisData = {};
	private whois: Whois;
	private logger: Logger;

	constructor(whois: Whois, logger: Logger) {
		this.whois = whois;
		this.logger = logger;
	}

	isExpired(): boolean {
		const expiryDate = this.data?.expiryDate;
		if (!expiryDate) {
			return true;
		}

		const now = new Date();
		return now > expiryDate;
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

	async getDomain(domain: string): Promise<IMappedWhoisData | null> {
		const whoisData = await this.whois.whois(domain);
		this.domainName = domain;

		if (checkIfInvalid(whoisData)) {
			return null;
		}

		this.data = whoisData ?? {};
		return this.data;
	}
}
