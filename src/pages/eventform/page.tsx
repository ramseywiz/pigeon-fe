import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EventPageLayout } from '../../components/eventpagelayout/eventpagelayout';
import {
  EventForm,
  defaultFormState,
  formStateFromDto,
  type EventFormState,
} from '../../components/eventform/eventform';
import { AnnouncementPreview } from '../../components/announcementpreview/AnnouncementPreview';
import { Button } from '../../components/ui/button';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  addEvent,
  updateEvent,
  fetchEvents,
  selectEvents,
  selectEventsLoading,
} from '../../store/eventSlice';
import { getEventFormErrors } from '../../lib/eventValidation';
import { useNotification } from '../../notifications/useNotification';
import type { EventDto } from '../../api/events/eventDto';
import styles from './page.module.css';

const hasChanges = (form: EventFormState, event: EventDto): boolean => {
  const original = formStateFromDto(event);
  return (Object.keys(original) as (keyof EventFormState)[]).some(
    (key) => form[key] !== original[key],
  );
};

export const EventFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { notify } = useNotification();

  const isEditMode = Boolean(id);

  const events = useAppSelector(selectEvents);
  const loading = useAppSelector(selectEventsLoading);
  const event = id ? (events.find((e) => e.id === id) ?? null) : null;

  const [form, setForm] = useState<EventFormState>(
    event ? formStateFromDto(event) : defaultFormState,
  );
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const errors = getEventFormErrors(form);

  // If navigating directly to /events/:id with an empty store, fetch events
  useEffect(() => {
    if (isEditMode && events.length === 0) {
      dispatch(fetchEvents());
    }
  }, [isEditMode, events.length, dispatch]);

  // Sync form once the event loads from the store
  useEffect(() => {
    if (event) {
      setForm(formStateFromDto(event));
    }
  }, [event?.id]);

  const handleCancel = () => navigate('/events');

  const handleSubmit = async () => {
    setSubmitAttempted(true);
    if (Object.keys(errors).length > 0) return;

    if (isEditMode && event) {
      if (!hasChanges(form, event)) {
        navigate('/events');
        return;
      }
      const name = event.eventName;
      navigate('/events');
      const resolve = notify(`Saving "${name}"...`);
      try {
        await dispatch(updateEvent({ id: event.id, form })).unwrap();
        resolve('success', `Saved "${name}" successfully!`);
      } catch {
        resolve('error', `Failed to save "${name}".`);
      }
    } else {
      const name = form.eventName;
      navigate('/events');
      const resolve = notify(`Adding "${name}"...`);
      try {
        await dispatch(addEvent(form)).unwrap();
        resolve('success', `Added "${name}" successfully!`);
      } catch {
        resolve('error', `Failed to add "${name}".`);
      }
    }
  };

  if (isEditMode && loading && !event) {
    return <p>Loading...</p>;
  }

  if (isEditMode && !loading && events.length > 0 && !event) {
    return <p>Event not found.</p>;
  }

  const actions = (
    <>
      <Button variant="ghost" onClick={handleCancel}>
        Cancel
      </Button>
      <Button
        variant="ghost"
        onClick={() => (isEditMode ? navigate(`/events/${id}/preview`) : setPreviewOpen(true))}
      >
        Preview Announcement
      </Button>
      <Button variant="primary" onClick={handleSubmit}>
        {isEditMode ? 'Save' : 'Add'}
      </Button>
    </>
  );

  return (
    <EventPageLayout title={isEditMode ? 'Edit Event' : 'Add Event'} actions={actions}>
      <AnnouncementPreview open={previewOpen} onClose={() => setPreviewOpen(false)} form={form} />
      <div className={styles.formBody}>
        <EventForm
          form={form}
          onChange={setForm}
          errors={errors}
          submitAttempted={submitAttempted}
        />
      </div>
    </EventPageLayout>
  );
};
