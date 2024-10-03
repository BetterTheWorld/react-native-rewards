import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet } from 'react-native';

interface OptionsModalProps {
  isVisible: boolean;
  onClose: () => void;
  onDeeplinkSubmit: (deeplink: string) => void;
}

export const OptionsModal: React.FC<OptionsModalProps> = ({
  isVisible,
  onClose,
  onDeeplinkSubmit,
}) => {
  const [deeplink, setDeeplink] = useState('');

  const handleSubmit = () => {
    onDeeplinkSubmit(deeplink);
    setDeeplink('');
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Options</Text>
          <TextInput
            style={styles.input}
            onChangeText={setDeeplink}
            value={deeplink}
            placeholder="Enter deeplink URL"
          />
          <View style={styles.buttonContainer}>
            <Button title="Submit Deeplink" onPress={handleSubmit} />
            <Button title="Close" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});
