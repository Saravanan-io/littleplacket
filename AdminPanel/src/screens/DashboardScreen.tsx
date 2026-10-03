import { useWindowDimensions } from '../hooks/useWindowDimensions';
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
import {
  Shirt,
  Baby,
  Heart,
  PlusCircle,
  Pencil,
  ArrowRight,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { api } from '../services/api';
import { Product, ScreenName } from '../types';

interface DashboardScreenProps {
  onNavigate: (screen: ScreenName, params?: any) => void;
}

export default function DashboardScreen({ onNavigate }: DashboardScreenProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

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
  const [settings, setSettings] = useState<any>(null);

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
        <ActivityIndicator size="large" color="#7C3AED" />
        <Text style={styles.loadingText}>Loading Dashboard Data...</Text>
      </View>
    );
  }

  const totalCount = stats.total || stats.totalProducts || recentProducts.length || 0;
  const boysCount = stats.boys || stats.boysCount || 0;
  const girlsCount = stats.girls || stats.girlsCount || 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, isMobile && styles.contentMobile]}>
      {/* Brand Header Section with Store Image Logo */}
      <View style={[styles.brandHeaderCard, isMobile && styles.brandHeaderCardMobile]}>
        <Image
          source={{ uri: '/images/the-little-placket-banner.png' }}
          style={styles.headerLogoImg}
          resizeMode="contain"
        />

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.primaryAddBtn}
            onPress={() => onNavigate('product-add')}
            activeOpacity={0.85}
          >
            <PlusCircle size={18} color="#FFFFFF" strokeWidth={2.5} />
            <Text style={styles.primaryAddBtnText}>Add New Baby Outfit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryCatalogueBtn}
            onPress={() => onNavigate('products')}
            activeOpacity={0.85}
          >
            <ShoppingBag size={16} color="#0F172A" strokeWidth={2.2} />
            <Text style={styles.secondaryCatalogueBtnText}>View Catalogue ({totalCount})</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modern Baby KPI Cards Grid */}
      <View style={styles.kpiGrid}>
        {/* Total Outfits Card */}
        <View style={[styles.kpiCard, styles.kpiCardTotal, isMobile && styles.kpiCardMobile]}>
          <View style={styles.kpiHeaderRow}>
            <View style={[styles.kpiIconBox, { backgroundColor: '#EDE9FE', borderColor: '#DDD6FE' }]}>
              <Shirt size={22} color="#7C3AED" strokeWidth={2.2} />
            </View>
            <View style={[styles.kpiPillBadge, { backgroundColor: '#F3E8FF' }]}>
              <Text style={[styles.kpiPillText, { color: '#6D28D9' }]}>Total Catalogue</Text>
            </View>
          </View>
          <Text style={styles.kpiValue}>{totalCount}</Text>
          <Text style={styles.kpiLabel}>Total Outfits Available</Text>
        </View>

        {/* Boys Collection Card */}
        <View style={[styles.kpiCard, styles.kpiCardBoys, isMobile && styles.kpiCardMobile]}>
          <View style={styles.kpiHeaderRow}>
            <View style={[styles.kpiIconBox, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]}>
              <Baby size={22} color="#2563EB" strokeWidth={2.2} />
            </View>
            <View style={[styles.kpiPillBadge, { backgroundColor: '#DBEAFE' }]}>
              <Text style={[styles.kpiPillText, { color: '#1E40AF' }]}>Baby Boys</Text>
            </View>
          </View>
          <Text style={styles.kpiValue}>{boysCount}</Text>
          <Text style={styles.kpiLabel}>Boys Outfits Collection</Text>
        </View>

        {/* Girls Collection Card */}
        <View style={[styles.kpiCard, styles.kpiCardGirls, isMobile && styles.kpiCardMobile]}>
          <View style={styles.kpiHeaderRow}>
            <View style={[styles.kpiIconBox, { backgroundColor: '#FDF2F8', borderColor: '#FBCFE8' }]}>
              <Heart size={22} color="#EC4899" strokeWidth={2.2} />
            </View>
            <View style={[styles.kpiPillBadge, { backgroundColor: '#FCE7F3' }]}>
              <Text style={[styles.kpiPillText, { color: '#9D174D' }]}>Baby Girls</Text>
            </View>
          </View>
          <Text style={styles.kpiValue}>{girlsCount}</Text>
          <Text style={styles.kpiLabel}>Girls Outfits Collection</Text>
        </View>
      </View>
      {/* Welcome Admin Banner Card */}
      <View style={styles.welcomeBannerSection}>
        <View style={[styles.welcomeBannerCard, isMobile && styles.welcomeBannerCardMobile]}>
          <Image
            source={{ uri: '/images/welcome-admin.png' }}
            style={styles.welcomeBannerImg}
            resizeMode="contain"
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  welcomeBannerSection: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  welcomeBannerCard: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  welcomeBannerCardMobile: {
    paddingVertical: 4,
  },
  welcomeBannerImg: {
    width: '100%',
    height: 380,
  },
  

  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 28,
    maxWidth: 1120,
    width: '100%',
    marginHorizontal: 'auto',
    gap: 24,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 80,
  },
  loadingText: {
    marginTop: 14,
    fontSize: 14,
    color: '#64748B',
    fontWeight: '700',
  },
  brandHeaderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 22,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  brandHeaderCardMobile: {
    padding: 16,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  headerLogoImg: {
    height: 85,
    width: 290,
    maxWidth: '100%' as any,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  primaryAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#7C3AED',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  primaryAddBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  secondaryCatalogueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
  },
  secondaryCatalogueBtnText: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '800',
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
  },
  kpiCard: {
    flex: 1,
    minWidth: 260,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    gap: 8,
  },
  kpiCardTotal: {
    borderColor: '#DDD6FE',
  },
  kpiCardBoys: {
    borderColor: '#BFDBFE',
  },
  kpiCardGirls: {
    borderColor: '#FBCFE8',
  },
  kpiHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  kpiIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  kpiPillBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  kpiPillText: {
    fontSize: 11,
    fontWeight: '800',
  },
  kpiValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -1,
  },
  kpiLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  recentSection: {
    gap: 14,
  },
  recentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2563EB',
  },
  tableCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  productThumb: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  catBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  catBadgeBoys: {
    backgroundColor: '#EFF6FF',
  },
  catBadgeGirls: {
    backgroundColor: '#FDF2F8',
  },
  catBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  priceTag: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  inStockBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  inStockText: {
    color: '#047857',
    fontSize: 11,
    fontWeight: '800',
  },
  outStockBadge: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  outStockText: {
    color: '#B91C1C',
    fontSize: 11,
    fontWeight: '800',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  contentMobile: {
    padding: 14,
    gap: 16,
  },
  welcomeBannerMobile: {
    padding: 18,
    borderRadius: 18,
    minHeight: 150,
  },
  kpiCardMobile: {
    minWidth: '100%' as any,
  },
});
