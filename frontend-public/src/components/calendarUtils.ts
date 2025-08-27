// Debug utilities for Calendar component

export const DEBUG_CALENDAR = process.env.NODE_ENV === 'development';

export function logCalendarDebug(message: string, data?: any) {
  if (DEBUG_CALENDAR) {
    console.log(`[Calendar Debug] ${message}`, data || '');
  }
}

export function logCalendarError(message: string, error?: any) {
  console.error(`[Calendar Error] ${message}`, error || '');
}

// Test function to verify FullCalendar API
export function testCalendarAPI(calendarRef: React.RefObject<any>) {
  if (!calendarRef.current) {
    logCalendarError('Calendar ref is null');
    return false;
  }

  try {
    const api = calendarRef.current.getApi();
    if (!api) {
      logCalendarError('Calendar API is null');
      return false;
    }

    logCalendarDebug('Calendar API available', {
      currentView: api.view.type,
      title: api.view.title,
      availableViews: ['dayGridMonth', 'timeGridWeek', 'listMonth']
    });

    return true;
  } catch (error) {
    logCalendarError('Error testing calendar API', error);
    return false;
  }
}
