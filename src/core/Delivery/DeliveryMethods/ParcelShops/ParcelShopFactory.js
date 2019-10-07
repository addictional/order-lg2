import IML from './Iml';
import Boxberry from './Boxberry';
import Default from './ParcelShop'

export default class ParcelShopFactory {
    create(type = null){
        if(type === 'iml')
            return new IML();
        if(type === 'boxberry')
            return new Boxberry();
        else
            return new Default();
    }
}