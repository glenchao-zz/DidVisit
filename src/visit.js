import {
    extendObservable,
    action,
    computed,
    toJS,
} from 'mobx';
import Moment from 'moment';

export default class Visit {
    constructor(params = {}) {
        let {
            latitude = 0,
            longitude = 0,
        } = params.latlng;
        extendObservable(this, {
            id: params.id || "",
            name: params.name || "",
            latlng: { latitude: Number(latitude), longitude: Number(longitude) },
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
        this.latlng = {
            latitude: params.latitude,
            longitude: params.longitude
        };
        this.arrivalDate = params.arrivalDate;
        this.departureDate = params.departureDate;
        this.horizontalAccuracy = params.horizontalAccuracy;
    }

    value() {
        return toJS(this);
    }
}