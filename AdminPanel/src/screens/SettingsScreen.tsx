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
import { api } from '../services/api';
import { BusinessSettings, ScreenName } from '../types';

interface SettingsScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

export default function SettingsScreen({ onNavigate }: SettingsScreenProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [businessName, setBusinessName] = useState('Kiddy Closet');
  const [whatsappNumber, setWhatsappNumber] = useState('919876543210');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [email, setEmail] = useState('hello@kiddycloset.com');
  const [address, setAddress] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const data = await api.getSettings();
        if (data) {
          setBusinessName(data.businessName || 'Kiddy Closet');
          setWhatsappNumber(data.whatsappNumber || '919876543210');
          setPhone(data.phone || '');
          setEmail(data.email || '');
          setAddress(data.address || '');
          setInstagramUrl(data.instagramUrl || '');
          setFacebookUrl(data.facebookUrl || '');
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
    if (!whatsappNumber.trim()) {
      alert('WhatsApp number is required');
      return;
    }

    try {
      setSaving(true);
      setSuccessMsg('');
      await api.updateSettings({
        businessName: businessName.trim(),
        whatsappNumber: whatsappNumber.replace(/[^\d]/g, ''),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        instagramUrl: instagramUrl.trim(),
        facebookUrl: facebookUrl.trim(),
      });
      setSuccessMsg('Settings saved successfully! WhatsApp enquiries will now route to this number.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      alert(`Save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2A2E39" />
        <Text style={styles.loadingText}>Loading settings...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Business & WhatsApp Configuration</Text>
          <Text style={styles.subtitle}>
            Control your primary WhatsApp enquiry contact, store address, and brand channels.
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.saveBtnText}>Save Settings</Text>
          )}
        </TouchableOpacity>
      </View>

      {successMsg ? (
        <View style={styles.successBox}>
          <Text style={styles.successText}>✓ {successMsg}</Text>
        </View>
      ) : null}

      {/* Critical WhatsApp Card */}
      <View style={[styles.card, styles.waCard]}>
        <View style={styles.waCardHeader}>
          <Text style={styles.waEmoji}>💬</Text>
          <View>
            <Text style={styles.waCardTitle}>Primary WhatsApp Enquiry Number</Text>
            <Text style={styles.waCardSubtitle}>
              All "Enquire on WhatsApp" buttons across the customer catalogue forward messages to this number.
            </Text>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>WhatsApp Number (Include Country Code without +) *</Text>
          <TextInput
            style={[styles.input, styles.waInput]}
            placeholder="e.g. 919876543210"
            value={whatsappNumber}
            onChangeText={setWhatsappNumber}
            keyboardType="phone-pad"
          />
          <Text style={styles.hintText}>
            Example: For India +91 9876543210, enter <strong>919876543210</strong>.
          </Text>
        </View>
      </View>

      {/* General Store Details */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Store Profile</Text>

        <View style={styles.rowTwo}>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Business / Brand Name</Text>
            <TextInput
              style={styles.input}
              value={businessName}
              onChangeText={setBusinessName}
            />
          </View>

          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Support Phone (Display)</Text>
            <TextInput
              style={styles.input}
              placeholder="+91 98765 43210"
              value={phone}
              onChangeText={setPhone}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Customer Support Email</Text>
          <TextInput
            style={styles.input}
            placeholder="hello@kiddycloset.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Boutique Physical Address</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Store location, arcade number, city, pin code..."
            value={address}
            onChangeText={setAddress}
            multiline
            numberOfLines={3}
          />
        </View>
      </View>

      {/* Social Links */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Social & Web Channels</Text>

        <View style={styles.rowTwo}>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Instagram Profile URL</Text>
            <TextInput
              style={styles.input}
              placeholder="https://instagram.com/kiddycloset"
              value={instagramUrl}
              onChangeText={setInstagramUrl}
            />
          </View>

          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Facebook Page URL</Text>
            <TextInput
              style={styles.input}
              placeholder="https://facebook.com/kiddycloset"
              value={facebookUrl}
              onChangeText={setFacebookUrl}
            />
          </View>
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
    maxWidth: 900,
    width: '100%',
    alignSelf: 'center',
    gap: 20,
  },
  center: {
    padding: 60,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 13,
    color: '#6B7280',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
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
  saveBtn: {
    backgroundColor: '#1C1E24',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  saveBtnDisabled: {
    opacity: 0.7,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  successBox: {
    backgroundColor: '#DEF7EC',
    borderWidth: 1,
    borderColor: '#31C48D',
    borderRadius: 12,
    padding: 14,
  },
  successText: {
    color: '#03543F',
    fontSize: 13,
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 16,
  },
  waCard: {
    borderColor: '#A7F3D0',
    backgroundColor: '#F0FDF4',
  },
  waCardHeader: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  waEmoji: {
    fontSize: 32,
  },
  waCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#065F46',
  },
  waCardSubtitle: {
    fontSize: 12,
    color: '#047857',
    marginTop: 2,
  },
  waInput: {
    backgroundColor: '#FFFFFF',
    borderColor: '#6EE7B7',
    fontSize: 15,
    fontWeight: '700',
    color: '#065F46',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1C1E24',
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: '#111827',
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  rowTwo: {
    flexDirection: 'row',
    gap: 16,
  },
  hintText: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
});
