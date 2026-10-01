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
} from 'react-native';
import { api } from '../services/api';
import { AgeOption, Collection, Product, ScreenName, AgePriceEntry } from '../types';

interface ProductEditScreenProps {
  productId?: string;
  onNavigate: (screen: ScreenName) => void;
}

const SLOT_CONFIG = [
  { title: 'Slot 1: Cover Photo', desc: 'Main catalogue thumbnail' },
  { title: 'Slot 2: Angle 2', desc: 'Front or side view' },
  { title: 'Slot 3: Angle 3', desc: 'Back or fabric close-up' },
  { title: 'Slot 4: Angle 4', desc: 'Model or styled look' },
];

export default function ProductEditScreen({
  productId,
  onNavigate,
}: ProductEditScreenProps) {
  const isEditing = Boolean(productId);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);
  const activeSlotRef = useRef<number>(0);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'boys' | 'girls'>('boys');
  const [dressType, setDressType] = useState('Romper');
  const [collection, setCollection] = useState('');
  const [description, setDescription] = useState('');
  const [availability, setAvailability] = useState<'available' | 'limited' | 'out_of_stock' | 'coming_soon'>('available');
  const [featured, setFeatured] = useState(false);
  const [uniformPrice, setUniformPrice] = useState<string>('999');
  const [images, setImages] = useState<Array<{ url: string; publicId?: string; order: number }>>([]);
  const [agePrices, setAgePrices] = useState<AgePriceEntry[]>([]);

  // Metadata dropdowns
  const [availableAges, setAvailableAges] = useState<AgeOption[]>([]);
  const [availableCollections, setAvailableCollections] = useState<Collection[]>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);
        const [ages, cols] = await Promise.all([
          api.getAges(),
          api.getCollections(),
        ]);
        setAvailableAges(ages);
        setAvailableCollections(cols);
        if (cols.length > 0 && !collection) {
          setCollection(cols[0].name);
        }

        if (productId) {
          const prod = await api.getProductById(productId);
          setName(prod.name);
          setCategory(prod.category);
          setDressType(prod.dressType || '');
          setCollection(prod.collection || '');
          setDescription(prod.description || '');
          setAvailability(prod.availability || 'available');
          setFeatured(prod.featured || false);
          setImages(prod.images || []);
          setAgePrices(prod.agePrices || []);
          const firstPrice = prod.agePrices?.[0]?.price || (prod as any).price || 999;
          setUniformPrice(String(firstPrice));
        } else {
          // Preset default age price rows from available ages
          const initialAgeRows: AgePriceEntry[] = ages.slice(0, 4).map((a) => ({
            ageId: a.id,
            ageLabel: a.label,
            minMonths: a.minMonths,
            maxMonths: a.maxMonths,
            price: 999,
            available: true,
          }));
          setAgePrices(initialAgeRows);
          setUniformPrice('999');
        }
      } catch (err) {
        console.error('Failed to initialize product form:', err);
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
      const res = await api.uploadImage(file);
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
      alert(`Image upload failed: ${err.message}`);
    } finally {
      setUploadingSlot(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
  };

  const handlePasteUrlForSlot = (slotIdx: number) => {
    const entered = window.prompt(`Enter direct image URL for Slot ${slotIdx + 1}:`, images[slotIdx]?.url || '');
    if (entered && entered.trim()) {
      const newImages = [...images];
      const newEntry = {
        url: entered.trim(),
        order: slotIdx,
      };
      if (slotIdx < newImages.length) {
        newImages[slotIdx] = newEntry;
      } else {
        newImages[slotIdx] = newEntry;
      }
      setImages(newImages.slice(0, 4));
    }
  };

  const handleUniformPriceChange = (val: string) => {
    setUniformPrice(val);
    const num = Number(val) || 0;
    setAgePrices(agePrices.map((ap) => ({ ...ap, price: num })));
  };

  const handleAddAgePriceRow = () => {
    // Pick first unused age or fallback
    const usedAgeIds = new Set(agePrices.map((ap) => ap.ageId));
    const nextAge = availableAges.find((a) => !usedAgeIds.has(a.id)) || availableAges[0];
    if (!nextAge) return;

    setAgePrices([
      ...agePrices,
      {
        ageId: nextAge.id,
        ageLabel: nextAge.label,
        minMonths: nextAge.minMonths,
        maxMonths: nextAge.maxMonths,
        price: Number(uniformPrice) || 0,
        available: true,
      },
    ]);
  };

  const handleUpdateAgePrice = (index: number, key: keyof AgePriceEntry, value: any) => {
    const updated = [...agePrices];
    if (key === 'ageId') {
      const selected = availableAges.find((a) => a.id === value);
      if (selected) {
        updated[index] = {
          ...updated[index],
          ageId: selected.id,
          ageLabel: selected.label,
          minMonths: selected.minMonths,
          maxMonths: selected.maxMonths,
        };
      }
    } else {
      (updated[index] as any)[key] = value;
    }
    setAgePrices(updated);
  };

  const handleRemoveAgePrice = (index: number) => {
    setAgePrices(agePrices.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!name.trim()) {
      alert('Product name is required');
      return;
    }

    try {
      setSaving(true);
      const payload: Partial<Product> = {
        name: name.trim(),
        category,
        dressType,
        collection,
        description,
        availability,
        featured,
        images,
        agePrices,
      };

      if (isEditing && productId) {
        await api.updateProduct(productId, payload);
      } else {
        await api.createProduct(payload);
      }

      alert(isEditing ? '✓ Outfit updated successfully! Changes are live on the user catalogue.' : '✓ Outfit created successfully!');
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            {isEditing ? `Edit Outfit: ${name}` : 'Add New Baby Outfit'}
          </Text>
          <Text style={styles.subtitle}>
            Enter details, upload catalogue photos, and specify age-based pricing tiers.
          </Text>
        </View>
        <View style={styles.headerButtons}>
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
                {isEditing ? 'Save Changes' : 'Create Outfit'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Form Cards */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Basic Information</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Outfit Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Teddy Bear Hooded Fleece Romper"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Catalogue Price (₹) * (Same for all sizes)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 1499"
            keyboardType="numeric"
            value={uniformPrice}
            onChangeText={handleUniformPriceChange}
          />
        </View>

        <View style={styles.rowTwo}>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Category *</Text>
            <View style={styles.pillSelector}>
              <TouchableOpacity
                style={[
                  styles.pillOption,
                  category === 'boys' && styles.pillOptionActive,
                ]}
                onPress={() => setCategory('boys')}
              >
                <Text
                  style={[
                    styles.pillOptionText,
                    category === 'boys' && styles.pillOptionTextActive,
                  ]}
                >
                  👦 Baby Boys
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.pillOption,
                  category === 'girls' && styles.pillOptionActive,
                ]}
                onPress={() => setCategory('girls')}
              >
                <Text
                  style={[
                    styles.pillOptionText,
                    category === 'girls' && styles.pillOptionTextActive,
                  ]}
                >
                  👧 Baby Girls
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Dress Type *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Romper, Frock, Partywear, Linen Set"
              value={dressType}
              onChangeText={setDressType}
            />
          </View>
        </View>

        <View style={styles.rowTwo}>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Collection</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Party & Festive Sparkle"
              value={collection}
              onChangeText={setCollection}
            />
          </View>

          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Availability Status</Text>
            <View style={styles.pillSelector}>
              <TouchableOpacity
                style={[
                  styles.pillOption,
                  availability === 'available' && styles.pillOptionActive,
                ]}
                onPress={() => setAvailability('available')}
              >
                <Text
                  style={[
                    styles.pillOptionText,
                    availability === 'available' && styles.pillOptionTextActive,
                  ]}
                >
                  In Stock
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.pillOption,
                  availability === 'limited' && styles.pillOptionActive,
                ]}
                onPress={() => setAvailability('limited')}
              >
                <Text
                  style={[
                    styles.pillOptionText,
                    availability === 'limited' && styles.pillOptionTextActive,
                  ]}
                >
                  Limited
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.pillOption,
                  availability === 'out_of_stock' && styles.pillOptionActive,
                ]}
                onPress={() => setAvailability('out_of_stock')}
              >
                <Text
                  style={[
                    styles.pillOptionText,
                    availability === 'out_of_stock' && styles.pillOptionTextActive,
                  ]}
                >
                  Out of Stock
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description & Fabric Details</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Fabric composition, snap buttons, design details..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.checkbox, featured && styles.checkboxActive]}
            onPress={() => setFeatured(!featured)}
          >
            <Text style={styles.checkboxCheck}>{featured ? '✓' : ''}</Text>
          </TouchableOpacity>
          <Text style={styles.toggleLabel}>
            Mark as Featured (showcases with gold badge on catalogue homepage)
          </Text>
        </View>
      </View>

      {/* 4 Dedicated Images Section */}
      <View style={styles.card}>
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={styles.cardTitle}>Catalogue Photography (4 Image Slots)</Text>
            <Text style={styles.cardSubtitle}>
              Upload 4 photos per dress so users can swipe and view all angles directly on the catalogue cards.
            </Text>
          </View>
        </View>

        {/* Hidden File Input */}
        <div>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>

        <View style={styles.fourSlotsGrid}>
          {SLOT_CONFIG.map((slot, idx) => {
            const img = images[idx];
            const isUploadingThis = uploadingSlot === idx;

            return (
              <View key={idx} style={styles.slotCard}>
                <View style={styles.slotHeader}>
                  <Text style={styles.slotTitle}>{slot.title}</Text>
                  <Text style={styles.slotDesc}>{slot.desc}</Text>
                </View>

                {img ? (
                  <View style={styles.slotImageWrapper}>
                    <Image source={{ uri: img.url }} style={styles.slotImagePreview} />
                    <View style={styles.slotActionButtons}>
                      <TouchableOpacity
                        style={styles.replaceSlotBtn}
                        onPress={() => triggerUploadForSlot(idx)}
                        disabled={isUploadingThis}
                      >
                        {isUploadingThis ? (
                          <ActivityIndicator size="small" color="#fff" />
                        ) : (
                          <Text style={styles.replaceSlotBtnText}>Replace</Text>
                        )}
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.urlSlotBtn}
                        onPress={() => handlePasteUrlForSlot(idx)}
                      >
                        <Text style={styles.urlSlotBtnText}>URL</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.removeSlotBtn}
                        onPress={() => handleRemoveImage(idx)}
                      >
                        <Text style={styles.removeSlotBtnText}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View style={styles.emptySlotBox}>
                    {isUploadingThis ? (
                      <ActivityIndicator size="small" color="#6B7280" />
                    ) : (
                      <>
                        <Text style={styles.slotCameraIcon}>📷</Text>
                        <TouchableOpacity
                          style={styles.slotUploadActionBtn}
                          onPress={() => triggerUploadForSlot(idx)}
                        >
                          <Text style={styles.slotUploadActionText}>+ Upload Photo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.slotUrlActionBtn}
                          onPress={() => handlePasteUrlForSlot(idx)}
                        >
                          <Text style={styles.slotUrlActionText}>or Paste URL</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </View>

      {/* Age-Based Pricing Section */}
      <View style={styles.card}>
        <View style={styles.sectionHeaderRow}>
          <div>
            <Text style={styles.cardTitle}>Available Sizes for Ages</Text>
            <Text style={styles.cardSubtitle}>
              Select which baby age sizes are available for this outfit at ₹{uniformPrice || 0}.
            </Text>
          </div>
          <TouchableOpacity
            style={styles.addTierBtn}
            onPress={handleAddAgePriceRow}
          >
            <Text style={styles.addTierText}>+ Add Size</Text>
          </TouchableOpacity>
        </View>

        {agePrices.length === 0 ? (
          <Text style={styles.noAgesText}>No age sizes added. Click "+ Add Size" to add available sizes.</Text>
        ) : (
          <View style={styles.ageList}>
            {agePrices.map((ap, idx) => (
              <View key={idx} style={styles.ageRow}>
                <View style={{ flex: 3 }}>
                  <Text style={styles.miniLabel}>Age Bracket</Text>
                  <TextInput
                    style={styles.input}
                    value={ap.ageLabel}
                    onChangeText={(val) => handleUpdateAgePrice(idx, 'ageLabel', val)}
                  />
                </View>

                <View style={{ flex: 2, alignItems: 'center' }}>
                  <Text style={styles.miniLabel}>Stock Status</Text>
                  <TouchableOpacity
                    style={[
                      styles.statusToggle,
                      ap.available ? styles.statusAvailable : styles.statusOut,
                    ]}
                    onPress={() =>
                      handleUpdateAgePrice(idx, 'available', !ap.available)
                    }
                  >
                    <Text style={styles.statusToggleText}>
                      {ap.available ? 'In Stock' : 'Out of Stock'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.deleteAgeBtn}
                  onPress={() => handleRemoveAgePrice(idx)}
                >
                  <Text style={styles.deleteAgeText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: 24,
    maxWidth: 900,
    width: '100%',
    alignSelf: 'center',
    gap: 20,
  },
  center: {
    padding: 60,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 13,
    color: '#6B7280',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1C1E24',
  },
  subtitle: {
    fontSize: 13,
    color: '#5F677D',
    marginTop: 2,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelBtn: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  cancelBtnText: {
    color: '#374151',
    fontWeight: '700',
    fontSize: 13,
  },
  saveBtn: {
    backgroundColor: '#1C1E24',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  saveBtnDisabled: {
    opacity: 0.7,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1C1E24',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: -8,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: '#111827',
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  rowTwo: {
    flexDirection: 'row',
    gap: 16,
  },
  pillSelector: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 3,
    gap: 4,
  },
  pillOption: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 8,
  },
  pillOptionActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  pillOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  pillOptionTextActive: {
    color: '#111827',
    fontWeight: '700',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: '#1C1E24',
    borderColor: '#1C1E24',
  },
  checkboxCheck: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  toggleLabel: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '600',
  },
  fourSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 12,
  },
  slotCard: {
    flex: 1,
    minWidth: 220,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  slotHeader: {
    marginBottom: 8,
  },
  slotTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
  },
  slotDesc: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  slotImageWrapper: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  slotImagePreview: {
    width: '100%',
    height: '100%',
  },
  slotActionButtons: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    gap: 6,
  },
  replaceSlotBtn: {
    flex: 2,
    backgroundColor: 'rgba(17, 24, 39, 0.85)',
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  replaceSlotBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  urlSlotBtn: {
    backgroundColor: 'rgba(59, 130, 246, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  urlSlotBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  removeSlotBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeSlotBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  emptySlotBox: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
  },
  slotCameraIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  slotUploadActionBtn: {
    backgroundColor: '#111827',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 4,
  },
  slotUploadActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  slotUrlActionBtn: {
    paddingVertical: 4,
  },
  slotUrlActionText: {
    fontSize: 10,
    color: '#6B7280',
    textDecorationLine: 'underline',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addTierBtn: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addTierText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F2937',
  },
  noAgesText: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  ageList: {
    gap: 10,
  },
  ageRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-end',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  miniLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 4,
  },
  statusToggle: {
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  statusAvailable: {
    backgroundColor: '#D1FAE5',
  },
  statusOut: {
    backgroundColor: '#FEE2E2',
  },
  statusToggleText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065F46',
  },
  deleteAgeBtn: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  deleteAgeText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
