import {identity, last, pickBy} from 'lodash';
import whoiser from 'whoiser';
export interface IMappedWhoisData {
	domainName?: string | undefined;
	registryDomainId?: string | undefined;
	registrarWhoisServer?: string | undefined;
	registrarUrl?: string | undefined;
	updatedDate?: Date | undefined;
	createdDate?: Date | undefined;
	expiryDate?: Date | undefined;
	registrar?: string | undefined;
	registrarIanaId?: string | undefined;
	registrarAbuseContactEmail?: string | undefined;
	registrarAbuseContactPhone?: string | undefined;
	domainStatus?: string[] | undefined;
	registrantName?: string | undefined;
	registrantOrganization?: string | undefined;
	registrantStreet?: string | undefined;
	registrantCity?: string | undefined;
	registrantStateProvince?: string | undefined;
	registrantPostalCode?: string | undefined;
	registrantCountry?: string | undefined;
	registrantPhone?: string | undefined;
	registrantEmail?: string | undefined;
	adminName?: string | undefined;
	adminOrganization?: string | undefined;
	adminStreet?: string | undefined;
	adminCity?: string | undefined;
	adminStateProvince?: string | undefined;
	adminPostalCode?: string | undefined;
	adminCountry?: string | undefined;
	adminPhone?: string | undefined;
	adminEmail?: string | undefined;
	techName?: string | undefined;
	techOrganization?: string | undefined;
	techStreet?: string | undefined;
	techCity?: string | undefined;
	techStateProvince?: string | undefined;
	techPostalCode?: string | undefined;
	techCountry?: string | undefined;
	techPhone?: string | undefined;
	techEmail?: string | undefined;
	nameServer?: string[] | undefined;
	dnssec?: string | undefined;
	urlOfTheIcannWhoisDataProblemReportingSystem?: string | undefined;
	lastUpdateOfWhoisDatabase?: string | undefined;
	text?: string;
}

export interface IWhoisData {
	'Domain Status'?: string[];
	'Name Server'?: string[];
	'Domain Name'?: string;
	'Registry Domain ID'?: string;
	'Registrar WHOIS Server'?: string;
	'Registrar URL'?: string;
	'Updated Date'?: string;
	'Created Date'?: string;
	'Expiry Date'?: string;
	Registrar?: string;
	'Registrar IANA ID'?: string;
	'Registrar Abuse Contact Email'?: string;
	'Registrar Abuse Contact Phone'?: string;
	'Registrant Organization'?: string;
	'Registrant State/Province'?: string;
	'Registrant Country'?: string;
	'Registrant Phone'?: string;
	'Registrant Email'?: string;
	'Registrant Name'?: string;
	'Registrant Street'?: string;
	'Registrant City'?: string;
	'Registrant Postal Code'?: string;
	'Admin Organization'?: string;
	'Admin State/Province'?: string;
	'Admin Country'?: string;
	'Admin Phone'?: string;
	'Admin Email'?: string;
	'Admin Name'?: string;
	'Admin Street'?: string;
	'Admin City'?: string;
	'Admin Postal Code'?: string;
	'Tech Organization'?: string;
	'Tech State/Province'?: string;
	'Tech Country'?: string;
	'Tech Phone'?: string;
	'Tech Email'?: string;
	'Tech Name'?: string;
	'Tech Street'?: string;
	'Tech City'?: string;
	'Tech Postal Code'?: string;
	DNSSEC?: string;
	'URL of the ICANN WHOIS Data Problem Reporting System'?: string;
	'>>> Last update of WHOIS database: '?: string;
	text?: string;
}

export class Whois {
	private whoiser: any;
	constructor() {
		this.whoiser = whoiser;
	}
	async whois(domain: string, options: any = {}): Promise<IMappedWhoisData | null> {
		const defaultOptions = {};
		const opts = {...defaultOptions, ...options};
		const whoisResult: IWhoisData[] = await this.whoiser.domain(domain, opts);

		if (!whoisResult || whoisResult.length === 0) {
			return null;
		}

		// Thanks, i hate it
		const mappedData = last(
			Object.values(whoisResult).map((item: IWhoisData) => {
				// Remove undefined values
				return pickBy(
					{
						domainName: item['Domain Name'] ?? domain,
						registryDomainId: item['Registry Domain ID'],
						registrarWhoisServer: item['Registrar WHOIS Server'],
						registrarUrl: item['Registrar URL'],

						expiryDate:
							typeof item['Expiry Date'] !== 'undefined' ? new Date(Date.parse(item['Expiry Date'])) : undefined,
						createdDate:
							typeof item['Created Date'] !== 'undefined' ? new Date(Date.parse(item['Created Date'])) : undefined,
						updatedDate:
							typeof item['Updated Date'] !== 'undefined' ? new Date(Date.parse(item['Updated Date'])) : undefined,
						registrar: item['Registrar'],
						registrarIanaId: item['Registrar IANA ID'],
						registrarAbuseContactEmail: item['Registrar Abuse Contact Email'],
						registrarAbuseContactPhone: item['Registrar Abuse Contact Phone'],
						domainStatus: item['Domain Status'],
						registrantName: item['Registrant Name'],
						registrantOrganization: item['Registrant Organization'],
						registrantStreet: item['Registrant Street'],
						registrantCity: item['Registrant City'],
						registrantStateProvince: item['Registrant State/Province'],
						registrantPostalCode: item['Registrant Postal Code'],
						registrantCountry: item['Registrant Country'],
						registrantPhone: item['Registrant Phone'],
						registrantEmail: item['Registrant Email'],
						adminName: item['Admin Name'],
						adminOrganization: item['Admin Organization'],
						adminStreet: item['Admin Street'],
						adminCity: item['Admin City'],
						adminStateProvince: item['Admin State/Province'],
						adminPostalCode: item['Admin Postal Code'],
						adminCountry: item['Admin Country'],
						adminPhone: item['Admin Phone'],
						adminEmail: item['Admin Email'],
						techName: item['Tech Name'],
						techOrganization: item['Tech Organization'],
						techStreet: item['Tech Street'],
						techCity: item['Tech City'],
						techStateProvince: item['Tech State/Province'],
						techPostalCode: item['Tech Postal Code'],
						techCountry: item['Tech Country'],
						techPhone: item['Tech Phone'],
						techEmail: item['Tech Email'],
						nameServer: item['Name Server'],
						dnssec: item['DNSSEC'],
						urlOfTheIcannWhoisDataProblemReportingSystem: item['URL of the ICANN WHOIS Data Problem Reporting System'],
						lastUpdateOfWhoisDatabase: item['>>> Last update of WHOIS database: '],
						text: item.text,
					},
					identity
				);
			})
		);
		return mappedData ? Promise.resolve(mappedData) : null;
	}
}
