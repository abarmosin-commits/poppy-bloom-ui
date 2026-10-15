const rubles = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 });
export const formatMoney = (value: number | null | undefined) => value == null ? '—' : rubles.format(value);
export const formatNumber = (value: number | null | undefined) => value == null ? '—' : new Intl.NumberFormat('ru-RU').format(value);
export const formatDate = (value: string) => new Intl.DateTimeFormat('ru-RU', {day:'numeric',month:'short',timeZone:'UTC'}).format(new Date(value+'T00:00:00Z'));
