import DeliveryMethod from '../DeliveryMethod';
import Mustache from 'mustache';
import template from './template.html'

export  default class ParcelShop extends DeliveryMethod{
    constructor(){
        super('PICKUP');
        this.template = template;
        this._rowData = {};
    }

    get shippingDate() {
        return this.data.shippingDate;
    }

    get imgPointer(){
        return this.data.imgPointer;
    }

    init(data,index){
        this.data.index = index;
        this._rowData = data;
        return {}
    }

    get company(){
        return this.data.parcelType;
    }

    get geoCoordinates() {
        let data = this.data;
        return [data.latitude, data.longitude];
    }

    get description() {
        return Mustache.render(this.template, this.data);
    }

    get estimatedDeliveryDate(){
        return new Date(this.data.estimatedDeliveryDate);
    }

    get zone(){
        return this.data.zone;
    }

    get logo() {
        return this.data.logo;
    }

    get price(){
        return this.data.price || 0;
    }

    get threshold(){
        return this.data.threshold || 0;
    }

    get deliveryPrice() {
        /* should be implemented */
        return false;
    }

    get color(){
        return this.data.color;
    }

    get index(){
        return this.data.index;
    }


    get hasFitting() {

        /*have to be implemented*/
        return this.data.fitting;
    }

    get cashlessPayment()
    {
        /*have to be implemented*/
        return this.data.cashlessPayment
    }

    get code(){
        return this.data.parcelShopCode;
    }

    get howToGet(){
        return this.data.howToGet;
    }

    get addressAbbr(){
        return this.data.addressAbbr;
    }

    get ready(){
        return true;
    }

    get imgPointer() {
        return {
            passive:{
                href: this.data.imgPointer,
                size: this.data.imgPointerSize,
                offset: this.data.imgPointerOffset
            },
            active:{
                href: this.data.imgActivePointer,
                size: this.data.imgActivePointerSize,
                offset: this.data.imgActivePointerOffset
            }
        };
    }

    get info() {
        return {
            code: this.data.parcelShopCode,
            addressAbbr :  this.data.addressAbbr,
            howToGet: this.data.howToGet
        };
    }
}