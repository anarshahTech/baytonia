import React from "react";
import { Badge, Icon, Text, Thumbnail } from 'native-base';
import { Image, View, Dimensions, TouchableOpacity } from 'react-native';
import showStyle from './styles';
import Identify from '@helper/Identify';

class Label extends React.Component {
    render() {
        if (Identify.isPluginEnabled('magestore_productlabel_40') && this.props.product) {
            let product = this.props.product;
            if (product.product_label) {
                //show one
                return this.renderLayout(product.product_label);
            } else if (product.product_labels) {
                //show multi
                let labels = [];
                for (let i = 0; i < product.product_labels.length; i++) {
                    let label = product.product_labels[i];
                    labels.push(this.renderLayout(label));
                }
                return labels;
            }
        }
        return null;
    }

    renderLayout(label) {
        let image_url = label.image;
        if (image_url) {
            image_url = image_url.replace('https', 'http');
        }
        let position = label.position;
        let styles = showStyle.details;
        if (this.props.type == "1" || this.props.type == "3") {
            styles = showStyle.gridview;
        } else if (this.props.type == "2") {
            styles = showStyle.listview;
        }
        let style = styles.topLeft;
        switch (position) {
            case "1":
                style = styles.topLeft;
                if(this.props.hasSpecial){
                    if (this.props.type == "1" || this.props.type == "3") {
                        style.top = 35
                    }else {
                        style.left = 95
                    }
                }
                break;
            case "2":
                style = styles.topCenter;
                break;
            case "3":
                style = styles.topRight;
                break;
            case "4":
                style = styles.middleLeft;
                break;
            case "5":
                style = styles.middleCenter;
                break;
            case "6":
                style = styles.middleRight;
                break;
            case "7":
                style = styles.bottomLeft;
                break;
            case "8":
                style = styles.bottomCenter;
                break;
            case "9":
                style = styles.bottomRight;
                break;
            default:
                style = styles.topLeft;
                break;
        }
        return (
            <Image
                key={Identify.makeid()}
                source={{ uri: image_url }}
                resizeMode='contain'
                style={[{ width: 50, aspectRatio: 1, position: 'absolute' }, style]} />
        );
    }
}
export default Label;
