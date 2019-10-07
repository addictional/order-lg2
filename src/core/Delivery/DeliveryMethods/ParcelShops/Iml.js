import ParcelShop from './ParcelShop';

export default class IML extends ParcelShop{
    get date(){
        return this._rowData.DAYS_FORMAT;
    }

    get availablePaymentMethods(){
        let payments = [];
        if(this._rowData.PaymentCard == 1)
            payments.push({value: '12',text :"Картой в пукте выдачи"});
        if(this._rowData.ZONE != "A")
        {
            return [{value: '13',text :"Картой онлайн"}];
        }
        if(this._rowData.PaymentPossible == 1)
            payments.push({value:'11',text: 'наличными в пункте выдачи'})
        payments.push({value: '13',text :"Картой онлайн"});
        return payments;

    }

    get threshold(){
        let zone = this._rowData.ZONE;
        let result = 0;
        switch ( zone ){
            case 'A':
                result = 2500;
            case 'B':
                result = 5000;
                break;
            case 'C':
                result = 5000;
                break;
            case 'D':
                result = 5000;
                break;
            case 'E':
                result = 5000;
                break;
            case 'F':
                result = 5000;
                break;
            case 'G':
                result = 5000;
                break;
            case 'H':
                result = 7000;
                break;
            case 'V1':
                result = 10000;
                break;
            case 'V2':
                result = 10000;
                break;
            case 'V3':
                result = 25000;
                break;
        }
        return result;
    }

    fullAdressStr(){
        return this._rowData.FormCity+', '+this._rowData.Address;
    }

    checkDate() {
        if(typeof this._rowData.CALENDARWORKC_BLOCK == 'undefined')
            return this._rowData.DAYS_FORMAT;
        for (let i in this._rowData.CALENDARWORKC_BLOCK) {
            if(this._rowData.CALENDARWORKC_BLOCK[i] == this._rowData.DAYS_FORMAT){
                let parsDate = this._rowData.DAYS_FORMAT.split('.');
                this._rowData.DAYS_FORMAT = moment(parsDate[2]+'-'+parsDate[1]+'-'+parsDate[0]).add('days', 1).format('DD.MM.YYYY');
                this.checkDate(this._rowData.DAYS_FORMAT);
            }
        }
        return this._rowData.DAYS_FORMAT;
    }

    init(data,index){
        super.init(data,index);
        let result;
        let dateDelivery = this.checkDate();
        result = {
            latitude :data.Latitude,
            longitude: data.Longitude,
            parcelType: 'IML',
            schedule: data.WorkMode,
            address: this.fullAdressStr(),
            number: this.index,
            logo: '/local/templates/ladyandgentleman/img/IML_logo.svg',
            index: this.index,
            dateDelivery: dateDelivery,
            logoSize: [34, 22],
            color: '#FFB833',
            price: data.PRICE,
            imgPointer: '/local/templates/ladyandgentleman/img/IML_logo.svg',
            imgPointerOffset: [-17, 0],
            imgPointerSize: [34, 22],
            imgActivePointer: '/local/templates/ladyandgentleman/img/IML_logo.svg',
            imgActivePointerSize: [-17, 0],
            imgActivePointerOffset: [34, 22]
        };
        if(data.PaymentCard != 0)
        {
            if(data.PaymentCard > 0)
                result.cashlessPayment = true;
            result.cashOnDelivery = true;
        }
        if(data.FittingRoom > 0)
            result.fitting = true;
        this.data = result;
        return this;
    }

    get hasFitting() {
        return this.data.fitting;
    }

    get cashlessPayment() {
        return this.data.cashlessPayment;
    }
}