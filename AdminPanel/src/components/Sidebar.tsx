import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import {
  LayoutDashboard,
  Shirt,
  PlusCircle,
  MessageCircle,
  ExternalLink,
  LogOut,
} from 'lucide-react';
import { ScreenName } from '../types';

interface SidebarProps {
  currentScreen: ScreenName;
  onNavigate: (screen: ScreenName) => void;
  onLogout: () => void;
}

export default function Sidebar({
  currentScreen,
  onNavigate,
  onLogout,
}: SidebarProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  // On mobile screens, desktop sidebar is hidden because MobileBottomBar handles navigation
  if (isMobile) {
    return null;
  }

  const navItems = [
    {
      screen: 'dashboard' as ScreenName,
      label: 'Dashboard',
      icon: LayoutDashboard,
      color: '#3B82F6',
    },
    {
      screen: 'products' as ScreenName,
      label: 'All Outfits',
      icon: Shirt,
      color: '#EC4899',
    },
    {
      screen: 'product-add' as ScreenName,
      label: 'Add Outfit',
      icon: PlusCircle,
      color: '#8B5CF6',
    },
    {
      screen: 'settings' as ScreenName,
      label: 'WhatsApp Number',
      icon: MessageCircle,
      color: '#10B981',
    },
  ];

  return (
    <View style={styles.sidebar}>
      {/* Brand Header */}
      <View style={styles.brandContainer}>
        <View style={styles.brandLogoBox}>
          <Image
            source={{ uri: '/images/logo.png' }}
            style={styles.brandLogoImg}
            resizeMode="contain"
          />
        </View>
        <View style={styles.brandTextWrapper}>
          <Text style={styles.brandTitle}>THE LITTLE PLACKET</Text>
          <Text style={styles.brandSubtitle}>Baby Boutique Admin</Text>
        </View>
      </View>

      {/* Navigation List */}
      <View style={styles.navSection}>
        <Text style={styles.navHeaderTitle}>CATALOGUE CONTROL</Text>
        {navItems.map((item) => {
          const isActive =
            currentScreen === item.screen ||
            (currentScreen === 'product-edit' && item.screen === 'products');
          const IconComp = item.icon;

          return (
            <TouchableOpacity
              key={item.screen}
              style={[styles.navItem, isActive && styles.navItemActive]}
              onPress={() => onNavigate(item.screen)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconBadge,
                  isActive ? styles.iconBadgeActive : { backgroundColor: '#F3F4F6' },
                ]}
              >
                <IconComp
                  size={18}
                  color={isActive ? '#FFFFFF' : '#4B5563'}
                  strokeWidth={2.2}
                />
              </View>
              <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Footer Section */}
      <View style={styles.footerSection}>
        <TouchableOpacity
          style={styles.externalLink}
          onPress={() => window.open('http://localhost:3000', '_blank')}
          activeOpacity={0.8}
        >
          <ExternalLink size={16} color="#2563EB" strokeWidth={2.2} />
          <Text style={styles.externalLinkText}>View Store Frontend</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout} activeOpacity={0.8}>
          <LogOut size={16} color="#EF4444" strokeWidth={2.2} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 260,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
    padding: 20,
    justifyContent: 'space-between',
    minHeight: '100%',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  brandLogoBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#FFF5F7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FCE7F3',
    padding: 4,
  },
  brandLogoImg: {
    width: '100%',
    height: '100%',
  },
  brandTextWrapper: {
    flex: 1,
  },
  brandTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 11,
    color: '#EC4899',
    fontWeight: '700',
    marginTop: 2,
  },
  navSection: {
    marginTop: 24,
    gap: 8,
    flex: 1,
  },
  navHeaderTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 8,
    paddingLeft: 6,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    gap: 12,
  },
  navItemActive: {
    backgroundColor: '#1E293B',
  },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  navLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  navLabelActive: {
    color: '#FFFFFF',
  },
  footerSection: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 16,
    gap: 10,
  },
  externalLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#EFF6FF',
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  externalLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  logoutText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
});
