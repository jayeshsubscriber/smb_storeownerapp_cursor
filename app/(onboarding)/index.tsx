import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, useWindowDimensions, Animated } from 'react-native';
import { router } from 'expo-router';
import { COLORS, FONT, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { Store, ShoppingBag, Smartphone, TrendingUp } from 'lucide-react-native';
import { Platform } from 'react-native';

// Onboarding data
const onboardingData = [
  {
    id: '1',
    title: 'Create Your Digital Store',
    description: 'Build your store catalog in minutes with our easy-to-use tools',
    icon: Store,
  },
  {
    id: '2',
    title: 'Showcase Your Products',
    description: 'Add products with rich details, images, and categories',
    icon: ShoppingBag,
  },
  {
    id: '3',
    title: 'Share With Customers',
    description: 'Share your catalog via WhatsApp and other platforms',
    icon: Smartphone,
  },
  {
    id: '4',
    title: 'Grow Your Business',
    description: 'Increase sales with digital presence and easy ordering',
    icon: TrendingUp,
  },
];

export default function OnboardingScreen() {
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Handle skip button press
  const handleSkip = () => {
    router.replace('/(auth)');
  };

  // Handle next button press
  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      // Navigate to auth screen when we reach the end
      router.replace('/(auth)');
    }
  };

  // Render onboarding item
  const renderItem = ({ item }: { item: typeof onboardingData[0] }) => {
    const Icon = item.icon;
    
    return (
      <View style={[styles.slide, { width }]}>
        <View style={styles.iconContainer}>
          <Icon
            size={80}
            color={COLORS.primary}
            strokeWidth={1.5}
          />
        </View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    );
  };

  // Render pagination dots
  const Pagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {onboardingData.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 20, 8],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index.toString()}
              style={[
                styles.dot,
                { width: dotWidth, opacity },
                index === currentIndex && styles.dotActive,
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.skipButton}
        onPress={handleSkip}
        activeOpacity={0.7}
      >
        <Text style={styles.skipButtonText}>Skip</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / width
          );
          setCurrentIndex(index);
        }}
        keyExtractor={(item) => item.id}
        style={styles.flatList}
      />

      <Pagination />

      <TouchableOpacity
        style={styles.nextButton}
        onPress={handleNext}
        activeOpacity={0.8}
      >
        <Text style={styles.nextButtonText}>
          {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flatList: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  iconContainer: {
    width: 150,
    height: 150,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    ...Platform.select({
      web: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      default: {
        elevation: 8,
      },
    }),
  },
  title: {
    fontFamily: FONT.bold,
    fontSize: FONT.size.xxl,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.md,
    lineHeight: FONT.size.xxl * FONT.lineHeight.heading,
  },
  description: {
    fontFamily: FONT.regular,
    fontSize: FONT.size.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
    lineHeight: FONT.size.md * FONT.lineHeight.body,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  dot: {
    height: 8,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.primary,
    marginHorizontal: SPACING.xs,
  },
  dotActive: {
    backgroundColor: COLORS.primary,
  },
  skipButton: {
    position: 'absolute',
    top: SPACING.xxl,
    right: SPACING.xl,
    zIndex: 1,
  },
  skipButtonText: {
    fontFamily: FONT.medium,
    fontSize: FONT.size.md,
    color: COLORS.textSecondary,
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.round,
    marginBottom: SPACING.xxl,
    marginHorizontal: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      default: {
        elevation: 4,
      },
    }),
  },
  nextButtonText: {
    fontFamily: FONT.bold,
    fontSize: FONT.size.md,
    color: COLORS.background,
  },
});