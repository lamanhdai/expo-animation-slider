import {useState} from 'react'
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Card from './components/Card'
import Image1 from './assets/catheral.jpeg';
import Image2 from './assets/city.jpeg';
import Image3 from './assets/sunset.jpeg';

export default function App() {
  const [list, setList] = useState([
    {
      id: 1,
      backgroundColor: 'black',
      url: Image1,
    }
    ,{
      id: 2,
      backgroundColor: 'yellow',
      url: Image2,
    },
    {
      id: 3,
      backgroundColor: 'red',
      url: Image3,
    }
  ]);
  const onChangeList = (data) => {
    setList([data, ...list.filter(i => i.backgroundColor != data.backgroundColor)])
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <View style={styles.container}>
      {
        list.map((i, index) => (
          <Card backgroundColor={i.backgroundColor} url={i.url} itemId={i.id} index={index} key={i.id} onChangeList={onChangeList} data={list}></Card>
        ))
      }
    </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
