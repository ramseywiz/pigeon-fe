import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getEvents,
  createEvent,
  updateEvent as updateEventService,
} from '../api/events/eventService';
import type { EventDto } from '../api/events/eventDto';
import type { RootState } from './store';
import type { EventFormState } from '../components/eventform/eventform';

interface EventsState {
  events: EventDto[];
  loading: boolean;
  error: string | null;
}

const initialState: EventsState = {
  events: [],
  loading: false,
  error: null,
};

export const fetchEvents = createAsyncThunk('events/fetchAll', async () => {
  return await getEvents();
});

export const addEvent = createAsyncThunk('events/add', async (form: EventFormState) => {
  return await createEvent(form);
});

export const updateEvent = createAsyncThunk(
  'events/update',
  async ({ id, form }: { id: string; form: EventFormState }) => {
    return await updateEventService(id, form);
  },
);

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to load events';
      })
      .addCase(addEvent.fulfilled, (state, action) => {
        state.events.push(action.payload);
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        const index = state.events.findIndex((e) => e.id === action.payload.id);
        if (index !== -1) state.events[index] = action.payload;
      });
  },
});

export const selectEvents = (state: RootState) => state.events.events;
export const selectEventsLoading = (state: RootState) => state.events.loading;
export const selectEventsError = (state: RootState) => state.events.error;

export default eventsSlice.reducer;
