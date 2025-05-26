import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { COLORS, FONT, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { ArrowLeft, Check } from 'lucide-react-native';

// OTP input length
const OTP_LENGTH = 4;

export default function OTPVerificationScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(30);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  
  const inputRefs = useRef<Array<TextInput | null>>([]);
  
  // Timer countdown effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);
  
  // Handle OTP input change
  const handleOtpChange = (text: string, index: number) => {
    if (isLoading || isVerified) return;
    
    // Only allow numbers
    const formattedText = text.replace(/[^0-9]/g, '');
    
    // Update OTP array
    const newOtp = [...otp];
    newOtp[index] = formattedText;
    setOtp(newOtp);
    
    // Clear error when user types
    if (error) setError('');
    
    // Auto-focus next input if current input is filled
    if (formattedText && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    
    // Auto-verify if all inputs are filled
    if (index === OTP_LENGTH - 1 && formattedText) {
      const filledOtp = newOtp.slice(0, index).concat(formattedText);
      if (filledOtp.every(digit => digit !== '')) {
        verifyOtp(filledOtp.join(''));
      }
    }
  };
  
  // Handle OTP verification
  const verifyOtp = (otpCode: string) => {
    // Reset error
    setError('');
    
    // Validate OTP
    if (otpCode.length !== OTP_LENGTH) {
      setError('Please enter a valid OTP');
      return;
    }
    
    // Show loading state
    setIsLoading(true);
    
    // Simulate API call - for demo, we accept any 4-digit OTP
    setTimeout(() => {
      setIsLoading(false);
      setIsVerified(true);
      
      // Navigate to store setup after a short delay to show success state
      setTimeout(() => {
        router.replace('/(store-setup)');
      }, 1000);
    }, 1500);
  };
  
  // Handle resend OTP
  const handleResendOtp = () => {
    if (timeLeft > 0) return;
    
    // Reset OTP fields
    setOtp(['', '', '', '']);
    // Focus first input
    inputRefs.current[0]?.focus();
    // Reset timer
    setTimeLeft(30);
    // Clear error
    setError('');
  };
  
  // Format phone number for display
  const formatPhoneNumber = (number: string | undefined) => {
    if (!number) return '';
    return `+91 ${number}`;
  };
  
  // Format remaining time
  const formatTime = (seconds: number) => {
    return `${seconds}s`;
  };
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            disabled={isLoading || isVerified}
          >
            <ArrowLeft size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.content}>
          <Text style={styles.title}>Verify your number</Text>
          <Text style={styles.subtitle}>
            Enter the 4-digit code sent to{' '}
            <Text style={styles.phoneText}>{formatPhoneNumber(phone)}</Text>
          </Text>
          
          <View style={styles.otpContainer}>
            {Array(OTP_LENGTH).fill(0).map((_, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={[
                  styles.otpInput,
                  error ? styles.otpInputError : null,
                  otp[index] ? styles.otpInputFilled : null,
                  isVerified ? styles.otpInputVerified : null
                ]}
                keyboardType="number-pad"
                maxLength={1}
                value={otp[index]}
                onChangeText={(text) => handleOtpChange(text, index)}
                editable={!isLoading && !isVerified}
              />
            ))}
          </View>
          
          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}
          
          {isVerified ? (
            <View style={styles.successContainer}>
              <View style={styles.successIconContainer}>
                <Check size={24} color={COLORS.background} />
              </View>
              <Text style={styles.successText}>Verification successful</Text>
            </View>
          ) : isLoading ? (
            <View style={styles.loadingContainer}>
              <View style={styles.loadingIndicator} />
              <Text style={styles.loadingText}>Verifying...</Text>
            </View>
          ) : (
            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>
                Didn't receive code?{' '}
                {timeLeft > 0 ? (
                  <Text style={styles.timerText}>
                    Resend in {formatTime(timeLeft)}
                  </Text>
                ) : (
                  <TouchableOpacity
                    onPress={handleResendOtp}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.resendButtonText}>Resend OTP</Text>
                  </TouchableOpacity>
                )}
              </Text>
            </View>
          )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  backButton: {
    padding: SPACING.sm,
    marginRight: SPACING.md,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
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
  phoneText: {
    fontFamily: FONT.medium,
    color: COLORS.text,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  otpInput: {
    width: 65,
    height: 65,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    textAlign: 'center',
    fontSize: FONT.size.xl,
    fontFamily: FONT.bold,
    color: COLORS.text,
  },
  otpInputError: {
    borderColor: COLORS.error,
  },
  otpInputFilled: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight + '20', // 20% opacity
  },
  otpInputVerified: {
    borderColor: COLORS.success,
    backgroundColor: COLORS.successLight + '20', // 20% opacity
  },
  errorText: {
    fontFamily: FONT.regular,
    fontSize: FONT.size.sm,
    color: COLORS.error,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  resendText: {
    fontFamily: FONT.regular,
    fontSize: FONT.size.md,
    color: COLORS.textSecondary,
  },
  timerText: {
    fontFamily: FONT.medium,
    color: COLORS.textSecondary,
  },
  resendButtonText: {
    fontFamily: FONT.medium,
    color: COLORS.primary,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.lg,
  },
  loadingIndicator: {
    width: 20,
    height: 20,
    borderRadius: BORDER_RADIUS.round,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderTopColor: 'transparent',
    marginRight: SPACING.sm,
    animationKeyframes: 'spin',
    animationDuration: '1s',
    animationIterationCount: 'infinite',
    animationTimingFunction: 'linear',
  },
  loadingText: {
    fontFamily: FONT.medium,
    fontSize: FONT.size.md,
    color: COLORS.primary,
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.lg,
  },
  successIconContainer: {
    width: 28,
    height: 28,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  successText: {
    fontFamily: FONT.medium,
    fontSize: FONT.size.md,
    color: COLORS.success,
  },
});