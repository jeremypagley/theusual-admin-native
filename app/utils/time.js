import moment from 'moment';

/**
 * Used to check if a store is opened given the stores hours
 * @param {start, end} storeHours Both start and end are moment values
 */
const getStoreOpened = (storeHours) => {
  const minutesOfDay = (m) => {
    return m.minutes() + m.hours() * 60;
  }

  const end = minutesOfDay(moment(storeHours.end));
  const start = minutesOfDay(moment(storeHours.start));
  const now = minutesOfDay(moment());

  if (now > start && now < end) return true;
  else return false;
}

export default {
  getStoreOpened
}