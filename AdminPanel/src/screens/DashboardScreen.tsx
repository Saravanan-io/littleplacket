import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { api } from '../services/api';
import { Product, ScreenName } from '../types';

interface DashboardScreenProps {
  onNavigate: (screen: ScreenName, params?: any) => void;
}

export default function DashboardScreen({ onNavigate }: DashboardScreenProps) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({
    total: 0,
    boys: 0,
    girls: 0,
    available: 0,
    outOfStock: 0,
    featured: 0,
  });
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.getStats();
      setStats(data.stats);
      setRecentProducts(data.recentProducts || []);
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2A2E39" />
        <Text style={styles.loadingText}>Loading Dashboard Data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Welcome Banner */}
      <View style={styles.welcomeCard}>
        <View>
          <Text style={styles.welcomeTitle}>Welcome back, Admin 👋</Text>
          <Text style={styles.welcomeSubtitle}>
            Here is your catalogue overview, outfit counts, and live stock statuses.
          </Text>
        </View>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => onNavigate('product-add')}
        >
          <Text style={styles.primaryBtnText}>+ Add New Outfit</Text>
        </TouchableOpacity>
      </View>

      {/* KPI Cards Grid */}
      <View style={styles.kpiGrid}>
        <View style={[styles.kpiCard, { borderLeftColor: '#3A86FF' }]}>
          <Text style={styles.kpiLabel}>Total Outfits</Text>
          <Text style={styles.kpiValue}>{stats.total}</Text>
          <Text style={styles.kpiSub}>In Catalogue</Text>
        </View>

        <View style={[styles.kpiCard, { borderLeftColor: '#60A5FA' }]}>
          <Text style={styles.kpiLabel}>Baby Boys</Text>
          <Text style={styles.kpiValue}>{stats.boys}</Text>
          <Text style={styles.kpiSub}>Rompers & Suits</Text>
        </View>

        <View style={[styles.kpiCard, { borderLeftColor: '#FB6F92' }]}>
          <Text style={styles.kpiLabel}>Baby Girls</Text>
          <Text style={styles.kpiValue}>{stats.girls}</Text>
          <Text style={styles.kpiSub}>Frocks & Gowns</Text>
        </View>

        <View style={[styles.kpiCard, { borderLeftColor: '#10B981' }]}>
          <Text style={styles.kpiLabel}>Available Now</Text>
          <Text style={styles.kpiValue}>{stats.available}</Text>
          <Text style={styles.kpiSub}>Ready for Enquiry</Text>
        </View>
      </View>

      {/* Quick Navigation Cards */}
      <View style={styles.quickNavSection}>
        <Text style={styles.sectionTitle}>Catalogue Management</Text>
        <View style={styles.quickNavGrid}>
          <TouchableOpacity
            style={styles.navCard}
            onPress={() => onNavigate('products')}
          >
            <Text style={styles.navCardIcon}>👗</Text>
            <Text style={styles.navCardTitle}>All Products</Text>
            <Text style={styles.navCardDesc}>View, edit, search, and update outfits</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navCard}
            onPress={() => onNavigate('ages')}
          >
            <Text style={styles.navCardIcon}>📏</Text>
            <Text style={styles.navCardTitle}>Age Brackets</Text>
            <Text style={styles.navCardDesc}>Manage 0-3M, 3-6M, and sizing ranges</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navCard}
            onPress={() => onNavigate('collections')}
          >
            <Text style={styles.navCardIcon}>✨</Text>
            <Text style={styles.navCardTitle}>Collections</Text>
            <Text style={styles.navCardDesc}>Newborn, Festive, and Summer groupings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navCard}
            onPress={() => onNavigate('settings')}
          >
            <Text style={styles.navCardIcon}>⚙️</Text>
            <Text style={styles.navCardTitle}>Business Settings</Text>
            <Text style={styles.navCardDesc}>Update WhatsApp number, address, & phone</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Outfits Table */}
      <View style={styles.recentSection}>
        <View style={styles.recentHeader}>
          <Text style={styles.sectionTitle}>Recently Added Outfits</Text>
          <TouchableOpacity onPress={() => onNavigate('products')}>
            <Text style={styles.viewAllText}>View All Outfits →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tableCard}>
          {recentProducts.map((product) => (
            <View key={product.id || product.slug} style={styles.productRow}>
              <Image
                source={{ uri: product.images?.[0]?.url || '/images/hero-banner.jpg' }}
                style={styles.productThumb}
              />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productMeta}>
                  {product.category === 'boys' ? '👦 Boys' : '👧 Girls'} • {product.dressType || 'Boutique'}
                </Text>
              </View>
              <View style={styles.productActions}>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => onNavigate('product-edit', { productId: product.id })}
                >
                  <Text style={styles.editBtnText}>Edit</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
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
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#5F677D',
    fontWeight: '600',
  },
  welcomeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1C1E24',
  },
  welcomeSubtitle: {
    fontSize: 13,
    color: '#5F677D',
    marginTop: 4,
  },
  primaryBtn: {
    backgroundColor: '#1C1E24',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 28,
  },
  kpiCard: {
    flex: 1,
    minWidth: 200,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 18,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  kpiLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5F677D',
    textTransform: 'uppercase',
  },
  kpiValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1C1E24',
    marginVertical: 4,
  },
  kpiSub: {
    fontSize: 12,
    color: '#858FA8',
  },
  quickNavSection: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1C1E24',
    marginBottom: 14,
  },
  quickNavGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  navCard: {
    flex: 1,
    minWidth: 220,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  navCardIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  navCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1E24',
    marginBottom: 4,
  },
  navCardDesc: {
    fontSize: 12,
    color: '#5F677D',
    lineHeight: 16,
  },
  recentSection: {
    marginBottom: 28,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#3A86FF',
  },
  tableCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  productThumb: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
    marginRight: 14,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1E24',
  },
  productMeta: {
    fontSize: 12,
    color: '#858FA8',
    marginTop: 2,
  },
  productActions: {
    marginLeft: 12,
  },
  editBtn: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
});
