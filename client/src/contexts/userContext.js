import React from 'react';

const UserContext = React.createContext({
  name: 'Guest',
  changeUsername: () => { },
});

export default UserContext;
