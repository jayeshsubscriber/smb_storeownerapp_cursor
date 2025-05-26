import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, Switch } from 'react-native';
import { router } from 'expo-router';
import { COLORS, FONT, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { Plus, Package } from 'lucide-react-native';

// Temporary mock data - replace with actual data store
const mockProducts = [
  {
    id: '1',
    name: 'Classic Wooden Building Blocks',
    image: 'https://images.pexels.com/photos/3933025/pexels-photo-3933025.jpeg',
    price: 1299,
    inStock: true,
    category: 'Toys',
  },
  {
    id: '2',
    name: 'Educational Science Kit',
    image: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg',
    price: 2499,
    inStock: true,
    category: 'Educational',
  },
  {
    id: '3',
    name: 'Art & Craft Supply Set',
    image: 'https://images.pexels.com/photos/159644/art-supplies-brushes-rulers-scissors-159644.jpeg',
    price: 999,
    inStock: false,
    category: 'Art Supplies',
  },
];

export default function ProductsScreen() {
  const [products, setProducts] = useState(mockProducts);

  const handleAddProduct = () => {
    router.push('/products/new');
  };

  const toggleProductStock = (productId: string) => {
    setProducts(currentProducts =>
      currentProducts.map(product =>
        product.id === productId
          ? { ...product, inStock: !product.inStock }
          : product
      )
    );
  };

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  if (products.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Products</Text>
          <TouchableOpacity style={styles.addButton} activeOpacity={0.8} onPress={handleAddProduct}>
            <Plus size={24} color={COLORS.background} />
          </TouchableOpacity>
        </View>
        
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.emptyStateContainer}>
            <View style={styles.iconContainer}>
              <Package size={60} color={COLORS.primary} strokeWidth={1.5} />
            </View>
            <Text style={styles.emptyStateTitle}>No Products Yet</Text>
            <Text style={styles.emptyStateDescription}>
              Add your first product to start building your digital catalog.
            </Text>
            
            <TouchableOpacity style={styles.addProductButton} activeOpacity={0.8} onPress={handleAddProduct}>
              <Plus size={20} color={COLORS.background} />
              <Text style={styles.addProductButtonText}>Add First Product</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Products</Text>
        <TouchableOpacity style={styles.addButton} activeOpacity={0.8} onPress={handleAddProduct}>
          <Plus size={24} color={COLORS.background} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.productList}>
        {products.map((product) => (
          <View key={product.id} style={styles.productCard}>
            <Image source={{ uri: product.image }} style={styles.productImage} />
            
            <View style={styles.productInfo}>
              <View style={styles.productHeader}>
                <Text style={styles.productName} numberOfLines={2}>
                  {product.name}
                </Text>
                <Text style={styles.productCategory}>{product.category}</Text>
              </View>

              <View style={styles.productFooter}>
                <Text style={styles.productPrice}>
                  {formatPrice(product.price)}
                </Text>
                
                <View style={styles.stockControl}>
                  <Text style={[
                    styles.stockLabel,
                    product.inStock ? styles.inStockLabel : styles.outOfStockLabel
                  ]}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </Text>
                  <Switch
                    value={product.inStock}
                    onValueChange={() => toggleProductStock(product.id)}
                    trackColor={{ false: COLORS.errorLight, true: COLORS.successLight }}
                    thumbColor={product.inStock ? COLORS.success : COLORS.error}
                  />
                </View>
              </View>
            </View>
          </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  addButton: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productList: {
    padding: SPACING.md,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  productImage: {
    width: 120,
    height: 120,
    backgroundColor: COLORS.borderLight,
  },
  productInfo: {
    flex: 1,
    padding: SPACING.md,
    justifyContent: 'space-between',
  },
  productHeader: {
    flex: 1,
  },
  productName: {
    fontFamily: FONT.bold,
    fontSize: FONT.size.md,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  productCategory: {
    fontFamily: FONT.regular,
    fontSize: FONT.size.sm,
    color: COLORS.textSecondary,
  },
  productFooter: {
    marginTop: SPACING.sm,
  },
  productPrice: {
    fontFamily: FONT.bold,
    fontSize: FONT.size.lg,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  stockControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stockLabel: {
    fontFamily: FONT.medium,
    fontSize: FONT.size.sm,
  },
  inStockLabel: {
    color: COLORS.success,
  },
  outOfStockLabel: {
    color: COLORS.error,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xxl,
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
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
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    lineHeight: FONT.size.md * FONT.lineHeight.body,
  },
  addProductButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.round,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addProductButtonText: {
    fontFamily: FONT.bold,
    fontSize: FONT.size.md,
    color: COLORS.background,
    marginLeft: SPACING.sm,
  },
});