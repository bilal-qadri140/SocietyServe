import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

interface GigItem {
  id: string;
  coverPhoto: string;
  profilePhoto: string;
  title: string;
  category: string;
  price: number;
  deliveryTime: number;
}

const Gig = () => {
  const [gigs, setGigs] = useState<GigItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGigs = async () => {
      const user = auth().currentUser;
      console.log({ user });

      if (user) {
        try {
          const gigDoc = await firestore()
            .collection("gigs")
            .doc(user.uid)
            .get();

          if (gigDoc.exists) {
            const gigData = gigDoc.data();

            if (gigData) {
              const userGigs = Object.keys(gigData).map((key) => ({
                id: key,
                ...gigData[key],
              })) as GigItem[];

              setGigs(userGigs);
              console.log(userGigs);
            } else {
              console.log("No gig data found.");
            }
          } else {
            console.log("No gigs found for the user.");
          }
        } catch (error) {
          console.error("Error fetching gigs: ", error);
        } finally {
          setLoading(false);
        }
      } else {
        console.log("User is not logged in");
        setLoading(false);
      }
    };

    fetchGigs();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const renderItem = ({ item }: { item: GigItem }) => (
    <View style={styles.gigContainer}>
      <Image source={{uri:item.coverPhoto}} style={styles.coverPhoto} />
      <Image source={{uri:item.profilePhoto}} style={styles.profilePhoto} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.category}>{item.category}</Text>
      <Text style={styles.price}>Price: ${item.price}</Text>
      <Text style={styles.deliveryTime}>
        Delivery Time: {item.deliveryTime} days
      </Text>
    </View>
  );

  return (
    <FlatList
      data={gigs}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
    />
  );
};

export default Gig;

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 16,
  },
  gigContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  coverPhoto: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  profilePhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  deliveryTime: {
    fontSize: 14,
    color: "#333",
  },
});
