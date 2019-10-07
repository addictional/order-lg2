import ParcelShop from './ParcelShop';

export default class Boxberry extends ParcelShop{
    get availablePaymentMethods(){
        let paymentMethods = [{value: 'cash',text:'Наличными'},]
        let data = this._rowData;
        if(data.only_prepaid_orders == 1)
            return [{value: '13',text:'Онлайн'}];
        if(data.acquiring == 1)
            paymentMethods.push({value: '13',text:'онлайн'});
        return paymentMethods;
    }

    get estimatedDeliveryDate() {
        let date = new Date(this._rowData.estimatedDelivery);
        return date.toISOString()
    }

    get date(){
        let date = new Date(this._rowData.estimatedDelivery);
        let format = (num)=>{
            if(num<=9)
                return `0${num}`;
            else
                return num;
        };
        return `${format(date.getDate())}.${format(date.getMonth()+1)}.${date.getFullYear()}`;
    }

    init(data,index) {
        super.init(data,index);
        let result = {
            latitude :data.latitude,
            longitude: data.longitude,
            parcelType: 'boxberry',
            schedule: data.work_shedule,
            address: data.address_abbr,
            number: data.code,
            logo: '/local/templates/ladyandgentleman/img/boxberry_logo.png',
            index: this.index,
            color: '#FF339F',
            cashlessPayment: data.acquiring == 1,
            cashOnDelivery: data.only_prepaid_orders == 0,
            fitting: data.fitting,
            shippingDate: data.shippingDate,
            estimatedDeliveryDate: data.estimatedDelivery,
            price : data.price,
            threshold: data.threshold,
            paymentMethods: [
                {value: 'online',text:'онлайн'},
                {value: 'cash',text:'кэш'}
            ],
            dateDelivery: this.date,
            parcelShopCode: data.code,
            howToGet: data.how_to_get_to,
            addressAbbr: data.address_abbr,
            zone: data.tariff_zone,
            imgPointer: "/local/templates/ladyandgentleman/img/boxberry_placemark.png",
            imgPointerOffset: [0, 0],
            imgPointerSize: [25, 33],
            imgActivePointer: '/local/templates/ladyandgentleman/img/boxberry_placemark_opened.png',
            imgActivePointerSize: [42, 56],
            imgActivePointerOffset: [-9, -25]
        };
        this.data =  result;
        return this;
    }
}