import React, { useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Platform
} from 'react-native';
import { COLORS, FONT, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { Check } from 'lucide-react-native';

// Store categories with icons and colors
const categories = [
  { id: 'fashion', name: 'Fashion & Clothing', color: '#FF6B6B' },
  { id: 'electronics', name: 'Electronics', color: '#4ECDC4' },
  { id: 'grocery', name: 'Grocery & Food', color: '#FFD166' },
  { id: 'beauty', name: 'Beauty & Personal Care', color: '#F72585' },
  { id: 'home', name: 'Home & Furniture', color: '#457B9D' },
  { id: 'books', name: 'Books & Stationery', color: '#8338EC' },
  { id: 'sports', name: 'Sports & Fitness', color: '#06D6A0' },
  { id: 'toys', name: 'Toys & Games', color: '#FB8500' },
  { id: 'jewelry', name: 'Jewelry & Accessories', color: '#9F86C0' },
  { id: 'handmade', name: 'Handmade & Crafts', color: '#E07A5F' },
  { id: 'other', name: 'Other', color: '#6C757D' },
];

type CategoryPickerProps = {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  disabled?: boolean;
};

const CategoryPicker = ({ 
  selectedCategory, 
  onSelectCategory,
  disabled = false
}: CategoryPickerProps) => {
  // Reference to the ScrollView to scroll to the selected category
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Animation value for scale effect
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  // Handle category selection
  const handleSelectCategory = (categoryId: string) => {
    if (disabled) return;
    
    // Trigger scale animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    onSelectCategory(categoryId);
  };
  
  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      style={styles.scrollView}
    >
      {categories.map((category) => {
        const isSelected = selectedCategory === category.id;
        
        return (
          <Animated.View 
            key={category.id}
            style={[
              isSelected && { transform: [{ scale: scaleAnim }] }
            ]}
          >
            <TouchableOpacity
              style={[
                styles.categoryPill,
                isSelected && styles.categoryPillSelected,
                { borderColor: category.color },
                isSelected && { backgroundColor: `${category.color}20` }, // 20% opacity
                disabled && styles.categoryPillDisabled
              ]}
              onPress={() => handleSelectCategory(category.id)}
              activeOpacity={0.7}
              disabled={disabled}
            >
              {isSelected && (
                <View style={[styles.checkIconContainer, { backgroundColor: category.color }]}>
                  <Check size={12} color={COLORS.background} strokeWidth={3} />
                </View>
              )}
              
              <Text 
                style={[
                  styles.categoryText,
                  isSelected && styles.categoryTextSelected,
                  disabled && styles.categoryTextDisabled
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 0,
    marginBottom: SPACING.md,
  },
  container: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xs,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    marginRight: SPACING.sm,
    borderRadius: BORDER_RADIUS.round,
    borderWidth: 1,
    backgroundColor: COLORS.backgroundSecondary,
    ...Platform.select({
      web: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      default: {
        elevation: 1,
      },
    }),
  },
  categoryPillSelected: {
    borderWidth: 1.5,
    ...Platform.select({
      web: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
      },
      default: {
        elevation: 2,
      },
    }),
  },
  categoryPillDisabled: {
    opacity: 0.6,
    ...Platform.select({
      web: {
        shadowOpacity: 0,
      },
      default: {
        elevation: 0,
      },
    }),
  },
  checkIconContainer: {
    width: 16,
    height: 16,
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.xs,
  },
  categoryText: {
    fontFamily: FONT.medium,
    fontSize: FONT.size.sm,
    color: COLORS.textSecondary,
  },
  categoryTextSelected: {
    fontFamily: FONT.bold,
    color: COLORS.text,
  },
  categoryTextDisabled: {
    color: COLORS.textTertiary,
  },
});

export default CategoryPicker;