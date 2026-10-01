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
import { Collection, ScreenName } from '../types';

interface CollectionsScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

export default function CollectionsScreen({ onNavigate }: CollectionsScreenProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingCol, setEditingCol] = useState<Collection | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const loadCollections = async () => {
    try {
      setLoading(true);
      const data = await api.getCollections();
      setCollections(data);
    } catch (err) {
      console.error('Failed to load collections:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCollections();
  }, []);

  const openAdd = () => {
    setEditingCol(null);
    setName('');
    setDescription('');
    setIsAdding(true);
  };

  const openEdit = (col: Collection) => {
    setEditingCol(col);
    setName(col.name);
    setDescription(col.description || '');
    setIsAdding(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      alert('Collection name is required');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        name: name.trim(),
        description: description.trim(),
        active: true,
      };

      if (editingCol) {
        await api.updateCollection(editingCol.id, payload);
      } else {
        await api.createCollection(payload);
      }

      setIsAdding(false);
      loadCollections();
    } catch (err: any) {
      alert(`Save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, colName: string) => {
    if (!window.confirm(`Delete collection "${colName}"?`)) return;
    try {
      await api.deleteCollection(id);
      setCollections(collections.filter((c) => c.id !== id));
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Catalogue Collections</Text>
          <Text style={styles.subtitle}>
            Organize outfits into seasonal, festive, and thematic showcases.
          </Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
          <Text style={styles.addBtnText}>+ Add Collection</Text>
        </TouchableOpacity>
      </View>

      {/* Form */}
      {isAdding && (
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>
            {editingCol ? `Edit Collection: ${editingCol.name}` : 'Create New Collection'}
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Collection Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Newborn Essentials, Party & Festive Sparkle"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Brief description for customer preview..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />
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
                {saving ? 'Saving...' : 'Save Collection'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Collections Table */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2A2E39" />
        </View>
      ) : (
        <View style={styles.tableCard}>
          {collections.map((c) => (
            <View key={c.id} style={styles.row}>
              <View style={styles.rowInfo}>
                <Text style={styles.colName}>{c.name}</Text>
                <Text style={styles.colDesc}>
                  {c.description || 'No description provided.'}
                </Text>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => openEdit(c)}
                >
                  <Text style={styles.editBtnText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.delBtn}
                  onPress={() => handleDelete(c.id, c.name)}
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
  textArea: {
    height: 70,
    textAlignVertical: 'top',
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
  colName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  colDesc: {
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
