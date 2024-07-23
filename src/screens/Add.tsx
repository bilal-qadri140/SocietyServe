import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import ImagePicker from "react-native-image-crop-picker";
import ModalDropdown from "react-native-modal-dropdown";
import { Formik } from "formik";
import * as Yup from "yup";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { RootStackParamList } from "../../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
// Validation schema
const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  category: Yup.string().required("Category is required"),
  service: Yup.string().required("Service title is required"),
  description: Yup.string().required("Description is required"),
  deliveryTime: Yup.string().required("Delivery time is required"),
  features: Yup.string().required("Features are required"),
  price: Yup.number()
    .typeError("Price must be a number")
    .positive("Price must be a positive number")
    .required("Price is required"),
  // coverPhoto: Yup.string().required("Cover photo is required"),
  // profileImage: Yup.string().required("Profile image is required"),
});

type ValueType = {
  title: string;
  category: string;
  service: string;
  description: string;
  deliveryTime: string;
  features: string;
  price: string;
  coverPhoto: string;
  profileImage: string;
};

type NavigationProps = NativeStackScreenProps<RootStackParamList>;

const Add = ({ navigation, route }: NavigationProps) => {
  const categories = [
    "Plumbing",
    "Motor Mechanics",
    "Construction Labour",
    "Janitor",
    "Carpenter",
    "Interior Painter",
    "Laundry Service",
  ];

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

  const handleFeaturesChange = (text: string, setFieldValue: any) => {
    const featuresArray = text
      .split(",")
      .map((item) => item.trim())
      .slice(0, 3);
    setFieldValue("features", featuresArray.join(", "));
  };

  const createGig = async (values: ValueType) => {
    // Implement create gig functionality here
    console.log(values);
    // ToastAndroid.show("Gig created successfully!", ToastAndroid.LONG);
    const uid = auth().currentUser?.uid;
    console.log({ uid });
    await firestore()
      .collection("gigs")
      .doc(uid)
      .set({
        values,
      })
      .then(async () => {
        console.log("Data inserted!");
        const user = await firestore().collection("gigs").doc(uid).get();
        console.log("User: ", user.data());
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Add New Gig</Text>

      <Formik
        initialValues={{
          title: "",
          category: "",
          service: "",
          description: "",
          deliveryTime: "",
          features: "",
          price: "",
          coverPhoto: "",
          profileImage: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => createGig(values)}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          values,
          errors,
          touched,
        }) => (
          <View>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={values.title}
              onChangeText={handleChange("title")}
              onBlur={handleBlur("title")}
            />
            {touched.title && errors.title && (
              <Text style={styles.errorText}>{errors.title}</Text>
            )}

            <ModalDropdown
              options={categories}
              defaultValue="Select Category"
              style={styles.dropdown}
              defaultIndex={0}
              textStyle={styles.dropdownText}
              dropdownStyle={styles.dropdownStyle}
              onSelect={(index, value) => {
                setFieldValue("category", value);
              }}
              showsVerticalScrollIndicator={false}
            />
            {touched.category && errors.category && (
              <Text style={styles.errorText}>{errors.category}</Text>
            )}

            <TouchableOpacity
              onPress={() =>
                pickImage((path: any) => setFieldValue("coverPhoto", path))
              }
              style={styles.imagePicker}
            >
              <Text>Choose Cover Photo</Text>
              {values.coverPhoto && <Text>{values.coverPhoto}</Text>}
            </TouchableOpacity>
            {touched.coverPhoto && errors.coverPhoto && (
              <Text style={styles.errorText}>{errors.coverPhoto}</Text>
            )}

            <TouchableOpacity
              onPress={() =>
                pickImage((path: any) => setFieldValue("profileImage", path))
              }
              style={styles.imagePicker}
            >
              <Text>Choose Profile Image</Text>
              {values.profileImage && <Text>{values.profileImage}</Text>}
            </TouchableOpacity>
            {touched.profileImage && errors.profileImage && (
              <Text style={styles.errorText}>{errors.profileImage}</Text>
            )}

            <TextInput
              style={styles.input}
              placeholder="Service Title"
              value={values.service}
              onChangeText={handleChange("service")}
              onBlur={handleBlur("service")}
            />
            {touched.service && errors.service && (
              <Text style={styles.errorText}>{errors.service}</Text>
            )}

            <TextInput
              style={[styles.input, { height: 100 }]}
              placeholder="Description"
              value={values.description}
              onChangeText={handleChange("description")}
              onBlur={handleBlur("description")}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            {touched.description && errors.description && (
              <Text style={styles.errorText}>{errors.description}</Text>
            )}

            <TextInput
              style={styles.input}
              placeholder="Delivery Time (e.g. 3 days)"
              value={values.deliveryTime}
              onChangeText={handleChange("deliveryTime")}
              onBlur={handleBlur("deliveryTime")}
            />
            {touched.deliveryTime && errors.deliveryTime && (
              <Text style={styles.errorText}>{errors.deliveryTime}</Text>
            )}

            <TextInput
              style={styles.input}
              placeholder="Features (comma separated, up to 3)"
              value={values.features}
              onChangeText={(text) => handleFeaturesChange(text, setFieldValue)}
              onBlur={handleBlur("features")}
            />
            {touched.features && errors.features && (
              <Text style={styles.errorText}>{errors.features}</Text>
            )}

            <TextInput
              style={styles.input}
              placeholder="Price"
              value={values.price}
              onChangeText={handleChange("price")}
              onBlur={handleBlur("price")}
              keyboardType="numeric"
            />
            {touched.price && errors.price && (
              <Text style={styles.errorText}>{errors.price}</Text>
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                // handleSubmit();
                navigation.navigate('DrawerNavigation')
              }}
            >
              <Text style={styles.buttonText}>Create</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

export default Add;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  dropdown: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    justifyContent: "center",
    paddingLeft: 10,
  },
  dropdownText: {
    fontSize: 16,
    color: "grey",
  },
  dropdownStyle: {
    height: 150,
    width: "85%",
    borderWidth: 2,
    borderColor: "grey",
    fontSize: 18,
    color: "red",
    borderRadius: 8,
  },
  imagePicker: {
    alignItems: "center",
    justifyContent: "center",
    borderColor: "gray",
    borderWidth: 1,
    height: 50,
    marginBottom: 10,
    backgroundColor: "#f5f",
  },
  button: {
    backgroundColor: "#1dbf73",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 50,
  },
  buttonText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  errorText: {
    fontSize: 14,
    color: "red",
    marginBottom: 8,
  },
});
