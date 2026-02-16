export function formatDateShort(value?: string | Date | null) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

export function formatNumberShort(value: number) {
  if (value >= 1000) {
    const formatted = (value / 1000).toFixed(1).replace(/\.0$/, "");
    return `${formatted}k`;
  }
  return value.toString();
}

export function formatMoney(value: number) {
  return `$ ${value.toFixed(2)}`;
}
