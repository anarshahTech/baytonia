import React from "react";
import Mixpanel  from 'react-native-mixpanel';
import Identify from '@helper/Identify';
import Action from './action';

export default class MixpanelAnalytics extends React.Component {
  constructor(props){
    super(props);
    this.key = null;
  }
  async initiateMixpanel(){
    if(Identify.getMerchantConfig() && Identify.getMerchantConfig().storeview.mixpanel_config.token){
      try {
        await Mixpanel.sharedInstanceWithToken(Identify.getMerchantConfig().storeview.mixpanel_config.token);
        this.pushData(0);
      }catch(err){
        console.log(`Error initiating Mixpanel:`, err);
      }
    }
  }
  componentWillMount(){
    //customer are viewing page.
    this.initiateMixpanel();
  }
  componentDidMount() {
    // Typical usage (don't forget to compare props):
  }
  componentDidUpdate(){
    //page is loaded
    if(!Identify.isEmpty(this.props.parent.dataTracking)){
        this.pushData(1);
    }
  }
  getKeyFromProps(props){
    let router = this.props.navigation.state;
    if(this.props.parent.parent === undefined){
      return [router.key, router.routeName, router.params];
    }
    return null;
  }
  pushData(status=0){
    if(Identify.getMerchantConfig() && Identify.getMerchantConfig().storeview.mixpanel_config.token){
      let currentProps = this.getKeyFromProps(this.props);
      if(currentProps){
        let data = {};
        data['event'] = "page_view_action";
        if(status == 0){
          data['action'] = "view_"+currentProps[1].toLowerCase()+"_screen";
        }else if (status == 1) {
          data['action'] = "viewed_"+currentProps[1].toLowerCase()+"_screen";
        }else{
          data['action'] = "viewed_"+currentProps[1].toLowerCase()+"_screen";
        }
        if(!Identify.isEmpty(this.props.parent.dataTracking)){
          for(let i in this.props.parent.dataTracking){
              data[i]= this.props.parent.dataTracking[i];
          }
        }else{
          let params = currentProps[2];
          if(params){
            for(let i in params){
              data[i]= params[i];
            }
          }
        }
        Action(data);
      }
    }
  }
  render(){
      return null;
  }
}
