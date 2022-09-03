import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MyFeedScreen from './MyFeedScreen';

import PostScreen from './PostScreen';

const Stack = createNativeStackNavigator();

function MyFeedStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MyFeedScreen" component={MyFeedScreen} />
      <Stack.Screen
        name="PostScreen"
        component={PostScreen}
        options={{title: '게시물'}}
      />
    </Stack.Navigator>
  );
}

export default MyFeedStack;
