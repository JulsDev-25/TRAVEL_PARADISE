import React from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Dimensions, ImageBackground, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons, FontAwesome5, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Obtenir la largeur et hauteur de l'écran
const { width, height } = Dimensions.get('window');

// Fonctions utilitaires pour rendre responsive
const wp = (percentage) => (width * percentage) / 100;
const hp = (percentage) => (height * percentage) / 100;
export default function Description({ navigation }) {
    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <SafeAreaView style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={{ backgroundColor: '#041562', alignItems: "center", justifyContent: "center", borderRadius: 50, position: "absolute", left: 20 }}>
                        <Entypo name="chevron-left" size={24} color="white" onPress={() => navigation.goBack()} />
                    </View>
                    <Text style={styles.headerTitle}>Description</Text>
                </View>

                {/* Image + Overlay */}
                <View style={styles.imageContainer}>
                    <ImageBackground
                        source={require('../assets/bg.png')}
                        resizeMode="cover"
                        style={styles.image}
                    >
                        <View style={styles.overlay}>
                            <Text style={styles.overlayTitle}>Brasserie de Bertinchamps</Text>
                            <View style={styles.overlayInfo}>
                                <View style={{ flexDirection: "row", padding: 0, alignItems: "center" }}>
                                    <Entypo name="location-pin" size={16} color="white" />
                                    <Text style={styles.overlayText}>Paris, France</Text>
                                </View>
                                <View style={{ flexDirection: "row", padding: 0, alignItems: "center" }}>
                                    <FontAwesome5 name="clock" size={14} color="white" style={{ marginLeft: 10 }} />
                                    <Text style={styles.overlayText}>9h - 12h</Text>
                                </View>
                            </View>
                        </View>
                    </ImageBackground>
                </View>

                {/* Overview */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Overview</Text>
                    <View style={styles.row}>
                        <Ionicons name="calendar-outline" size={20} color="#041562" />
                        <Text style={styles.dateText}>Lundi 10/05/2025</Text>
                        <View style={styles.attendance}>
                            <FontAwesome5 name="user-check" size={18} color="green" />
                            <Text style={styles.attendanceText}>12</Text>
                            <FontAwesome5 name="user-times" size={18} color="red" style={{ marginLeft: 10 }} />
                            <Text style={styles.attendanceText}>2</Text>
                        </View>
                    </View>

                    <Text style={styles.description}>
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloremque, officiis! Eius deleniti corporis, alias ad doloremque quae eos reiciendis! Enim, alias. Eveniet explicabo porro quidem aliquid veritatis fugit culpa hic.
                    </Text>

                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 10,
                            gap: 6
                        }}
                        onPress={() => {/* navigation vers carte ou ouverture modal */ }}
                    >
                        <Entypo name="map" size={18} color="#041562" />
                        <Text style={{ color: '#041562', fontWeight: '600' }}>Afficher sur la carte</Text>
                    </TouchableOpacity>
                </View>

                {/* Commentaire */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Commentaire</Text>
                    <TextInput
                        placeholder="no comment."
                        multiline
                        style={styles.commentBox}
                        placeholderTextColor="#888"
                    />
                </View>

                {/* Button */}
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Terminer la visite</Text>
                    <MaterialCommunityIcons name="check-underline" size={20} color="white" style={{ marginLeft: 8 }} />
                </TouchableOpacity>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "center",
        gap: 12,
    },
    headerTitle: {
        color: '#041562',
        fontSize: 18,
        fontWeight: 'bold',
    },
    imageContainer: {
        position: 'relative',
        width: "100%",
        paddingHorizontal: 20
    },
    image: {
        width: '100%',
        margin: "auto",
        height: 271,
        justifyContent: "flex-end",
        paddingBottom: 20,
        overflow: "hidden",
        borderRadius: 20,
    },
    overlay: {
        backgroundColor: '#041562',
        borderRadius: 20,
        padding: 15,
        width: wp(80),
        height: wp(20),
        marginHorizontal: "auto",
        justifyContent: "space-between"
    },
    overlayTitle: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    overlayInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        marginTop: 4,
    },
    overlayText: {
        color: '#fff',
        marginLeft: 4,
    },
    section: {
        padding: 20,
    },
    sectionTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 10,
        color: '#041562',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 10,
    },
    dateText: {
        fontSize: 14,
        color: '#000',
    },
    attendance: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 'auto',
    },
    attendanceText: {
        marginLeft: 4,
        fontSize: 14,
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
        color: '#333',
        marginTop: 4,
    },
    commentBox: {
        backgroundColor: '#f0f8ff',
        padding: 12,
        borderRadius: 10,
        fontSize: 14,
        height: 80,
        textAlignVertical: 'top',
    },
    button: {
        flexDirection: 'row',
        backgroundColor: '#041562',
        paddingVertical: 14,
        justifyContent: 'center',
        borderRadius: 50,
        alignItems: 'center',
        alignSelf: "center",
        position: "absolute",
        width: 250,
        bottom: 40
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
});

