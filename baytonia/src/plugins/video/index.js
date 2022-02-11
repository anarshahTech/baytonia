import React from 'react';
import { View, Card, H3 } from "native-base";
import Identify from '@helper/Identify';
import styles from './styles';
import { WebView } from 'react-native-webview';

class VideoNative extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    if (this.props.product && this.props.product.product_video && this.props.product.product_video.length > 0) {
      let listvideo = this.props.product.product_video
      let items = [];
      for (let i = 0; i < listvideo.length; i++) {
        let item = listvideo[i];
        items.push(
          <WebView
            style={{ alignSelf: 'stretch', height: 200, marginTop: 10 }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            source={{ uri: 'https://www.youtube.com/embed/' + item.video_key + '?rel=0' }}
          />
        )
      }
      return (
        <Card style={styles.card}>
          <View>
            <H3>{Identify.__('Video')}</H3>
            {items}
          </View>
        </Card>
      )
    }
    return null;
  }
}

export default VideoNative;
