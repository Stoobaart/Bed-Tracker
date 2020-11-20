import { helper } from '@ember/component/helper';
import moment from 'moment';

export default helper(function timeSince([lastEdittedDate]) {
  const timeDiffInMonths = Math.abs(moment().diff(lastEdittedDate, 'months'));
  const timeDiffInDays = Math.abs(moment().diff(lastEdittedDate, 'days'));
  const timeDiffInHours = Math.abs(moment().diff(lastEdittedDate, 'hours'));
  const timeDiffInMinutes = Math.abs(moment().diff(lastEdittedDate, 'minutes'));
  const timeDiffInSeconds = Math.abs(moment().diff(lastEdittedDate, 'seconds'));

  if (timeDiffInMonths > 0) {
    return timeDiffInMonths === 1 ? `${timeDiffInMonths} month ago` : `${timeDiffInMonths} months ago`;
  } else if (timeDiffInDays > 0) {
    return timeDiffInDays === 1 ? `${timeDiffInDays} day ago` : `${timeDiffInDays} days ago`;
  } else if (timeDiffInHours > 0) {
    return timeDiffInHours === 1 ? `${timeDiffInHours} hour ago` : `${timeDiffInHours} hours ago`;
  } else if (timeDiffInMinutes > 0) {
    return timeDiffInMinutes === 1 ? `${timeDiffInMinutes} minute ago` : `${timeDiffInMinutes} minutes ago`;
  } else if (timeDiffInSeconds > 0) {
    return `${timeDiffInSeconds} seconds ago`;
  }
});
