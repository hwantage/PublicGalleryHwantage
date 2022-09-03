import React, {useContext, createContext, useState} from 'react';

const UserContext = createContext(null);

export function UserContextProvider({children}) {
  const [userContext, setUserContext] = useState(null);

  return (
    <UserContext.Provider
      children={children}
      value={{
        userContext,
        setUserContext,
      }}
    />
  );
}

export function useUserContext() {
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error('UserContext.Provider is not found');
  }
  return userContext;
}
