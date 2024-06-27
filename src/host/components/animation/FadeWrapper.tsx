import React, { useRef, useEffect } from 'react';
import { type ReactNode } from 'react';
import { Animated } from 'react-native';
import { type StyleProp, type ViewStyle } from 'react-native';

interface FadeWrapperProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const FadeWrapper: React.FC<FadeWrapperProps> = ({
  children,
  style,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    return () => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    };
  }, [fadeAnim]);

  return (
    <Animated.View style={[style, { opacity: fadeAnim }]}>
      {children}
    </Animated.View>
  );
};
