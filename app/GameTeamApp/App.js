import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';

// android 569659777889-nar65j9gsj14kp80vilt9bcpnul89hmd.apps.googleusercontent.com

/*
Google Certificate Fingerprint:     43:83:2A:85:15:49:F2:01:42:6E:81:7D:E9:C4:C1:BF:49:6B:F5:51
Google Certificate Hash (SHA-1):    43832A851549F201426E817DE9C4C1BF496BF551
Google Certificate Hash (SHA-256):  9853C7E533AA70345C7C5F06F743C05C1AD551019E27570CE8EEC8953D1F705D
Facebook Key Hash:                  Q4MqhRVJ8gFCboF96cTBv0lr9VE=
*/


export default function App() {
  const [userInfo, setUserInfo] = React.useState(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClienteId: "569659777889-nar65j9gsj14kp80vilt9bcpnul89hmd.apps.googleusercontent.com"
  });

  React.useEffect(() => {
    handleSignInWithGoogle();
  }, [response]);

  async function handleSignInWithGoogle() {
    const user = await AsyncStorage.getItem("@user");
    if (!user) {
      if (response?.type === "suscess"){
        await getUserInfo(response.autentication.accessToken);
      }
    } else {
      setUserInfo(JSON.parse(user));
    }
  }

  const getUserInfo = async (token) => {
    if (!token) return;
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const user = await response.json();
      await AsyncStorage.setItem("@user", JSON.stringify(user));
      setUserInfo(user);
    } catch (error) {

    }
  }

  return (
    <View style={styles.container}>
      <Text>{JSON.stringify(userInfo, null, 2)}</Text>
      <Text>Anubis</Text>
      <Button title="Sign in with Google" onPress={promptAsync} />
      <Button 
        title="Delete local storage" 
        onPress={() => AsyncStorage.removeItem("@user")}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
