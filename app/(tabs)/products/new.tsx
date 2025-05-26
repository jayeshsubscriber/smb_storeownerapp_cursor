import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import {
  ArrowLeft,
  Plus,
  X as Close,
  CircleAlert as AlertCircle,
  Upload,
} from 'lucide-react-native';
import { COLORS, FONT, SPACING, BORDER_RADIUS } from '@/constants/theme';

// Predefined categories
const CATEGORIES = [
  'Toys',
  'Clothing',
  'Books',
  'School Supplies',
  'Electronics',
  'Sports Equipment',
  'Arts & Crafts',
  'Baby Care',
  'Accessories',
  'Other',
];

const AGE_GROUPS = [
  '0-1 years',
  '1-2 years',
  '2-4 years',
  '9-12 years',
  '12+ years',
];

const GENDERS = ['Male', 'Female', 'Unisex', 'All'];

type FormErrors = {
  [key: string]: string;
};

export default function NewProductScreen() {
  // Form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [sku, setSku] = useState('');
  const [mrp, setMrp] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [gender, setGender] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isDraft, setIsDraft] = useState(false);

  // Validation
  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!category) {
      newErrors.category = 'Please select a category';
    }

    if (!sku.trim()) {
      newErrors.sku = 'SKU ID is required';
    }

    if (!mrp.trim()) {
      newErrors.mrp = 'MRP is required';
    } else if (isNaN(Number(mrp)) || Number(mrp) <= 0) {
      newErrors.mrp = 'Please enter a valid price';
    }

    if (discountedPrice.trim() && (isNaN(Number(discountedPrice)) || Number(discountedPrice) <= 0)) {
      newErrors.discountedPrice = 'Please enter a valid discounted price';
    }

    if (!ageGroup) {
      newErrors.ageGroup = 'Please select an age group';
    }

    if (!gender) {
      newErrors.gender = 'Please select a gender';
    }

    if (!description.trim() || description.length < 100) {
      newErrors.description = 'Description must be at least 100 characters';
    }

    if (images.length === 0) {
      newErrors.images = 'At least one product image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (asDraft: boolean = false) => {
    if (asDraft) {
      setIsDraft(true);
      // Save as draft logic here
      router.back();
      return;
    }

    if (!validateForm()) {
      return;
    }

    // Submit form logic here
    router.back();
  };

  // Render error message
  const renderError = (field: string) => {
    if (!errors[field]) return null;

    return (
      <View style={styles.errorContainer}>
        <AlertCircle size={16} color={COLORS.error} />
        <Text style={styles.errorText}>{errors[field]}</Text>
      </View>
    );
  };

  // Render image picker
  const renderImagePicker = () => {
    return (
      <View style={styles.imagePickerContainer}>
        {images.map((image, index) => (
          <View key={index} style={styles.imagePreview}>
            <Image source={{ uri: image }} style={styles.previewImage} />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={() => {
                const newImages = [...images];
                newImages.splice(index, 1);
                setImages(newImages);
              }}
            >
              <Close size={16} color={COLORS.error} />
            </TouchableOpacity>
          </View>
        ))}

        {images.length < 5 && (
          <TouchableOpacity
            style={styles.addImageButton}
            onPress={() => {
              // Add image picker logic here
              setImages([...images, 'https://images.pexels.com/photos/4226269/pexels-photo-4226269.jpeg']);
            }}
          >
            <Upload size={24} color={COLORS.primary} />
            <Text style={styles.addImageText}>Add Image</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Product</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Product Name*</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={name}
              onChangeText={setName}
              placeholder="Enter product name"
              placeholderTextColor={COLORS.textTertiary}
            />
            {renderError('name')}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category*</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryContainer}
            >
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryPill,
                    category === cat && styles.categoryPillSelected,
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryPillText,
                      category === cat && styles.categoryPillTextSelected,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {renderError('category')}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>SKU ID*</Text>
            <TextInput
              style={[styles.input, errors.sku && styles.inputError]}
              value={sku}
              onChangeText={setSku}
              placeholder="Enter SKU ID"
              placeholderTextColor={COLORS.textTertiary}
            />
            {renderError('sku')}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Media Gallery</Text>
          {renderImagePicker()}
          {renderError('images')}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pricing Details</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>MRP (₹)*</Text>
            <TextInput
              style={[styles.input, errors.mrp && styles.inputError]}
              value={mrp}
              onChangeText={setMrp}
              placeholder="Enter MRP"
              keyboardType="numeric"
              placeholderTextColor={COLORS.textTertiary}
            />
            {renderError('mrp')}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Discounted Price (₹)</Text>
            <TextInput
              style={[styles.input, errors.discountedPrice && styles.inputError]}
              value={discountedPrice}
              onChangeText={setDiscountedPrice}
              placeholder="Enter discounted price (optional)"
              keyboardType="numeric"
              placeholderTextColor={COLORS.textTertiary}
            />
            {renderError('discountedPrice')}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Target Audience</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Age Group*</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryContainer}
            >
              {AGE_GROUPS.map((age) => (
                <TouchableOpacity
                  key={age}
                  style={[
                    styles.categoryPill,
                    ageGroup === age && styles.categoryPillSelected,
                  ]}
                  onPress={() => setAgeGroup(age)}
                >
                  <Text
                    style={[
                      styles.categoryPillText,
                      ageGroup === age && styles.categoryPillTextSelected,
                    ]}
                  >
                    {age}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {renderError('ageGroup')}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gender*</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryContainer}
            >
              {GENDERS.map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[
                    styles.categoryPill,
                    gender === g && styles.categoryPillSelected,
                  ]}
                  onPress={() => setGender(g)}
                >
                  <Text
                    style={[
                      styles.categoryPillText,
                      gender === g && styles.categoryPillTextSelected,
                    ]}
                  >
                    {g}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {renderError('gender')}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Product Description</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description*</Text>
            <TextInput
              style={[styles.textArea, errors.description && styles.inputError]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter detailed product description (minimum 100 characters)"
              placeholderTextColor={COLORS.textTertiary}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
            <Text style={styles.characterCount}>
              {description.length}/100 characters minimum
            </Text>
            {renderError('description')}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, styles.draftButton]}
          onPress={() => handleSubmit(true)}
        >
          <Text style={styles.draftButtonText}>Save as Draft</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.submitButton]}
          onPress={() => handleSubmit(false)}
        >
          <Text style={styles.submitButtonText}>Add Product</Text>
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxl * 1.5,
    paddingBottom: SPACING.lg,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  backButton: {
    marginRight: SPACING.md,
  },
  headerTitle: {
    fontFamily: FONT.bold,
    fontSize: FONT.size.xl,
    color: COLORS.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xxl,
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
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontFamily: FONT.medium,
    fontSize: FONT.size.md,
    color: COLORS.text,
    marginBottom: SPACING.sm,
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
  },
  inputError: {
    borderColor: COLORS.error,
  },
  textArea: {
    height: 120,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontFamily: FONT.regular,
    fontSize: FONT.size.md,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  characterCount: {
    fontFamily: FONT.regular,
    fontSize: FONT.size.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    textAlign: 'right',
  },
  categoryContainer: {
    flexGrow: 0,
    marginBottom: SPACING.sm,
  },
  categoryPill: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.backgroundSecondary,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryPillSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryPillText: {
    fontFamily: FONT.medium,
    fontSize: FONT.size.sm,
    color: COLORS.textSecondary,
  },
  categoryPillTextSelected: {
    color: COLORS.background,
  },
  imagePickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -SPACING.xs,
  },
  imagePreview: {
    width: '33.33%',
    aspectRatio: 1,
    padding: SPACING.xs,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: BORDER_RADIUS.md,
  },
  removeImageButton: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.round,
    padding: SPACING.xs,
  },
  addImageButton: {
    width: '33.33%',
    aspectRatio: 1,
    padding: SPACING.xs,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  addImageText: {
    fontFamily: FONT.medium,
    fontSize: FONT.size.sm,
    color: COLORS.primary,
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
  footer: {
    flexDirection: 'row',
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    backgroundColor: COLORS.background,
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: BORDER_RADIUS.round,
    justifyContent: 'center',
    alignItems: 'center',
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
  draftButton: {
    backgroundColor: COLORS.backgroundSecondary,
    marginRight: SPACING.md,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
  },
  draftButtonText: {
    fontFamily: FONT.bold,
    fontSize: FONT.size.md,
    color: COLORS.textSecondary,
  },
  submitButtonText: {
    fontFamily: FONT.bold,
    fontSize: FONT.size.md,
    color: COLORS.background,
  },
});