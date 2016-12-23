import {
    extendObservable,
    action,
    computed,
    toJS,
} from 'mobx';
import Moment from 'moment';

export default class Visit {
    constructor(params = {}) {
        extendObservable(this, {
            id: params.id || "",
            name: params.name || "",
            latitude: params.latitude || 0,
            longitude: params.longitude || 0,
            arrivalDate: params.arrivalDate ? Moment(params.arrivalDate) : null,
            departureDate: params.departureDate ? Moment(params.departureDate) : null,
            duration: computed(() => {
                if (this.arrivalDate && this.departureDate) {
                    return Moment.diff(this.departureDate, this.arrivalDate);
                }
            }),
            horizontalAccuracy: params.horizontalAccuracy || 0,
        });
        // actions
        action(this.update);
        action(this.value);
    }

    update(params = {}) {
        this.id = params.id;
        this.name = params.name;
        this.latitude = params.latitude;
        this.longitude = params.longitude;
        this.arrivalDate = params.arrivalDate;
        this.departureDate = params.departureDate;
        this.horizontalAccuracy = params.horizontalAccuracy;
    }

    value() {
        return toJS(this);
    }
}