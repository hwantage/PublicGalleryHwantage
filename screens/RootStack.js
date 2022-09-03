import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from 'react-native-splash-screen';
import {useUserContext} from '../contexts/UserContext';
import {subscribeAuth, getUserInfo} from '../libs/auth';
import MainTab from './MainTab';
import UploadScreen from './UploadScreen';
import ModifyScreen from './ModifyScreen';
import SettingScreen from './SettingScreen';
import SignInScreen from './SignInScreen';
import SetupProfileScreen from './SetupProfileScreen';

const Stack = createNativeStackNavigator();

function RootStack() {
  const {userContext, setUserContext} = useUserContext();

  useEffect(() => {
    // 컴포넌트 첫 로딩 시 로그인 상태를 확인하고 UserContext에 적용
    const unsubscribe = subscribeAuth(async currentUser => {
      // 여기에 등록한 함수는 사용자 정보가 바뀔 때마다 호출되는데
      // 처음 호출될 때 바로 unsubscribe해 한 번 호출된 후에는 더 이상 호출되지 않게 설정
      unsubscribe();
      if (!currentUser) {
        SplashScreen.hide();
        return;
      }
      const profile = await getUserInfo(currentUser.uid);
      if (!profile) {
        return;
      }
      setUserContext(profile);
    });
  }, [setUserContext]);

  return (
    <Stack.Navigator>
      {userContext ? (
        <>
          <Stack.Screen
            name="MainTab"
            component={MainTab}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="UploadScreen"
            component={UploadScreen}
            options={{
              title: '새 게시물',
              headerBackTitle: '뒤로가기',
            }}
          />
          <Stack.Screen
            name="ModifyScreen"
            component={ModifyScreen}
            options={{title: '설명 수정', headerBackTitle: '뒤로가기'}}
          />
          <Stack.Screen
            name="SettingScreen"
            component={SettingScreen}
            options={{title: '설정', headerBackTitle: '뒤로가기'}}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="SignInScreen"
            component={SignInScreen}
            options={{headerShown: false}}
          />
        </>
      )}
      <Stack.Screen
        name="SetupProfileScreen"
        component={SetupProfileScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export default RootStack;
