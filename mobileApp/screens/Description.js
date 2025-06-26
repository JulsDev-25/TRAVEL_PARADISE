import React, { useEffect, useState } from 'react';
import {
    View, Text, ImageBackground, StyleSheet, TextInput, TouchableOpacity, Dimensions,
    KeyboardAvoidingView, Platform, ActivityIndicator, Alert, ScrollView
} from 'react-native';
import { Ionicons, FontAwesome5, Entypo, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const wp = (percentage) => (width * percentage) / 100;

export default function Description({ route, navigation }) {
    const [visite, setVisite] = useState(null);
    const [loading, setLoading] = useState(true);
    const [commentaireFin, setCommentaireFin] = useState('');
    const [saving, setSaving] = useState(false);

    const { visite: visiteParam } = route.params;

    const [isFuture, setIsFuture] = useState(false);
    const [isPast, setIsPast] = useState(false);
    // isToday est implicitement true si ni isFuture ni isPast ne sont vrais

    useEffect(() => {
        const fetchVisite = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                const response = await axios.get(
                    `https://a131-2a02-2788-1004-1df-bd68-6d3f-ef16-8362.ngrok-free.app/api/visites/${visiteParam.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setVisite(response.data);
                setCommentaireFin(response.data.commentaireFin || '');

                const visitDate = new Date(response.data.date);
                const now = new Date();

                visitDate.setHours(0, 0, 0, 0);
                now.setHours(0, 0, 0, 0);

                if (visitDate > now) {
                    setIsFuture(true);
                    setIsPast(false);
                } else if (visitDate < now) {
                    setIsFuture(false);
                    setIsPast(true);
                } else {
                    setIsFuture(false);
                    setIsPast(false);
                }

            } catch (error) {
                console.error("Erreur API :", error);
                Alert.alert("Erreur", "Impossible de charger les détails de la visite.");
            } finally {
                setLoading(false);
            }
        };

        fetchVisite();
    }, []);

    const handleTerminerVisite = async () => {
        // Ce bloc ne devrait plus être atteint si le bouton n'est pas rendu pour les visites futures
        // Mais gardons la vérification par sécurité
        if (isFuture) {
            Alert.alert("Visite future", "Vous ne pouvez pas terminer une visite qui n'a pas encore eu lieu.");
            return;
        }

        try {
            setSaving(true);
            const token = await AsyncStorage.getItem('userToken');
            await axios.put(
                `https://a131-2a02-2788-1004-1df-bd68-6d3f-ef16-8362.ngrok-free.app/api/visites/${visite.id}/commentaire-fin`,
                { commentaireFin },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            setSaving(false);
            Alert.alert(
                "Succès",
                "Visite terminée avec succès.",
                [
                    {
                        text: "OK",
                        onPress: () => navigation.navigate("BottomTabNavigator")
                    }
                ]
            );
        } catch (error) {
            setSaving(false);
            console.error("Erreur lors de la mise à jour :", error);
            Alert.alert("Erreur", "Impossible d'enregistrer le commentaire.");
        }
    };

    const navigateToPresences = () => {
        if (isFuture) {
            Alert.alert("Visite future", "Vous ne pouvez pas faire l'appel pour une visite future.");
            return;
        }
        navigation.navigate('Presences', {
            visiteId: visite.id,
            visitVisiteurs: visite.visitVisiteurs,
            visite: visite,
            isPastOrToday: !isFuture
        });
    };

    if (loading || !visite) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#003366" />
            </View>
        );
    }

    const formattedDate = new Date(visite.date).toLocaleDateString('fr-FR');
    const heureDebut = new Date(visite.heureDebut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const heureFin = new Date(visite.heureFin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const totalVisiteurs = visite.visitVisiteurs.length;

    const isCallButtonDisabled = isFuture;
    // Le bouton "Terminer la visite" est désactivé UNIQUEMENT si la visite est future.
    // Si la visite est passée ou en cours, il doit être actif.
    const isFinishButtonDisabled = isFuture;

    // Nouvelle logique pour déterminer si le bouton "Terminer la visite" doit être rendu
    const shouldShowFinishButton = !isFuture && !isPast; // Afficher seulement si la visite est en cours

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <SafeAreaView style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={{ backgroundColor: '#003366', borderRadius: 50, padding: 5, position: 'absolute', left: 20 }}
                        onPress={() => navigation.goBack()}
                    >
                        <Entypo name="chevron-left" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Description</Text>
                </View>
                <ScrollView style={{ marginTop: 10 }}>
                    {/* Image */}
                    <View style={styles.imageContainer}>
                        <ImageBackground
                            source={{ uri: visite.photo }}
                            style={styles.image}
                            imageStyle={{ borderRadius: 20 }}
                        >
                            <View style={styles.overlay}>
                                <Text style={styles.overlayTitle}>{visite.lieu}</Text>
                                <View style={styles.overlayInfo}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Entypo name="location-pin" size={16} color="white" />
                                        <Text style={styles.overlayText}>{visite.pays}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <FontAwesome5 name="clock" size={14} color="white" style={{ marginLeft: 10 }} />
                                        <Text style={styles.overlayText}>{heureDebut} - {heureFin}</Text>
                                    </View>
                                </View>
                            </View>
                        </ImageBackground>
                    </View>

                    {/* Overview */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Détails</Text>
                        <View style={styles.row}>
                            <Ionicons name="calendar-outline" size={20} color="#003366" />
                            <Text style={styles.dateText}>{formattedDate}</Text>
                            <View style={styles.attendance}>
                                <FontAwesome5 name="users" size={18} color="green" />
                                <Text style={styles.attendanceText}>{totalVisiteurs}</Text>
                            </View>
                        </View>

                        <Text style={styles.description}>{visite.commentaire}</Text>

                        <View style={{ display: 'flex', flexDirection: "row", alignItems: 'center', justifyContent: "space-between", marginTop: 10, }}>
                            <TouchableOpacity
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 6
                                }}
                            >
                                <Entypo name="map" size={18} color="#003366" />
                                <Text style={{ color: '#003366', fontWeight: '600' }}>Afficher sur la carte</Text>
                            </TouchableOpacity>

                            {/* Bouton Faire l'appel / Consulter les présences */}
                            <TouchableOpacity
                                style={[
                                    styles.callButton,
                                    isCallButtonDisabled && styles.disabledButton
                                ]}
                                onPress={navigateToPresences}
                                disabled={isCallButtonDisabled}
                            >
                                {isPast ? (
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                        <Text style={[styles.buttonText, isCallButtonDisabled && { color: "#aaa" }]}>présences</Text>
                                        <MaterialCommunityIcons name="book-open-variant" size={20} color={isCallButtonDisabled ? "#aaa" : "white"} />
                                    </View>
                                ) : (
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                        <Text style={[styles.buttonText, isCallButtonDisabled && { color: "#aaa" }]}>Faire l'appel</Text>
                                        <MaterialCommunityIcons name="book" size={20} color={isCallButtonDisabled ? "#aaa" : "white"} />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Commentaire */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Votre commentaire de fin</Text>
                        <TextInput
                            placeholder="Ajoutez un commentaire..."
                            multiline
                            value={commentaireFin}
                            onChangeText={setCommentaireFin}
                            style={[
                                styles.commentBox,
                                isFinishButtonDisabled && styles.disabledInput
                            ]}
                            placeholderTextColor="#888"
                            editable={!isFinishButtonDisabled}
                        />
                    </View>

                    {/* Bouton Terminer la visite - Rendu conditionnel */}
                    {shouldShowFinishButton && ( // Afficher seulement si la visite est en cours
                        <TouchableOpacity
                            style={[
                                styles.button,
                                isFinishButtonDisabled && styles.disabledButton // Ce style est toujours appliqué si isFuture est vrai
                            ]}
                            onPress={handleTerminerVisite}
                            disabled={saving || isFinishButtonDisabled}
                        >
                            {saving ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <>
                                    <Text style={[styles.buttonText, isFinishButtonDisabled && { color: "#aaa" }]}>Terminer la visite</Text>
                                    <MaterialCommunityIcons name="check-underline" size={20} color={isFinishButtonDisabled ? "#aaa" : "white"} style={{ marginLeft: 8 }} />
                                </>
                            )}
                        </TouchableOpacity>
                    )}
                </ScrollView>
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
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "center",
        gap: 12,
        borderBottomWidth: 1,
        borderColor: '#00336620',
    },
    headerTitle: {
        color: '#003366',
        fontSize: 18,
        fontWeight: 'bold',
    },
    imageContainer: {
        width: "100%",
        paddingHorizontal: 20
    },
    image: {
        width: '100%',
        height: 271,
        justifyContent: "flex-end",
        paddingBottom: 20,
    },
    overlay: {
        backgroundColor: '#003366',
        borderRadius: 20,
        padding: 15,
        width: wp(80),
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
        color: '#003366',
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
        marginLeft: 12,
        fontSize: 14,
        color: 'green',
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
        height: 100,
        textAlignVertical: 'top',
    },
    button: {
        flexDirection: 'row',
        backgroundColor: '#003366',
        paddingVertical: 14,
        justifyContent: 'center',
        borderRadius: 50,
        alignItems: 'center',
        alignSelf: "center",
        width: 250,
        marginBottom: 40,
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
    callButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'green',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 50,
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    disabledInput: {
        backgroundColor: '#e0e0e0',
        color: '#888',
    },
});