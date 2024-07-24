import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import firestore from "@react-native-firebase/firestore";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import auth from "@react-native-firebase/auth";
const { height } = Dimensions.get("window");
type NavigationProps = NativeStackScreenProps<RootStackParamList>;

const AllGigs = ({ navigation, route }: NavigationProps) => {
  const [gigs, setGigs] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection("gigs")
      .onSnapshot((querySnapshot) => {
        const gigsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setGigs(gigsData);
      });

    return () => unsubscribe();
  }, []);

  const renderGig = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        navigation.navigate("Request", {
          userId: Number(auth().currentUser?.uid),
          category: item.category,
          profileImage: item.profileImage,
          coverPhoto: item.coverPhoto,
          phoneNumber: item.phoneNumber,
          serviceProviderId: item.serviceProviderId,
          description: item.description,
        });
      }}
    >
      <Image source={{ uri: item.coverPhoto }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.title}>{item.category}</Text>
        <Text style={styles.price}>${item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={gigs}
      keyExtractor={(item) => item.id}
      renderItem={renderGig}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  card: {
    height: height * 0.4,
    width: "90%",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginBottom: 25,
    overflow: "hidden",
    elevation: 5,
    // marginHorizontal:10,
    alignSelf: "center",
  },
  image: {
    width: "100%",
    height: "80%",
  },
  details: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  price: {
    fontSize: 16,
    color: "green",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default AllGigs;
