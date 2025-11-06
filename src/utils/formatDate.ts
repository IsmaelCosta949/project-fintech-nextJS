export function formatDateTime(isoString: string): string {
  const date = new Date(isoString);

  const dia = String(date.getDate()).padStart(2, "0");
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const ano = date.getFullYear();

  const hora = String(date.getHours()).padStart(2, "0");
  const minuto = String(date.getMinutes()).padStart(2, "0");

  return `${dia}/${mes}/${ano} - ${hora}:${minuto}`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function combineDateTime(dateStr: string, timeStr: string): string {
  // Combina data (YYYY-MM-DD) e hora (HH:mm) em formato ISO DateTime
  // Exemplo: "2025-11-05" + "14:30" -> "2025-11-05T14:30:00"
  return `${dateStr}T${timeStr}:00`;
}
