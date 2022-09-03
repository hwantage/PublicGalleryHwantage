import React from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useEffect} from 'react';
import Profile from '../components/Profile';

function UserFeedScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const {user} = route.params ?? {};

  useEffect(() => {
    navigation.setOptions({
      title: user.displayName,
    });
  }, [navigation, user.displayName]);

  return <Profile profileUser={user} />;
}

export default UserFeedScreen;
