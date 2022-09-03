import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import IconRightButton from '../components/IconRightButton';
import Profile from '../components/Profile';
import {useUserContext} from '../contexts/UserContext';

function MyProfileScreen() {
  const {userContext} = useUserContext();
  const navigation = useNavigation();

  console.log('MyFeedScreen.js', userContext);
  useEffect(() => {
    navigation.setOptions({
      title: 'My Feed',
      headerRight: () => (
        <IconRightButton
          name="settings"
          onPress={() => navigation.push('SettingScreen')}
        />
      ),
    });
  }, [navigation, userContext]);

  return <Profile profileUser={userContext} />;
}

export default MyProfileScreen;
