import type { EventDto } from './eventDto';
import type { EventFormState } from '../../components/eventform/eventform';

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = async (): Promise<HeadersInit> => {
  const session = await import('../../lib/supabase').then((m) => m.supabase.auth.getSession());
  const token = session.data.session?.access_token;
  return { Authorization: `Bearer ${token}` };
};

const uploadImage = async (image: File, authHeader: string): Promise<string> => {
  const formData = new FormData();
  formData.append('file', image);
  const res = await fetch(`${API_URL}/api/events/upload`, {
    method: 'POST',
    headers: { Authorization: authHeader },
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to upload image');
  const data = await res.json();
  return data.url;
};

const toUtcTime = (date: string, time: string): { date: string; time: string } => {
  // frustrating: the api returned HH:MM:SS but the frontend does HH:MM -.-
  const normalizedTime = time.length === 8 ? time : `${time}:00`;
  const local = new Date(`${date}T${normalizedTime}`);
  const utcDate = local.toISOString().split('T')[0];
  const utcTime = local.toISOString().split('T')[1].substring(0, 5);
  return { date: utcDate, time: utcTime };
};

export const getEvents = async (): Promise<EventDto[]> => {
  const headers = await getAuthHeader();
  const response = await fetch(`${API_URL}/api/events`, { headers });
  if (!response.ok) throw new Error('Failed to fetch events');
  return response.json();
};

export const createEvent = async (form: EventFormState): Promise<EventDto> => {
  const headers = await getAuthHeader();
  const authHeader = (headers as Record<string, string>).Authorization;

  const imageUrl = form.image ? await uploadImage(form.image, authHeader) : null;

  const start = toUtcTime(form.startDate, form.startTime);
  const end = toUtcTime(form.endDate, form.endTime);

  const response = await fetch(`${API_URL}/api/events`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      eventName: form.eventName,
      startDate: start.date,
      startTime: start.time,
      endDate: end.date,
      endTime: end.time,
      location: form.location,
      branch: form.branch,
      description: form.description,
      food: form.food,
      imageUrl,
    }),
  });

  if (!response.ok) throw new Error('Failed to create event');
  return response.json();
};

export const updateEvent = async (id: string, form: EventFormState): Promise<EventDto> => {
  const headers = await getAuthHeader();
  const authHeader = (headers as Record<string, string>).Authorization;

  const imageUrl = form.image ? await uploadImage(form.image, authHeader) : form.imageUrl;

  const start = toUtcTime(form.startDate, form.startTime);
  const end = toUtcTime(form.endDate, form.endTime);

  const response = await fetch(`${API_URL}/api/events/${id}`, {
    method: 'PUT',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      eventName: form.eventName,
      startDate: start.date,
      startTime: start.time,
      endDate: end.date,
      endTime: end.time,
      location: form.location,
      branch: form.branch,
      description: form.description,
      food: form.food,
      imageUrl,
    }),
  });

  if (!response.ok) throw new Error('Failed to update event');
  return response.json();
};

export const deleteEvents = async (ids: string[]): Promise<void> => {
  const headers = await getAuthHeader();
  const response = await fetch(`${API_URL}/api/events`, {
    method: 'DELETE',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify(ids),
  });
  if (!response.ok) throw new Error('Failed to delete events');
};
