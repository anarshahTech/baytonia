import { Platform, StyleSheet } from "react-native";
import variable from '@theme/variables/material';

export default StyleSheet.create({
  container: {
    flex: 1
  },
  fullSpinnerContainer: {
    backgroundColor: 'white',
    flex: 1,
    marginTop: variable.platform === 'ios' ? 68 + (variable.isIphoneX ? 24: 0) : 56,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dialogSpinnerContainer: {
    backgroundColor: '#00000033',
    flex: 1,
    marginTop: variable.platform === 'ios' ? 68 + (variable.isIphoneX ? 24: 0) : 56,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
