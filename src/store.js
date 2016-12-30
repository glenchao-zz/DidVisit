
import { AsyncStorage } from 'react-native';
import { observable, toJS } from 'mobx';
import Moment from 'moment';

import Visit from './visit';

const VISIT_DATA = "VISIT_DATA";

class DidVisitStore {
    constructor() {
        this.visits = observable([]);
        this.retrieve();
    }

    add = (visit) => {
        // find if there's a visit that has the same arrival date
        let index = this.visits.findIndex(v => {
            return visit.arrivalDate.isSame(v.arrivalDate);
        });
        // if there's no match, just add to the front
        if (index === -1) { this.visits.unshift(visit); }
        // if there's a match, overwrite
        else { this.visits[index].merge(visit); }
        this.save();
    }

    get = (id) => {
        return this.visits.find(visit => visit.id === id);
    }

    getAll = () => {
        return this.visits;
    }

    remove = (id) => {
        let visitToRemove = this.get(id);
        let index = this.visits.indexOf(visitToRemove);
        this.visits.splice(index, 1);
        this.save();
        return visitToRemove;
    }

    removeAll = () => {
        this.visits.replace([]);
        this.save();
    }

    save = () => {
        return AsyncStorage.setItem(VISIT_DATA, JSON.stringify(toJS(this.visits)));
    }

    retrieve = () => {
        AsyncStorage.getItem(VISIT_DATA).then(data => {
            let visits = JSON.parse(data || "[]");
            visits = visits.map(params => new Visit(params));
            visits.sort(byArrivalDate);
            this.visits.replace(visits);
        });
    }
}

function byArrivalDate(v1, v2) {
    if (!v1.arrivalDate || !v2.arrivalDate) { return -1; }
    return v2.arrivalDate.isAfter(v1.arrivalDate) ? 1 : -1;
}

export default new DidVisitStore();