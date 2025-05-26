import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { COLORS, FONT, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { CircleAlert as AlertCircle, ChevronRight } from 'lucide-react-native';
import CategoryPicker from '@/components/CategoryPicker';

export default function StoreDetailsScreen() {
  const [storeName, setStoreName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [storeNameError, setStoreNameError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Handle store name change
  const handleStoreNameChange = (text: string) => {
    setStoreName(text);
    
    // Clear error when user types
    if (storeNameError) setStoreNameError('');
  };
  
  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    
    // Clear error when user selects
    if (categoryError) setCategoryError('');
  };
  
  // Handle continue button press
  const handleContinue = () => {
    // Validate store name
    if (!storeName.trim()) {
      setStoreNameError('Please enter your store name');
      return;
    }
    
    // Validate category
    if (!selectedCategory) {
      setCategoryError('Please select a category');
      return;
    }
    
    // Show loading state
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Navigate to dashboard
      router.replace('/(tabs)');
    }, 1500);
  };
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <Text style={styles.title}>Create your store</Text>
          <Text style={styles.subtitle}>
            Let's set up your digital store to showcase your products
          </Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Store name</Text>
            <TextInput
              style={[
                styles.input,
                storeNameError ? styles.inputError : null
              ]}
              placeholder="Enter your store name"
              placeholderTextColor={COLORS.textTertiary}
              value={storeName}
              onChangeText={handleStoreNameChange}
              maxLength={50}
              editable={!isLoading}
            />
            
            {storeNameError ? (
              <View style={styles.errorContainer}>
                <AlertCircle size={16} color={COLORS.error} />
                <Text style={styles.errorText}>{storeNameError}</Text>
              </View>
            ) : (
              <Text style={styles.characterCount}>
                {storeName.length}/50 characters
              </Text>
            )}
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Store category</Text>
            <Text style={styles.helperText}>
              Select the category that best describes your store
            </Text>
            
            <CategoryPicker
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategorySelect}
              disabled={isLoading}
            />
            
            {categoryError ? (
              <View style={styles.errorContainer}>
                <AlertCircle size={16} color={COLORS.error} />
                <Text style={styles.errorText}>{categoryError}</Text>
              </View>
            ) : null}
          </View>
          
          <TouchableOpacity
            style={[
              styles.continueButton,
              (!storeName || !selectedCategory || isLoading) ? styles.continueButtonDisabled : null
            ]}
            onPress={handleContinue}
            disabled={!storeName || !selectedCategory || isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <View style={styles.loadingIndicator} />
            ) : (
              <>
                <Text style={styles.continueButtonText}>Create Store</Text>
                <ChevronRight size={20} color={COLORS.background} />
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: SPACING.xxl,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxl * 1.5,
  },
  title: {
    fontFamily: FONT.bold,
    fontSize: FONT.size.xxl,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  subtitle: {
    fontFamily: FONT.regular,
    fontSize: FONT.size.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
    lineHeight: FONT.size.md * FONT.lineHeight.body,
  },
  formGroup: {
    marginBottom: SPACING.xl,
  },
  label: {
    fontFamily: FONT.medium,
    fontSize: FONT.size.md,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  helperText: {
    fontFamily: FONT.regular,
    fontSize: FONT.size.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  input: {
    height: 50,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    fontFamily: FONT.regular,
    fontSize: FONT.size.md,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xs,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  characterCount: {
    fontFamily: FONT.regular,
    fontSize: FONT.size.sm,
    color: COLORS.textSecondary,
    textAlign: 'right',
    marginTop: SPACING.xs,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  errorText: {
    fontFamily: FONT.regular,
    fontSize: FONT.size.sm,
    color: COLORS.error,
    marginLeft: SPACING.xs,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.round,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.xl,
    ...Platform.select({
      web: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      default: {
        elevation: 2,
      },
    }),
  },
  continueButtonDisabled: {
    backgroundColor: COLORS.primaryLight,
    ...Platform.select({
      web: {
        shadowOpacity: 0,
      },
      default: {
        elevation: 0,
      },
    }),
  },
  continueButtonText: {
    fontFamily: FONT.bold,
    fontSize: FONT.size.md,
    color: COLORS.background,
    marginRight: SPACING.sm,
  },
  loadingIndicator: {
    width: 20,
    height: 20,
    borderRadius: BORDER_RADIUS.round,
    borderWidth: 2,
    borderColor: COLORS.background,
    borderTopColor: 'transparent',
    animationKeyframes: 'spin',
    animationDuration: '1s',
    animationIterationCount: 'infinite',
    animationTimingFunction: 'linear',
  },
});