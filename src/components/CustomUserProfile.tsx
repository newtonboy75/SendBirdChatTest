'use-client'

import { useEditUserProfileContext } from '@sendbird/uikit-react/EditUserProfile/context';
import useSendbirdStateContext from '@sendbird/uikit-react/useSendbirdStateContext';
import React from 'react'

export default function CustomUserProfile() {

const globalStore = useSendbirdStateContext();
const user = globalStore.stores.userStore.user;
const userProfile = useEditUserProfileContext

  return (
    <></>    
    
  )
}
