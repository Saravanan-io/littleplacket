import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Image,
  useWindowDimensions,
} from 'react-native';
import {
  Camera,
  UploadCloud,
  Trash2,
  Baby,
  Heart,
} from 'lucide-react';
import { api } from '../services/api';
import { Product, ScreenName } from '../types';
import { compressAndValidateImage } from '../utils/imageCompressor';
import { deleteFromFirebaseStorage } from '../services/firebaseService';

interface ProductEditScreenProps {
  productId?: string;
  onNavigate: (screen: ScreenName) => void;
}


const SLOT_CONFIG = [
  { title: 'Slot 1: Cover Photo', desc: 'Main card image in catalogue' },
  { title: 'Slot 2: Angle 2', desc: 'Carousel angle 2 on product page' },
  { title: 'Slot 3: Angle 3', desc: 'Carousel angle 3 on product page' },
  { title: 'Slot 4: Angle 4', desc: 'Carousel angle 4 on product page' },
];

export const STANDARD_AGES = [
  '2-3yr',
  '3-4yr',
  '4-5yr',
  '5-6yr',
  '6-7yr',
  '7-8yr',
  '8-9yr',
  '9-10yr',
  '10-11yr',
  '11-12yr',
];

export default function ProductEditScreen({
  productId,
  onNavigate,
}: ProductEditScreenProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const isEditing = Boolean(productId);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);
  const activeSlotRef = useRef<number>(0);

  // Core Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'boys' | 'girls'>('boys');
  const [price, setPrice] = useState<string>('749');
  const [whatsappNumber, setWhatsappNumber] = useState<string>('');
  const [selectedAges, setSelectedAges] = useState<string[]>([
    '2-3yr',
    '3-4yr',
    '4-5yr',
  ]);
  const [availability, setAvailability] = useState<'available' | 'out_of_stock'>('available');
  const [images, setImages] = useState<Array<{ url: string; publicId?: string; order: number }>>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const initData = async () => {
      if (!productId) return;
      try {
        setLoading(true);
        const prod = await api.getProductById(productId);
        setName(prod.name || '');
        setCategory(prod.category || 'boys');
        setPrice(String(prod.price || 749));
        setWhatsappNumber(prod.whatsappNumber || '');
        setAvailability(prod.availability === 'out_of_stock' ? 'out_of_stock' : 'available');
        setImages(prod.images || []);

        if (prod.availableAges && prod.availableAges.length > 0) {
          setSelectedAges(prod.availableAges);
        } else if (prod.ageGroup) {
          const matched = STANDARD_AGES.filter((a) => prod.ageGroup?.includes(a));
          setSelectedAges(matched.length > 0 ? matched : ['2-3yr', '3-4yr']);
        }
      } catch (err) {
        console.error('Failed to load product for editing:', err);
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [productId]);

  const triggerUploadForSlot = (slotIdx: number) => {
    activeSlotRef.current = slotIdx;
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleImageUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const targetSlot = activeSlotRef.current;
    try {
      setUploadingSlot(targetSlot);

      // 1. Validate Max File Size (10 MB) & Compress for storage optimization
      const compResult = await compressAndValidateImage(file, 10, 1200, 0.82);

      // 2. Upload compressed & optimized file
      const res = await api.uploadImage(compResult.file);
      const newImages = [...images];
      const newEntry = {
        url: res.url,
        publicId: res.publicId,
        order: targetSlot,
      };

      if (targetSlot < newImages.length) {
        newImages[targetSlot] = newEntry;
      } else {
        while (newImages.length < targetSlot) {
          newImages.push({ url: res.url, publicId: res.publicId, order: newImages.length });
        }
        newImages[targetSlot] = newEntry;
      }
      setImages(newImages.slice(0, 4));
    } catch (err: any) {
      alert(`Image upload error: ${err.message}`);
    } finally {
      setUploadingSlot(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = async (index: number) => {
    const targetImg = images[index];
    if (targetImg) {
      const pathOrUrl = (targetImg as any).storagePath || targetImg.url || targetImg.publicId;
      if (pathOrUrl) {
        try {
          await deleteFromFirebaseStorage(pathOrUrl);
        } catch (e) {
          console.warn('Firebase Storage image delete warning:', e);
        }
      }
    }
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };


  const toggleAge = (age: string) => {
    if (selectedAges.includes(age)) {
      if (selectedAges.length > 1) {
        setSelectedAges(selectedAges.filter((a) => a !== age));
      } else {
        alert('Please keep at least one available age.');
      }
    } else {
      setSelectedAges([...selectedAges, age]);
    }
  };

  const handleDelete = async () => {
    if (!productId) return;
    if (
      !window.confirm(
        `Are you sure you want to permanently delete "${name || 'this outfit'}" from the catalogue? This will immediately remove it from the user website.`
      )
    ) {
      return;
    }

    try {
      setSaving(true);
      await api.deleteProduct(productId);
      alert('✓ Outfit successfully deleted from catalogue!');
      onNavigate('products');
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      alert('Dress name is required');
      return;
    }

    const numPrice = Number(price) || 0;
    if (numPrice <= 0) {
      alert('Please enter a valid price in ₹');
      return;
    }

    if (images.length === 0 || !images[0]?.url) {
      alert('Please provide at least 1 image (Slot 1: Cover Photo) for the outfit.');
      return;
    }

    try {
      setSaving(true);
      const payload: Partial<Product> = {
        name: name.trim(),
        category,
        price: numPrice,
        startingPrice: `₹${numPrice}`,
        availableAges: selectedAges,
        ageGroup: selectedAges[0] || '2-3yr',
        whatsappNumber: whatsappNumber.trim() || undefined,
        availability,
        images,
        description: '',
        dressType: category === 'boys' ? 'Boys Outfit' : 'Girls Outfit',
        collection: category === 'boys' ? 'Boys Collection' : 'Girls Collection',
      };


      if (isEditing && productId) {
        await api.updateProduct(productId, payload);
      } else {
        await api.createProduct(payload);
      }

      alert(
        isEditing
          ? '✓ Outfit updated successfully! Changes are live on the user frontend.'
          : '✓ Outfit created successfully! Changes are live on the user frontend.'
      );
      onNavigate('products');
    } catch (err: any) {
      alert(`Save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2A2E39" />
        <Text style={styles.loadingText}>Loading outfit data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, isMobile && styles.contentMobile]}>
      {/* Hidden browser file input for direct upload */}
      {typeof document !== 'undefined' && (
        <input
          ref={fileInputRef as any}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleImageUpload}
        />
      )}

      {/* Top Header */}
      <View style={[styles.header, isMobile && styles.headerMobile]}>
        <View>
          <Text style={styles.title}>
            {isEditing ? `Edit Outfit: ${name}` : 'Add New Baby Outfit'}
          </Text>
          <Text style={styles.subtitle}>
            Add dress with 4 photos, dress name, available ages, price, and stock status.
          </Text>
        </View>
        <View style={styles.headerButtons}>
          {isEditing && (
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={handleDelete}
              disabled={saving}
            >
              <Trash2 size={14} color="#DC2626" strokeWidth={2} />
              <Text style={styles.deleteBtnText}>Delete Outfit</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => onNavigate('products')}
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.saveBtnText}>
                {isEditing ? 'Save Changes' : 'Publish Outfit'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* 1. 4 Images for one card */}
      <View style={styles.card}>
        <View style={styles.sectionHeaderRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>4 Photos for Outfit Card</Text>
            <Text style={styles.cardSubtitle}>
              Provide 4 photos for the card and product detail carousel (Max 10 MB per image).
            </Text>
          </View>
          <Text style={styles.imageCounter}>
            {images.filter((img) => img?.url).length} / 4 Photos Added
          </Text>
        </View>

        <View style={styles.slotsGrid}>
          {SLOT_CONFIG.map((slot, idx) => {
            const currentImg = images[idx];
            const hasImage = Boolean(currentImg?.url);
            const isSlotUploading = uploadingSlot === idx;

            return (
              <View
                key={slot.title}
                style={[styles.slotCard, idx === 0 && styles.slotCardPrimary]}
              >
                <View style={styles.slotHeader}>
                  <Text style={styles.slotTitle} numberOfLines={1}>{slot.title}</Text>
                  {idx === 0 && <Text style={styles.primaryBadge}>Main Cover</Text>}
                </View>
                <Text style={styles.slotDesc}>{slot.desc}</Text>

                {/* Slot Preview Box */}
                <View style={styles.slotPreviewBox}>
                  {isSlotUploading ? (
                    <View style={styles.uploadingBox}>
                      <ActivityIndicator size="small" color="#7C3AED" />
                      <Text style={styles.uploadingText}>Uploading...</Text>
                    </View>
                  ) : hasImage ? (
                    <View style={styles.previewImageContainer}>
                      <Image
                        source={{ uri: currentImg.url }}
                        style={styles.slotImage}
                        resizeMode="cover"
                      />
                      <TouchableOpacity
                        style={styles.removeImageBtn}
                        onPress={() => handleRemoveImage(idx)}
                      >
                        <Text style={styles.removeImageBtnText}>✕ Remove</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.emptySlotBox}>
                      <Camera size={26} color="#94A3B8" strokeWidth={1.5} />
                      <Text style={styles.emptySlotText}>No image selected</Text>
                    </View>
                  )}
                </View>

                {/* Slot Action Buttons */}
                <View style={styles.slotActions}>
                  <TouchableOpacity
                    style={styles.uploadBtn}
                    onPress={() => triggerUploadForSlot(idx)}
                  >
                    <UploadCloud size={14} color="#FFFFFF" strokeWidth={2} />
                    <Text style={styles.uploadBtnText}>
                      {hasImage ? 'Change Image' : 'Upload Image'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </View>



      {/* 2. Dress Name & Category */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Dress Name & Category</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Dress Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Royal Navy Velvet Tuxedo Romper"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.rowTwoAligned}>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Category *</Text>
            <View style={styles.pillSelectorRow}>
              <TouchableOpacity
                style={[
                  styles.pillOptionItem,
                  category === 'boys' && styles.pillBoysActive,
                ]}
                onPress={() => setCategory('boys')}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Baby
                    size={16}
                    color={category === 'boys' ? '#FFFFFF' : '#2563EB'}
                    strokeWidth={2.2}
                  />
                  <Text
                    style={[
                      styles.pillOptionText,
                      category === 'boys' && styles.pillOptionTextActive,
                    ]}
                  >
                    Boys Collection
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.pillOptionItem,
                  category === 'girls' && styles.pillGirlsActive,
                ]}
                onPress={() => setCategory('girls')}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Heart
                    size={16}
                    color={category === 'girls' ? '#FFFFFF' : '#EC4899'}
                    strokeWidth={2.2}
                  />
                  <Text
                    style={[
                      styles.pillOptionText,
                      category === 'girls' && styles.pillOptionTextActive,
                    ]}
                  >
                    Girls Collection
                  </Text>
                </View>
              </TouchableOpacity>

            </View>
          </View>

          <View style={[styles.inputGroup, { flex: 0.8 }]}>
            <Text style={styles.label}>Catalogue Price (₹) *</Text>
            <TextInput
              style={[styles.input, { height: 44 }]}
              placeholder="e.g. 749"
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
            />
          </View>
        </View>
      </View>


      {/* 3. Available Ages (2-3yr, 3-4yr, 4-5yr ... 10-12yr) */}
      <View style={styles.card}>
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={styles.cardTitle}>Available Ages</Text>
            <Text style={styles.cardSubtitle}>
              Select which age brackets this dress is available for (2-3yr to 10-12yr).
            </Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity
              style={styles.miniBtn}
              onPress={() => setSelectedAges([...STANDARD_AGES])}
            >
              <Text style={styles.miniBtnText}>Select All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.miniBtn}
              onPress={() => setSelectedAges(['2-3yr'])}
            >
              <Text style={styles.miniBtnText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.chipsContainer}>
          {STANDARD_AGES.map((age) => {
            const isSelected = selectedAges.includes(age);
            return (
              <TouchableOpacity
                key={age}
                style={[
                  styles.chip,
                  isSelected && styles.chipActive,
                ]}
                onPress={() => toggleAge(age)}
              >
                <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                  {isSelected ? `✓ ${age}` : age}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>


      {/* Bottom Action Buttons */}
      <View style={styles.bottomBar}>
        {isEditing && (
          <TouchableOpacity
            style={styles.deleteBottomBtn}
            onPress={handleDelete}
            disabled={saving}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Trash2 size={14} color="#DC2626" strokeWidth={2} />
              <Text style={styles.deleteBtnText}>Delete Outfit from Catalogue</Text>
            </View>

          </TouchableOpacity>
        )}

        <View style={{ flexDirection: 'row', gap: 12, marginLeft: 'auto' }}>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => onNavigate('products')}
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.saveBtnText}>
                {isEditing ? 'Save Changes' : 'Publish Outfit'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 24,
    maxWidth: 1040,
    width: '100%',
    marginHorizontal: 'auto',
    gap: 20,
    paddingBottom: 60,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    maxWidth: 600,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  saveBtn: {
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 12,
    backgroundColor: '#7C3AED',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  deleteBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  deleteBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#DC2626',
  },
  deleteBottomBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    gap: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  imageCounter: {
    fontSize: 12,
    fontWeight: '800',
    color: '#7C3AED',
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginTop: 4,
  },
  slotCard: {
    flex: 1,
    minWidth: 210,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  slotCardPrimary: {
    borderColor: '#C4B5FD',
    backgroundColor: '#FAF5FF',
  },
  slotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  slotTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
  },
  primaryBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#7C3AED',
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  slotDesc: {
    fontSize: 11,
    color: '#64748B',
  },
  slotPreviewBox: {
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptySlotBox: {
    alignItems: 'center',
    gap: 6,
  },
  cameraIcon: {
    fontSize: 28,
  },
  emptySlotText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  previewImageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  slotImage: {
    width: '100%',
    height: '100%',
  },
  removeImageBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  removeImageBtnText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  uploadingBox: {
    alignItems: 'center',
    gap: 6,
  },
  uploadingText: {
    fontSize: 12,
    color: '#7C3AED',
    fontWeight: '600',
  },
  slotActions: {
    width: '100%',
  },
  uploadBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#7C3AED',
    paddingVertical: 10,
    borderRadius: 12,
  },
  uploadBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  inputGroup: {

    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
  },
  hintText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  rowTwoAligned: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    flexWrap: 'wrap',
  },
  pillSelectorRow: {
    flexDirection: 'row',
    gap: 10,
    height: 44,
  },
  pillOptionItem: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  pillBoysActive: {
    backgroundColor: '#2563EB',
    borderColor: '#1D4ED8',
  },
  pillGirlsActive: {
    backgroundColor: '#EC4899',
    borderColor: '#DB2777',
  },
  pillOptionText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
  },
  pillOptionTextActive: {
    color: '#FFFFFF',
  },
  pillStockInActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  pillStockInTextActive: {
    color: '#047857',
    fontWeight: '800',
  },
  pillStockOutActive: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  pillStockOutTextActive: {
    color: '#B91C1C',
    fontWeight: '800',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  miniBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  miniBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  addSizeBtn: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addSizeBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 14,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  contentMobile: {
    padding: 14,
    gap: 16,
  },
  headerMobile: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 12,
  },
});

