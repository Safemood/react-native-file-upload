/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import axios from 'axios';
import React, { useCallback, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  StyleSheet,
  Button,
  Platform,
  Text,
} from 'react-native';

import DocumentPicker, { types } from 'react-native-document-picker';
import { API_URL } from '@env';

const App = () => {
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const handleDocumentSelection = useCallback(async () => {
    try {
      const file = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
        type: [types.pdf],
        allowMultiSelection: false,
      });
      if (file && file[0]) {
        var data = new FormData();
        data.append('file', {
          uri:
            Platform.OS === 'android'
              ? file[0].uri
              : file[0].uri.replace('file://', ''),
          name: file[0]?.name,
          type: file[0]?.type,
        });
        var config = {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        };
        setSuccess(null);
        setErrors(null);
        setIsLoading(true);
        axios
          .post(`${API_URL}/upload`, data, config)
          .then(response => {
            setSuccess(response.data);
          })
          .catch(({ response }) => {
            setErrors(response.data?.errors?.file);
          })
          .finally(() => setIsLoading(false));
      }
    } catch (err) {
      console.warn(err);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} />

      <Button
        disabled={isLoading}
        title={!isLoading ? 'Select 📑' : 'Loading ...'}
        onPress={handleDocumentSelection}
      />

      {success && (
        <View>
          <Text style={styles.success}>{success?.message}</Text>
        </View>
      )}

      {errors && (
        <View>
          {errors.map((err, index) => (
            <Text key={index} style={styles.error}>
              {err}
            </Text>
          ))}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  success: {
    color: 'green',
  },
  error: {
    color: 'red',
  },
});

export default App;
