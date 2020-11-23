import { helper } from '@ember/component/helper';
import moment from 'moment';

export default helper(function daysSinceAdmission([admissionDate]) {
    const daysSinceAdmission = moment().add(1, 'days').diff(admissionDate, 'days');
    return daysSinceAdmission;
});
