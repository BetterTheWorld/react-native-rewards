import { useCallback, useRef } from 'react';
import { Animated, type GestureResponderEvent } from 'react-native';

const ANIMATION_DURATION = 400;
const HEADER_MAX_HEIGHT = 35;
const HEADER_MIN_HEIGHT = 0;

export function useWebViewAnimate({ fixedValue = 1 }) {
  const offset = useRef(new Animated.Value(0)).current;
  const touchableEndRef = useRef<boolean>(true);
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: offset } } }],
    {
      useNativeDriver: false,
    }
  );
  const scrollOffsetYRef = useRef<number>(0);
  const scrollDirectionRef = useRef<'up' | 'down'>('up');
  const animatedTranslateY = useRef(new Animated.Value(0)).current;
  const animatedOpacity = useRef(new Animated.Value(1)).current;
  const animatedHeight = useRef(new Animated.Value(HEADER_MAX_HEIGHT)).current;

  const onTouchEvent = useCallback(
    (type: 'end' | 'start') => (_: GestureResponderEvent) => {
      // small debounce to prevent scroll event to be triggered
      setTimeout(() => {
        touchableEndRef.current = type === 'end';
      }, 100);
    },
    []
  );

  const animateHeaderTransition = useCallback(
    (direction: 'up' | 'down') => {
      Animated.parallel([
        Animated.timing(animatedTranslateY, {
          toValue:
            direction === 'down' ? -HEADER_MAX_HEIGHT : HEADER_MIN_HEIGHT,
          duration: ANIMATION_DURATION,
          useNativeDriver: false,
        }),
        Animated.timing(animatedOpacity, {
          toValue: direction === 'down' ? 0 : 1,
          duration: ANIMATION_DURATION,
          useNativeDriver: false,
        }),
        Animated.timing(animatedHeight, {
          toValue: direction === 'down' ? HEADER_MIN_HEIGHT : HEADER_MAX_HEIGHT,
          duration: ANIMATION_DURATION,
          useNativeDriver: false,
        }),
      ]).start();
    },
    [animatedHeight, animatedOpacity, animatedTranslateY]
  );

  const onWebViewScroll = useCallback(
    (event: { nativeEvent: { contentOffset: { y: number } } }) => {
      const direction =
        scrollOffsetYRef.current < event.nativeEvent.contentOffset.y
          ? 'down'
          : 'up';

      if (direction !== scrollDirectionRef.current) {
        animateHeaderTransition(direction);
      }

      scrollDirectionRef.current = direction;
      // prevent animate scroll on modals, just scroll on list.
      if (touchableEndRef.current) {
        return;
      }

      if (event.nativeEvent.contentOffset.y <= 0) {
        return;
      }

      handleScroll({
        nativeEvent: {
          contentOffset: { y: event.nativeEvent.contentOffset.y * fixedValue },
        },
      });
      scrollOffsetYRef.current = event.nativeEvent.contentOffset.y;
    },
    [animateHeaderTransition, fixedValue, handleScroll]
  );

  return {
    onWebViewScroll,
    offset,
    onTouchEvent,
    animatedTranslateY,
    animatedOpacity,
    animatedHeight,
  };
}
