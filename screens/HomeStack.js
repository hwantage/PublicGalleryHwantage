import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import FeedScreen from './FeedScreen';
import MyFeedScreen from './MyFeedScreen';
import UserFeedScreen from './UserFeedScreen';
import PostScreen from './PostScreen';

const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="FeedScreen"
        component={FeedScreen}
        options={{
          title: 'All Feeds',
        }}
      />
      <Stack.Screen
        name="MyFeedScreen"
        component={MyFeedScreen}
        options={{
          title: 'My Feeds',
        }}
      />
      <Stack.Screen
        name="UserFeedScreen"
        component={UserFeedScreen}
        options={{
          title: 'User Feeds',
        }}
      />
      <Stack.Screen
        name="PostScreen"
        component={PostScreen}
        options={{title: '게시물'}}
      />
    </Stack.Navigator>
  );
}

export default HomeStack;
