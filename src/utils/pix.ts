import QRCode from 'qrcode';

export interface GeneratePixParams {
  pixKey: string;
  merchantName: string;
  merchantCity: string;
  amount?: number;
  txid?: string;
  description?: string;
}

/**
 * Formats a single EMV TLV (Tag-Length-Value) chunk.
 * Length must be zero-padded to 2 digits.
 */
function formatTlv(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${id}${len}${value}`;
}

/**
 * Strips accents and standardizes text to ASCII safe characters for EMV payload
 */
function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .trim();
}

/**
 * Calculates the CRC16-CCITT (0x1021) checksum according to ISO/IEC 13239 / BACEN EMV standard.
 * Polynomial: 0x1021, Initial: 0xFFFF
 */
export function calculateCrc16(payload: string): string {
  let crc = 0xffff;
  const polynomial = 0x1021;

  for (let i = 0; i < payload.length; i++) {
    const byte = payload.charCodeAt(i);
    crc ^= byte << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ polynomial) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }

  return (crc & 0xffff).toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Generates official BACEN PIX BR Code EMV payload (Copia e Cola string).
 * Reference: Banco Central do Brasil - Especificação do Arranjo Pix & Padrão EMV QRCPS-MPM.
 */
export function generatePixPayload(params: GeneratePixParams): string {
  const {
    pixKey,
    merchantName,
    merchantCity,
    amount,
    txid = '***',
    description,
  } = params;

  // Tag 00: Payload Format Indicator
  const tag00 = formatTlv('00', '01');

  // Tag 26: Merchant Account Information
  // Subtag 00: GUI (br.gov.bcb.pix)
  const subtag00 = formatTlv('00', 'br.gov.bcb.pix');
  // Subtag 01: Chave Pix
  const subtag01 = formatTlv('01', pixKey.trim());
  // Optional Subtag 02: Description
  const subtag02 = description ? formatTlv('02', normalizeText(description).slice(0, 40)) : '';
  const tag26 = formatTlv('26', `${subtag00}${subtag01}${subtag02}`);

  // Tag 52: Merchant Category Code (0000 or general merchandise)
  const tag52 = formatTlv('52', '0000');

  // Tag 53: Transaction Currency (986 = BRL)
  const tag53 = formatTlv('53', '986');

  // Tag 54: Transaction Amount (optional for dynamic, fixed 2 decimal places for orders)
  let tag54 = '';
  if (amount && amount > 0) {
    tag54 = formatTlv('54', amount.toFixed(2));
  }

  // Tag 58: Country Code (BR)
  const tag58 = formatTlv('58', 'BR');

  // Tag 59: Merchant Name (Max 25 characters, ASCII only)
  const cleanName = (normalizeText(merchantName) || 'AMARELINHOS').toUpperCase().slice(0, 25);
  const tag59 = formatTlv('59', cleanName);

  // Tag 60: Merchant City (Max 15 characters, ASCII only)
  const cleanCity = (normalizeText(merchantCity) || 'SAO PAULO').toUpperCase().slice(0, 15);
  const tag60 = formatTlv('60', cleanCity);

  // Tag 62: Additional Data Field Template
  // Subtag 05: Reference Label (txid - alphanumeric, max 25 chars, default '***')
  const cleanTxid = (txid.replace(/[^a-zA-Z0-9*]/g, '') || '***').slice(0, 25);
  const subtag05 = formatTlv('05', cleanTxid);
  const tag62 = formatTlv('62', subtag05);

  // Partial payload before CRC
  const payloadBeforeCrc = `${tag00}${tag26}${tag52}${tag53}${tag54}${tag58}${tag59}${tag60}${tag62}6304`;

  // Calculate CRC16 checksum
  const crc = calculateCrc16(payloadBeforeCrc);

  return `${payloadBeforeCrc}${crc}`;
}

/**
 * Generates an SVG or DataURL QR Code for rendering in the web browser
 */
export async function generatePixQrCodeDataUrl(payload: string): Promise<string> {
  try {
    return await QRCode.toDataURL(payload, {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 320,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
  } catch (err) {
    console.error('Failed to generate Pix QR Code', err);
    throw err;
  }
}
