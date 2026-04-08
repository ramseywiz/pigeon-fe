import type { EventFormState } from '../components/eventform/eventform';

export type EventFormErrors = Partial<Record<keyof EventFormState, string>>;

const VALID_BRANCHES = ['Main', 'WebDev', 'InfoSec', 'Tutoring'];

export function getEventFormErrors(form: EventFormState): EventFormErrors {
  const errors: EventFormErrors = {};

  if (!form.eventName.trim()) {
    errors.eventName = 'Event name is required.';
  }

  if (!form.startDate) {
    errors.startDate = 'Start date is required.';
  }

  if (!form.startTime) {
    errors.startTime = 'Start time is required.';
  }

  if (!form.endDate) {
    errors.endDate = 'End date is required.';
  }

  if (!form.endTime) {
    errors.endTime = 'End time is required.';
  }

  // End must not be before start
  if (form.startDate && form.startTime && form.endDate && form.endTime) {
    const start = new Date(`${form.startDate}T${form.startTime}`);
    const end = new Date(`${form.endDate}T${form.endTime}`);

    if (end < start) {
      errors.endDate = 'End date/time cannot be before the start date/time.';
    } else if (end.getTime() === start.getTime()) {
      errors.endDate = 'End date/time must be after the start date/time.';
    }
  }

  if (!form.location.trim()) {
    errors.location = 'Location is required.';
  }

  if (!form.branch || !VALID_BRANCHES.includes(form.branch)) {
    errors.branch = 'Please select a valid branch.';
  }

  if (!form.description.trim()) {
    errors.description = 'Description is required.';
  }

  if (form.image && form.image.size > 3 * 1024 * 1024) {
    errors.image = 'Image must be under 3MB.';
  }
  return errors;
}
