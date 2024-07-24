import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  ToastAndroid,
  Linking,
} from "react-native";
import { RootStackParamList } from "../../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/FontAwesome";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";
type NavigationProps = NativeStackScreenProps<RootStackParamList>;

const DATA = [
  {
    id: "1",
    image: require("../assets/images/plumber.jpg"),
    title: "Plumber",
    subtitle: "Fix your leaks",
    price: "$30/hr",
  },
  {
    id: "2",
    image: require("../assets/images/electrician.jpg"),
    title: "Electrician",
    subtitle: "Electrical repairs",
    price: "$25/hr",
  },
  {
    id: "3",
    image: require("../assets/images/barber.jpg"),
    title: "Barber",
    subtitle:
      "Hair cutting Hair cutting Hair cutting Hair cutting Hair cutting",
    price: "$10/hr",
  },
];

const Home = ({ navigation, route }: NavigationProps) => {
  const [gigData, setGigData] = useState<any>();
  const [serviceProviderId, setServiceProviderId] = useState<number>(0);

  console.log(auth().currentUser);

  const handleCreateGig = () => {
    if (auth().currentUser) {
      navigation.navigate("Add");
    } else {
      Alert.alert("Not Logged in", "Please login before creating new Gig!");
      navigation.navigate("Login");
    }
  };

  const fetchGigs = async () => {
    const gigsSnapshot = (await firestore().collection("gigs").get()).docs;
    const gigs: { id: string }[] = [];
    gigsSnapshot.forEach((doc) => {
      gigs.push({ id: doc.id, ...doc.data() });
    });
    console.log(gigs);
    setServiceProviderId(Number(gigs[0].id));
    setGigData(gigs);
  };
  const truncateText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  useFocusEffect(
    useCallback(() => {
      fetchGigs();
      console.log("data after: ", gigData);
    }, [])
  );

  useEffect(() => {}, []);

  const handlePress = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {/* <Text style={styles.companyName}>SocietyServe</Text> */}
        <Image
          style={{ width: 50, height: 50, borderRadius: 25 }}
          source={require("../assets/images/applogo.jpg")}
        />
        <View style={styles.loginButtonContainer}>
          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.loginButton}
            onPress={() => {
              navigation.navigate("Login");
            }}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            style={[
              styles.loginButton,
              {
                backgroundColor: "#fff",
                borderColor: "#1dbf73",
                borderWidth: 1.5,
              },
            ]}
            onPress={() => {
              navigation.navigate("Register");
            }}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color: "#1dbf73",
                },
              ]}
            >
              Join
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.heading}>
        Find the best professional services for your
        <Text style={{ color: "red" }}> Home</Text>
        <Text style={{ color: "#1dbf73" }}>.</Text>
      </Text>
      <View style={styles.searchBarContainer}>
        <TextInput style={styles.searchBar} placeholder="Search services..." />
        <TouchableOpacity style={styles.searchIcon}>
          <Icon name="search" size={22} color="#000" />
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={gigData}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
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
            <Image source={{ uri: item.coverPhoto }} style={styles.cardImage} />
            <Text style={styles.cardTitle}>{item.category}</Text>
            <Text style={styles.cardSubtitle}>
              {truncateText(item.description, 20)}
            </Text>
            <Text style={[styles.cardPrice, { color: "#1dbf73" }]}>
              {item.price}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        style={styles.cardList}
      />

      <View style={styles.professionalSection}>
        <Text style={styles.professionalHeading}>
          Are you a <Text style={{ color: "red" }}> Working</Text> Professional
          of any <Text style={{ color: "#1dbf73" }}> Profession</Text>
          <Text style={{ color: "#1dbf73" }}>?</Text>
        </Text>
        <Text style={styles.professionalSubheading}>
          Join our platform and connect with clients looking for your services.
        </Text>
        <TouchableOpacity
          style={styles.professionalButton}
          onPress={handleCreateGig}
        >
          <Text style={styles.professionalButtonText}>
            Create your Professional account now
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <View style={styles.socialLinks}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 5 }}>
            Contact us.
          </Text>
          <TouchableOpacity
            onPress={() =>
              handlePress("https://www.facebook.com/bilalqadri.bilalqadri.77")
            }
          >
            <Text style={styles.socialLink}>Facebook</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handlePress("https://www.twitter.com")}
          >
            <Text style={styles.socialLink}>Twitter</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handlePress("https://www.instagram.com")}
          >
            <Text style={styles.socialLink}>Instagram</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.categorySection}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 5 }}>
            Categories
          </Text>
          <Text style={styles.category}>Plumbing</Text>
          <Text style={styles.category}>Electrician</Text>
          <Text style={styles.category}>Loader</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f7",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  companyName: {
    fontSize: 24,
    color: "#000",
    fontWeight: "bold",
    textAlign: "center",
    textAlignVertical: "center",
  },
  loginButtonContainer: {
    width: "55%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    // backgroundColor:'red'
  },
  loginButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1dbf73",
    borderRadius: 16,
    width: 88,
    height: 40,
    marginHorizontal: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 24,
    textAlign: "center",
  },
  heading: {
    fontSize: 24,
    lineHeight: 40,
    fontWeight: "bold",
    margin: 20,
    color: "#333333",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    margin: 20,
    backgroundColor: "#fff",
    elevation: 3,
  },
  searchBar: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    width: 70,
  },
  searchIcon: {
    padding: 10,
    backgroundColor: "#e0e0e0",
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  cardList: {
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginRight: 10,
    width: 220,
    height: "auto",
    padding: 10,
    // alignItems: "center",
  },
  cardImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    color: "#333",
    marginLeft: 5,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
    marginLeft: 5,
    marginBottom: 15,
  },
  cardPrice: {
    fontSize: 18,
    color: "#000",
    marginTop: 10,
    fontWeight: "bold",
    marginLeft: 5,
    position: "absolute",
    bottom: 5,
    left: "45%",
  },
  professionalSection: {
    padding: 20,
    alignItems: "center",
  },
  professionalHeading: {
    fontSize: 22,
    lineHeight: 40,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  professionalSubheading: {
    fontSize: 22,
    color: "#666",
    marginBottom: 20,
    // textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 40,
  },
  professionalButton: {
    backgroundColor: "#1dbf73",
    borderRadius: 5,
    width: "85%",
    paddingVertical: 10,
    alignItems: "center",
    paddingHorizontal: 3,
  },
  professionalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#1dbf73",
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  categorySection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  category: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "bold",
    color: "#fff",
  },
  socialLinks: {
    flex: 1,
    justifyContent: "center",
    borderRightWidth: 1.5,
  },
  socialLink: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 10,
    fontWeight: "bold",
  },
});
