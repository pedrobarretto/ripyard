import { Timestamp } from 'firebase/firestore';

export function formatBrazilDate(timestamp: Timestamp): string {
  console.log(timestamp)
  const date = timestamp.toDate(); // Convert Timestamp to Date

  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric' as const,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'America/Sao_Paulo',
  };

  return new Intl.DateTimeFormat('pt-BR', options).format(date);
}


export function formatDateFromFirebase(timestamp: Timestamp) {
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'America/Sao_Paulo',
  };

  const formattedDate = timestamp.toDate().toLocaleDateString('pt-BR', options);

  return formattedDate;
}

export function formatDateOnlyDays(timestamp: Timestamp) {
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  };

  const formattedDate = timestamp.toDate().toLocaleDateString('pt-BR', options);

  return formattedDate;
}