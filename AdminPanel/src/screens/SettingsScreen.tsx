import { useWindowDimensions } from '../hooks/useWindowDimensions';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { MessageCircle, Check, ExternalLink, MapPin, Phone } from 'lucide-react';
import { api } from '../services/api';
import { ScreenName } from '../types';

interface SettingsScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

export default function SettingsScreen({ onNavigate }: SettingsScreenProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Form states for Address, Phone Number, WhatsApp Number
  const [address, setAddress] = useState('Shop 14, Lilac Arcade, Blossom Street, Bandra West, Mumbai 400050');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [whatsappNumber, setWhatsappNumber] = useState('919876543210');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const data = await api.getSettings();
        if (data) {
          if (data.whatsappNumber) setWhatsappNumber(data.whatsappNumber);
          if (data.phone) setPhone(data.phone);
          if (data.address) setAddress(data.address);
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    const cleanedWhatsapp = whatsappNumber.replace(/[^\d]/g, '');
    if (!cleanedWhatsapp) {
      alert('Please enter a valid WhatsApp number (numbers only, with country code)');
      return;
    }

    if (!address.trim()) {
      alert('Please enter a valid boutique address.');
      return;
    }

    if (!phone.trim()) {
      alert('Please enter a valid store phone number.');
      return;
    }

    try {
      setSaving(true);
      setSuccessMsg('');
      await api.updateSettings({
        whatsappNumber: cleanedWhatsapp,
        phone: phone.trim(),
        address: address.trim(),
      });
      setSuccessMsg('Boutique address, phone number & WhatsApp contact updated successfully! All website enquiries will use these details.');
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err: any) {
      alert(`Save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleTestWhatsApp = () => {
    const cleaned = whatsappNumber.replace(/[^\d]/g, '');
    if (!cleaned) {
      alert('Please enter a WhatsApp number first.');
      return;
    }
    window.open(`https://wa.me/${cleaned}?text=Hello%20The%20Little%20Placket%20support`, '_blank');
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={styles.loadingText}>Loading boutique settings...</Text>
      </View>
    );
  }

  const cleanNum = whatsappNumber.replace(/[^\d]/g, '');

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, isMobile && styles.contentMobile]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Boutique & Contact Settings</Text>
          <Text style={styles.subtitle}>
            Manage store physical address, customer phone line, and WhatsApp order enquiry number.
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.85}
        >
          {saving ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Check size={16} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.saveBtnText}>Save All Settings</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {successMsg ? (
        <View style={styles.successBox}>
          <Check size={18} color="#047857" strokeWidth={2.5} />
          <Text style={styles.successText}>{successMsg}</Text>
        </View>
      ) : null}

      {/* Main Settings Card */}
      <View style={styles.card}>
        
        {/* 1. Address Section */}
        <View style={styles.sectionHeader}>
          <View style={[styles.iconCircle, { backgroundColor: '#FDF2F8', borderColor: '#FBCFE8' }]}>
            <MapPin size={22} color="#EC4899" strokeWidth={2.2} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>1. Boutique Physical Address</Text>
            <Text style={styles.cardDesc}>
              Displayed under "Boutique & Enquiries" in the website footer and mobile side drawer.
            </Text>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Boutique Store Address *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter store full address..."
            value={address}
            onChangeText={setAddress}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.divider} />

        {/* 2. Phone Section */}
        <View style={styles.sectionHeader}>
          <View style={[styles.iconCircle, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]}>
            <Phone size={22} color="#2563EB" strokeWidth={2.2} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>2. Customer Phone Number</Text>
            <Text style={styles.cardDesc}>
              Store contact phone number for direct customer calls.
            </Text>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Store Phone Number *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. +91 98765 43210"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.divider} />

        {/* 3. WhatsApp Section */}
        <View style={styles.sectionHeader}>
          <View style={[styles.iconCircle, { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}>
            <MessageCircle size={22} color="#059669" strokeWidth={2.2} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>3. Primary WhatsApp Order Number</Text>
            <Text style={styles.cardDesc}>
              When customers click "Enquire on WhatsApp", their message is sent to this number.
            </Text>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>WhatsApp Business Number (country code, digits only) *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 919876543210 or 9715880005"
            value={whatsappNumber}
            onChangeText={setWhatsappNumber}
            keyboardType="phone-pad"
          />
          <Text style={styles.hint}>
            Example: For India (+91) 9876543210, enter <Text style={styles.boldText}>919876543210</Text>.
          </Text>
        </View>

        {cleanNum ? (
          <View style={styles.previewBox}>
            <View style={{ flex: 1 }}>
              <Text style={styles.previewLabel}>Active WhatsApp Destination:</Text>
              <Text style={styles.previewNumber}>+{cleanNum}</Text>
            </View>
            <TouchableOpacity style={styles.testBtn} onPress={handleTestWhatsApp} activeOpacity={0.8}>
              <ExternalLink size={14} color="#15803D" strokeWidth={2} />
              <Text style={styles.testBtnText}>Test in WhatsApp</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* Action Button */}
        <View style={styles.actionsBar}>
          <TouchableOpacity
            style={[styles.primarySaveBtn, saving && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.85}
          >
            {saving ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Check size={18} color="#FFFFFF" strokeWidth={2.5} />
                <Text style={styles.primarySaveBtnText}>Save Boutique Contact Settings</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
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
    maxWidth: 750,
    width: '100%',
    alignSelf: 'center',
    gap: 20,
  },
  contentMobile: {
    padding: 14,
    gap: 16,
  },
  center: {
    padding: 80,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748B',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  saveBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    padding: 16,
    borderRadius: 14,
  },
  successText: {
    color: '#065F46',
    fontWeight: '700',
    fontSize: 13,
    flex: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 28,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    gap: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  cardDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
  },
  formGroup: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
    backgroundColor: '#F8FAFC',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  hint: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 18,
  },
  boldText: {
    fontWeight: '800',
    color: '#0F172A',
  },
  previewBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    padding: 14,
    borderRadius: 14,
  },
  previewLabel: {
    fontSize: 11,
    color: '#166534',
    fontWeight: '700',
    marginBottom: 2,
  },
  previewNumber: {
    fontSize: 16,
    fontWeight: '900',
    color: '#15803D',
  },
  testBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#86EFAC',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  testBtnText: {
    color: '#15803D',
    fontSize: 12,
    fontWeight: '800',
  },
  actionsBar: {
    paddingTop: 8,
  },
  primarySaveBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  primarySaveBtnText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 15,
  },
});
