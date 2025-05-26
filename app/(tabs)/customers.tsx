import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { COLORS, FONT, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { Search, Users } from 'lucide-react-native';

// Mock customer data
const mockCustomers = [
  {
    id: '1',
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    lastPurchase: '2024-02-15',
    totalAmount: 12500,
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
  },
  {
    id: '2',
    name: 'Priya Patel',
    phone: '+91 87654 32109',
    lastPurchase: '2024-02-10',
    totalAmount: 8750,
    image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
  },
  {
    id: '3',
    name: 'Amit Kumar',
    phone: '+91 76543 21098',
    lastPurchase: '2024-02-05',
    totalAmount: 15000,
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
  },
];

export default function CustomersScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [customers] = useState(mockCustomers);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery)
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatAmount = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  if (customers.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Customers</Text>
        </View>
        
        <View style={styles.emptyStateContainer}>
          <View style={styles.iconContainer}>
            <Users size={60} color={COLORS.primary} strokeWidth={1.5} />
          </View>
          <Text style={styles.emptyStateTitle}>No Customers Yet</Text>
          <Text style={styles.emptyStateDescription}>
            Start adding customers by creating a new transaction.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Customers</Text>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color={COLORS.textTertiary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or phone number"
          placeholderTextColor={COLORS.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView contentContainerStyle={styles.customerList}>
        {filteredCustomers.map((customer) => (
          <TouchableOpacity
            key={customer.id}
            style={styles.customerCard}
            activeOpacity={0.7}
          >
            <Image
              source={{ uri: customer.image }}
              style={styles.customerImage}
            />
            
            <View style={styles.customerInfo}>
              <View style={styles.customerHeader}>
                <Text style={styles.customerName}>{customer.name}</Text>
                <Text style={styles.customerPhone}>{customer.phone}</Text>
              </View>

              <View style={styles.customerStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Last Purchase</Text>
                  <Text style={styles.statValue}>
                    {formatDate(customer.lastPurchase)}
                  </Text>
                </View>

                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Total Spent</Text>
                  <Text style={[styles.statValue, styles.amountValue]}>
                    {formatAmount(customer.totalAmount)}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxl * 1.5,
    paddingBottom: SPACING.lg,
    backgroundColor: COLORS.background,
  },
  title: {
    fontFamily: FONT.bold,
    fontSize: FONT.size.xxl,
    color: COLORS.text,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  searchInput: {
    flex: 1,
    height: 44,
    marginLeft: SPACING.sm,
    fontFamily: FONT.regular,
    fontSize: FONT.size.md,
    color: COLORS.text,
  },
  customerList: {
    padding: SPACING.md,
  },
  customerCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  customerImage: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.borderLight,
  },
  customerInfo: {
    flex: 1,
    padding: SPACING.md,
  },
  customerHeader: {
    marginBottom: SPACING.sm,
  },
  customerName: {
    fontFamily: FONT.bold,
    fontSize: FONT.size.md,
    color: COLORS.text,
  },
  customerPhone: {
    fontFamily: FONT.regular,
    fontSize: FONT.size.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  customerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontFamily: FONT.regular,
    fontSize: FONT.size.xs,
    color: COLORS.textTertiary,
    marginBottom: 2,
  },
  statValue: {
    fontFamily: FONT.medium,
    fontSize: FONT.size.sm,
    color: COLORS.text,
  },
  amountValue: {
    color: COLORS.primary,
    fontFamily: FONT.bold,
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.primaryLight + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  emptyStateTitle: {
    fontFamily: FONT.bold,
    fontSize: FONT.size.xl,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  emptyStateDescription: {
    fontFamily: FONT.regular,
    fontSize: FONT.size.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: FONT.size.md * FONT.lineHeight.body,
  },
});