import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput, Image, ActivityIndicator } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { Entypo, FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function PresenceScreen({ route, navigation }) {
  // Récupération de isPastOrToday depuis les paramètres de route
  // Note: isPastOrToday est true si la visite est passée OU aujourd'hui
  // Nous avons besoin d'une logique plus fine pour savoir si c'est EN COURS
  const { visiteId, visitVisiteurs, visite, isPastOrToday } = route.params;

  // Déterminer si la visite est future, passée ou en cours
  const visitDate = new Date(visite.date);
  const now = new Date();
  visitDate.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);

  const isFuture = visitDate > now;
  const isPast = visitDate < now;
  const isToday = visitDate.getTime() === now.getTime(); // Vérifie si la date est exactement aujourd'hui

  // Les interactions sont désactivées si la visite est future OU passée.
  // Elles sont actives si la visite est EN COURS (aujourd'hui).
  const isInteractionsDisabled = isFuture || isPast;

  const initialStudentsState = visitVisiteurs.map((v) => ({
    id: v.id,
    visitVisiteurId: v.id,
    name: v.visiteur.nom + ' ' + v.visiteur.prenom,
    present: v.present || false,
    comment: v.commentaire || '',
  }));

  const [students, setStudents] = useState(initialStudentsState);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [currentComment, setCurrentComment] = useState('');
  const [loading, setLoading] = useState(false);

  const totalPresent = students.filter(s => s.present).length;
  const totalAbsent = students.filter(s => !s.present).length;

  const togglePresence = (id) => {
    if (isInteractionsDisabled) return; // Ne rien faire si désactivé
    setStudents(prev =>
      prev.map(s => s.id === id ? { ...s, present: !s.present } : s)
    );
  };

  const openCommentModal = (student) => {
    if (isInteractionsDisabled) return; // Ne rien faire si désactivé
    setSelectedStudent(student);
    setCurrentComment(student.comment);
    setModalVisible(true);
  };

  const saveComment = () => {
    setStudents(prev =>
      prev.map(s =>
        s.id === selectedStudent.id ? { ...s, comment: currentComment } : s
      )
    );
    setModalVisible(false);
  };

  const handleSave = async () => {
    if (isInteractionsDisabled) return; // Ne rien faire si désactivé
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const dataToSend = {
        presences: students.map(s => ({
          visitVisiteurId: s.visitVisiteurId,
          present: s.present,
          commentaire: s.comment
        }))
      };
      await axios.post(
        `https://a131-2a02-2788-1004-1df-bd68-6d3f-ef16-8362.ngrok-free.app/api/visites/presences`,
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );
      alert("Présences enregistrées ✅");
      navigation.goBack();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      alert("Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.item, isInteractionsDisabled && styles.disabledItem]}>
      <Image source={require('../assets/logo.png')} style={styles.avatar} />
      <Text style={[styles.name, isInteractionsDisabled && styles.disabledText]}>{item.name}</Text>
      <View style={{ flexDirection: 'row', backgroundColor: "#003366", alignItems: "center", paddingLeft: 10 }}>
        <View style={[styles.checkboxContainer, isInteractionsDisabled && styles.disabledCheckboxContainer]}>
          <Checkbox
            status={item.present ? 'checked' : 'unchecked'}
            onPress={() => togglePresence(item.id)}
            color="#4CAF50"
            disabled={isInteractionsDisabled}
          />
        </View>
        <TouchableOpacity
          style={[styles.editBtn, isInteractionsDisabled && styles.disabledEditBtn]}
          onPress={() => openCommentModal(item)}
          disabled={isInteractionsDisabled}
        >
          <MaterialCommunityIcons name="square-edit-outline" size={40} color={isInteractionsDisabled ? "#aaa" : "#fff"} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{ backgroundColor: '#003366', alignItems: "center", justifyContent: "center", borderRadius: 50, position: "absolute", left: 10 }}>
          <Entypo name="chevron-left" size={24} color="white" onPress={() => navigation.goBack()} />
        </View>
        <Text style={styles.headerTitle}>Présences</Text>
      </View>

      <View style={styles.container}>
        <View style={styles.lastVisitCard}>
          <View style={{ position: 'absolute', marginTop: 9, marginLeft: 16, backgroundColor: "#0A436D", width: 37, height: 37, alignItems: "center", justifyContent: "center", borderRadius: 30 }}>
            <MaterialCommunityIcons name="notebook" size={22} color="white" />
          </View>
          <Text style={styles.lastVisitTitle}>Enregistrer les présences</Text>
          <Text style={styles.location}>{visite.lieu}</Text>
          <View style={styles.lastVisitFooter}>
            <View style={{ flexDirection: 'row', alignItems: "center" }}>
              <MaterialIcons name="location-on" size={23} color="white" />
              <Text style={styles.footerText}>{visite.pays}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: "center" }}>
              <Ionicons name="people-outline" size={26} color="lightgreen" style={{ marginLeft: 10 }} />
              <Text style={styles.count}>{students.length}</Text>
            </View>
          </View>
        </View>

        <View style={styles.containtList}>
          <FlatList
            data={students}
            keyExtractor={item => item.visitVisiteurId.toString()}
            renderItem={renderItem}
          />
        </View>

        {/* Section des totaux */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryBox}>
            <Ionicons name="person-checkmark-outline" size={24} color="green" />
            <Text style={styles.summaryText}>{totalPresent}</Text>
            <Text style={styles.summaryLabel}>Présents</Text>
          </View>
          <View style={styles.summaryBox}>
            <Ionicons name="person-outline" size={24} color="red" />
            <Text style={styles.summaryText}>{totalAbsent}</Text>
            <Text style={styles.summaryLabel}>Absents</Text>
          </View>
        </View>

        {/* Le bouton Enregistrer n'est visible/actif que si la visite est EN COURS */}
        {isToday && (
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveText}>Enregistrer</Text>
            )}
          </TouchableOpacity>
        )}

        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={styles.modalTitle}>Ajouter un commentaire</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <FontAwesome name='close' color={"red"} size={20} />
                </TouchableOpacity>
              </View>
              <TextInput
                value={currentComment}
                onChangeText={setCurrentComment}
                placeholder="Écrire un commentaire"
                style={[styles.input, isInteractionsDisabled && styles.disabledInput]}
                multiline
                editable={!isInteractionsDisabled}
              />
              {/* Le bouton Sauvegarder dans le modal n'est visible/actif que si la visite est EN COURS */}
              {isToday && (
                <TouchableOpacity style={styles.saveModalBtn} onPress={saveComment}>
                  <Text style={styles.saveText}>Sauvegarder</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f6f6', paddingHorizontal: 10 },
  header: {
    paddingVertical: 10, flexDirection: 'row', alignItems: 'center',
    justifyContent: "center", gap: 12, borderBottomWidth: 1,
    borderColor: '#00336620', marginBottom: 10,
  },
  headerTitle: { color: '#003366', fontSize: 18, fontWeight: 'bold' },
  lastVisitCard: {
    backgroundColor: '#003366', borderRadius: 20,
    padding: 16, marginBottom: 16, height: 150,
    justifyContent: "space-between"
  },
  lastVisitTitle: { color: '#A5D7E8', fontSize: 14, textAlign: "center" },
  location: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginTop: 13, textAlign: "center" },
  lastVisitFooter: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginTop: 13, alignItems: 'center',
  },
  footerText: { color: '#fff', fontSize: 13 },
  count: { color: 'white', marginLeft: 4 },
  containtList: {
    borderRadius: 5, marginTop: 10, padding: 10,
    borderTopWidth: 50, borderWidth: 1, borderColor: "#003366"
  },
  item: {
    backgroundColor: 'white', borderRadius: 5, overflow: "hidden",
    marginBottom: 8, flexDirection: 'row', alignItems: 'center',
    borderColor: "#003366", borderWidth: 1, paddingLeft: 10
  },
  disabledItem: {
    backgroundColor: '#e0e0e0',
    borderColor: '#ccc',
  },
  avatar: { width: 30, height: 30, borderRadius: 15, marginRight: 10 },
  name: { flex: 1, fontSize: 14 },
  disabledText: {
    color: '#888',
  },
  editBtn: { padding: 6 },
  disabledEditBtn: {
    opacity: 0.5,
  },
  saveBtn: {
    backgroundColor: '#003366', padding: 15, borderRadius: 25,
    alignItems: 'center', position: 'absolute', bottom: 20, left: 20, right: 20,
  },
  saveText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  modalContainer: {
    flex: 1, justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', padding: 20,
  },
  modalContent: {
    backgroundColor: 'white', borderRadius: 12, padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  input: {
    height: 100, borderColor: '#ccc', borderWidth: 1,
    borderRadius: 8, padding: 10, marginBottom: 15,
    textAlignVertical: 'top',
  },
  disabledInput: {
    backgroundColor: '#f0f0f0',
    color: '#888',
  },
  saveModalBtn: {
    backgroundColor: '#003366', padding: 12,
    borderRadius: 10, alignItems: 'center',
  },
  checkboxContainer: {
    height: 35, width: 35, borderRadius: 5, borderWidth: 2, borderColor: "gray", overflow: "hidden", backgroundColor: "#fff", justifyContent: "center", alignItems: "center"
  },
  disabledCheckboxContainer: {
    backgroundColor: '#f0f0f0',
    borderColor: '#ccc',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 80,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  summaryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  summaryText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#555',
  },
});