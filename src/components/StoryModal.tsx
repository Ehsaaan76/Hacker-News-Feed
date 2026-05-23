import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { Story } from '../types';

interface Props {
  story: Story | null;
  onClose: () => void;
}

export const StoryModal = ({ story, onClose }: Props) => {
  return (
    <Modal
      visible={!!story}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-white" style={styles.safeArea}>
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
          <Text className="flex-1 text-base font-bold text-gray-900 mr-3" numberOfLines={1}>
            {story?.title}
          </Text>
          <TouchableOpacity
            onPress={onClose}
            className="p-2 bg-gray-100 rounded-full"
          >
            <X size={18} color="#374151" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1" contentContainerStyle={styles.content}>
          <Text className="text-base leading-7 text-gray-700">
            {story?.story_text?.replace(/<[^>]+>/g, '') ?? ''}
          </Text>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 48,
  },
});