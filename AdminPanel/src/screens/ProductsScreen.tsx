import { useWindowDimensions } from '../hooks/useWindowDimensions';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  ActivityIndicator,
} from 'react-native';
import {
  PlusCircle,
  Search,
  Pencil,
  Trash2,
  Baby,
  Heart,
  Shirt,
  Sparkles,
} from 'lucide-react';
import { api } from '../services/api';
import { Product, ScreenName } from '../types';

interface ProductsScreenProps {
  onNavigate: (screen: ScreenName, params?: any) => void;
}

export default function ProductsScreen({ onNavigate }: ProductsScreenProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'boys' | 'girls'>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await api.getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from the catalogue?`)) {
      return;
    }
    try {
      setDeletingId(id);
      await api.deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.dressType?.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, isMobile && styles.contentMobile]}>
      {/* Top Header */}
      <View style={[styles.header, isMobile && styles.headerMobile]}>
        <View>
          <Text style={styles.title}>Baby Outfits Catalogue</Text>
          <Text style={styles.subtitle}>
            Manage, update, and inspect all {products.length} outfits in your catalogue.
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.addBtn, isMobile && styles.addBtnMobile]}
          onPress={() => onNavigate('product-add')}
          activeOpacity={0.85}
        >
          <PlusCircle size={18} color="#FFFFFF" strokeWidth={2.2} />
          <Text style={styles.addBtnText}>Add New Outfit</Text>
        </TouchableOpacity>
      </View>

      {/* Search & Category Filter Toolbar */}
      <View style={[styles.toolbar, isMobile && styles.toolbarMobile]}>
        <View style={styles.searchWrapper}>
          <Search size={18} color="#64748B" strokeWidth={2} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search outfits by name..."
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <View style={styles.categoryFilters}>
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedCategory === 'all' && styles.filterChipActive,
            ]}
            onPress={() => setSelectedCategory('all')}
          >
            <Shirt
              size={14}
              color={selectedCategory === 'all' ? '#FFFFFF' : '#475569'}
              strokeWidth={2}
            />
            <Text
              style={[
                styles.filterChipText,
                selectedCategory === 'all' && styles.filterChipTextActive,
              ]}
            >
              All ({products.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedCategory === 'boys' && styles.filterChipBoysActive,
            ]}
            onPress={() => setSelectedCategory('boys')}
          >
            <Baby
              size={14}
              color={selectedCategory === 'boys' ? '#FFFFFF' : '#2563EB'}
              strokeWidth={2}
            />
            <Text
              style={[
                styles.filterChipText,
                selectedCategory === 'boys' && styles.filterChipTextActive,
                selectedCategory !== 'boys' && { color: '#2563EB' },
              ]}
            >
              Boys ({products.filter((p) => p.category === 'boys').length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedCategory === 'girls' && styles.filterChipGirlsActive,
            ]}
            onPress={() => setSelectedCategory('girls')}
          >
            <Heart
              size={14}
              color={selectedCategory === 'girls' ? '#FFFFFF' : '#DB2777'}
              strokeWidth={2}
            />
            <Text
              style={[
                styles.filterChipText,
                selectedCategory === 'girls' && styles.filterChipTextActive,
                selectedCategory !== 'girls' && { color: '#DB2777' },
              ]}
            >
              Girls ({products.filter((p) => p.category === 'girls').length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Catalogue Cards Grid */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#7C3AED" />
          <Text style={styles.loadingText}>Loading catalogue outfits...</Text>
        </View>
      ) : filteredProducts.length === 0 ? (
        <View style={styles.emptyBox}>
          <Sparkles size={36} color="#94A3B8" strokeWidth={1.5} />
          <Text style={styles.emptyTitle}>No Outfits Found</Text>
          <Text style={styles.emptyDesc}>
            No outfits match your search filter "{search}".
          </Text>
        </View>
      ) : (
        <View style={styles.grid}>
          {filteredProducts.map((product) => {
            const isDeleting = deletingId === product.id;
            const coverImage = product.images?.[0]?.url || '/images/hero-banner.jpg';
            const isBoys = product.category === 'boys';

            return (
              <View key={product.id} style={[styles.productCard, isMobile && styles.productCardMobile]}>
                {/* Image Box */}
                <View style={styles.imageContainer}>
                  <Image source={{ uri: coverImage }} style={styles.cardImage} resizeMode="cover" />

                  {/* Category Pill Tag */}
                  <View style={[styles.cardTag, isBoys ? styles.cardTagBoys : styles.cardTagGirls]}>
                    {isBoys ? (
                      <Baby size={11} color="#1D4ED8" strokeWidth={2} />
                    ) : (
                      <Heart size={11} color="#BE185D" strokeWidth={2} />
                    )}
                    <Text style={[styles.cardTagText, isBoys ? { color: '#1D4ED8' } : { color: '#BE185D' }]}>
                      {isBoys ? 'Boys' : 'Girls'}
                    </Text>
                  </View>

                  {/* Availability Badge */}
                  {product.availability === 'out_of_stock' && (
                    <View style={styles.outStockOverlay}>
                      <Text style={styles.outStockOverlayText}>Out of Stock</Text>
                    </View>
                  )}
                </View>

                {/* Card Details */}
                <View style={styles.cardBody}>
                  <Text style={styles.productTitle} numberOfLines={1}>
                    {product.name}
                  </Text>

                  <View style={styles.priceRow}>
                    <Text style={styles.priceText}>₹{product.price}</Text>
                    <Text style={styles.photoCountText}>
                      📷 {product.images?.length || 1} Photos
                    </Text>
                  </View>

                  {/* Ages Tag */}
                  <View style={styles.agesRow}>
                    <Text style={styles.agesLabel}>Ages:</Text>
                    <Text style={styles.agesValue} numberOfLines={1}>
                      {product.availableAges?.slice(0, 3).join(', ') || 'All Ages'}
                      {(product.availableAges?.length || 0) > 3 ? '...' : ''}
                    </Text>
                  </View>

                  {/* Card Actions */}
                  <View style={styles.cardActions}>
                    <TouchableOpacity
                      style={styles.editCardBtn}
                      onPress={() => onNavigate('product-edit', { productId: product.id })}
                      activeOpacity={0.8}
                    >
                      <Pencil size={14} color="#1E293B" strokeWidth={2} />
                      <Text style={styles.editCardBtnText}>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.deleteCardBtn}
                      onPress={() => handleDelete(product.id, product.name)}
                      disabled={isDeleting}
                      activeOpacity={0.8}
                    >
                      {isDeleting ? (
                        <ActivityIndicator size="small" color="#DC2626" />
                      ) : (
                        <>
                          <Trash2 size={14} color="#DC2626" strokeWidth={2} />
                          <Text style={styles.deleteCardBtnText}>Delete</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 28,
    maxWidth: 1120,
    width: '100%',
    marginHorizontal: 'auto',
    gap: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#7C3AED',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 14,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchWrapper: {
    flex: 1,
    minWidth: 260,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
  },
  categoryFilters: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  filterChipBoysActive: {
    backgroundColor: '#2563EB',
    borderColor: '#1D4ED8',
  },
  filterChipGirlsActive: {
    backgroundColor: '#EC4899',
    borderColor: '#DB2777',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  center: {
    padding: 60,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#64748B',
    fontSize: 13,
  },
  emptyBox: {
    padding: 60,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  emptyDesc: {
    fontSize: 13,
    color: '#64748B',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  productCard: {
    width: 'calc(33.333% - 14px)' as any,
    minWidth: 260,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  imageContainer: {
    width: '100%',
    height: 220,
    position: 'relative',
    backgroundColor: '#F1F5F9',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardTag: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  cardTagBoys: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  cardTagGirls: {
    backgroundColor: '#FDF2F8',
    borderColor: '#FBCFE8',
  },
  cardTagText: {
    fontSize: 11,
    fontWeight: '800',
  },
  outStockOverlay: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: '#EF4444',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  outStockOverlayText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  cardBody: {
    padding: 16,
    gap: 10,
  },
  productTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#7C3AED',
  },
  photoCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  agesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  agesLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  agesValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    flex: 1,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  editCardBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  editCardBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  deleteCardBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FEF2F2',
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  deleteCardBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DC2626',
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
  addBtnMobile: {
    width: '100%',
    justifyContent: 'center',
  },
  toolbarMobile: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 10,
  },
  productCardMobile: {
    width: '100%' as any,
    minWidth: '100%' as any,
  },
});
