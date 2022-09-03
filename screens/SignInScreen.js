import React, {useState, useRef} from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {signIn, join, getUserInfo} from '../libs/auth';
import {useUserContext} from '../contexts/UserContext';
import BorderedInput from '../components/BorderedInput';
import CustomButton from '../components/CustomButton';

function SignInScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const ref_password = useRef();
  const ref_confirmPassword = useRef();
  const isJoin = route.params?.isJoin;

  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const {setUserContext} = useUserContext();

  const createChangeTextHandler = (name, value) => {
    setForm({...form, [name]: value});
  };

  const onSubmit = async () => {
    Keyboard.dismiss();

    if (form.email.trim() === '') {
      Alert.alert('실패', '이메일을 입력하십시오.');
      return;
    }

    if (form.password.trim() === '') {
      Alert.alert('실패', '비밀번호를 입력하십시오.');
      return;
    }

    if (isJoin && form.password !== form.confirmPassword) {
      Alert.alert('실패', '비밀번호가 일치하지 않습니다.');
      return;
    }

    setLoading(true);

    try {
      const {user} = isJoin
        ? await join(form.email, form.password)
        : await signIn(form.email, form.password);

      const userInfo = await getUserInfo(user.uid);
      console.log('PROFILE :', userInfo);

      if (!userInfo) {
        setUserContext({id: user.uid, displayName: '', photoURL: ''});
        navigation.navigate('SetupProfileScreen');
      } else {
        setUserContext(userInfo);
      }
    } catch (e) {
      if (e.code === 'auth/email-already-in-use') {
        Alert.alert('실패', '이미 가입된 이메일입니다.');
      } else if (e.code === 'auth/wrong-password') {
        Alert.alert('실패', '잘못된 비밀번호입니다.');
      } else if (e.code === 'auth/user-not-found') {
        Alert.alert('실패', '존재하지 않는 계정입니다.');
      } else if (e.code === 'auth/invalid-email') {
        Alert.alert('실패', '유효하지 않은 이메일 주소입니다.');
      } else if (e.code === 'auth/weak-password') {
        Alert.alert('실패', '비밀번호는 6자리 이상입니다.');
      } else {
        Alert.alert('실패', '실패했습니다.');
      }
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.select({ios: 'padding'})}>
      <SafeAreaView style={styles.fullscreen}>
        <Text style={styles.text}>PublicGallery !</Text>
        <View style={styles.form}>
          <BorderedInput
            hasMarginBottom
            placeholder="이메일"
            value={form.email}
            autoCapitalize="none"
            autoCorrect={false}
            autoCompleteType="email"
            keyboardType="email-address"
            returnKeyType="next"
            blurOnSubmit={false}
            onChangeText={text => createChangeTextHandler('email', text)}
            onSubmitEditing={() => ref_password.current.focus()}
          />
          <BorderedInput
            hasMarginBottom
            placeholder="비밀번호"
            value={form.password}
            secureTextEntry
            blurOnSubmit={false}
            returnKeyType={isJoin ? 'next' : 'done'}
            onChangeText={text => createChangeTextHandler('password', text)}
            onSubmitEditing={() =>
              isJoin ? ref_confirmPassword.current.focus() : onSubmit()
            }
            ref={ref_password}
          />
          {isJoin && (
            <BorderedInput
              placeholder="비밀번호 확인"
              value={form.confirmPassword}
              secureTextEntry
              blurOnSubmit={false}
              returnKeyType="done"
              onChangeText={text =>
                createChangeTextHandler('confirmPassword', text)
              }
              onSubmitEditing={onSubmit}
              ref={ref_confirmPassword}
            />
          )}
          {loading && (
            <View style={styles.spinnerWrapper}>
              <ActivityIndicator size={32} color="#6200ee" />
            </View>
          )}
          {!loading && (
            <View style={styles.buttons}>
              {!isJoin && (
                <>
                  <CustomButton
                    title="로그인"
                    hasMarginBottom
                    onPress={onSubmit}
                  />
                  <CustomButton
                    title="회원가입"
                    theme="secondary"
                    onPress={() => {
                      navigation.push('SignInScreen', {isJoin: true});
                    }}
                  />
                </>
              )}
              {isJoin && (
                <>
                  <CustomButton
                    title="회원가입"
                    hasMarginBottom
                    onPress={onSubmit}
                  />
                  <CustomButton
                    title="로그인"
                    theme="secondary"
                    onPress={() => {
                      navigation.goBack();
                    }}
                  />
                </>
              )}
            </View>
          )}
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  fullscreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  form: {
    marginTop: 64,
    width: '100%',
    paddingHorizontal: 16,
  },
  buttons: {
    marginTop: 64,
  },
  spinnerWrapper: {
    marginTop: 64,
    height: 104,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
});
export default SignInScreen;
