import { type ColorValue } from 'react-native';
import { type WebViewProps } from 'react-native-webview';

export interface WebViewComponent extends WebViewProps {
  baseURL: string;
  loaderColor?: ColorValue;
}
