import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  useWindowDimensions,
  TouchableHighlight,
} from 'react-native';
import RenderHtml from 'react-native-render-html';
import Toast from 'react-native-toast-message';

import {
  useKnockFeed,
  FilterStatus,
  formatTimestamp,
} from '@knocklabs/react-native';
import {FeedItem, FeedItemOrItems} from '@knocklabs/client';

export const NotificationList: React.FC = () => {
  const [status, setStatus] = useState(FilterStatus.All);

  const {feedClient, useFeedStore} = useKnockFeed();
  const {items} = useFeedStore();

  // const toast = useToast();

  useEffect(() => {
    // When the feed client changes, or the status changes issue a re-fetch
    feedClient.fetch({status});
  }, [feedClient, status]);

  const onNotificationsReceived = useCallback(
    // @ts-ignore
    ({items}) => {
      // Whenever we receive a new notification from our real-time stream, show a toast
      // (note here that we can receive > 1 items in a batch)
      items.forEach((notification: any) => {
        console.log(notification);

        if (notification.data.showToast === false) return;

        Toast.show({
          type: 'info',
          text1: notification.actors[0]?.name || 'Unknown user',
          text2: notification?.data?.message || 'New notification received',
        });
      });
    },
    [],
  );

  useEffect(() => {
    // Receive all real-time notifications on our feed
    feedClient.on('items.received.realtime', onNotificationsReceived);

    // Cleanup
    return () =>
      feedClient.off('items.received.realtime', onNotificationsReceived);
  }, [feedClient, onNotificationsReceived]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>

      {items.map((item: any) => (
        <NotificationListItem key={item.id} item={item} />
      ))}
    </View>
  );
};

const NotificationListItem: React.FC<{item: FeedItem}> = ({item}) => {
  const {feedClient} = useKnockFeed();
  const {width} = useWindowDimensions();
  const actor = item.actors[0];

  const markAsRead = useCallback(
    async (item: FeedItemOrItems) => {
      try {
        await feedClient.markAsRead(item);
      } catch (e: any) {
        Alert.alert('Error', e.message);
      }
    },
    [feedClient],
  );

  return (
    <View
      style={[
        styles.item,
        {
          backgroundColor: item.read_at ? '#ccc' : '#ccf',
        },
      ]}>
      <TouchableHighlight onPress={() => markAsRead(item)}>
        <View>
          <Text style={styles.itemTitle}>
            Notification from:
            {actor && 'name' in actor && actor.name && actor.name}
          </Text>
          <Text style={styles.itemTimestamp}>
            {formatTimestamp(item.inserted_at)}
          </Text>
          <Text>{}</Text>
          <RenderHtml
            contentWidth={width}
            source={{html: item.blocks[0]?.rendered}}
          />
        </View>
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    flexGrow: 1,
    flexDirection: 'column',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  item: {
    flex: 1,
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemTimestamp: {
    fontSize: 12,
    color: '#666',
  },
});
