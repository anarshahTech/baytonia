import Mixpanel  from 'react-native-mixpanel';
import Identify from '@helper/Identify';

const Action = (params, obj=null, key=null) => {
  //let Analytics = Firebase.analytics();
  let data =  {...params}
  let action = data['event'];
  delete data['event'];
  if(Identify.getMerchantConfig() && Identify.getMerchantConfig().storeview.mixpanel_config.token){
    if(Identify.getCustomerData()){
      data['customer_identity'] = Identify.getCustomerData().email;
    }else{
      data['customer_identity'] = Identify.getMerchantConfig() ? Identify.getMerchantConfig().storeview.base.customer_identity:'';
    }
    data['customer_ip'] =  Identify.getMerchantConfig() ? Identify.getMerchantConfig().storeview.base.customer_ip: '';
    try {
      Mixpanel.trackWithProperties(action, data);
    } catch (err) {
        console.log(`Error initiating Mixpanel:`, err);
    }
  }
}

export default Action;
