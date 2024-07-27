import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import ModalDropdown from "react-native-modal-dropdown";

const Post = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [problemTitle, setProblemTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const categories = [
    "Plumbing",
    "Motor Mechanics",
    "Construction Labour",
    "Janitor",
    "Carpenter",
    "Interior Painter",
    "Laundry Service",
  ];

  const postJob = () => {
    // Implement post job functionality here
    console.log("Posting job with the following details:", {
      title,
      category,
      problemTitle,
      description,
      price,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Post a Job</Text>

      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />

      <ModalDropdown
        options={categories}
        defaultValue="Select Category"
        style={styles.dropdown}
        defaultIndex={0}
        textStyle={styles.dropdownText}
        dropdownStyle={styles.dropdownStyle}
        onSelect={(index, value) => setCategory(value)}
        showsVerticalScrollIndicator={false}
      />

      <TextInput
        style={styles.input}
        placeholder="Problem Title"
        value={problemTitle}
        onChangeText={setProblemTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TextInput
        style={styles.input}
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={postJob}
        activeOpacity={0.5}
      >
        <Text style={styles.buttonText}>Post</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Post;

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
  },
  dropdownStyle: {
    height: 200,
    width:'85%'
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
