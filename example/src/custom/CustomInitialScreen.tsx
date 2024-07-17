import { useHost } from '@flipgive/react-native-rewards/hooks';
import { UIStateType } from '@flipgive/react-native-rewards/types';
import { useState, useRef } from 'react';
import {
  View,
  FlatList,
  Image,
  Dimensions,
  StyleSheet,
  type ListRenderItem,
  type ViewToken,
  Text,
  TouchableOpacity,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const imageWidth = screenWidth * 0.8;
const imageHeight = imageWidth * 0.75;

interface CarouselItem {
  id: string;
  url: string;
}

const DATA: CarouselItem[] = [
  {
    id: '1',
    url: `https://placehold.co/${Math.round(imageWidth)}x${Math.round(imageHeight)}/png`,
  },
  {
    id: '2',
    url: `https://placehold.co/${Math.round(imageWidth)}x${Math.round(imageHeight)}/png`,
  },
  {
    id: '3',
    url: `https://placehold.co/${Math.round(imageWidth)}x${Math.round(imageHeight)}/png`,
  },
  {
    id: '4',
    url: `https://placehold.co/${Math.round(imageWidth)}x${Math.round(imageHeight)}/png`,
  },
  {
    id: '5',
    url: `https://placehold.co/${Math.round(imageWidth)}x${Math.round(imageHeight)}/png`,
  },
];

export function CustomInitialScreen() {
  const { setUIState } = useHost();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<CarouselItem>>(null);

  const renderItem: ListRenderItem<CarouselItem> = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.url }} style={styles.image} />
    </View>
  );

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
      if (viewableItems.length > 0 && viewableItems?.[0]?.index !== null) {
        setActiveIndex(viewableItems?.[0]?.index || 0);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleButtonPress = (screen: UIStateType) => () => {
    setUIState(screen);
  };

  return (
    <View style={styles.container}>
      <Text>Custom initial screen</Text>
      <FlatList<CarouselItem>
        ref={flatListRef}
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToInterval={screenWidth}
        decelerationRate="fast"
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
      />
      <View style={styles.pagination}>
        {DATA.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === activeIndex ? styles.paginationDotActive : null,
            ]}
          />
        ))}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleButtonPress(UIStateType.ShowLoginForm)}
        >
          <Text style={styles.buttonText}>Go to signUp</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={handleButtonPress(UIStateType.ShowSignUpForm)}
        >
          <Text style={styles.buttonText}>Go to signIn</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: imageWidth,
    height: imageHeight,
    borderRadius: 10,
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 100,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#007AFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    position: 'absolute',
    bottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
