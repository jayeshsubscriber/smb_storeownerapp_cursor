import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Image,
  Modal,
  ActionSheetIOS,
} from 'react-native';
import { router } from 'expo-router';
import { COLORS, FONT, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { Circle, User } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showImagePickerModal, setShowImagePickerModal] = useState(false);

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

  const handleSubmit = async (asDraft: boolean = false) => {
    if (isSubmitting) return;

    if (asDraft) {
      setIsDraft(true);
      router.back();
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      router.push({
        pathname: '/products/success',
        params: {
          name,
          sku,
          price: mrp,
          category
        }
      });
    } catch (error) {
      console.error('Error submitting product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImages([...images, result.assets[0].uri]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    } finally {
      setShowImagePickerModal(false);
    }
  };

  const takePhoto = async () => {
    try {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      
      if (cameraPermission.status !== 'granted') {
        alert('Sorry, we need camera permissions to make this work!');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImages([...images, result.assets[0].uri]);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
    } finally {
      setShowImagePickerModal(false);
    }
  };

  const handleImagePickerPress = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Choose from Library', 'Take Photo'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            pickImage();
          } else if (buttonIndex === 2) {
            takePhoto();
          }
        }
      );
    } else {
      setShowImagePickerModal(true);
    }
  };

  const renderError = (field: string) => {
    if (!errors[field]) return null;

    return (
      <View style={styles.errorContainer}>
        <Circle size={16} color={COLORS.error} />
        <Text style={styles.errorText}>{errors[field]}</Text>
      </View>
    );
  };

  const renderImagePickerModal = () => (
    <Modal
      visible={showImagePickerModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowImagePickerModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.modalOption}
            onPress={pickImage}
          >
            <User size={24} color={COLORS.text} />
            <Text style={styles.modalOptionText}>Choose from Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modalOption}
            onPress={takePhoto}
          >
            <User size={24} color={COLORS.text} />
            <Text style={styles.modalOptionText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modalOption, styles.cancelOption]}
            onPress={() => setShowImagePickerModal(false)}
          >
            <Text style={[styles.modalOptionText, styles.cancelText]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

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
              <Circle size={16} color={COLORS.error} />
            </TouchableOpacity>
          </View>
        ))}

        {images.length < 5 && (
          <TouchableOpacity
            style={styles.addImageButton}
            onPress={handleImagePickerPress}
          >
            <User size={24} color={COLORS.primary} />
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
          disabled={isSubmitting}
        >
          <Circle size={24} color={COLORS.text} />
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
              editable={!isSubmitting}
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
                  disabled={isSubmitting}
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
              editable={!isSubmitting}
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
              editable={!isSubmitting}
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
              editable={!isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
              editable={!isSubmitting}
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
          style={[
            styles.button, 
            styles.draftButton,
            isSubmitting && styles.buttonDisabled
          ]}
          onPress={() => handleSubmit(true)}
          disabled={isSubmitting}
        >
          <Text style={styles.draftButtonText}>Save as Draft</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button, 
            styles.submitButton,
            isSubmitting && styles.buttonDisabled
          ]}
          onPress={() => handleSubmit(false)}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <View style={styles.loadingIndicator} />
          ) : (
            <Text style={styles.submitButtonText}>Add Product</Text>
          )}
        </TouchableOpacity>
      </View>
      {renderImagePickerModal()}
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
  buttonDisabled: {
    opacity: 0.6,
    ...Platform.select({
      web: {
        shadowOpacity: 0,
      },
      default: {
        elevation: 0,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  modalOptionText: {
    fontFamily: FONT.medium,
    fontSize: FONT.size.md,
    color: COLORS.text,
    marginLeft: SPACING.md,
  },
  cancelOption: {
    justifyContent: 'center',
    borderBottomWidth: 0,
    marginTop: SPACING.sm,
  },
  cancelText: {
    color: COLORS.error,
    marginLeft: 0,
  },
});