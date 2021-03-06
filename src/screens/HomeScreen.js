import React, {useState, useEffect} from 'react';
import {View, StyleSheet, FlatList, TouchableOpacity, Text} from 'react-native';
import {List, Divider, Title, IconButton} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import Loading from '../components/Loading';
import useStatsBar from '../helpers/useStatsBar';
import {useSelector} from 'react-redux';
import ButtonBase from '../components/ButtonBase';

export default function HomeScreen({navigation}) {
  useStatsBar('light-content');
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [namaBayi, setnamaBayi] = useState('Daryal');
  const [namaRoom, setNamaRoom] = useState([]);
  const userLogedin = useSelector((state) => state.userReducer.user);
  const namaRoomBayi = userLogedin.user.bayis;
  // console.log(namaRoomBayi,'dihomescreen')

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('THREADS')
      .orderBy('latestMessage.createdAt', 'desc')
      .onSnapshot((querySnapshot) => {
        const threads = querySnapshot.docs.map((documentSnapshot) => {
          return {
            _id: documentSnapshot.id,
            // give defaults
            name: '',

            latestMessage: {
              text: '',
            },
            ...documentSnapshot.data(),
          };
        });

        setThreads(threads);

        if (loading) {
          setLoading(false);
        }
      });

    /**
     * unsubscribe listener
     */
    return () => unsubscribe();
  }, []);

  const generateRoom = () => {
    namaRoomBayi.map((roomBayi) => {
      // console.log(roomBayi,'dalam');
      firestore()
        .collection('THREADS')
        .add({
          name: roomBayi,
          latestMessage: {
            text: `You have joined the room ${roomBayi}.`,
            createdAt: new Date().getTime(),
          },
        })
        .then((docRef) => {
          docRef.collection('MESSAGES').add({
            text: `You have joined the room ${roomBayi}.`,
            createdAt: new Date().getTime(),
            system: true,
          });
        });
    });
  };

  useEffect(() => {
    let temp = [];
    for (let i = 0; i < namaRoomBayi.length; i++) {
      const filter = threads.filter((el) => {
        return el.name === namaRoomBayi[i];
      });
      // const newList = temp.concat(filter);
      temp.push(filter);

    }
    // console.log(temp, 'ne');
    // setNamaRoom(temp);
    setNamaRoom(temp)
  }, [threads]);

  let tampunganRoom= []
  namaRoom.map(satuan=>{
    satuan.map(satu=>{
      tampunganRoom.push(satu)
    })
  })
  // console.log(tempa)

  if (loading) {
    return <Loading />;
  }
  return (
    <>
      {/* <Text>{JSON.stringify(namaRoom[2][1])}</Text> */}
      {/* <Text>{JSON.stringify(threads[2].latestMessage)}</Text> */}
      <View style={styles.container}>
        <Title style={{textAlign: 'center'}}>Konsultasi Dengan Dokter</Title>
        {namaRoom.length == 0 && (
          <ButtonBase
            // size="xl"
            onPress={() => generateRoom()}
            title="Tampilkan Chat"
            borderRadius={25}
            width={250}
            marginTop={24}
          />
        )}
       {/* {namaRoom.map(satuan=>{
          satuan.map(datum=>{
           console.log(satuan)
          <Text>{datum}</Text>
            
          })
        })} */}
       
       <FlatList
            data={tampunganRoom}
            // data={threads}
            keyExtractor={(item) => item._id}
            ItemSeparatorComponent={() => <Divider />}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => navigation.navigate('RoomScreen', {thread: item})}>
                <List.Item
                  title={item.name}
                  description={item.latestMessage.text}
                  titleNumberOfLines={1}
                  titleStyle={styles.listTitle}
                  descriptionStyle={styles.listDescription}
                  descriptionNumberOfLines={1}
                />
              </TouchableOpacity>
            )}
          />     
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
  },
  listTitle: {
    fontSize: 22,
  },
  listDescription: {
    fontSize: 16,
  },
});
