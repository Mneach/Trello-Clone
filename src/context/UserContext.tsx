import { onAuthStateChanged, getAuth } from "firebase/auth";
import { collection, Firestore, getDocs, query, where, writeBatch } from "firebase/firestore";
import React, { useContext, createContext, useState, useEffect, Children } from "react";
import { useNavigate } from "react-router-dom";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import { auth, db } from "../firebase/config";
import { enumNotificationFrequency, enumPrivacySetting, UserType } from "../model/model";

const UserContext = React.createContext<userContextProps>({
    user: {
        userId: '',
        username: '',
        password: '',
        email: '',
        notificationFrequency : enumNotificationFrequency.Instant, 
        privacySetting : enumPrivacySetting.On,
        imageLink : '',
    },
    favoriteBoard : []
})

type Props = {
    children: React.ReactNode | React.ReactFragment;
}

type userContextProps = {
    user: UserType,
    favoriteBoard : Array<String>
}

export function useUserContext() {
    return useContext(UserContext)
}

export const UserProvider: React.FC<Props> = ({ children }) => {

    const auth = getAuth()

    const getUserQuery = collection(useFirestore(), 'UserCollection');
    const {status : statusUser , data : dataUser} = useFirestoreCollectionData(query(getUserQuery) , {
        idField : 'uid'
    })

    if (statusUser === 'loading') {
        return (<div>Get User Data...</div>)
    }

    
    const getNewUser = (dataUser as Array<UserType>)
    // console.log(auth.currentUser)
    // console.log(getNewUser)

    const userData = getNewUser.filter((user) => {
        return user.userId == auth.currentUser?.uid
    })[0];
    
    return (
        <UserContext.Provider value={{ user: userData , favoriteBoard : [] }}>
            {children}
        </UserContext.Provider>
    )

}