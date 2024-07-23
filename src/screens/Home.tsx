import React from "react";
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
} from "react-native";
import { RootStackParamList } from "../../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/FontAwesome";
import auth from "@react-native-firebase/auth";

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

  console.log(auth().currentUser)


  const handleCreateGig = () => {
    if (auth().currentUser) {
      navigation.navigate("Add");
    } else {
      Alert.alert("Not Logged in", "Please login before creating new Gig!");
      navigation.navigate("Login");
    }
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
            style={styles.loginButton}
            onPress={() => {
              navigation.navigate("Gig");
            }}
          >
            <Text style={styles.buttonText}>Join</Text>
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
        data={DATA}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} activeOpacity={0.8}>
            <Image source={item.image} style={styles.cardImage} />
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
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
        <TouchableOpacity
          style={[styles.professionalButton, { marginTop: 10 }]}
          onPress={async () => {
            await auth().signOut().then(() => {
              ToastAndroid.show('Signs Out',ToastAndroid.LONG)
            })
          }}
        >
          <Text style={styles.professionalButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <View style={styles.categorySection}>
          <Text style={styles.category}>Plumbing</Text>
          <Text style={styles.category}>Electrician</Text>
          <Text style={styles.category}>Loader</Text>
          {/* Add more categories as needed */}
        </View>
        <View style={styles.socialLinks}>
          <Text style={styles.socialLink}>Facebook</Text>
          <Text style={styles.socialLink}>Twitter</Text>
          <Text style={styles.socialLink}>Instagram</Text>
          {/* Add more social links as needed */}
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
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  loginButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1dbf73",
    borderRadius: 16,
    width: 88,
    height: 48,
  },
  buttonText: {
    color: "#fff",
    fontSize: 24,
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
    padding: 20,
    backgroundColor: "#4a90e2",
  },
  categorySection: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  category: {
    fontSize: 16,
    color: "#fff",
  },
  socialLinks: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  socialLink: {
    fontSize: 16,
    color: "#fff",
  },
});
