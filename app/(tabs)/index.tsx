import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { COLORS, FONT, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { ShoppingBag, BarChart2, Tag, Share2, Plus } from 'lucide-react-native';

export default function DashboardScreen() {
  const [isNavigating, setIsNavigating] = useState(false);

  const handleAddProduct = async () => {
    if (isNavigating) return; // Prevent multiple clicks

    try {
      setIsNavigating(true);
      await router.push('/products/new');
    } catch (error) {
      console.error('Navigation failed:', error);
      // You could show an error message to the user here
    } finally {
      setIsNavigating(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.storeName}>Your Digital Store</Text>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: `${COLORS.primary}20` }]}>
              <ShoppingBag size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Products</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: `${COLORS.accent}20` }]}>
              <BarChart2 size={20} color={COLORS.accent} />
            </View>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: `${COLORS.success}20` }]}>
              <Tag size={20} color={COLORS.success} />
            </View>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Categories</Text>
          </View>
        </View>
        
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity 
            style={[styles.actionButton, isNavigating && styles.actionButtonDisabled]} 
            activeOpacity={0.7}
            onPress={handleAddProduct}
            disabled={isNavigating}
          >
            <View style={[styles.actionIconContainer, { backgroundColor: COLORS.primary }]}>
              <Plus size={20} color={COLORS.background} />
            </View>
            <Text style={styles.actionText}>Add New Product</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <View style={[styles.actionIconContainer, { backgroundColor: COLORS.accent }]}>
              <Share2 size={20} color={COLORS.background} />
            </View>
            <Text style={styles.actionText}>Share Your Store</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateTitle}>Start Building Your Catalog</Text>
          <Text style={styles.emptyStateDescription}>
            Add products to your store to start showcasing and selling to your customers.
          </Text>
          
          <TouchableOpacity 
            style={[styles.primaryButton, isNavigating && styles.primaryButtonDisabled]} 
            activeOpacity={0.8}
            onPress={handleAddProduct}
            disabled={isNavigating}
          >
            <Text style={styles.primaryButtonText}>Add First Product</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    paddingTop: SPACING.xxl * 1.5,
    paddingBottom: SPACING.xxl,
  },
  header: {
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  welcomeText: {
    fontFamily: FONT.regular,
    fontSize: FONT.size.md,
    color: COLORS.textSecondary,
  },
  storeName: {
    fontFamily: FONT.bold,
    fontSize: FONT.size.xxxl,
    color: COLORS.text,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginHorizontal: SPACING.xs,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  statValue: {
    fontFamily: FONT.bold,
    fontSize: FONT.size.xl,
    color: COLORS.text,
  },
  statLabel: {
    fontFamily: FONT.regular,
    fontSize: FONT.size.sm,
    color: COLORS.textSecondary,
  },
  actionsSection: {
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontFamily: FONT.bold,
    fontSize: FONT.size.lg,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  actionButtonDisabled: {
    opacity: 0.6,
  },
  actionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  actionText: {
    fontFamily: FONT.medium,
    fontSize: FONT.size.md,
    color: COLORS.text,
  },
  emptyStateContainer: {
    marginTop: SPACING.xl,
    marginHorizontal: SPACING.xl,
    padding: SPACING.xl,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  emptyStateTitle: {
    fontFamily: FONT.bold,
    fontSize: FONT.size.lg,
    color: COLORS.text,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  emptyStateDescription: {
    fontFamily: FONT.regular,
    fontSize: FONT.size.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: FONT.size.md * FONT.lineHeight.body,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.round,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    fontFamily: FONT.bold,
    fontSize: FONT.size.md,
    color: COLORS.background,
  },
});