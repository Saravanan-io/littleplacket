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

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.dressType?.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Header */}
      <View style={styles.header}>
        <div>
          <Text style={styles.title}>All Baby Outfits</Text>
          <Text style={styles.subtitle}>
            Manage, update, and inspect all {products.length} outfits in your catalogue.
          </Text>
        </div>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => onNavigate('product-add')}
        >
          <Text style={styles.addBtnText}>+ Add New Outfit</Text>
        </TouchableOpacity>
      </View>

      {/* Search & Category Filter Toolbar */}
      <View style={styles.toolbar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by outfit name or dress type..."
          value={search}
          onChangeText={setSearch}
        />

        <View style={styles.categoryFilters}>
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedCategory === 'all' && styles.filterChipActive,
            ]}
            onPress={() => setSelectedCategory('all')}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedCategory === 'all' && styles.filterChipTextActive,
              ]}
            >
              All Outfits
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedCategory === 'boys' && styles.filterChipActive,
            ]}
            onPress={() => setSelectedCategory('boys')}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedCategory === 'boys' && styles.filterChipTextActive,
              ]}
            >
              👦 Baby Boys
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedCategory === 'girls' && styles.filterChipActive,
            ]}
            onPress={() => setSelectedCategory('girls')}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedCategory === 'girls' && styles.filterChipTextActive,
              ]}
            >
              👧 Baby Girls
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Products Table/List */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2A2E39" />
          <Text style={styles.loadingText}>Fetching catalogue items...</Text>
        </View>
      ) : filteredProducts.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyEmoji}>🧸</Text>
          <Text style={styles.emptyTitle}>No Outfits Found</Text>
          <Text style={styles.emptySubtitle}>Try changing your search term or category filter.</Text>
        </View>
      ) : (
        <View style={styles.tableCard}>
          {filteredProducts.map((p) => {
            const minPrice =
              p.agePrices && p.agePrices.length > 0
                ? Math.min(...p.agePrices.map((ap) => ap.price))
                : 0;

            return (
              <View key={p.id} style={styles.row}>
                <Image
                  source={{ uri: p.images?.[0]?.url || '/images/hero-banner.jpg' }}
                  style={styles.thumb}
                />
                <View style={styles.rowInfo}>
                  <View style={styles.badgeRow}>
                    <Text
                      style={[
                        styles.catBadge,
                        p.category === 'boys' ? styles.catBoys : styles.catGirls,
                      ]}
                    >
                      {p.category === 'boys' ? 'Boys' : 'Girls'}
                    </Text>
                    <Text style={styles.dressTypeBadge}>{p.dressType || 'Boutique'}</Text>
                    {p.featured && <Text style={styles.featuredBadge}>★ Featured</Text>}
                  </View>
                  <Text style={styles.productName}>{p.name}</Text>
                  <Text style={styles.priceText}>
                    From ₹{minPrice.toLocaleString('en-IN')} • {p.agePrices?.length || 0} Age Sizes
                  </Text>
                </View>

                {/* Actions */}
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => onNavigate('product-edit', { productId: p.id })}
                  >
                    <Text style={styles.editBtnText}>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.delBtn}
                    onPress={() => handleDelete(p.id, p.name)}
                    disabled={deletingId === p.id}
                  >
                    <Text style={styles.delBtnText}>
                      {deletingId === p.id ? 'Deleting...' : 'Delete'}
                    </Text>
                  </TouchableOpacity>
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
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: 24,
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 20,
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
  addBtn: {
    backgroundColor: '#1C1E24',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  toolbar: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
    gap: 12,
  },
  searchInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: '#1C1E24',
  },
  categoryFilters: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  filterChipActive: {
    backgroundColor: '#1C1E24',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  center: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 13,
    color: '#6B7280',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  tableCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  thumb: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    marginRight: 16,
  },
  rowInfo: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 4,
  },
  catBadge: {
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  catBoys: {
    backgroundColor: '#DBEAFE',
    color: '#1E40AF',
  },
  catGirls: {
    backgroundColor: '#FCE7F3',
    color: '#9D174D',
  },
  dressTypeBadge: {
    fontSize: 10,
    fontWeight: '600',
    backgroundColor: '#F3F4F6',
    color: '#4B5563',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  featuredBadge: {
    fontSize: 10,
    fontWeight: '700',
    backgroundColor: '#FEF3C7',
    color: '#92400E',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  priceText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  editBtn: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  delBtn: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  delBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#DC2626',
  },
});
