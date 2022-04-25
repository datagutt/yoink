import fetch from 'node-fetch';
import Logger from './singletons/logger';

const logger = Logger.getChildLogger({
	name: 'Hype ~ REST client',
});

const pkg = require('../package.json');

const USER_AGENT = `yoink (Version ${pkg.version}) - https://github.com/datagutt/yoink`;

type HeadersInit = Headers | string[][] | {[key: string]: string};

interface BuildOptions {
	method?: string;
	path?: string;
	data?: object;
	headers?: HeadersInit;
}
export class Rest {
	protected token: string = '';
	protected API_HEADERS: {
		authorization?: string;
		'user-agent'?: string;
		'content-type'?: string;
	} = {};
	protected API_URL: string = '';

	async init(token: string, url: string) {
		this.token = token;

		this.API_URL = url;

		this.API_HEADERS = {
			authorization: this.token,
			'user-agent': USER_AGENT,
		};
	}

	async build({method = 'GET', path = '/', data = {}, headers}: BuildOptions) {
		try {
			let opts: any = {
				headers: {...headers, ...this.API_HEADERS},
				method,
				body: JSON.stringify(data),
			};

			if (data) {
				opts.headers['content-type'] = 'application/json';
			} else opts.headers['content-type'] = 'text/plain';

			let res = await fetch(`${this.API_URL}${path}`, opts);

			return res;
		} catch (error) {
			logger.error(error);
			throw error;
		}
	}

	async get(path: string, headers?: {}) {
		return this.build({method: 'GET', path, headers});
	}

	async post(path: string, data?: {}, headers?: {}) {
		return this.build({method: 'POST', path, data, headers});
	}

	async patch(path: string, data?: {}, headers?: {}) {
		return this.build({method: 'PATCH', path, data, headers});
	}

	async delete(path: string, data?: {}, headers?: {}) {
		return this.build({method: 'DELETE', path, data, headers});
	}
}
