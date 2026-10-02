import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  LayoutDashboard,
  Shirt,
  PlusCircle,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';
import { ScreenName } from '../types';

interface MobileBottomBarProps {
  currentScreen: ScreenName;
  onNavigate: (screen: ScreenName) => void;
}

export default function MobileBottomBar({
  currentScreen,
  onNavigate,
}: MobileBottomBarProps) {
  const navItems = [
    {
      screen: 'dashboard' as ScreenName,
      label: 'Dashboard',
      icon: LayoutDashboard,
      activeColor: '#3B82F6',
    },
    {
      screen: 'products' as ScreenName,
      label: 'Outfits',
      icon: Shirt,
      activeColor: '#EC4899',
    },
    {
      screen: 'product-add' as ScreenName,
      label: 'Add Outfit',
      icon: PlusCircle,
      isPrimary: true,
      activeColor: '#7C3AED',
    },
    {
      screen: 'settings' as ScreenName,
      label: 'WhatsApp',
      icon: MessageCircle,
      activeColor: '#10B981',
    },
    {
      screen: 'store' as any,
      label: 'View Store',
      icon: ExternalLink,
      activeColor: '#2563EB',
      isExternal: true,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.barContent}>
        {navItems.map((item) => {
          const isActive =
            !item.isExternal &&
            (currentScreen === item.screen ||
              (currentScreen === 'product-edit' && item.screen === 'products'));
          const IconComp = item.icon;

          if (item.isPrimary) {
            return (
              <TouchableOpacity
                key={item.label}
                style={styles.primaryTab}
                onPress={() => onNavigate(item.screen)}
                activeOpacity={0.85}
              >
                <View style={styles.primaryIconBox}>
                  <IconComp size={22} color="#FFFFFF" strokeWidth={2.5} />
                </View>
                <Text style={styles.primaryLabel}>{item.label}</Text>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={item.label}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => {
                if (item.isExternal) {
                  window.open('http://localhost:3000', '_blank');
                } else {
                  onNavigate(item.screen);
                }
              }}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconWrapper,
                  isActive && { backgroundColor: item.activeColor + '18' },
                ]}
              >
                <IconComp
                  size={20}
                  color={isActive ? item.activeColor : '#64748B'}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </View>
              <Text
                style={[
                  styles.label,
                  isActive && { color: item.activeColor, fontWeight: '800' },
                ]}
                numberOfLines={1}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingBottom: 6,
    paddingTop: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 20,
    zIndex: 999,
  },
  barContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabActive: {},
  iconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    textAlign: 'center',
  },
  primaryTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -14,
  },
  primaryIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  primaryLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#7C3AED',
    marginTop: 2,
    textAlign: 'center',
  },
});
