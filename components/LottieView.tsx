import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { SvgXml } from 'react-native-svg';

// This is a placeholder component for Lottie animations
// On web, we'll show a static image since Lottie web requires additional setup
const LottieView = ({ 
  source, 
  autoPlay, 
  loop, 
  style
}: { 
  source: any, 
  autoPlay?: boolean, 
  loop?: boolean,
  style?: any 
}) => {
  // Simple placeholder SVG that represents a store logo
  const placeholderSvg = `
    <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="30" width="80" height="60" rx="5" fill="#7E57C2" />
      <rect x="20" y="10" width="60" height="30" rx="5" fill="#B39DDB" />
      <rect x="30" y="50" width="40" height="30" rx="3" fill="white" />
      <circle cx="50" cy="40" r="8" fill="#00BCD4" />
    </svg>
  `;

  return (
    <View style={[styles.container, style]}>
      <SvgXml xml={placeholderSvg} width="100%" height="100%" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default LottieView;