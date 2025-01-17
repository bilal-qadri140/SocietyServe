import { Linking, StyleSheet } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./src/screens/Home";
import AllGig from "./src/screens/AllGig";
import Gig from "./src/screens/Gig";
import Order from "./src/screens/Order";
import MyGig from "./src/screens/MyGig";
import Add from "./src/screens/Add";
import Message from "./src/screens/Message";
import Request from "./src/screens/Request";
import Post from "./src/screens/Post";
import Login from "./src/screens/Login";
import Register from "./src/screens/Register";
import Payment from "./src/screens/Payment";
import Success from "./src/screens/Success";
import Bid from "./src/screens/Bid";
import { StripeProvider } from "@stripe/stripe-react-native";
// import "react-native-gesture-handler";
// import "react-native-gesture-handler";
// import { createDrawerNavigator } from '@react-navigation/drawer';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import CustomDrawer from "./src/screens/CustomDrawer";

// params for Navigations
export type RootStackParamList = {
  Home: undefined;
  AllGig: undefined;
  Gig: undefined;
  Order: undefined;
  MyGig: undefined;
  Add: undefined;
  Message: undefined;
  Request: {
    userId: number;
    serviceProviderId: number;
    category: string;
    profileImage: string;
    coverPhoto: string;
    phoneNumber: string;
    description: string
  };
  Post: undefined;
  Login: undefined;
  Register: undefined;
  Payment: undefined;
  Success: undefined;
  Bid: undefined;
  DrawerNavigation: undefined;
};

export type DrawerParamList = {
  Home: undefined;
  Add: undefined;
};

const DrawerNavigation = () => {
  const Drawer = createDrawerNavigator();
  console.log("DrawerNavigation initialized");

  return (
    <Drawer.Navigator
      screenOptions={
        {
          // headerShown : false,
        }
      }
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Add" component={Add} />
      <Drawer.Screen name="AllGig" component={AllGig} />
      <Drawer.Screen name="Message" component={Message} />
    </Drawer.Navigator>
  );
};

const App = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="DrawerNavigation"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} />
        {/* <Stack.Screen name="Gig" component={Gig} /> */}
        <Stack.Screen name="Order" component={Order} />
        {/* <Stack.Screen name="Message" component={Message} /> */}
        <Stack.Screen name="Post" component={Post} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Payment" component={Payment} />
        <Stack.Screen name="Success" component={Success} />
        <Stack.Screen name="Bid" component={Bid} />
        <Stack.Screen name="Request" component={Request} />
      </Stack.Navigator>
    </NavigationContainer>
  );
  // return (
  //   // <StripeProvider publishableKey="pk_test_51PdX2BRvPGnkwL1861wnudYQVNjlKjKy8N1uou7UkQEK0dBWc693GLF4F6yfuXnlj8JQErIDvFfpJj29VxsKJtMo00vhamBZXK">
  //   <NavigationContainer>
  //     <Stack.Navigator
  //       screenOptions={{
  //         headerShown: false,
  //       }}
  //     >
  //       <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} />
  //       <Stack.Screen name="Add" component={Add} />

  //       <Stack.Screen name="AllGig" component={AllGig} />
  //       <Stack.Screen name="Gig" component={Gig} />
  //       <Stack.Screen name="Order" component={Order} />
  //       <Stack.Screen name="MyGig" component={MyGig} />

  //       <Stack.Screen name="Message" component={Message} />
  //       <Stack.Screen name="Request" component={Request} />
  //       <Stack.Screen name="Post" component={Post} />
  //       <Stack.Screen name="Login" component={Login} />
  //       <Stack.Screen name="Register" component={Register} />
  //       <Stack.Screen name="Payment" component={Payment} />

  //       <Stack.Screen name="Success" component={Success} />
  //       <Stack.Screen name="Bid" component={Bid} />
  //     </Stack.Navigator>
  //   </NavigationContainer>
  //   // </StripeProvider>
  // );
};

export default App;

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
  },
});
