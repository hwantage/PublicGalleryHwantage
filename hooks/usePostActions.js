import {useState} from 'react';
import {ActionSheetIOS, Platform} from 'react-native';
import {removePost} from '../libs/posts';
import {useNavigation, useRoute} from '@react-navigation/native';
import events from '../libs/events';

export default function usePostActions({postId, description}) {
  const [isSelecting, setIsSelecting] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();

  const edit = () => {
    console.log('editPost :: ', postId, description);
    navigation.navigate('ModifyScreen', {
      postId,
      description,
    });
  };

  const remove = async () => {
    console.log('removePost :: ', postId);
    await removePost(postId);

    // 현재 단일 포스트 조회 화면이라면 뒤로가기
    if (route.name === 'PostScreen') {
      navigation.pop();
    }

    events.emit('removePost', postId);
  };

  const onPressMore = () => {
    if (Platform.OS === 'android') {
      setIsSelecting(true);
    } else {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['설명 수정', '게시물 삭제', '취소'],
          destructiveButtonIndex: 1,
          cancelButtonIndex: 2,
        },
        buttonIndex => {
          if (buttonIndex === 0) {
            edit();
          } else if (buttonIndex === 1) {
            remove();
          }
        },
      );
    }
  };

  const actions = [
    {
      icon: 'edit',
      text: '설명 수정',
      onPress: edit,
    },
    {
      icon: 'delete',
      text: '게시물 삭제',
      onPress: remove,
    },
  ];

  const onClose = () => {
    setIsSelecting(false);
  };

  return {
    isSelecting,
    onPressMore,
    onClose,
    actions,
  };
}
