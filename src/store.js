
import { AsyncStorage } from 'react-native';
import { observable, toJS } from 'mobx';
import Visit from './visit';

const VISIT_DATA = "VISIT_DATA";

class DidVisitStore {
    constructor() {
        this.visits = observable([]);
        this.retrieve();
    }

    add = (visit) => {
        this.visits.push(visit);
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
            this.visits.replace(visits);
        });
    }
}

export default new DidVisitStore();