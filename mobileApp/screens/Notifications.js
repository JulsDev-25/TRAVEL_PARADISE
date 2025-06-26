import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Image } from 'react-native-svg';
import { StatusBar } from 'expo-status-bar';

const Notifications = () => {
    return (
        <View style={{ flex: 1, padding: 20, backgroundColor: '#f0f0f0' }}>
            <StatusBar style="dark" />

            <View style={styles.header}>
                <Ionicons name="menu" size={28} color="#003366" />
                <Text style={styles.headerTitle}>Travel Paradise</Text>
                <Image
                    source={require('../assets/logo.png')}
                    style={styles.profileImage}
                />
            </View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, color: '#333' }}>Fonctionnalité bientôt disonbile...</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
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
})

export default Notifications;
