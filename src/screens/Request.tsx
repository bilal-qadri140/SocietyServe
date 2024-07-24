import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Button,
  Linking,
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import { RootStackParamList } from "../../App";

type NavigationProps = NativeStackScreenProps<RootStackParamList, "Request">;

const Request = ({ navigation, route }: NavigationProps) => {
  const {
    userId,
    serviceProviderId,
    category,
    coverPhoto,
    phoneNumber,
    profileImage,
    description
  } = route.params;
  const chatId = `${userId}_${serviceProviderId}`;
  const [chatExpanded, setChatExpanded] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const unsubscribe = firestore()
      .collection("chats")
      .doc(chatId)
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
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      firestore().collection("chats").doc(chatId).collection("messages").add({
        text: newMessage,
        createdAt: firestore.FieldValue.serverTimestamp(),
        senderId: userId,
      });
      setNewMessage("");
    }
  };

  const handleCallNow = () => {
    Linking.openURL(`tel:+92${phoneNumber}`); // Replace with the actual phone number
  };

  return (
    <View style={styles.container}>
      <View style={{ }}>
        <Image
          style={{ width: "100%", height: 260 }}
          source={{ uri: profileImage }}
        />
      </View>
      <View style={[styles.profileSection,{position:'absolute',left:'30%',top:'13.5%'}]}>
        <Image style={styles.profileImage} source={{ uri: coverPhoto }} />
      </View>
        <Text style={styles.category}>{category}</Text>
        <Text style={{fontSize:18, marginHorizontal:8}}>{description}</Text>
      <TouchableOpacity
        style={styles.bookButton}
        onPress={() => navigation.navigate("Payment")}
      >
        <Text style={styles.bookButtonText}>Book Now</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.callButton} onPress={handleCallNow}>
        <Text style={styles.callButtonText}>Call Now</Text>
      </TouchableOpacity>
      <View style={styles.chatContainer}>
        <TouchableOpacity
          style={styles.chatHeader}
          onPress={() => setChatExpanded(!chatExpanded)}
        >
          <Text style={styles.chatHeaderText}>Chat</Text>
        </TouchableOpacity>
        {chatExpanded && (
          <View style={styles.chatBox}>
            <ScrollView style={styles.chatMessages}>
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
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 20,
    backgroundColor: "#fff",
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  category: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: 'center',
    marginTop:5
  },
  bookButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
    marginTop:70
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  callButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  callButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  chatContainer: {
    flex: 1,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  chatHeader: {
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  chatHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  chatBox: {
    flex: 1,
  },
  chatMessages: {
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

export default Request;
