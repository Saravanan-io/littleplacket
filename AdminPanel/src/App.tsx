import { useWindowDimensions } from './hooks/useWindowDimensions';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { api } from './services/api';
import { AdminUser, ScreenName } from './types';

// Screens
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import ProductsScreen from './screens/ProductsScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import AgesScreen from './screens/AgesScreen';
import CollectionsScreen from './screens/CollectionsScreen';
import SettingsScreen from './screens/SettingsScreen';

// Layout components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MobileBottomBar from './components/MobileBottomBar';

export default function App() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('dashboard');
  const [activeProductId, setActiveProductId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (api.getToken()) {
          const user = await api.getMe();
          setAdmin(user);
        }
      } catch (err) {
        api.logout();
        setAdmin(null);
      } finally {
        setLoadingAuth(false);
      }
    };

    checkAuth();
  }, []);

  const handleNavigate = (screen: ScreenName, params?: any) => {
    if (params?.productId) {
      setActiveProductId(params.productId);
    } else {
      setActiveProductId(undefined);
    }
    setCurrentScreen(screen);
  };

  const handleLogout = () => {
    api.logout();
    setAdmin(null);
    setCurrentScreen('dashboard');
  };

  if (loadingAuth) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1C1E24" />
      </View>
    );
  }

  if (!admin) {
    return <LoginScreen onLoginSuccess={(u) => setAdmin(u)} />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <DashboardScreen onNavigate={handleNavigate} />;
      case 'products':
        return <ProductsScreen onNavigate={handleNavigate} />;
      case 'product-add':
        return <ProductEditScreen onNavigate={handleNavigate} />;
      case 'product-edit':
        return (
          <ProductEditScreen
            productId={activeProductId}
            onNavigate={handleNavigate}
          />
        );
      case 'ages':
        return <AgesScreen onNavigate={handleNavigate} />;
      case 'collections':
        return <CollectionsScreen onNavigate={handleNavigate} />;
      case 'settings':
        return <SettingsScreen onNavigate={handleNavigate} />;
      default:
        return <DashboardScreen onNavigate={handleNavigate} />;
    }
  };

  return (
    <View style={[styles.appContainer, isMobile && styles.appContainerMobile]}>
      {!isMobile && (
        <Sidebar
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}
      <View style={styles.mainWrapper}>
        <Header
          currentScreen={currentScreen}
          admin={admin}
          onLogout={handleLogout}
        />
        <View style={[styles.screenWrapper, isMobile && styles.screenWrapperMobile]}>
          {renderScreen()}
        </View>
      </View>

      {isMobile && (
        <MobileBottomBar
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  appContainer: {
    flex: 1,
    flexDirection: 'row',
    height: '100%',
    backgroundColor: '#F8F9FA',
  },
  appContainerMobile: {
    flexDirection: 'column',
    position: 'relative',
  },
  mainWrapper: {
    flex: 1,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  screenWrapper: {
    flex: 1,
    overflow: 'hidden',
  },
  screenWrapperMobile: {
    paddingBottom: 64,
  },
});
