import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '@/constants/theme';

type ProgressBarProps = {
  step: number;
  totalSteps: number;
};

const ProgressBar = ({ step, totalSteps }: ProgressBarProps) => {
  // Calculate progress percentage
  const progressPercentage = (step / totalSteps) * 100;
  
  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <View 
          style={[
            styles.progress, 
            { width: `${progressPercentage}%` }
          ]} 
        />
      </View>
      
      <View style={styles.stepsContainer}>
        {Array.from({ length: totalSteps }).map((_, index) => {
          const isCompleted = index + 1 <= step;
          const isActive = index + 1 === step;
          
          return (
            <View 
              key={index} 
              style={[
                styles.step,
                isCompleted ? styles.stepCompleted : null,
                isActive ? styles.stepActive : null
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  track: {
    height: 4,
    backgroundColor: COLORS.borderLight,
    borderRadius: BORDER_RADIUS.round,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.round,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -8, // Negative margin to position dots on the track
    paddingHorizontal: 2, // To ensure dots are centered on the track ends
  },
  step: {
    width: 16,
    height: 16,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.borderLight,
  },
  stepCompleted: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  stepActive: {
    borderColor: COLORS.primary,
    borderWidth: 3,
  },
});

export default ProgressBar;