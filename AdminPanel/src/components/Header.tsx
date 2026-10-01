import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AdminUser, ScreenName } from '../types';

interface HeaderProps {
  currentScreen: ScreenName;
  admin: AdminUser | null;
  onLogout: () => void;
}

export default function Header({ currentScreen, admin, onLogout }: HeaderProps) {
  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'dashboard':
        return 'Dashboard Overview';
      case 'products':
        return 'Baby Outfits Catalogue';
      case 'product-add':
        return 'Add New Outfit';
      case 'product-edit':
        return 'Edit Outfit';
      case 'ages':
        return 'Manage Age Brackets';
      case 'collections':
        return 'Manage Collections';
      case 'settings':
        return 'Business & WhatsApp Settings';
      default:
        return 'Admin Panel';
    }
  };

  return (
    <View style={styles.header}>
      <Text style={styles.screenTitle}>{getScreenTitle()}</Text>

      <View style={styles.userContainer}>
        <View style={styles.statusDot} />
        <View>
          <Text style={styles.userName}>{admin?.name || 'Admin User'}</Text>
          <Text style={styles.userRole}>{admin?.email || 'admin@kiddycloset.com'}</Text>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 70,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1C1E24',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  userName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1E24',
  },
  userRole: {
    fontSize: 11,
    color: '#858FA8',
  },
  logoutBtn: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 8,
  },
  logoutText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
});
