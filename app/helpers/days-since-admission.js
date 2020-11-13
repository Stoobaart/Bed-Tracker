import { helper } from '@ember/component/helper';
import moment from 'moment';

export default helper(function daysSinceAdmission([admissionDate]) {
    const daysSinceAdmission = moment().diff(admissionDate, 'days');
    return daysSinceAdmission;
});
