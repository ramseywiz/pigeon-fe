import type { EventDto } from './eventDto';

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = async (): Promise<HeadersInit> => {
  const session = await import('../../lib/supabase').then((m) => m.supabase.auth.getSession());
  const token = session.data.session?.access_token;
  return { Authorization: `Bearer ${token}` };
};

export const getEvents = async (): Promise<EventDto[]> => {
  const headers = await getAuthHeader();
  const response = await fetch(`${API_URL}/api/events`, { headers });
  if (!response.ok) throw new Error('Failed to fetch events');
  return response.json();
};

export const createEvent = async (
  form: Omit<EventDto, 'id'> & { image: File | null },
): Promise<EventDto> => {
  const headers = await getAuthHeader();

  let imageUrl: string | null = null;

  if (form.image) {
    const formData = new FormData();
    formData.append('file', form.image);
    const uploadRes = await fetch(`${API_URL}/api/events/upload`, {
      method: 'POST',
      headers: { Authorization: (headers as Record<string, string>).Authorization },
      body: formData,
    });
    if (!uploadRes.ok) throw new Error('Failed to upload image');
    const uploadData = await uploadRes.json();
    imageUrl = uploadData.url;
  }

  const response = await fetch(`${API_URL}/api/events`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      eventName: form.eventName,
      startDate: form.startDate,
      startTime: form.startTime,
      endDate: form.endDate,
      endTime: form.endTime,
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

export const updateEvent = async (
  id: string,
  form: Omit<EventDto, 'id'> & { image: File | null },
): Promise<EventDto> => {
  const headers = await getAuthHeader();

  let imageUrl = form.imageUrl;

  if (form.image) {
    const formData = new FormData();
    formData.append('file', form.image);
    const uploadRes = await fetch(`${API_URL}/api/events/upload`, {
      method: 'POST',
      headers: { Authorization: (headers as Record<string, string>).Authorization },
      body: formData,
    });
    if (!uploadRes.ok) throw new Error('Failed to upload image');
    const uploadData = await uploadRes.json();
    imageUrl = uploadData.url;
  }

  const response = await fetch(`${API_URL}/api/events/${id}`, {
    method: 'PUT',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      eventName: form.eventName,
      startDate: form.startDate,
      startTime: form.startTime,
      endDate: form.endDate,
      endTime: form.endTime,
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
