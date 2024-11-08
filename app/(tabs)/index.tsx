import {
  Image,
  StyleSheet, 
  Platform,
  View,
  Text, 
  ScrollView,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  TextInput,
  Alert

  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { Fontisto } from '@expo/vector-icons';
import { theme } from '@/colors'
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const API_KEY = '1403d5fcf20669d858eb5530c1f9199c';

type WeatherCondition = "Clouds" | "Clear" | "Rain" | "Atmosphere" | "Snow" | "Drizzle" | "Thunderstorm";
const STORAGE_KEY = "@toDos";
const icons: Record<WeatherCondition, keyof typeof Fontisto.glyphMap> = {
  Clear: "day-sunny",
  Clouds: "cloudy",
  Rain: "rain",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Drizzle: "day-rain",
  Thunderstorm: "lightning",
};

interface ToDo{
  text: string;
  working:boolean;
}
export default function HomeScreen() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState('');
  const [toDos, setToDos] = useState<{[key:string]:ToDo}>({});
  const travel = () => setWorking(false);
  const work =()=>{setWorking(true)};
  const onChangeText = (text: string) => {
    console.log(text);
    setText(text);
  }
  const  saveToDos=async(toSave:{[key: string]: ToDo} )=>{
    const s = JSON.stringify(toSave);
    await AsyncStorage.setItem(STORAGE_KEY, s);
  } 
 
  const loadToDos = async () => {
    try{
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      const parsedToDos = s ? JSON.parse(s) : {};  // null 체크 후 기본값 빈 객체로 설정
      console.log(parsedToDos);
      setToDos(parsedToDos);
    }catch{

    }
   
  };
  
  useEffect(()=>{
    loadToDos();

  },[])
  const addToDo = async() =>{
    alert(text);
    if(text===''){
      return;
    }
    //save to do
    const newToDos = Object.assign({}, toDos, {[Date.now()]: {text, working}}); 
    setToDos(newToDos);
    console.log(newToDos)
    setText("");
    console.log(`
      
      
      newToDos
      
      
      `, newToDos)
      await saveToDos(newToDos);
  }
  const deleteToDo = async(id:string)=>{
    return Alert.alert("delete todo?", "Are you sure?",[
      {text:"cancel"},
      {text:"sure", 
        style:"destructive",
        onPress:async()=>{
        const newToDos = {...toDos};
        delete newToDos[id];
        setToDos(newToDos);
        await saveToDos(newToDos);
      }}
    ])
    
    
  }
  return (
    <View style={styles.container}>
      <StatusBar style='auto' />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{...styles.btnText, color: working? "white": theme.grey}}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text style={{...styles.btnText, color: !working? "white": theme.grey}}>Travel</Text>
        </TouchableOpacity>
        
      </View>
      <View>
        <TextInput 
        value={text}
        returnKeyType='done'
        autoCapitalize={'sentences'}
        onChangeText={onChangeText}
         style={styles.input} 
         placeholder={working?"Add a To Do": "Add a Travel"}
         placeholderTextColor="red"
         onSubmitEditing={addToDo}
         ></TextInput>
      </View>

      <ScrollView>
        {Object.keys(toDos).map((key)=>(
          toDos[key].working ===working? 
         ( 
         <View key={key} style={styles.toDo}>
          <Text style={styles.toDoText}>{toDos[key].text}</Text>

          <TouchableOpacity onPress={()=>{deleteToDo(key)}}>
            <Text>❌</Text>
          </TouchableOpacity>
          
        </View>
        ):(
        null
        )
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
    backgroundColor: theme.bg,
    paddingHorizontal:20,
  },
  header:{
    justifyContent:'space-between',
    flexDirection:'row',
    marginTop: 100
  },
  btnText:{
    fontSize:38,
  
  },
  input:{
    backgroundColor:'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical:20,
    borderRadius:30,
    marginTop:20,
    fontSize: 18
  },
  toDo:{
    backgroundColor:theme.toDoBg,
    marginBottom:10,
    paddingVertical:10,
    paddingHorizontal:20,
    borderRadius:15,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between'
  },
  toDoText:{
    color:'white',
    fontSize:16,
    fontWeight:'500'
  }
});
