import EventEmitter from 'events';
import fetch from 'node-fetch';
import {Logger} from 'tslog';

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

	async buyDomain(name: string, expectedPrice?: number): Promise<boolean> {
		const url = `https://api.vercel.com/v4/domains/buy?teamId=${this.teamId}`;
		const body = {
			name,
			expectedPrice: expectedPrice || 0,
			renew: true,
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
				this.logger.error(`Failed to buy domain ${name}: ${data?.error?.message}`);
				return false;
			}
		} catch (error) {
			this.logger.error(error);
			return false;
		}
	}
}
