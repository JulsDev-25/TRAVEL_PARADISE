import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function HomePage({navigation}) {
    const insets = useSafeAreaInsets();

    return (
        <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <Ionicons name="menu" size={28} color="#00224D" />
                <Text style={styles.headerTitle}>Travel Paradise</Text>
                <Image
                    source={require('../assets/logo.png')} // image de profil fictive
                    style={styles.profileImage}
                />
            </View>

            {/* Dernière visite */}
            <TouchableOpacity 
                style={styles.lastVisitCard}
                onPress={() => navigation.navigate('Description')}
            >
                <View style={{ position: 'absolute', marginTop: 9, marginLeft: 16, backgroundColor: "#0A436D", width: 35, height: 35, alignItems: "center", justifyContent: "center", borderRadius: 30 }}>
                    <MaterialIcons name="push-pin" size={22} color="white" />
                </View>
                <Text style={styles.lastVisitTitle}>Dernière visite</Text>
                <Text style={styles.location}>Visite du mont Cameroun</Text>
                <View style={styles.lastVisitFooter}>
                    <View style={{ flexDirection: 'row' }}>
                        <MaterialIcons name="location-on" size={18} color="white" />
                        <Text style={styles.footerText}>Gembloux</Text>
                    </View>
                    <Text style={styles.footerText}>Last-week</Text>
                </View>
            </TouchableOpacity>

            {/* Total visite */}
            <View style={styles.totalCard}>
                <View>
                    <Text style={styles.totalLabel}>Total visite</Text>
                    <Text style={styles.totalSubLabel}>Last-month</Text>
                </View>
                <View style={styles.totalCount}>
                    <Text style={styles.totalCountText}>9</Text>
                </View>
            </View>

            {/* Calendrier */}
            <Text style={styles.calendarTitle}>Visites</Text>
            <Calendar
                current={'2025-05-01'}
                markedDates={{
                    '2025-05-10': { selected: true, marked: true, selectedColor: '#041562' },
                    '2025-05-13': { selected: true, marked: true, selectedColor: '#00B4D8' },
                    '2025-05-22': { selected: true, marked: true, selectedColor: '#041562' },
                    '2025-05-26': { selected: true, marked: true, selectedColor: '#041562' },
                }}
                theme={{
                    backgroundColor: '#ffffff',
                    calendarBackground: '#ffffff',
                    todayTextColor: '#00224D',
                    dayTextColor: '#00224D',
                    monthTextColor: '#00224D',
                    arrowColor: '#00224D',
                }}
                style={styles.calendar}
            />

            {/* Bottom padding */}
            <View style={{ height: 40 }} />
        </ScrollView>
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
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#00224D',
    },
    profileImage: {
        width: 36,
        height: 36,
        borderRadius: 20,
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
    totalCard: {
        backgroundColor: '#F0F0F0',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: {
        color: '#00224D',
        fontSize: 15,
        fontWeight: 'bold',
    },
    totalSubLabel: {
        color: 'gray',
        fontSize: 12,
        marginTop: 15
    },
    totalCount: {
        backgroundColor: '#00224D',
        borderRadius: 20,
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    totalCountText: {
        color: 'white',
        fontWeight: 'bold',
    },
    calendarTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#00224D',
        marginTop: 15,
        marginBottom: 15,
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
