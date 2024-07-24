import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
  Button,
  ScrollView,
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import { RootStackParamList } from "../../App";

type NavigationProps = NativeStackScreenProps<RootStackParamList, "Message">;

const Messages = ({ navigation }: NavigationProps) => {
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const unsubscribe = firestore()
      .collection("chats")
      .onSnapshot((querySnapshot) => {
        const chats = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setChats(chats);
      });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (selectedChatId) {
      const unsubscribe = firestore()
        .collection("chats")
        .doc(selectedChatId)
        .collection("messages")
        .orderBy("createdAt", "asc")
        .onSnapshot((querySnapshot) => {
          const messages = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setMessages(messages);
        });

      return () => unsubscribe();
    }
  }, [selectedChatId]);

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedChatId) {
      firestore()
        .collection("chats")
        .doc(selectedChatId)
        .collection("messages")
        .add({
          text: newMessage,
          createdAt: firestore.FieldValue.serverTimestamp(),
          senderId: "serviceProviderId", // Adjust as needed
        });
      setNewMessage("");
    }
  };

  return (
    <View style={styles.container}>
      {selectedChatId ? (
        <View style={styles.chatContainer}>
          <Text style={styles.header}>Chat</Text>
          <ScrollView style={styles.chatBox}>
            {messages.map((message: any) => (
              <View key={message.id} style={styles.chatMessage}>
                <Text>{message.text}</Text>
              </View>
            ))}
          </ScrollView>
          <View style={styles.chatInputContainer}>
            <TextInput
              style={styles.chatInput}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Type a message"
            />
            <Button title="Send" onPress={handleSendMessage} />
          </View>
        </View>
      ) : (
        <View>
          <Text style={styles.header}>Messages</Text>
          <FlatList
            data={chats}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.chatItem}
                onPress={() => handleSelectChat(item.id)}
              >
                <Text style={styles.chatItemText}>{item.text}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  chatItem: {
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  chatItemText: {
    fontSize: 18,
  },
  chatContainer: {
    flex: 1,
  },
  chatBox: {
    flex: 1,
    padding: 10,
  },
  chatMessage: {
    padding: 10,
    backgroundColor: "#e9e9e9",
    borderRadius: 5,
    marginBottom: 10,
  },
  chatInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  chatInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
});

export default Messages;
