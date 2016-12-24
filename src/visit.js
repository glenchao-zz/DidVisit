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
        latitude = formatCoordinate(latitude);
        longitude = formatCoordinate(longitude);

        extendObservable(this, {
            id: params.id || "",
            name: params.name || "",
            latlng: { latitude: latitude, longitude: longitude },
            arrivalDate: params.arrivalDate ? Moment(params.arrivalDate) : null,
            departureDate: params.departureDate ? Moment(params.departureDate) : null,
            duration: computed(() => {
                if (this.arrivalDate && this.departureDate) {
                    return this.departureDate.diff(this.arrivalDate);
                } else {
                    return 0;
                }
            }),
            horizontalAccuracy: params.horizontalAccuracy || 0,
        });
        // actions
        action(this.update);
        action(this.value);
    }

    update(params = {}) {
        let {
            latitude = 0,
            longitude = 0,
        } = params.latlng;

        this.id = params.id;
        this.name = params.name;
        this.latlng = {
            latitude: formatCoordinate(latitude),
            longitude: formatCoordinate(longitude)
        };
        this.arrivalDate = params.arrivalDate;
        this.departureDate = params.departureDate;
        this.horizontalAccuracy = params.horizontalAccuracy;
    }

    value() {
        return toJS(this);
    }
}

function formatCoordinate(coord) {
    return Number(Number(coord).toFixed(5));
}