/**
 * GS1 Digital Link & Barcode Utility
 *
 * Implements GS1 Digital Link standard (GS1 Standard Identification Keys):
 * (01) GTIN - Global Trade Item Number (13-14 digits)
 * (10) Batch / Lot Number
 * (21) Serial Number
 */

export interface ParsedGs1Code {
  isGs1: boolean;
  gtin?: string;
  lotCode?: string;
  serial?: string;
  endpointPath?: string;
}

export function parseGs1DigitalLink(code: string | null | undefined): ParsedGs1Code {
  if (!code || typeof code !== 'string') return { isGs1: false };

  const trimmed = code.trim();

  // Pattern 1: Dash-separated format (e.g., 01-08938501234567-10-LOT-202609-001)
  if (trimmed.startsWith('01-') && trimmed.includes('-10-')) {
    const parts = trimmed.split('-');
    const gtin = parts[1];
    const lotIndex = parts.indexOf('10');
    const lotCode = parts.slice(lotIndex + 1).join('-');

    if (gtin && lotCode) {
      return {
        isGs1: true,
        gtin,
        lotCode,
        endpointPath: `/01/${gtin}/10/${lotCode}`,
      };
    }
  }

  // Pattern 2: Standard GS1 URI or path: /01/<gtin>/10/<lotCode> or /01/<gtin>/10/<lotCode>/21/<serial>
  const gs1UriMatch = trimmed.match(/(?:^|\/)01\/(\d{13,14})\/10\/([^/?#]+)(?:\/21\/([^/?#]+))?/);
  if (gs1UriMatch) {
    const [, gtin, lotCode, serial] = gs1UriMatch;
    return {
      isGs1: true,
      gtin,
      lotCode,
      serial,
      endpointPath: `/01/${gtin}/10/${lotCode}${serial ? `/21/${serial}` : ''}`,
    };
  }

  return { isGs1: false };
}
