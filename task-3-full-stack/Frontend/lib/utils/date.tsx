export const isTodayVisible = (visibilityDays: unknown): boolean => {
  if (!visibilityDays) return false;
  
  let daysArray: { day_of_week: number }[] = [];
  
  if (typeof visibilityDays === 'string') {
    try {
      daysArray = JSON.parse(visibilityDays);
    } catch {
      return false;
    }
  } else if (Array.isArray(visibilityDays)) {
    daysArray = visibilityDays;
  }

  if (!Array.isArray(daysArray)) return false;

  const today = new Date().getDay();
  return daysArray.some(day => 'day_of_week' in day && day.day_of_week === today);
};