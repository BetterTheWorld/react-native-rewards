import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { hostColors } from '../../styles/colors';

const windowHeight = Dimensions.get('window').height;

interface BottomSheetProps {
  isVisible: boolean;
  setModalVisible: (isVisible: boolean) => void;
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isVisible,
  setModalVisible,
  children,
}) => {
  const [showModal, setShowModal] = useState(isVisible);
  const slideAnim = useRef(new Animated.Value(windowHeight)).current;

  useEffect(() => {
    if (isVisible) {
      setShowModal(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: windowHeight,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowModal(false);
      });
    }
  }, [isVisible, slideAnim]);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: windowHeight,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowModal(false);
      setModalVisible(false);
    });
  };

  return (
    <Modal visible={showModal} onRequestClose={handleClose} transparent>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={handleClose}
        />
        <Animated.View
          style={[
            styles.contentContainer,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  overlay: {
    flex: 1,
  },
  contentContainer: {
    backgroundColor: hostColors.white,
    paddingTop: 5,
    maxHeight: windowHeight * 0.75,
    minHeight: windowHeight * 0.25,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 50,
  },
});
