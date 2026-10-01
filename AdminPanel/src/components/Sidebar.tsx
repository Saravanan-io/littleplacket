import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
  const navItems: Array<{ screen: ScreenName; label: string; icon: string }> = [
    { screen: 'dashboard', label: 'Dashboard', icon: '📊' },
    { screen: 'products', label: 'All Outfits', icon: '👗' },
    { screen: 'product-add', label: '+ Add Outfit', icon: '✨' },
    { screen: 'ages', label: 'Age Brackets', icon: '📏' },
    { screen: 'collections', label: 'Collections', icon: '🎀' },
    { screen: 'settings', label: 'WhatsApp / Settings', icon: '⚙️' },
  ];

  return (
    <View style={styles.sidebar}>
      {/* Brand Header */}
      <View style={styles.brandContainer}>
        <View style={styles.brandIconBox}>
          <Text style={styles.brandEmoji}>🧸</Text>
        </View>
        <View>
          <Text style={styles.brandTitle}>KIDDY CLOSET</Text>
          <Text style={styles.brandSubtitle}>Admin Hub</Text>
        </View>
      </View>

      {/* Navigation List */}
      <View style={styles.navSection}>
        {navItems.map((item) => {
          const isActive =
            currentScreen === item.screen ||
            (currentScreen === 'product-edit' && item.screen === 'products');

          return (
            <TouchableOpacity
              key={item.screen}
              style={[styles.navItem, isActive && styles.navItemActive]}
              onPress={() => onNavigate(item.screen)}
            >
              <Text style={styles.navIcon}>{item.icon}</Text>
              <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* External Catalogue Link */}
      <View style={styles.footerSection}>
        <TouchableOpacity
          style={styles.externalLink}
          onPress={() => window.open('http://localhost:3000', '_blank')}
        >
          <Text style={styles.externalLinkText}>↗ View Customer Catalogue</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 250,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    padding: 20,
    justifyContent: 'space-between',
    minHeight: '100%',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  brandIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FDF2F8',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FBCFE8',
  },
  brandEmoji: {
    fontSize: 22,
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1C1E24',
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 11,
    color: '#858FA8',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  navSection: {
    flex: 1,
    paddingTop: 20,
    gap: 6,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 12,
  },
  navItemActive: {
    backgroundColor: '#1C1E24',
  },
  navIcon: {
    fontSize: 16,
  },
  navLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  navLabelActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  footerSection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 10,
  },
  externalLink: {
    backgroundColor: '#F9FAFB',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  externalLinkText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#3B82F6',
  },
  logoutBtn: {
    padding: 10,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
  },
});
