import { StyleSheet, Text, View,TouchableOpacity,Image } from 'react-native';
import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import useAuth from '../hooks/useAuth';
import { useEffect, useState } from 'react/cjs/react.development';
import getMatchedUsersInfo from '../lib/getMatchedUsersInfo';
import tw from "tailwind-rn"
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';


const ChatRow = ({matchDetails}) => {
    const navigation = useNavigation()
    const {user} = useAuth()
    const [matchedUserInfo,setMatchedUserInfo] = useState(null)
    const [lastMessage,setLastMessage] = useState("")
    
    useEffect(() => {
        setMatchedUserInfo(getMatchedUsersInfo(matchDetails.users,user.uid))
    },[matchDetails,user])

    useEffect(() => onSnapshot(query(collection(db,"matches",matchDetails.id,"messages"),orderBy("timestamp","desc")),(snapshot) => setLastMessage(snapshot.docs[0]?.data()?.message)),[matchDetails,db])

    return (
        <TouchableOpacity 
            style={[tw("flex-row items-center py-3 px-5 bg-white mx-3 my-1 rounded-lg"),styles.cardShadow]}
            onPress={() => navigation.navigate("Message",{
                matchDetails
            })}
        >
            <Image
                style={tw("rounded-full h-16 w-16 mr-4")}
                source={{uri:matchedUserInfo?.photoURL}} 
            />

            <View>
                <Text style={tw("text-lg font-semibold")}>
                    {matchedUserInfo?.displayName}
                </Text>
                <Text>{lastMessage || "Say Hi!"}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default ChatRow;

const styles = StyleSheet.create({
    cardShadow:{
      shadowColor:"#000",
      shadowOffset:{
        width:0,
        height:1,
      },
      shadowOpacity:0.2,
      shadowRadius:1.41,
  
      elevation:2,
    },
  });
