import React from "react";
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
import storage from "@react-native-firebase/storage"; 
import { RootStackParamList } from "../../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

// Validation schema
const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  category: Yup.string().required("Category is required"),
  description: Yup.string().required("Description is required"),
  deliveryTime: Yup.string().required("Delivery time is required"),
  features: Yup.string().required("Features are required"),
  price: Yup.number()
    .typeError("Price must be a number")
    .positive("Price must be a positive number")
    .required("Price is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
});

type ValueType = {
  title: string;
  category: string;
  description: string;
  deliveryTime: string;
  features: string;
  price: string;
  coverPhoto: string;
  profileImage: string;
  phoneNumber: string;
};

type NavigationProps = NativeStackScreenProps<RootStackParamList>;

const Add = ({ navigation }: NavigationProps) => {
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

  const uploadImage = async (path: string, name: string) => {
    try {
      const reference = storage().ref(name);
      await reference.putFile(path);
      const url = await reference.getDownloadURL();
      return url;
    } catch (error) {
      console.error("Error uploading image: ", error);
      throw error;
    }
  };

  const createGig = async (values: ValueType) => {
    try {
      // Upload images to Firebase Storage and get URLs
      const coverPhotoUrl = await uploadImage(
        values.coverPhoto,
        `coverPhotos/${Date.now()}`
      );
      const profileImageUrl = await uploadImage(
        values.profileImage,
        `profileImages/${Date.now()}`
      );

      // Get current user ID
      const uid = auth().currentUser?.uid;

      // Create gig data with image URLs
      const data = {
        ...values,
        coverPhoto: coverPhotoUrl,
        profileImage: profileImageUrl,
        createdBy: uid,
      };

      // Add gig data to Firestore
      await firestore()
        .collection("gigs")
        .add(data)
        .then(() => {
          ToastAndroid.show("Gig created successfully", ToastAndroid.LONG);
          navigation.navigate("Home");
        });
    } catch (error) {
      console.error("Error creating gig: ", error);
      ToastAndroid.show("Failed to create gig", ToastAndroid.LONG);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Add New Gig</Text>

      <Formik
        initialValues={{
          title: "",
          category: "",
          description: "",
          deliveryTime: "",
          features: "",
          price: "",
          coverPhoto: "",
          profileImage: "",
          phoneNumber: "",
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
              placeholder="Service Title"
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
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={values.phoneNumber}
              onChangeText={handleChange("phoneNumber")}
              onBlur={handleBlur("phoneNumber")}
              keyboardType="numeric"
            />
            {touched.phoneNumber && errors.phoneNumber && (
              <Text style={styles.errorText}>{errors.phoneNumber}</Text>
            )}

            <TouchableOpacity
              onPress={() =>
                pickImage((path: any) => setFieldValue("coverPhoto", path))
              }
              style={styles.imagePicker}
            >
              <Text
                style={{
                  color: "#1dbf73",
                  fontWeight: "bold",
                }}
              >
                {values.coverPhoto ? "Selected" : "Choose Cover Photo"}
              </Text>
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
              <Text
                style={{
                  color: "#1dbf73",
                  fontWeight: "bold",
                }}
              >
                {values.profileImage ? "Selected" : "Choose Profile Image"}
              </Text>
            </TouchableOpacity>

            {touched.profileImage && errors.profileImage && (
              <Text style={styles.errorText}>{errors.profileImage}</Text>
            )}
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSubmit()}
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
    borderColor: "#1dbf73",
    borderWidth: 1.5,
    marginBottom: 10,
    padding: 10,
    borderRadius: 4,
  },
  dropdown: {
    height: 40,
    borderColor: "#1dbf73",
    borderWidth: 1.5,
    marginBottom: 10,
    justifyContent: "center",
    paddingLeft: 10,
    borderRadius: 4,
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
    borderColor: "#1dbf73",
    borderWidth: 1.5,
    height: 50,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 15,
  },
  button: {
    backgroundColor: "#1dbf73",
    padding: 10,
    alignItems: "center",
    borderRadius: 15,
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
