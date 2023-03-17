import React, { useState } from 'react';
import { View } from 'react-native';
import Login from './Login.react';
import CreateAccount from './CreateAccount.react';

const TABS = Object.freeze({ LOGIN: 'LOGIN', CREATE_ACCOUNT: 'CREATE_ACCOUNT' });

/**
 * @param {(authToken:string) => {}} onLogUser
 * @returns
 */

export default function LoggedOutView({ onLogUser }) {
  const [tab, setTab] = useState(TABS.LOGIN);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {tab == TABS.LOGIN ? <Login onSuccess={onLogUser} onCancel={() => setTab(TABS.CREATE_ACCOUNT)} />
        : <CreateAccount onSuccess={() => setTab(TABS.LOGIN)} onCancel={() => setTab(TABS.LOGIN)} />}
    </View>
  );
}
