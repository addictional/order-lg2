import Storage from "../entities/storage";
import {App} from "../main";
import DeliveryMethodFactory from './DeliveryMethods/DeliveryMethodFactory';
import Utils from '../utils';

const isEmpty = Utils.empty;


const  Delivery  = {

    init(){
        this.__tempMethToDoor = {};
        this.methodInited = false;
        this.__availableTypes = {};
        this.__zip = {};
        this.__city = null;
        this.data = this.setData();
        this.data.ob = this.setOb();
        return true;
    },

    setData() {
        let data = {...this.structure,...Storage.delivery};
        return data;
    },

    setOb(){
        if (this.data.method == 'TODOOR' )
            return DeliveryMethodFactory.createCourier();
        else if(this.data.method == 'PICKUP')
            return DeliveryMethodFactory.createParcelShop().create('default');
        else
            return DeliveryMethodFactory.createDefault();
    },

    get method(){
        return this.data.ob;
    },


    get structure()
    {
        return {
            city: null,
            method: null,
            index: null,
            ob: {}
        };
    },

    get estimatedDate(){
        return this.method.date;
    },

    async setParcelShop(index){
        try {
            let types = await this.getAvailableTypes();
            this.method = types.PICKUP[index];
            return true;
        } catch (error) {
            throw error;
        }
    },

    pushData()
    {
        let temp = {...this.data};
        delete(temp.ob);
        Storage.delivery = this.data;
    },

    get price(){
        return this.method.price;
    },

    get threshold(){
        return this.method.threshold;
    },

    set city(val)
    {
        this.data = this.structure;
        this.data.ob = this.setOb();
        this.data.city = val;
        this.pushData();
    },

    get city()
    {
        return this.data.city;
    },

    get index(){
        return this.data.index;
    },

    set index(val){
        this.data.index = val;
        this.pushData();
    },

    set method(val){
        if(typeof val === 'string'){
            this.data.ob.clear();
            this.data.method = val;
            this.data.ob = this.setOb();
            this.pushData();
            if(val == 'TODOOR')
            {
                let temp = {};
                if(typeof this.__tempMethToDoor[this.city] != 'undefined')
                    temp = this.__tempMethToDoor[this.city];
                else
                {
                    let _this = this;
                    $.ajax({
                        url: App.params.ajaxUrl,
                        data: {
                            method: 'getDeliveryMethods',
                            address: this.city
                        },
                        dataType: 'json',
                        async: false,
                        success : function(data) {
                            temp = _this.setParcels(data);
                        }
                    });
                    this.__tempMethToDoor[this.city] = temp;
                }
                this.method.init(temp.TODOOR.iml);
            }
        }else {
            this.data.method = 'PICKUP';
            this.data.ob = val;
        }
    },



    get courierFullAddress(){
        return (!isEmpty(this.method.street) ? ', '+this.method.street : '')
            +(!isEmpty(this.method.build) ? ', дом '+this.method.build : '')
            +(!isEmpty(this.method.block) && !isEmpty(this.method.build) ?'/'+this.method.block : '')
            +(!isEmpty(this.method.flat) && !isEmpty(this.method.block)
            && !isEmpty(this.method.build) ?', '+this.method.flat : '');
    },


    async getAvailableTypes(){
        try {
            if(this.city == null)
                return (new Error('city empty'));
            let address = this.city;
            if(this.method.type == 'TODOOR')
            {
                address += this.courierFullAddress;
            }
            let index = await this._getZip(address);
            if(typeof this.__availableTypes[index] != 'undefined')
                return this.__availableTypes[index];
            let data  = await $.ajax({
                url: App.params.ajaxUrl,
                data: {
                    method: 'getDeliveryMethods',
                    address: this.city
                },
                dataType: 'json'
            });
            console.log(data);
            data = this.setParcels(data);
            if(this.method.type == 'TODOOR')
            {
                this.__tempMethToDoor[this.city] = data;
                this.method.init(data.TODOOR.iml);
            }
            this.__availableTypes[index] = data;
            return data;
        }catch (error) {
            throw error;
        }
    },

    setParcels(data){
        let counter = 0,
            newArr = {
                geo: [],
                TODOOR: {},
                PICKUP: []
            },
            parcelShop;
        for(let company in data )
        {
            if(company == 'geo')
                newArr.geo = data[company];
            if(typeof data[company].TODOOR != 'undefined'){
                let toDoor = data[company].TODOOR[0];
                newArr.TODOOR[company] =  toDoor;
            }
            if(typeof data[company].PICKUP != "undefined")
                for(let parcel in data[company].PICKUP)
                {
                    switch (company) {
                        case 'iml':
                            parcelShop = DeliveryMethodFactory.createParcelShop().create('iml')
                                .init(data[company].PICKUP[parcel],counter++);
                            newArr.PICKUP.push(parcelShop);
                            break;
                        case 'boxberry':
                            parcelShop = DeliveryMethodFactory.createParcelShop().create('boxberry')
                                .init(data[company].PICKUP[parcel],counter++);
                            newArr.PICKUP.push(parcelShop);
                            break;
                    }
                }
        }
        for(let index in newArr) {
            if (index == "TODOOR" && typeof newArr[index].iml == 'undefined')
                delete (newArr[index]);
            if (index == "PICKUP" && newArr[index].length <= 0)
                delete (newArr[index]);
        }
        return newArr;
    },

    async _getZip(address){
        try{
            let data = null;
            if(typeof this.__zip[address.trim()] != 'undefined')
            {
                data =  this.__zip[address.trim()];
            }else{
                data  = await $.ajax({
                    url: App.params.ajaxUrl,
                    data: {method: 'getInfoByAddress',address:address},
                    dataType: "json"
                });
                this.__zip[address.trim()] = data.postal_code;
            }
            this.index = this.__zip[address.trim()];
            return this.__zip[address.trim()];
        } catch (error) {
            throw error;
        }

    },

    async getZip(){
        try{
            let address = (this.city != null ? this.city : '');
            if(this.method.type == 'TODOOR'){
                address += this.courierFullAddress;
            }
            return await this._getZip(address);
        } catch (error) {
            throw error;
        }
    },
};



export default Delivery;