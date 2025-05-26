import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { COLORS, FONT, SPACING, BORDER_RADIUS } from '@/constants/theme';
import {
  Search,
  User,
  Phone,
  ChevronRight,
  X as Close,
  Calendar,
  Mail,
  MapPin,
  Tag,
} from 'lucide-react-native';

// Mock customer suggestions
const mockCustomers = [
  {
    id: '1',
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
  },
  {
    id: '2',
    name: 'Priya Patel',
    phone: '+91 87654 32109',
  },
];

// Mock product suggestions
const mockProducts = [
  {
    id: '1',
    name: 'Classic Wooden Building Blocks',
    price: 1299,
  },
  {
    id: '2',
    name: 'Educational Science Kit',
    price: 2499,
  },
];

// Customer labels
const CUSTOMER_LABELS = [
  { id: 'price_sensitive', label: 'Price Sensitive', color: '#FF6B6B' },
  { id: 'loyal', label: 'Loyal Customer', color: '#4ECDC4' },
  { id: 'new', label: 'New Customer', color: '#FFD166' },
  { id: 'vip', label: 'VIP', color: '#8338EC' },
];

export default function NewTransactionScreen() {
  // Customer Information State
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [showCustomerSuggestions, setShowCustomerSuggestions] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  
  // Customer Details Modal State
  const [birthdate, setBirthdate] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  
  // Product State
  const [products, setProducts] = useState<Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>>([]);
  const [productSearch, setProductSearch] = useState('');
  const [showProductSuggestions, setShowProductSuggestions] = useState(false);
  
  // Labels State
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  
  // Handle customer selection from suggestions
  const handleCustomerSelect = (customer: typeof mockCustomers[0]) => {
    setPhone(customer.phone);
    setName(customer.name);
    setShowCustomerSuggestions(false);
  };

  // Handle product selection
  const handleProductSelect = (product: typeof mockProducts[0]) => {
    setProducts([
      ...products,
      { ...product, quantity: 1 }
    ]);
    setProductSearch('');
    setShowProductSuggestions(false);
  };

  // Calculate total amount
  const calculateTotal = () => {
    return products.reduce((total, product) => {
      return total + (product.price * product.quantity);
    }, 0);
  };

  // Handle quantity change
  const handleQuantityChange = (id: string, quantity: number) => {
    setProducts(products.map(product =>
      product.id === id ? { ...product, quantity } : product
    ));
  };

  // Handle label toggle
  const handleLabelToggle = (labelId: string) => {
    setSelectedLabels(current =>
      current.includes(labelId)
        ? current.filter(id => id !== labelId)
        : [...current, labelId]
    );
  };

  // Format price
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>New Transaction</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Customer Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          
          <View style={styles.inputContainer}>
            <Phone size={20} color={COLORS.textTertiary} />
            <TextInput
              style={styles.input}
              placeholder="Mobile Number"
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                setShowCustomerSuggestions(text.length >= 3);
              }}
              keyboardType="phone-pad"
            />
          </View>

          {showCustomerSuggestions && (
            <View style={styles.suggestionsContainer}>
              {mockCustomers.map((customer) => (
                <TouchableOpacity
                  key={customer.id}
                  style={styles.suggestionItem}
                  onPress={() => handleCustomerSelect(customer)}
                >
                  <View>
                    <Text style={styles.suggestionName}>{customer.name}</Text>
                    <Text style={styles.suggestionPhone}>{customer.phone}</Text>
                  </View>
                  <ChevronRight size={20} color={COLORS.textTertiary} />
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.inputContainer}>
            <User size={20} color={COLORS.textTertiary} />
            <TextInput
              style={styles.input}
              placeholder="Customer Name"
              value={name}
              onChangeText={setName}
            />
          </View>

          <TouchableOpacity
            style={styles.moreDetailsButton}
            onPress={() => setShowCustomerModal(true)}
          >
            <Text style={styles.moreDetailsText}>
              Capture more details about your customer
            </Text>
            <ChevronRight size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Products Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Purchase Details</Text>

          <View style={styles.inputContainer}>
            <Search size={20} color={COLORS.textTertiary} />
            <TextInput
              style={styles.input}
              placeholder="Search Products"
              value={productSearch}
              onChangeText={(text) => {
                setProductSearch(text);
                setShowProductSuggestions(text.length >= 2);
              }}
            />
          </View>

          {showProductSuggestions && (
            <View style={styles.suggestionsContainer}>
              {mockProducts.map((product) => (
                <TouchableOpacity
                  key={product.id}
                  style={styles.suggestionItem}
                  onPress={() => handleProductSelect(product)}
                >
                  <Text style={styles.suggestionName}>{product.name}</Text>
                  <Text style={styles.suggestionPrice}>
                    {formatPrice(product.price)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {products.map((product) => (
            <View key={product.id} style={styles.productItem}>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productPrice}>
                  {formatPrice(product.price)}
                </Text>
              </View>

              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => handleQuantityChange(
                    product.id,
                    Math.max(0, product.quantity - 1)
                  )}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>

                <Text style={styles.quantityText}>{product.quantity}</Text>

                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => handleQuantityChange(
                    product.id,
                    product.quantity + 1
                  )}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {products.length > 0 && (
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalAmount}>
                {formatPrice(calculateTotal())}
              </Text>
            </View>
          )}
        </View>

        {/* Customer Labels Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Labels</Text>

          <View style={styles.labelsContainer}>
            {CUSTOMER_LABELS.map((label) => (
              <TouchableOpacity
                key={label.id}
                style={[
                  styles.labelPill,
                  selectedLabels.includes(label.id) && {
                    backgroundColor: `${label.color}20`,
                    borderColor: label.color,
                  }
                ]}
                onPress={() => handleLabelToggle(label.id)}
              >
                <Tag
                  size={16}
                  color={selectedLabels.includes(label.id) ? label.color : COLORS.textTertiary}
                />
                <Text
                  style={[
                    styles.labelText,
                    selectedLabels.includes(label.id) && {
                      color: label.color,
                      fontFamily: FONT.bold,
                    }
                  ]}
                >
                  {label.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Add Transaction Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            // Handle transaction submission
            router.back();
          }}
        >
          <Text style={styles.addButtonText}>Add Transaction</Text>
        </TouchableOpacity>
      </View>

      {/* Customer Details Modal */}
      <Modal
        visible={showCustomerModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Customer Details</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowCustomerModal(false)}
              >
                <Close size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.modalInputContainer}>
                <Calendar size={20} color={COLORS.textTertiary} />
                <TextInput
                  style={styles.modalInput}
                  placeholder="Child's Birthdate"
                  value={birthdate}
                  onChangeText={setBirthdate}
                />
              </View>

              <View style={styles.modalInputContainer}>
                <Mail size={20} color={COLORS.textTertiary} />
                <TextInput
                  style={styles.modalInput}
                  placeholder="Email Address"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.modalInputContainer}>
                <MapPin size={20} color={COLORS.textTertiary} />
                <TextInput
                  style={[styles.modalInput, styles.modalTextArea]}
                  placeholder="Physical Address"
                  value={address}
                  onChangeText={setAddress}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowCustomerModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={() => {
                  // Handle save
                  setShowCustomerModal(false);
                }}
              >
                <Text style={styles.saveButtonText}>Save Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  title: {
    fontFamily: FONT.bold,
    fontSize: FONT.size.xxl,
    color: COLORS.text,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: SPACING.xl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  sectionTitle: {
    fontFamily: FONT.bold,
    fontSize: FONT.size.lg,
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  input: {
    flex: 1,
    height: 48,
    marginLeft: SPACING.sm,
    fontFamily: FONT.regular,
    fontSize: FONT.size.md,
    color: COLORS.text,
  },
  suggestionsContainer: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...Platform.select({
      web: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      default: {
        elevation: 2,
      },
    }),
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  suggestionName: {
    fontFamily: FONT.medium,
    fontSize: FONT.size.md,
    color: COLORS.text,
  },
  suggestionPhone: {
    fontFamily: FONT.regular,
    fontSize: FONT.size.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  suggestionPrice: {
    fontFamily: FONT.bold,
    fontSize: FONT.size.md,
    color: COLORS.primary,
  },
  moreDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
  },
  moreDetailsText: {
    fontFamily: FONT.medium,
    fontSize: FONT.size.md,
    color: COLORS.primary,
    marginRight: SPACING.xs,
  },
  productItem: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  productInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  productName: {
    flex: 1,
    fontFamily: FONT.medium,
    fontSize: FONT.size.md,
    color: COLORS.text,
  },
  productPrice: {
    fontFamily: FONT.bold,
    fontSize: FONT.size.md,
    color: COLORS.primary,
    marginLeft: SPACING.md,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.primaryLight + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    fontFamily: FONT.bold,
    fontSize: FONT.size.lg,
    color: COLORS.primary,
  },
  quantityText: {
    fontFamily: FONT.bold,
    fontSize: FONT.size.md,
    color: COLORS.text,
    marginHorizontal: SPACING.md,
    minWidth: 24,
    textAlign: 'center',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.lg,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  totalLabel: {
    fontFamily: FONT.medium,
    fontSize: FONT.size.md,
    color: COLORS.text,
  },
  totalAmount: {
    fontFamily: FONT.bold,
    fontSize: FONT.size.xl,
    color: COLORS.primary,
  },
  labelsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -SPACING.xs,
  },
  labelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.round,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    margin: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  labelText: {
    fontFamily: FONT.medium,
    fontSize: FONT.size.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },
  footer: {
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    backgroundColor: COLORS.background,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.round,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
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
  addButtonText: {
    fontFamily: FONT.bold,
    fontSize: FONT.size.md,
    color: COLORS.background,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  modalTitle: {
    fontFamily: FONT.bold,
    fontSize: FONT.size.lg,
    color: COLORS.text,
  },
  closeButton: {
    padding: SPACING.sm,
  },
  modalBody: {
    padding: SPACING.lg,
  },
  modalInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  modalInput: {
    flex: 1,
    height: 48,
    marginLeft: SPACING.sm,
    fontFamily: FONT.regular,
    fontSize: FONT.size.md,
    color: COLORS.text,
  },
  modalTextArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: SPACING.md,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  modalButton: {
    flex: 1,
    height: 48,
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.backgroundSecondary,
    marginRight: SPACING.md,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  cancelButtonText: {
    fontFamily: FONT.bold,
    fontSize: FONT.size.md,
    color: COLORS.textSecondary,
  },
  saveButtonText: {
    fontFamily: FONT.bold,
    fontSize: FONT.size.md,
    color: COLORS.background,
  },
});