import Storage from "../../entities/storage";

export default class DeliveryMethod {

    constructor(type = null){
        this.type = type;
        this._price = 0;
        this._threshold = 0;
        this.data = { ...this.structure, ...Storage.deliveryMethod };
        this._inited = false;
    }

    get structure(){
        return {};
    }

    pushData(){
        Storage.deliveryMethod = this.data;
    }

    clear(){
        Storage.deliveryMethod = {};
        this.data = this.structure;
    }

    get price(){
        return  this._price || 0;
    }

    get threshold(){
        return this._threshold || 0;
    }

    get ready() {
        return false;
    }

    get info() {
        return {};
    }

}