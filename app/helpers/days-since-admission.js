import { helper } from '@ember/component/helper';
import moment from 'moment';

export default helper(function daysSinceAdmission([admissionDate]) {
    const given = moment(admissionDate).startOf('day');
    const current = moment().startOf('day').add(1, 'days');

    return moment.duration(current.diff(given)).asDays();
});
