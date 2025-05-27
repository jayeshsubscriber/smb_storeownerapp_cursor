import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { COLORS, FONT, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { Circle, User } from 'lucide-react-native';

export default function ProductSuccessScreen() {
  const { name, sku, price, category } = useLocalSearchParams<{
    name: string;
    sku: string;
    price: string;
    category: string;
  }>();

  const handleAddAnother = () => {
    router.push('/products/new');
  };

  const handleViewProduct = () => {
    // Navigate to product details screen (to be implemented)
    router.back();
  };

  const handleGoHome = () => {
    router.replace('/(tabs)');
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Circle size={64} color={COLORS.success} strokeWidth={1.5} />
        </View>

        <Text style={styles.title}>Product Added Successfully!</Text>
        <Text style={styles.subtitle}>
          Your product has been added to your catalog
        </Text>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <User size={24} color={COLORS.primary} />
            <Text style={styles.cardTitle}>Product Details</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Name</Text>
            <Text style={styles.detailValue}>{name}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>SKU</Text>
            <Text style={styles.detailValue}>{sku}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Price</Text>
            <Text style={styles.detailValue}>₹{price}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Category</Text>
            <Text style={styles.detailValue}>{category}</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]} 
            onPress={handleAddAnother}
          >
            <User size={20} color={COLORS.primary} />
            <Text style={styles.secondaryButtonText}>Add Another Product</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.primaryButton]} 
            onPress={handleViewProduct}
          >
            <User size={20} color={COLORS.background} />
            <Text style={styles.primaryButtonText}>View Product</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.outlineButton]} 
            onPress={handleGoHome}
          >
            <User size={20} color={COLORS.textSecondary} />
            <Text style={styles.outlineButtonText}>Go to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: SPACING.xl,
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.successLight + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.xxl * 2,
    marginBottom: SPACING.xl,
  },
  title: {
    fontFamily: FONT.bold,
    fontSize: FONT.size.xxl,
    color: COLORS.success,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontFamily: FONT.regular,
    fontSize: FONT.size.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  card: {
    width: '100%',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  cardTitle: {
    fontFamily: FONT.bold,
    fontSize: FONT.size.lg,
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  detailLabel: {
    fontFamily: FONT.regular,
    fontSize: FONT.size.md,
    color: COLORS.textSecondary,
  },
  detailValue: {
    fontFamily: FONT.medium,
    fontSize: FONT.size.md,
    color: COLORS.text,
  },
  buttonContainer: {
    width: '100%',
    gap: SPACING.md,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.round,
    gap: SPACING.sm,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  primaryButtonText: {
    fontFamily: FONT.bold,
    fontSize: FONT.size.md,
    color: COLORS.background,
  },
  secondaryButton: {
    backgroundColor: COLORS.primaryLight + '20',
  },
  secondaryButtonText: {
    fontFamily: FONT.bold,
    fontSize: FONT.size.md,
    color: COLORS.primary,
  },
  outlineButton: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  outlineButtonText: {
    fontFamily: FONT.bold,
    fontSize: FONT.size.md,
    color: COLORS.textSecondary,
  },
});