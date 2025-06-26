import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

function getFirstDayOfMonth(dateStr) {
    // Extrait année-mois et ajoute "-01" pour le premier jour du mois
    return dateStr.slice(0, 7) + '-01';
}

export default function HomePage({ navigation }) {
    const insets = useSafeAreaInsets();
    const [visites, setVisites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [markedDates, setMarkedDates] = useState({});
    const [stats, setStats] = useState({ past: 0, upcoming: 0, ongoing: 0 });

    const today = new Date().toISOString().split('T')[0];
    const [currentMonth, setCurrentMonth] = useState(getFirstDayOfMonth(today));
    const [refreshKey, setRefreshKey] = useState(0); // clé pour forcer rerender

    useEffect(() => {
        const fetchVisites = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                if (!token) return;

                const response = await axios.get('https://a131-2a02-2788-1004-1df-bd68-6d3f-ef16-8362.ngrok-free.app/api/visites', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const data = response.data;

                const marks = {};
                let past = 0, upcoming = 0, ongoing = 0;

                data.forEach(visite => {
                    const date = visite.date.split('T')[0];
                    marks[date] = {
                        selected: true,
                        marked: true,
                        selectedColor: '#003366',
                        dotColor: '#003366'
                    };

                    if (date < today) past++;
                    else if (date > today) upcoming++;
                    else ongoing++;
                });

                // Mettre en surbrillance la date d’aujourd’hui (couleur différente)
                marks[today] = {
                    ...(marks[today] || {}),
                    selected: true,
                    selectedColor: '#00B4D8'
                };

                setVisites(data);
                setMarkedDates(marks);
                setStats({ past, upcoming, ongoing });
            } catch (error) {
                console.error("Erreur API :", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVisites();
    }, []);

    const handleDayPress = (day) => {
        const visiteDuJour = visites.find(v => v.date.startsWith(day.dateString));
        if (visiteDuJour) {
            navigation.navigate('Description', { visite: visiteDuJour });
        }
    };

    const onPressResetMonth = () => {
        // Réinitialise au mois actuel (premier jour du mois) et force rerender via refreshKey
        setCurrentMonth(getFirstDayOfMonth(today));
        setRefreshKey(prev => prev + 1);
    };

    const Stat = ({ label, value }) => (
        <View style={{ alignItems: 'center' }}>
            <Text style={{ color: '#003366', fontWeight: 'bold' }}>{value}</Text>
            <Text style={{ fontSize: 12, color: 'gray' }}>{label}</Text>
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Ionicons name="menu" size={28} color="#003366" />
                <Text style={styles.headerTitle}>Travel Paradise</Text>
                <Image source={require('../assets/logo.png')} style={styles.profileImage} />
            </View>

            <ScrollView style={{ paddingTop: 10 }}>
                {loading ? (
                    <ActivityIndicator style={{ marginTop: "70%" }} size="large" color="#003366" />
                ) : (
                    <>
                        {visites.length > 0 && (
                            <TouchableOpacity
                                style={styles.lastVisitCard}
                                onPress={() => navigation.navigate('Description', { visite: visites[0] })}
                            >
                                <View style={styles.pin}>
                                    <MaterialIcons name="push-pin" size={22} color="white" />
                                </View>
                                <Text style={styles.lastVisitTitle}>Dernière visite</Text>
                                <Text style={styles.location}>{visites[0].lieu}</Text>
                                <View style={styles.lastVisitFooter}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <MaterialIcons name="location-on" size={18} color="white" />
                                        <Text style={styles.footerText}>{visites[0].pays}</Text>
                                    </View>
                                    <Text style={styles.footerText}>{visites[0].date.split('T')[0]}</Text>
                                </View>
                            </TouchableOpacity>
                        )}

                        <View style={[styles.totalCard, { flexDirection: 'column', alignItems: 'flex-start' }]}>
                            <Text style={styles.totalLabel}>Statistiques des visites</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 10 }}>
                                <Stat label="Total" value={visites.length} />
                                <Stat label="Passées" value={stats.past} />
                                <Stat label="À venir" value={stats.upcoming} />
                                <Stat label="En cours" value={stats.ongoing} />
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                            <Text style={styles.calendarTitle}>Visites</Text>
                            <TouchableOpacity onPress={onPressResetMonth}>
                                <Text style={styles.resetText}>📅 Aujourd'hui</Text>
                            </TouchableOpacity>
                        </View>

                        <Calendar
                            key={refreshKey} // clé forcée pour forcer re-render
                            current={currentMonth}
                            markedDates={markedDates}
                            onDayPress={handleDayPress}
                            onPressArrowLeft={subtractMonth => subtractMonth()}
                            onPressArrowRight={addMonth => addMonth()}
                            theme={{
                                backgroundColor: '#ffffff',
                                calendarBackground: '#ffffff',
                                todayTextColor: '#003366',
                                dayTextColor: '#003366',
                                monthTextColor: '#003366',
                                arrowColor: '#003366',
                            }}
                            style={styles.calendar}
                        />
                    </>
                )}

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderColor: '#00336620',
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
    lastVisitCard: {
        backgroundColor: '#003366',
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        height: 150,
        justifyContent: "space-between"
    },
    pin: {
        position: 'absolute',
        marginTop: 9,
        marginLeft: 16,
        backgroundColor: "#0A436D",
        width: 35,
        height: 35,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 30
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
    totalCard: {
        backgroundColor: '#F0F0F0',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    totalLabel: {
        color: '#003366',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10
    },
    resetText: {
        textAlign: 'center',
        color: '#003366',
        marginTop: 5,
        fontSize: 14,
        marginBottom: 5,
    },
    calendarTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#003366',
        marginTop: 10,
        marginBottom: 15,
        marginLeft: 16,
    },
    calendar: {
        borderRadius: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginBottom: 16,
    },
});
