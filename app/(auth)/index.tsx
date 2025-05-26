import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { COLORS, FONT, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { ChevronRight, CircleAlert as AlertCircle } from 'lucide-react-native';

export default function PhoneVerificationScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Validate Indian phone number (10 digits)
  const validatePhoneNumber = (number: string) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(number);
  };

  const handleContinue = () => {
    // Reset error
    setError('');
    
    // Validate phone number
    if (!phoneNumber) {
      setError('Please enter your phone number');
      return;
    }
    
    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    
    // Show loading state
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to OTP verification screen
      router.push({
        pathname: '/(auth)/otp',
        params: { phone: phoneNumber }
      });
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <Text style={styles.title}>Enter your mobile number</Text>
          <Text style={styles.subtitle}>
            We'll send you a verification code to confirm your identity
          </Text>
          
          <View style={styles.inputContainer}>
            <View style={styles.countryCodeContainer}>
              <Text style={styles.countryCode}>+91</Text>
            </View>
            
            <TextInput
              style={[
                styles.input,
                error ? styles.inputError : null
              ]}
              placeholder="Mobile Number"
              placeholderTextColor={COLORS.textTertiary}
              keyboardType="phone-pad"
              maxLength={10}
              value={phoneNumber}
              onChangeText={(text) => {
                // Only allow digits
                const formattedText = text.replace(/[^0-9]/g, '');
                setPhoneNumber(formattedText);
                
                // Clear error when user types
                if (error) setError('');
              }}
            />
          </View>
          
          {error ? (
            <View style={styles.errorContainer}>
              <AlertCircle size={16} color={COLORS.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
          
          <TouchableOpacity
            style={[
              styles.continueButton,
              (!phoneNumber || isLoading) ? styles.continueButtonDisabled : null
            ]}
            onPress={handleContinue}
            disabled={!phoneNumber || isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <View style={styles.loadingIndicator} />
            ) : (
              <>
                <Text style={styles.continueButtonText}>Continue</Text>
                <ChevronRight size={20} color={COLORS.background} />
              </>
            )}
          </TouchableOpacity>
          
          <Text style={styles.termsText}>
            By continuing, you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
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
  inputContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  countryCodeContainer: {
    backgroundColor: COLORS.backgroundSecondary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  countryCode: {
    fontFamily: FONT.medium,
    fontSize: FONT.size.md,
    color: COLORS.textSecondary,
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    fontFamily: FONT.regular,
    fontSize: FONT.size.md,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
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
    marginTop: SPACING.lg,
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
  termsText: {
    fontFamily: FONT.regular,
    fontSize: FONT.size.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.xl,
    lineHeight: FONT.size.sm * FONT.lineHeight.body,
  },
  termsLink: {
    fontFamily: FONT.medium,
    color: COLORS.primary,
  },
});