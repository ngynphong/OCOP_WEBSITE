export function generateSkuFromName(variantName: string): string {
  if (!variantName) return '';
  return variantName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/\s+/g, '-')
    .replace(/[^A-Z0-9-]/g, '');
}

export function generateInternalGtin(): string {
  let gtin = '200';
  for (let i = 0; i < 9; i++) {
    gtin += Math.floor(Math.random() * 10).toString();
  }
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(gtin.charAt(i), 10);
    sum += i % 2 === 0 ? digit : digit * 3;
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  gtin += checkDigit.toString();
  return gtin;
}

export function parseOptionValues(rawStr?: string): Record<string, string> | undefined {
  if (!rawStr) return undefined;
  const optionValues: Record<string, string> = {};
  rawStr.split(',').forEach((pair) => {
    const [key, value] = pair.split(':').map((s) => s.trim());
    if (key && value) {
      optionValues[key] = value;
    }
  });
  return Object.keys(optionValues).length > 0 ? optionValues : undefined;
}
