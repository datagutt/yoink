import EventEmitter from 'events';
import fetch from 'node-fetch';
import {Logger} from 'tslog';

interface DomainBody {
	name: string;
	renew: boolean;
	expectedPrice?: number;
}
export class Vercel {
	private readonly teamId: string;
	private readonly headers: any;
	private readonly logger: Logger;
	private readonly emitter: EventEmitter;

	constructor(teamId: string, token: string, emitter: EventEmitter, logger: Logger) {
		this.teamId = teamId;
		this.headers = {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		};
		this.emitter = emitter;
		this.logger = logger;
	}

	async checkPrice(name: string): Promise<number> {
		const url = `https://api.vercel.com/v4/domains/price?name=${name}&teamId=${this.teamId}`;

		try {
			const res = await fetch(url, {
				method: 'GET',
				headers: this.headers,
			});

			if (res.status === 200) {
				const data: any = await res.json();
				return data.price as number;
			} else {
				const data: any = await res.json();
				this.logger.error(`Failed to check price for domain ${name}: ${JSON.stringify(data)}`);
				return 0;
			}
		} catch (error) {
			this.logger.error(error);
			return 0;
		}
	}

	async buyDomain(name: string, expectedPrice?: number): Promise<boolean> {
		const url = `https://api.vercel.com/v4/domains/buy?teamId=${this.teamId}`;
		const body: DomainBody = {
			name,
			renew: true,
			expectedPrice: expectedPrice ?? 50,
		};

		try {
			const res = await fetch(url, {
				method: 'POST',
				headers: this.headers,
				body: JSON.stringify(body),
			});

			if (res.status === 200) {
				this.logger.info(`Domain ${name} bought successfully`);
				return true;
			} else {
				const data: any = await res.json();
				this.logger.error(`Failed to buy domain ${name}: ${JSON.stringify(data)}`);
				return false;
			}
		} catch (error) {
			this.logger.error(error);
			return false;
		}
	}
}
