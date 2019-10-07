import Storage from "./storage";
import {OrderForm} from "../map/submitform";

class DeliveryMethod {

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
        return  this._price;
    }

    get threshold(){
        return this._threshold;
    }

    get ready() {
        return false;
    }

    get info() {
        return {};
    }

}



class ParcelShopFactory extends DeliveryMethod{

    create(type){
        if(type === 'iml')
            return new IML();
        if(type === 'boxberry')
            return new Boxberry();
    }
}


export default class DeliveryMethodFactory{
    createCourier(){

    }

    createParcelShop(){

    }
}

