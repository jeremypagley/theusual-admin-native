import { DeviceEventEmitter } from 'react-native';
const ActiveOrder = 'ActiveOrder';

const activeOrderEventListen = (handler) => {
  return DeviceEventEmitter.addListener(ActiveOrder, (activeOrder) => handler(activeOrder));
}

const activeOrderEventEmit = (activeOrder = false) => {
  return DeviceEventEmitter.emit(ActiveOrder, activeOrder);
}

export default {
  activeOrderEventListen,
  activeOrderEventEmit
}