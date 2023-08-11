/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import Toast from 'react-native-toast-message';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import Config from 'react-native-config';

import Knock from '@knocklabs/client';
import {KnockFeedProvider} from '@knocklabs/react-native';
import {NotificationList} from './NotificationList';

const {KNOCK_PUBLIC_API_KEY, KNOCK_FEED_ID, KNOCK_USER_ID} = Config;

function App(): JSX.Element {
  // Check if we're missing any environment variables
  if (!KNOCK_PUBLIC_API_KEY) {
    throw new Error('Missing KNOCK_PUBLIC_API_KEY');
  }
  if (!KNOCK_FEED_ID) {
    throw new Error('Missing KNOCK_FEED_ID');
  }
  if (!KNOCK_USER_ID) {
    throw new Error('Missing KNOCK_USER_ID');
  }

  useEffect(() => {
    console.log('calling Knock constructor', Knock);
    const client = new Knock(KNOCK_PUBLIC_API_KEY);
    console.log('Knock client', client);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={styles.container.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.container}>
        <View>
          <KnockFeedProvider
            apiKey={KNOCK_PUBLIC_API_KEY}
            feedId={KNOCK_FEED_ID}
            userId={KNOCK_USER_ID}>
            <NotificationList />
          </KnockFeedProvider>
        </View>
      </ScrollView>
      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.lighter,
    flex: 1,
    flexGrow: 1,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
