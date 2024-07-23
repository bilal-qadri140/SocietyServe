import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ToastAndroid,
  LogBox,
} from "react-native";
import auth from "@react-native-firebase/auth";
import { RootStackParamList } from "../../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Formik } from "formik";
import * as Yup from "yup";

// Ignore all log notifications
LogBox.ignoreAllLogs(true);

// Validation schema
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

type NavigationProps = NativeStackScreenProps<RootStackParamList>;

const Login = ({ navigation, route }: NavigationProps) => {
  const loginUser = async (email: string, password: string) => {
    try {
      // Sign in user with email and password
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password
      );
      if (userCredential) console.log("User logged in successfully!");
    } catch (error: any) {
      console.error("Error logging in user: ", error);

      // Handle different error codes
      switch (error.code) {
        case "auth/invalid-email":
          throw new Error("The email address is badly formatted.");
        case "auth/user-disabled":
          throw new Error(
            "The user account has been disabled by an administrator."
          );
        case "auth/user-not-found":
          throw new Error("There is no user corresponding to the given email.");
        case "auth/wrong-password":
          throw new Error(
            "The password is invalid or the user does not have a password."
          );
        default:
          throw new Error("An unknown error occurred.");
      }
    }
  };

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      await loginUser(values.email, values.password);
      ToastAndroid.show("User Logged in successfully", ToastAndroid.LONG);
      navigation.navigate("Home");
    } catch (error: any) {
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={(value) => {
          handleLogin(value);
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={values.email}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {touched.email && errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={values.password}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
            />
            {touched.password && errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                handleSubmit();
              }}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Register");
              }}
              activeOpacity={0.8}
              style={{marginTop:5}}
            >
              <Text>
                Don't have an account?{" "}
                <Text style={{ color: "red" }}> Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: "40%",
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 35,
    marginBottom: 24,
    textAlign: "center",
    fontWeight: "bold",
    color: "666",
  },
  input: {
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1.5,
    marginBottom: 16,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#1dbf73",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    fontSize: 14,
    color: "red",
    marginBottom: 8,
  },
});
