import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ToastAndroid,
} from "react-native";
import ImagePicker from "react-native-image-crop-picker";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { RootStackParamList } from "../../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Formik } from "formik";
import * as Yup from "yup";

// Validation schema
const validationSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  country: Yup.string().required("Country is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  description: Yup.string().required("Description is required"),
});

type NavigationProps = NativeStackScreenProps<RootStackParamList>;

const Register = ({ navigation, route }: NavigationProps) => {
  const [profilePicture, setProfilePicture] = useState<any>();
  const [isSeller, setIsSeller] = useState(false);

  const registerUser = async (values: any) => {
    const {
      username,
      email,
      password,
      country,
      phoneNumber,
      description,
      photoURL,
    } = values;
    try {
      // Create user with email and password
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password
      );
      if (!userCredential) {
        ToastAndroid.show("User not created", ToastAndroid.LONG);
        navigation.navigate("Register");
      } else {
        const { uid } = userCredential.user;
        // Save additional user info in Firestore
        await firestore().collection("users").doc(uid).set({
          username,
          email,
          country,
          description,
          phoneNumber,
          photoURL,
        });
        console.log("User registered successfully!");
        ToastAndroid.show("User created Successfully", ToastAndroid.LONG);
        navigation.navigate("Login");
      }
    } catch (error: any) {
      console.error("Error registering user: ", error);
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
  };
 const pickImage = (setImage: any) => {
   ImagePicker.openPicker({
     width: 300,
     height: 400,
     cropping: true,
   })
     .then((image) => {
       setImage(image.path);
     })
     .catch((error) => {
       console.log("Error picking image: ", error);
     });
 };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register</Text>
      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
          country: "",
          phoneNumber: "",
          description: "",
          photoUrl: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => registerUser(values)}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          setFieldValue,
        }) => (
          <View>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="grey"
              value={values.username}
              onChangeText={handleChange("username")}
              onBlur={handleBlur("username")}
            />
            {touched.username && errors.username && (
              <Text style={styles.errorText}>{errors.username}</Text>
            )}
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="grey"
              keyboardType="email-address"
              value={values.email}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
            />
            {touched.email && errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="grey"
              secureTextEntry
              value={values.password}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
            />
            {touched.password && errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
            <TextInput
              style={styles.input}
              placeholder="Country"
              placeholderTextColor="grey"
              value={values.country}
              onChangeText={handleChange("country")}
              onBlur={handleBlur("country")}
            />
            {touched.country && errors.country && (
              <Text style={styles.errorText}>{errors.country}</Text>
            )}
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor="grey"
              keyboardType="phone-pad"
              value={values.phoneNumber}
              onChangeText={handleChange("phoneNumber")}
              onBlur={handleBlur("phoneNumber")}
            />
            {touched.phoneNumber && errors.phoneNumber && (
              <Text style={styles.errorText}>{errors.phoneNumber}</Text>
            )}
            <TextInput
              style={styles.input}
              placeholder="Description"
              placeholderTextColor="grey"
              multiline
              numberOfLines={4}
              value={values.description}
              onChangeText={handleChange("description")}
              onBlur={handleBlur("description")}
            />
            {touched.description && errors.description && (
              <Text style={styles.errorText}>{errors.description}</Text>
            )}
            <View style={styles.radioContainer}>
              <TouchableOpacity
                style={styles.radioButton}
                onPress={() => setIsSeller(!isSeller)}
              >
                {isSeller && <View style={styles.radioButtonSelected} />}
              </TouchableOpacity>
              <Text style={styles.radioText}>Activate the seller account</Text>
            </View>
            <TouchableOpacity
              style={styles.fileButton}
              onPress={() =>
                pickImage((path: any) => setFieldValue("coverPhoto", path))
              }
            >
              <Text style={styles.fileButtonText}>Choose Profile Picture</Text>
            </TouchableOpacity>
            {profilePicture && (
              <Image
                source={{ uri: profilePicture }}
                style={styles.profileImage}
              />
            )}
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit as any}
            >
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: "10%",
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 35,
    marginBottom: 24,
    textAlign: "center",
    fontWeight: "bold",
    color: "#666",
  },
  input: {
    height: 40,
    borderColor: "#1dbf73",
    borderWidth: 1.5,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#007BFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  radioButtonSelected: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: "#007BFF",
  },
  radioText: {
    fontSize: 16,
  },
  fileButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 16,
  },
  fileButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#1dbf73",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  errorText: {
    fontSize: 14,
    color: "red",
    marginBottom: 8,
  },
});
