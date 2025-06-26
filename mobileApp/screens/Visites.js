import React, { useEffect, useState } from 'react';
import {
    View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator
} from 'react-native';
import { Ionicons, FontAwesome5, Entypo } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const { width, height } = Dimensions.get('window');
const wp = (percentage) => (width * percentage) / 100;
const hp = (percentage) => (height * percentage) / 100;

export default function Visites({ navigation }) {
    const [visites, setVisites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVisites = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                const response = await axios.get('https://a131-2a02-2788-1004-1df-bd68-6d3f-ef16-8362.ngrok-free.app/api/visites', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });

                const data = response.data;

                // Tri décroissant par date
                const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setVisites(sorted);
            } catch (err) {
                console.error('Erreur lors du chargement des visites :', err);
            } finally {
                setLoading(false);
            }
        };

        fetchVisites();
    }, []);

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Ionicons name="menu" size={28} color="#003366" />
                    <Text style={styles.headerTitle}>Travel Paradise</Text>
                    <Image
                        source={require('../assets/logo.png')}
                        style={styles.profileImage}
                    />
                </View>

                {loading ? (
                    <ActivityIndicator  size="large" color="#003366" style={{ marginTop: "70%" }} />
                ) : (
                    <ScrollView>
                        {visites.map((visite) => (
                            <TouchableOpacity
                                key={visite.id}
                                style={styles.imageContainer}
                                onPress={() => navigation.navigate('Description', { visite })}
                            >
                                <ImageBackground
                                    source={{ uri: visite.photo }}
                                    resizeMode="cover"
                                    style={styles.image}
                                    imageStyle={{ borderRadius: 20 }}
                                >
                                    <View style={styles.overlay}>
                                        <Text style={styles.overlayTitle}>{visite.lieu}</Text>
                                        <View style={styles.overlayInfo}>
                                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                <Entypo name="location-pin" size={16} color="white" />
                                                <Text style={styles.overlayText}>{visite.pays}</Text>
                                            </View>
                                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                <FontAwesome5 name="clock" size={14} color="white" style={{ marginLeft: 10 }} />
                                                <Text style={styles.overlayText}>
                                                    {new Date(visite.heureDebut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(visite.heureFin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </ImageBackground>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#003366',
    },
    profileImage: {
        width: 36,
        height: 36,
        borderRadius: 20,
    },
    imageContainer: {
        position: 'relative',
        width: "100%",
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    image: {
        width: '100%',
        height: 140,
        justifyContent: "flex-end",
    },
    overlay: {
        backgroundColor: '#003366BB',
        borderRadius: 20,
        padding: 15,
        flex: 1,
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
});
