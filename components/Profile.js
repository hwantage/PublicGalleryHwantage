import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  Pressable,
} from 'react-native';
import Avatar from './Avatar';
import PostGridItem from './PostGridItem';
import usePosts from '../hooks/usePosts';
import {useNavigation} from '@react-navigation/native';
import {useUserContext} from '../contexts/UserContext';

function Profile({profileUser}) {
  const [user, setUser] = useState();
  const {userContext} = useUserContext();
  const navigation = useNavigation();
  const {posts, noMorePost, refreshing, onLoadMore, onRefresh} = usePosts(
    profileUser.id,
  );

  useEffect(() => {
    setUser(profileUser);
  }, [profileUser]);

  if (!user || !posts) {
    return (
      <ActivityIndicator style={styles.spinner} size={32} color="#6200ee" />
    );
  }

  console.log('Profile :: ', user, posts);

  const onPress = () => {
    navigation.navigate('SetupProfileScreen');
  };

  return (
    <FlatList
      style={styles.block}
      data={posts}
      renderItem={renderItem}
      numColumns={3}
      keyExtractor={item => item.id}
      ListHeaderComponent={
        <View style={styles.userInfo}>
          <Avatar source={user.photoURL && {uri: user.photoURL}} size={128} />
          <Text style={styles.username}>{user.displayName}</Text>
          <View style={styles.block}>
            {userContext.id === user.id && (
              <Pressable onPress={onPress}>
                <Text>수정</Text>
              </Pressable>
            )}
          </View>
        </View>
      }
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.25}
      ListFooterComponent={
        !noMorePost && (
          <ActivityIndicator
            style={styles.bottomSpinner}
            size={32}
            color="#6200ee"
          />
        )
      }
      refreshControl={
        <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
      }
    />
  );
}

const renderItem = ({item}) => <PostGridItem post={item} />;

const styles = StyleSheet.create({
  spinner: {
    flex: 1,
    justifyContent: 'center',
  },
  block: {
    flex: 1,
  },
  userInfo: {
    paddingTop: 80,
    paddingBottom: 64,
    alignItems: 'center',
  },
  username: {
    marginTop: 8,
    fontSize: 24,
    color: '#424242',
  },
  bottomSpinner: {
    height: 128,
  },
});

export default Profile;
