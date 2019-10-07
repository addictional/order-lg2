import DeliveryMethod from '../DeliveryMethod';


export  default class CourierDelivery extends DeliveryMethod{
    constructor(){
        super('TODOOR');
        this.company = 'IML';
        this.selectedDate = null;
        this.selectedTime = null
    }

    get _intervalsClone() {
        return JSON.parse(JSON.stringify(this.__data.intervals));
    }

    get info() {
        return {
            street: this.street,
            build: this.build,
            block: this.block,
            flat: this.flat,
            remoteness: 10,
            index: Delivery.index,
            userDeliveryDate:{
                interval: this.selectedTime,
                date : this.selectedDate
            },
            locationCode: this.__data.LocationCode,
            name:	this.__data.Name
        };
    }

    get intervals(){
        console.log()
        return this._intervalsClone.map((element)=>{
            element.date = new Date(element.date);
            element.intervals = element.intervals.map((el,index)=>{
                return {value: el,index};
            });
            return element;
        });
    }

    init(data){
        console.log('init',data);
        this.__data = data;
        this.zone = data.ZONE;
        this.setPriceAndThreshold(this.zone);
        this.shippingDate = data.DATE_SHIPMENT;
        this.estimatedDeliveryDate = data.DAYS_FORMAT;
        this.date = data.DAYS_FORMAT;
    }

    setPriceAndThreshold(zone) {
        switch (zone) {
            case 'B':
                this._price = 500;
                this._threshold = 5000;
                break;
            case 'C':
                this._price = 500;
                this._threshold = 5000;
                break;
            case 'D':
                this._price = 500;
                this._threshold = 5000;
                break;
            case 'E':
                this._price = 500;
                this._threshold = 5000;
                break;
            case 'F':
                this._price = 500;
                this._threshold = 5000;
                break;
            case 'G':
                this._price = 500;
                this._threshold = 5000;
                break;
            case 'H':
                this._price = 700;
                this._threshold = 7000;
                break;
            case 'V1':
                this._price = 1000;
                this._threshold = 10000;
                break;
            case 'V2':
                this._price = 1000;
                this._threshold = 10000;
                break;
            case 'V3':
                this._price = 2500;
                this._threshold = 25000;
                break;
            case 'A':
                this._price = 200;
                this._threshold = 5000;
                break;
        }
    }

    get structure(){
        return {
            street: '',
            build: '',
            block: '',
            flat: '',
            deliveryCompany : ''
        };
    }

    set street(val){
        this.data = this.structure;
        this.data.street = val;
        this.pushData();
    }

    get street(){
        return this.data.street;
    }

    set build(val){
        this.data.build = val;
        this.pushData();
    }

    get build(){
        return this.data.build;
    }

    set block(val){
        this.data.block = val;
        this.pushData();
    }
    get block(){
        return this.data.block;
    }

    set flat(val){
        this.data.flat = val;
        this.pushData();
    }
    get flat(){
        return this.data.flat;
    }


    get ready(){
        return this.data.build != '';
    }

    get availablePaymentMethods()
    {
        if(this.zone == "A")
        {
            return [
                {value: '11',text: 'курьеру наличными'},
                {value: '13',text: 'онлайн'},
                {value: '12',text: 'курьеру картой'}
            ];
        }else
            return [
                {value: '13',text: 'онлайн'}
            ];
    }
}
