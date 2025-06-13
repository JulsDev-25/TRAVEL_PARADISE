import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput, Image } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PresenceScreen() {
  const [students, setStudents] = useState([
    { id: '1', name: 'Jules Loïc', present: false, comment: '' },
    { id: '2', name: 'Maxime Arold', present: false, comment: '' },
    { id: '3', name: 'Maxel Jocker', present: false, comment: '' },
    { id: '4', name: 'Brasserie de Bertinchamps', present: false, comment: '' },
    { id: '5', name: 'Brasserie de Bertinchamps', present: false, comment: '' },
    { id: '6', name: 'Brasserie de Bertinchamps', present: false, comment: '' },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [currentComment, setCurrentComment] = useState('');

  const togglePresence = (id) => {
    setStudents(prev =>
      prev.map(s => s.id === id ? { ...s, present: !s.present } : s)
    );
  };

  const openCommentModal = (student) => {
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

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image source={require('../assets/logo.png')} style={styles.avatar} />
      <Text style={styles.name}>{item.name}</Text>

      <View style={{ flexDirection: 'row', backgroundColor: "#041562", alignItems: "center", paddingLeft: 10 }}>
        <View style={{ height: 35, width: 35, borderRadius: 5, borderWidth: 2, borderColor: "gray", overflow: "hidden", backgroundColor: "#fff", justifyContent: "center", alignItems: "center" }}>
          <Checkbox
            status={item.present ? 'checked' : 'unchecked'}
            onPress={() => togglePresence(item.id)}
            color="#4CAF50"
          />
        </View>

        <TouchableOpacity style={styles.editBtn} onPress={() => openCommentModal(item)}>
          <MaterialCommunityIcons name="square-edit-outline" size={40} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleSave = () => {
    console.log('Données sauvegardées :', students);
    alert('Présences enregistrées');
  };

  return (
    <SafeAreaView
      style={styles.container}
    >
      <View style={styles.container}>
        {/* Carte de la visite */}
        <View
          style={styles.lastVisitCard}
          onPress={() => navigation.navigate('Description')}
        >
          <View style={{ position: 'absolute', marginTop: 9, marginLeft: 16, backgroundColor: "#0A436D", width: 37, height: 37, alignItems: "center", justifyContent: "center", borderRadius: 30 }}>
            <MaterialCommunityIcons name="notebook" size={22} color="white" />
          </View>
          <Text style={styles.lastVisitTitle}>Enregistrer les présences</Text>
          <Text style={styles.location}>Visite du mont Cameroun</Text>
          <View style={styles.lastVisitFooter}>
            <View style={{ flexDirection: 'row', alignItems: "center" }}>
              <MaterialIcons name="location-on" size={23} color="white" />
              <Text style={styles.footerText}>Gembloux</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: "center" }}>
              <Ionicons name="people-outline" size={26} color="lightgreen" style={{ marginLeft: 10 }} />
              <Text style={styles.count}>{students.length}</Text>
            </View>

          </View>
        </View>

        {/* Liste */}
        <View style={styles.containtList}>
          <FlatList
            data={students}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
          />
        </View>

        {/* Bouton Enregistrer */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveText}>Enregistrer</Text>
        </TouchableOpacity>

        {/* Modal pour commentaire */}
        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={styles.modalTitle}>Ajouter un commentaire</Text>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                >
                  <FontAwesome name='close' color={"red"} size={20} />
                </TouchableOpacity>
              </View>
              <TextInput
                value={currentComment}
                onChangeText={setCurrentComment}
                placeholder="Écrire un commentaire"
                style={styles.input}
                multiline
              />
              <TouchableOpacity style={styles.saveModalBtn} onPress={saveComment}>
                <Text style={styles.saveText}>Sauvegarder</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
    padding: 10,
  },
  lastVisitCard: {
    backgroundColor: '#041562',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    height: 150,
    justifyContent: "space-between"
  },
  lastVisitTitle: {
    color: '#A5D7E8',
    fontSize: 14,
    textAlign: "center",
  },
  location: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 13,
    textAlign: "center"
  },
  lastVisitFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 13,
    alignItems: 'center',
  },
  footerText: {
    color: '#fff',
    fontSize: 13,
  },
  count: {
    color: 'white',
    marginLeft: 4,
  },
  list: {
    paddingBottom: 100,
  },
  containtList: {
    borderRadius: 5,
    marginTop: 10,
    padding: 10,
    borderTopWidth: 50,
    borderWidth: 1,
    borderColor: "#041562"
  },
  item: {
    backgroundColor: 'white',
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: "#041562",
    borderWidth: 1,
    paddingLeft: 10
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  name: {
    flex: 1,
    fontSize: 14,
  },
  editBtn: {
    padding: 6,
  },
  saveBtn: {
    backgroundColor: '#041562',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  saveText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    textAlignVertical: 'top',
  },
  saveModalBtn: {
    backgroundColor: '#041562',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
});
