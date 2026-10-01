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
import { AgeOption, ScreenName } from '../types';

interface AgesScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

export default function AgesScreen({ onNavigate }: AgesScreenProps) {
  const [ages, setAges] = useState<AgeOption[]>([]);
  const [loading, setLoading] = useState(true);

  // New / Edit age modal state
  const [editingAge, setEditingAge] = useState<AgeOption | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [label, setLabel] = useState('');
  const [minMonths, setMinMonths] = useState('');
  const [maxMonths, setMaxMonths] = useState('');
  const [saving, setSaving] = useState(false);

  const loadAges = async () => {
    try {
      setLoading(true);
      const data = await api.getAges();
      setAges(data);
    } catch (err) {
      console.error('Failed to load ages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAges();
  }, []);

  const openAdd = () => {
    setEditingAge(null);
    setLabel('');
    setMinMonths('0');
    setMaxMonths('3');
    setIsAdding(true);
  };

  const openEdit = (age: AgeOption) => {
    setEditingAge(age);
    setLabel(age.label);
    setMinMonths(String(age.minMonths));
    setMaxMonths(String(age.maxMonths));
    setIsAdding(true);
  };

  const handleSave = async () => {
    if (!label.trim()) {
      alert('Age label is required (e.g. 0-3 Months)');
      return;
    }

    try {
      setSaving(true);
      const payload: Partial<AgeOption> = {
        label: label.trim(),
        minMonths: Number(minMonths) || 0,
        maxMonths: Number(maxMonths) || 0,
        active: true,
      };

      if (editingAge) {
        await api.updateAge(editingAge.id, payload);
      } else {
        await api.createAge(payload);
      }

      setIsAdding(false);
      loadAges();
    } catch (err: any) {
      alert(`Save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, ageLabel: string) => {
    if (!window.confirm(`Delete age bracket "${ageLabel}"?`)) return;
    try {
      await api.deleteAge(id);
      setAges(ages.filter((a) => a.id !== id));
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Baby Age Brackets</Text>
          <Text style={styles.subtitle}>
            Manage standard age sizes used across catalogue filters and pricing tiers.
          </Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
          <Text style={styles.addBtnText}>+ Add Age Size</Text>
        </TouchableOpacity>
      </View>

      {/* Inline Form / Modal */}
      {isAdding && (
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>
            {editingAge ? `Edit Age: ${editingAge.label}` : 'Create New Age Bracket'}
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Age Display Label *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 0-3 Months, 2-3 Years"
              value={label}
              onChangeText={setLabel}
            />
          </View>

          <View style={styles.rowTwo}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Min Months</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={minMonths}
                onChangeText={setMinMonths}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Max Months</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={maxMonths}
                onChangeText={setMaxMonths}
              />
            </View>
          </View>

          <View style={styles.formButtons}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setIsAdding(false)}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={saving}
            >
              <Text style={styles.saveBtnText}>
                {saving ? 'Saving...' : 'Save Bracket'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Ages Table */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2A2E39" />
        </View>
      ) : (
        <View style={styles.tableCard}>
          {ages.map((a) => (
            <View key={a.id} style={styles.row}>
              <View style={styles.rowInfo}>
                <Text style={styles.ageLabel}>{a.label}</Text>
                <Text style={styles.ageMeta}>
                  Span: {a.minMonths} to {a.maxMonths} Months
                </Text>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => openEdit(a)}
                >
                  <Text style={styles.editBtnText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.delBtn}
                  onPress={() => handleDelete(a.id, a.label)}
                >
                  <Text style={styles.delBtnText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}
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
  addBtn: {
    backgroundColor: '#1C1E24',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  center: {
    padding: 40,
    alignItems: 'center',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 14,
  },
  formTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
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
  rowTwo: {
    flexDirection: 'row',
    gap: 12,
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 6,
  },
  cancelBtn: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
  },
  cancelBtnText: {
    color: '#4B5563',
    fontWeight: '700',
    fontSize: 12,
  },
  saveBtn: {
    backgroundColor: '#1C1E24',
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 10,
  },
  saveBtnDisabled: {
    opacity: 0.7,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  tableCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  rowInfo: {
    flex: 1,
  },
  ageLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  ageMeta: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  editBtn: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  delBtn: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  delBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#DC2626',
  },
});
