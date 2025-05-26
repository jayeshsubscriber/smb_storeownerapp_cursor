import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS, FONT, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { Store, User, Bell, Share2, CircleHelp as HelpCircle, LogOut, ChevronRight } from 'lucide-react-native';

export default function SettingsScreen() {
  const settingsItems = [
    {
      id: 'store',
      title: 'Store Settings',
      icon: Store,
      iconBg: COLORS.primary,
    },
    {
      id: 'profile',
      title: 'Profile',
      icon: User,
      iconBg: COLORS.accent,
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      iconBg: COLORS.warning,
    },
    {
      id: 'share',
      title: 'Share Your Store',
      icon: Share2,
      iconBg: COLORS.success,
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: HelpCircle,
      iconBg: COLORS.primaryLight,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.settingsGroup}>
          {settingsItems.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.settingItem}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: item.iconBg }]}>
                <item.icon size={20} color={COLORS.background} />
              </View>
              
              <Text style={styles.settingTitle}>{item.title}</Text>
              
              <ChevronRight size={20} color={COLORS.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>
        
        <TouchableOpacity style={styles.logoutButton} activeOpacity={0.7}>
          <View style={[styles.iconContainer, { backgroundColor: COLORS.errorLight }]}>
            <LogOut size={20} color={COLORS.error} />
          </View>
          
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxl * 1.5,
    paddingBottom: SPACING.lg,
    backgroundColor: COLORS.background,
  },
  title: {
    fontFamily: FONT.bold,
    fontSize: FONT.size.xxl,
    color: COLORS.text,
  },
  scrollContainer: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xxl,
  },
  settingsGroup: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  settingTitle: {
    flex: 1,
    fontFamily: FONT.medium,
    fontSize: FONT.size.md,
    color: COLORS.text,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  logoutText: {
    fontFamily: FONT.medium,
    fontSize: FONT.size.md,
    color: COLORS.error,
  },
  versionText: {
    fontFamily: FONT.regular,
    fontSize: FONT.size.sm,
    color: COLORS.textTertiary,
    textAlign: 'center',
  },
});