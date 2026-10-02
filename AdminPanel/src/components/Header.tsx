import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import { ShieldCheck, LogOut } from 'lucide-react';
import { AdminUser, ScreenName } from '../types';

interface HeaderProps {
  currentScreen: ScreenName;
  admin: AdminUser | null;
  onLogout: () => void;
}

export default function Header({ currentScreen, admin, onLogout }: HeaderProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'dashboard':
        return 'Dashboard';
      case 'products':
        return 'Outfits Catalogue';
      case 'product-add':
        return 'Add New Outfit';
      case 'product-edit':
        return 'Edit Outfit';
      case 'settings':
        return 'WhatsApp Settings';
      default:
        return 'Admin Panel';
    }
  };

  if (isMobile) {
    return (
      <View style={styles.mobileHeader}>
        <View style={styles.mobileBrandLeft}>
          <View style={styles.mobileLogoBox}>
            <Image
              source={{ uri: '/images/logo.png' }}
              style={styles.mobileLogoImg}
              resizeMode="contain"
            />
          </View>
          <View>
            <Text style={styles.mobileBrandName} numberOfLines={1}>
              THE LITTLE PLACKET
            </Text>
            <Text style={styles.mobileScreenTitle} numberOfLines={1}>
              {getScreenTitle()}
            </Text>
          </View>
        </View>

        <View style={styles.mobileRightActions}>
          <View style={styles.statusDot} />
          <TouchableOpacity
            style={styles.mobileLogoutBtn}
            onPress={onLogout}
            activeOpacity={0.8}
            aria-label="Log Out"
          >
            <LogOut size={16} color="#DC2626" strokeWidth={2.2} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.header}>
      <Text style={styles.screenTitle}>{getScreenTitle()}</Text>

      <View style={styles.userContainer}>
        <View style={styles.avatarBadge}>
          <ShieldCheck size={18} color="#7C3AED" strokeWidth={2.2} />
        </View>
        <View style={styles.userInfo}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={styles.userName}>{admin?.name || 'Kiddy Closet Admin'}</Text>
            <View style={styles.statusDot} />
          </View>
          <Text style={styles.userRole}>{admin?.email || 'admin@kiddycloset.com'}</Text>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout} activeOpacity={0.8}>
          <LogOut size={15} color="#475569" strokeWidth={2} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 68,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingHorizontal: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  userInfo: {
    alignItems: 'flex-start',
  },
  userName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
  },
  userRole: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    marginLeft: 8,
  },
  logoutText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },

  // Mobile Styles
  mobileHeader: {
    height: 56,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
  },
  mobileBrandLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  mobileLogoBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFF5F7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FCE7F3',
    padding: 3,
  },
  mobileLogoImg: {
    width: '100%',
    height: '100%',
  },
  mobileBrandName: {
    fontSize: 11,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  mobileScreenTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7C3AED',
  },
  mobileRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  mobileLogoutBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
});
