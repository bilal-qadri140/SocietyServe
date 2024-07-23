import React, { useEffect, useState } from "react";
import { StyleSheet, View, Button, Alert } from "react-native";
import { CardField, useStripe } from "@stripe/stripe-react-native";
import { Screen } from "react-native-screens";

const Payment = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const API_URL = "http://10.0.2.2:3000"; // Change this to your server's IP address if on a physical device

  const fetchPaymentSheetParams = async () => {
    try {
      console.log("Fetching payment sheet parameters...");
      const response = await fetch(`${API_URL}/payment-sheet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        console.error("Failed to fetch payment sheet parameters", response.status, response.statusText);
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const { paymentIntent, ephemeralKey, customer } = await response.json();
      console.log("Fetched payment sheet parameters:", { paymentIntent, ephemeralKey, customer });
      return {
        paymentIntent,
        ephemeralKey,
        customer,
      };
    } catch (error) {
      console.error("Error fetching payment sheet parameters:", error);
      throw error;
    }
  };

  const initializePaymentSheet = async () => {
    try {
      const { paymentIntent, ephemeralKey, customer } = await fetchPaymentSheetParams();
      const { error } = await initPaymentSheet({
        merchantDisplayName: "Example, Inc.",
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: {
          name: "Jane Doe",
        },
      });
      if (error) {
        console.error("Error initializing payment sheet:", error);
        throw error;
      }
      setLoading(true);
    } catch (error) {
      console.error("Error initializing payment sheet:", error);
    }
  };

  const openPaymentSheet = async () => {
    try {
      const { error } = await presentPaymentSheet();
      if (error) {
        Alert.alert(`Error code: ${error.code}`, error.message);
        console.error("Error presenting payment sheet:", error);
      } else {
        Alert.alert("Success", "Your order is confirmed!");
      }
    } catch (error) {
      console.error("Error presenting payment sheet:", error);
    }
  };

  useEffect(() => {
    initializePaymentSheet().catch((err) => console.error(err));
  }, []);

  return (
    <Screen>
      <Button
        title="Checkout"
        onPress={openPaymentSheet}
        disabled={!loading}
      />
    </Screen>
  );
};

export default Payment;