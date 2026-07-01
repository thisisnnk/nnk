// Full ISO-3166 country list with E.164 dial codes, flag emoji and an example
// national-number length used to build per-country placeholders / light masks.
//
// `example` is a representative national number (no country code, no leading 0).
// It drives the input placeholder and the digit-grouping mask, so the user sees
// the expected number format for whichever country they pick.

export type Country = {
  name: string
  iso2: string
  dial: string
  flag: string
  example: string
}

// Flag emoji from the two-letter ISO code (regional-indicator pair).
export function flagOf(iso2: string): string {
  return iso2
    .toUpperCase()
    .replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)))
}

const RAW: Omit<Country, 'flag'>[] = [
  { name: 'Afghanistan', iso2: 'AF', dial: '+93', example: '70 123 4567' },
  { name: 'Albania', iso2: 'AL', dial: '+355', example: '67 212 3456' },
  { name: 'Algeria', iso2: 'DZ', dial: '+213', example: '551 23 45 67' },
  { name: 'Andorra', iso2: 'AD', dial: '+376', example: '312 345' },
  { name: 'Angola', iso2: 'AO', dial: '+244', example: '923 123 456' },
  { name: 'Antigua and Barbuda', iso2: 'AG', dial: '+1268', example: '464 1234' },
  { name: 'Argentina', iso2: 'AR', dial: '+54', example: '11 2345 6789' },
  { name: 'Armenia', iso2: 'AM', dial: '+374', example: '77 123456' },
  { name: 'Australia', iso2: 'AU', dial: '+61', example: '412 345 678' },
  { name: 'Austria', iso2: 'AT', dial: '+43', example: '664 123456' },
  { name: 'Azerbaijan', iso2: 'AZ', dial: '+994', example: '40 123 45 67' },
  { name: 'Bahamas', iso2: 'BS', dial: '+1242', example: '359 1234' },
  { name: 'Bahrain', iso2: 'BH', dial: '+973', example: '3600 1234' },
  { name: 'Bangladesh', iso2: 'BD', dial: '+880', example: '1812 345678' },
  { name: 'Barbados', iso2: 'BB', dial: '+1246', example: '250 1234' },
  { name: 'Belarus', iso2: 'BY', dial: '+375', example: '29 491 1911' },
  { name: 'Belgium', iso2: 'BE', dial: '+32', example: '470 12 34 56' },
  { name: 'Belize', iso2: 'BZ', dial: '+501', example: '622 1234' },
  { name: 'Benin', iso2: 'BJ', dial: '+229', example: '90 01 12 34' },
  { name: 'Bhutan', iso2: 'BT', dial: '+975', example: '17 12 34 56' },
  { name: 'Bolivia', iso2: 'BO', dial: '+591', example: '71 234 567' },
  { name: 'Bosnia and Herzegovina', iso2: 'BA', dial: '+387', example: '61 123 456' },
  { name: 'Botswana', iso2: 'BW', dial: '+267', example: '71 123 456' },
  { name: 'Brazil', iso2: 'BR', dial: '+55', example: '11 96123 4567' },
  { name: 'Brunei', iso2: 'BN', dial: '+673', example: '712 3456' },
  { name: 'Bulgaria', iso2: 'BG', dial: '+359', example: '48 123 456' },
  { name: 'Burkina Faso', iso2: 'BF', dial: '+226', example: '70 12 34 56' },
  { name: 'Burundi', iso2: 'BI', dial: '+257', example: '79 56 12 34' },
  { name: 'Cambodia', iso2: 'KH', dial: '+855', example: '91 234 567' },
  { name: 'Cameroon', iso2: 'CM', dial: '+237', example: '6 71 23 45 67' },
  { name: 'Canada', iso2: 'CA', dial: '+1', example: '506 234 5678' },
  { name: 'Cape Verde', iso2: 'CV', dial: '+238', example: '991 2345' },
  { name: 'Central African Republic', iso2: 'CF', dial: '+236', example: '70 01 23 45' },
  { name: 'Chad', iso2: 'TD', dial: '+235', example: '63 01 23 45' },
  { name: 'Chile', iso2: 'CL', dial: '+56', example: '2 2123 4567' },
  { name: 'China', iso2: 'CN', dial: '+86', example: '131 2345 6789' },
  { name: 'Colombia', iso2: 'CO', dial: '+57', example: '321 1234567' },
  { name: 'Comoros', iso2: 'KM', dial: '+269', example: '321 2345' },
  { name: 'Congo (Brazzaville)', iso2: 'CG', dial: '+242', example: '06 123 4567' },
  { name: 'Congo (Kinshasa)', iso2: 'CD', dial: '+243', example: '991 234 567' },
  { name: 'Costa Rica', iso2: 'CR', dial: '+506', example: '8312 3456' },
  { name: 'Croatia', iso2: 'HR', dial: '+385', example: '92 123 4567' },
  { name: 'Cuba', iso2: 'CU', dial: '+53', example: '5 1234567' },
  { name: 'Cyprus', iso2: 'CY', dial: '+357', example: '96 123456' },
  { name: 'Czechia', iso2: 'CZ', dial: '+420', example: '601 123 456' },
  { name: 'Denmark', iso2: 'DK', dial: '+45', example: '20 12 34 56' },
  { name: 'Djibouti', iso2: 'DJ', dial: '+253', example: '77 83 10 01' },
  { name: 'Dominica', iso2: 'DM', dial: '+1767', example: '225 1234' },
  { name: 'Dominican Republic', iso2: 'DO', dial: '+1809', example: '809 234 5678' },
  { name: 'Ecuador', iso2: 'EC', dial: '+593', example: '99 123 4567' },
  { name: 'Egypt', iso2: 'EG', dial: '+20', example: '100 123 4567' },
  { name: 'El Salvador', iso2: 'SV', dial: '+503', example: '7012 3456' },
  { name: 'Equatorial Guinea', iso2: 'GQ', dial: '+240', example: '222 123 456' },
  { name: 'Eritrea', iso2: 'ER', dial: '+291', example: '7 123 456' },
  { name: 'Estonia', iso2: 'EE', dial: '+372', example: '5123 4567' },
  { name: 'Eswatini', iso2: 'SZ', dial: '+268', example: '76 123 456' },
  { name: 'Ethiopia', iso2: 'ET', dial: '+251', example: '91 123 4567' },
  { name: 'Fiji', iso2: 'FJ', dial: '+679', example: '701 2345' },
  { name: 'Finland', iso2: 'FI', dial: '+358', example: '41 2345678' },
  { name: 'France', iso2: 'FR', dial: '+33', example: '6 12 34 56 78' },
  { name: 'Gabon', iso2: 'GA', dial: '+241', example: '06 03 12 34' },
  { name: 'Gambia', iso2: 'GM', dial: '+220', example: '301 2345' },
  { name: 'Georgia', iso2: 'GE', dial: '+995', example: '555 12 34 56' },
  { name: 'Germany', iso2: 'DE', dial: '+49', example: '1512 3456789' },
  { name: 'Ghana', iso2: 'GH', dial: '+233', example: '23 123 4567' },
  { name: 'Greece', iso2: 'GR', dial: '+30', example: '691 234 5678' },
  { name: 'Grenada', iso2: 'GD', dial: '+1473', example: '403 1234' },
  { name: 'Guatemala', iso2: 'GT', dial: '+502', example: '5123 4567' },
  { name: 'Guinea', iso2: 'GN', dial: '+224', example: '601 23 45 67' },
  { name: 'Guinea-Bissau', iso2: 'GW', dial: '+245', example: '955 012 345' },
  { name: 'Guyana', iso2: 'GY', dial: '+592', example: '609 1234' },
  { name: 'Haiti', iso2: 'HT', dial: '+509', example: '34 10 1234' },
  { name: 'Honduras', iso2: 'HN', dial: '+504', example: '9123 4567' },
  { name: 'Hong Kong', iso2: 'HK', dial: '+852', example: '5123 4567' },
  { name: 'Hungary', iso2: 'HU', dial: '+36', example: '20 123 4567' },
  { name: 'Iceland', iso2: 'IS', dial: '+354', example: '611 1234' },
  { name: 'India', iso2: 'IN', dial: '+91', example: '81234 56789' },
  { name: 'Indonesia', iso2: 'ID', dial: '+62', example: '812 345 678' },
  { name: 'Iran', iso2: 'IR', dial: '+98', example: '912 345 6789' },
  { name: 'Iraq', iso2: 'IQ', dial: '+964', example: '791 234 5678' },
  { name: 'Ireland', iso2: 'IE', dial: '+353', example: '85 012 3456' },
  { name: 'Israel', iso2: 'IL', dial: '+972', example: '50 234 5678' },
  { name: 'Italy', iso2: 'IT', dial: '+39', example: '312 345 6789' },
  { name: 'Ivory Coast', iso2: 'CI', dial: '+225', example: '01 23 45 67 89' },
  { name: 'Jamaica', iso2: 'JM', dial: '+1876', example: '210 1234' },
  { name: 'Japan', iso2: 'JP', dial: '+81', example: '90 1234 5678' },
  { name: 'Jordan', iso2: 'JO', dial: '+962', example: '7 9012 3456' },
  { name: 'Kazakhstan', iso2: 'KZ', dial: '+7', example: '771 000 9998' },
  { name: 'Kenya', iso2: 'KE', dial: '+254', example: '712 123456' },
  { name: 'Kiribati', iso2: 'KI', dial: '+686', example: '7202 3456' },
  { name: 'Kuwait', iso2: 'KW', dial: '+965', example: '500 12345' },
  { name: 'Kyrgyzstan', iso2: 'KG', dial: '+996', example: '700 123 456' },
  { name: 'Laos', iso2: 'LA', dial: '+856', example: '20 23 123 456' },
  { name: 'Latvia', iso2: 'LV', dial: '+371', example: '21 234 567' },
  { name: 'Lebanon', iso2: 'LB', dial: '+961', example: '71 123 456' },
  { name: 'Lesotho', iso2: 'LS', dial: '+266', example: '5012 3456' },
  { name: 'Liberia', iso2: 'LR', dial: '+231', example: '77 012 3456' },
  { name: 'Libya', iso2: 'LY', dial: '+218', example: '91 2345678' },
  { name: 'Liechtenstein', iso2: 'LI', dial: '+423', example: '660 234 567' },
  { name: 'Lithuania', iso2: 'LT', dial: '+370', example: '612 34567' },
  { name: 'Luxembourg', iso2: 'LU', dial: '+352', example: '628 123 456' },
  { name: 'Macau', iso2: 'MO', dial: '+853', example: '6612 3456' },
  { name: 'Madagascar', iso2: 'MG', dial: '+261', example: '32 12 345 67' },
  { name: 'Malawi', iso2: 'MW', dial: '+265', example: '991 23 45 67' },
  { name: 'Malaysia', iso2: 'MY', dial: '+60', example: '12 345 6789' },
  { name: 'Maldives', iso2: 'MV', dial: '+960', example: '771 2345' },
  { name: 'Mali', iso2: 'ML', dial: '+223', example: '65 01 23 45' },
  { name: 'Malta', iso2: 'MT', dial: '+356', example: '9696 1234' },
  { name: 'Marshall Islands', iso2: 'MH', dial: '+692', example: '235 1234' },
  { name: 'Mauritania', iso2: 'MR', dial: '+222', example: '22 12 34 56' },
  { name: 'Mauritius', iso2: 'MU', dial: '+230', example: '5251 2345' },
  { name: 'Mexico', iso2: 'MX', dial: '+52', example: '222 123 4567' },
  { name: 'Micronesia', iso2: 'FM', dial: '+691', example: '350 1234' },
  { name: 'Moldova', iso2: 'MD', dial: '+373', example: '621 12 345' },
  { name: 'Monaco', iso2: 'MC', dial: '+377', example: '6 12 34 56 78' },
  { name: 'Mongolia', iso2: 'MN', dial: '+976', example: '8812 3456' },
  { name: 'Montenegro', iso2: 'ME', dial: '+382', example: '67 622 901' },
  { name: 'Morocco', iso2: 'MA', dial: '+212', example: '650 123456' },
  { name: 'Mozambique', iso2: 'MZ', dial: '+258', example: '82 123 4567' },
  { name: 'Myanmar', iso2: 'MM', dial: '+95', example: '9 212 3456' },
  { name: 'Namibia', iso2: 'NA', dial: '+264', example: '81 123 4567' },
  { name: 'Nauru', iso2: 'NR', dial: '+674', example: '555 1234' },
  { name: 'Nepal', iso2: 'NP', dial: '+977', example: '984 1234567' },
  { name: 'Netherlands', iso2: 'NL', dial: '+31', example: '6 12345678' },
  { name: 'New Zealand', iso2: 'NZ', dial: '+64', example: '21 123 4567' },
  { name: 'Nicaragua', iso2: 'NI', dial: '+505', example: '8123 4567' },
  { name: 'Niger', iso2: 'NE', dial: '+227', example: '93 12 34 56' },
  { name: 'Nigeria', iso2: 'NG', dial: '+234', example: '802 123 4567' },
  { name: 'North Korea', iso2: 'KP', dial: '+850', example: '192 123 4567' },
  { name: 'North Macedonia', iso2: 'MK', dial: '+389', example: '72 345 678' },
  { name: 'Norway', iso2: 'NO', dial: '+47', example: '406 12 345' },
  { name: 'Oman', iso2: 'OM', dial: '+968', example: '9212 3456' },
  { name: 'Pakistan', iso2: 'PK', dial: '+92', example: '301 2345678' },
  { name: 'Palau', iso2: 'PW', dial: '+680', example: '620 1234' },
  { name: 'Palestine', iso2: 'PS', dial: '+970', example: '59 123 4567' },
  { name: 'Panama', iso2: 'PA', dial: '+507', example: '6123 4567' },
  { name: 'Papua New Guinea', iso2: 'PG', dial: '+675', example: '7012 3456' },
  { name: 'Paraguay', iso2: 'PY', dial: '+595', example: '961 456789' },
  { name: 'Peru', iso2: 'PE', dial: '+51', example: '912 345 678' },
  { name: 'Philippines', iso2: 'PH', dial: '+63', example: '905 123 4567' },
  { name: 'Poland', iso2: 'PL', dial: '+48', example: '512 345 678' },
  { name: 'Portugal', iso2: 'PT', dial: '+351', example: '912 345 678' },
  { name: 'Qatar', iso2: 'QA', dial: '+974', example: '3312 3456' },
  { name: 'Romania', iso2: 'RO', dial: '+40', example: '712 034 567' },
  { name: 'Russia', iso2: 'RU', dial: '+7', example: '912 345 6789' },
  { name: 'Rwanda', iso2: 'RW', dial: '+250', example: '720 123 456' },
  { name: 'Saint Kitts and Nevis', iso2: 'KN', dial: '+1869', example: '765 1234' },
  { name: 'Saint Lucia', iso2: 'LC', dial: '+1758', example: '284 1234' },
  { name: 'Saint Vincent and the Grenadines', iso2: 'VC', dial: '+1784', example: '430 1234' },
  { name: 'Samoa', iso2: 'WS', dial: '+685', example: '72 12345' },
  { name: 'San Marino', iso2: 'SM', dial: '+378', example: '66 66 12 12' },
  { name: 'Sao Tome and Principe', iso2: 'ST', dial: '+239', example: '981 2345' },
  { name: 'Saudi Arabia', iso2: 'SA', dial: '+966', example: '51 234 5678' },
  { name: 'Senegal', iso2: 'SN', dial: '+221', example: '70 123 45 67' },
  { name: 'Serbia', iso2: 'RS', dial: '+381', example: '60 1234567' },
  { name: 'Seychelles', iso2: 'SC', dial: '+248', example: '2 510 123' },
  { name: 'Sierra Leone', iso2: 'SL', dial: '+232', example: '25 123456' },
  { name: 'Singapore', iso2: 'SG', dial: '+65', example: '8123 4567' },
  { name: 'Slovakia', iso2: 'SK', dial: '+421', example: '912 123 456' },
  { name: 'Slovenia', iso2: 'SI', dial: '+386', example: '31 234 567' },
  { name: 'Solomon Islands', iso2: 'SB', dial: '+677', example: '74 21234' },
  { name: 'Somalia', iso2: 'SO', dial: '+252', example: '7 1123456' },
  { name: 'South Africa', iso2: 'ZA', dial: '+27', example: '71 123 4567' },
  { name: 'South Korea', iso2: 'KR', dial: '+82', example: '10 2000 0000' },
  { name: 'South Sudan', iso2: 'SS', dial: '+211', example: '977 123 456' },
  { name: 'Spain', iso2: 'ES', dial: '+34', example: '612 34 56 78' },
  { name: 'Sri Lanka', iso2: 'LK', dial: '+94', example: '71 234 5678' },
  { name: 'Sudan', iso2: 'SD', dial: '+249', example: '91 123 1234' },
  { name: 'Suriname', iso2: 'SR', dial: '+597', example: '741 2345' },
  { name: 'Sweden', iso2: 'SE', dial: '+46', example: '70 123 45 67' },
  { name: 'Switzerland', iso2: 'CH', dial: '+41', example: '78 123 45 67' },
  { name: 'Syria', iso2: 'SY', dial: '+963', example: '944 567 890' },
  { name: 'Taiwan', iso2: 'TW', dial: '+886', example: '912 345 678' },
  { name: 'Tajikistan', iso2: 'TJ', dial: '+992', example: '917 123 456' },
  { name: 'Tanzania', iso2: 'TZ', dial: '+255', example: '621 234 567' },
  { name: 'Thailand', iso2: 'TH', dial: '+66', example: '81 234 5678' },
  { name: 'Timor-Leste', iso2: 'TL', dial: '+670', example: '7721 2345' },
  { name: 'Togo', iso2: 'TG', dial: '+228', example: '90 11 23 45' },
  { name: 'Tonga', iso2: 'TO', dial: '+676', example: '771 5123' },
  { name: 'Trinidad and Tobago', iso2: 'TT', dial: '+1868', example: '291 1234' },
  { name: 'Tunisia', iso2: 'TN', dial: '+216', example: '20 123 456' },
  { name: 'Turkey', iso2: 'TR', dial: '+90', example: '501 234 5678' },
  { name: 'Turkmenistan', iso2: 'TM', dial: '+993', example: '66 123456' },
  { name: 'Tuvalu', iso2: 'TV', dial: '+688', example: '90 1234' },
  { name: 'Uganda', iso2: 'UG', dial: '+256', example: '712 345678' },
  { name: 'Ukraine', iso2: 'UA', dial: '+380', example: '50 123 4567' },
  { name: 'United Arab Emirates', iso2: 'AE', dial: '+971', example: '50 123 4567' },
  { name: 'United Kingdom', iso2: 'GB', dial: '+44', example: '7400 123456' },
  { name: 'United States', iso2: 'US', dial: '+1', example: '201 555 0123' },
  { name: 'Uruguay', iso2: 'UY', dial: '+598', example: '94 231 234' },
  { name: 'Uzbekistan', iso2: 'UZ', dial: '+998', example: '91 234 5678' },
  { name: 'Vanuatu', iso2: 'VU', dial: '+678', example: '591 2345' },
  { name: 'Vatican City', iso2: 'VA', dial: '+379', example: '6 98 12 34 56' },
  { name: 'Venezuela', iso2: 'VE', dial: '+58', example: '412 1234567' },
  { name: 'Vietnam', iso2: 'VN', dial: '+84', example: '91 234 56 78' },
  { name: 'Yemen', iso2: 'YE', dial: '+967', example: '712 345 678' },
  { name: 'Zambia', iso2: 'ZM', dial: '+260', example: '95 5123456' },
  { name: 'Zimbabwe', iso2: 'ZW', dial: '+263', example: '71 234 5678' },
]

export const COUNTRIES: Country[] = RAW.map((c) => ({ ...c, flag: flagOf(c.iso2) }))

// Default selection for the form (India — NNK's locale).
export const DEFAULT_COUNTRY =
  COUNTRIES.find((c) => c.iso2 === 'IN') ?? COUNTRIES[0]

/**
 * Format a raw digit string to mirror the grouping of a country's example
 * number (spaces follow the example's spacing). Extra digits beyond the
 * example length are appended ungrouped so longer numbers still type through.
 */
export function formatNational(digits: string, example: string): string {
  const clean = digits.replace(/\D/g, '')
  if (!clean) return ''
  const groups = example.split(' ').map((g) => g.length)
  const out: string[] = []
  let i = 0
  for (const len of groups) {
    if (i >= clean.length) break
    out.push(clean.slice(i, i + len))
    i += len
  }
  if (i < clean.length) out.push(clean.slice(i))
  return out.join(' ')
}
