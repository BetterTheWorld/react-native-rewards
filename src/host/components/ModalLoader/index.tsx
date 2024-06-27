import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Modal } from 'react-native';
import { hostColors } from '../../styles/colors';

interface ModalLoaderProps {
  visible: boolean;
  text?: string;
}

export function ModalLoader({ visible, text }: ModalLoaderProps) {
  const rotation = useRef(new Animated.Value(0)).current;
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const rotate = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    const animateDots = (dot: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(dot, {
            toValue: -10,
            duration: 300,
            delay,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 300,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ])
      );
    };

    let animationDot1 = animateDots(dot1, 0);
    let animationDot2 = animateDots(dot2, 150);
    let animationDot3 = animateDots(dot3, 300);

    if (visible) {
      rotate.start();
      animationDot1.start();
      animationDot2.start();
      animationDot3.start();
    } else {
      rotation.setValue(0);
      dot1.setValue(0);
      dot2.setValue(0);
      dot3.setValue(0);
      rotate.stop();
      animationDot1.stop();
      animationDot2.stop();
      animationDot3.stop();
    }

    // Cleanup function to stop animations
    return () => {
      rotate.stop();
      animationDot1.stop();
      animationDot2.stop();
      animationDot3.stop();
    };
  }, [visible, rotation, dot1, dot2, dot3]);

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const animatedStyle = {
    transform: [{ rotate: rotateInterpolate }],
  };

  const dotStyle = (dot: Animated.Value) => ({
    transform: [{ translateY: dot }],
  });

  return (
    <Modal visible={visible} transparent={false} style={styles.container}>
      <View style={styles.container}>
        <Animated.View style={[styles.loader, animatedStyle]}>
          <View style={styles.circle} />
        </Animated.View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{text || 'Loading '}</Text>
          <Animated.Text style={[styles.dot, dotStyle(dot1)]}>.</Animated.Text>
          <Animated.Text style={[styles.dot, dotStyle(dot2)]}>.</Animated.Text>
          <Animated.Text style={[styles.dot, dotStyle(dot3)]}>.</Animated.Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: hostColors.backgroundColor,
  },
  loader: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 100,
    height: 100,
    borderWidth: 10,
    borderColor: hostColors.primaryColor,
    borderRadius: 50,
    borderTopColor: 'transparent',
  },
  loadingContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  loadingText: {
    fontSize: 24,
    color: hostColors.primaryColor,
  },
  dot: {
    fontSize: 24,
    color: hostColors.primaryColor,
  },
});
