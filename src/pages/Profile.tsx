import { Image } from '@chakra-ui/image';
import { Box, Text } from '@chakra-ui/layout';
import { useEffect, useState } from 'react';
import ProfileEdit from '../components/profile/ProfileEdit';
import ProfileRoomStatCard from '../components/profile/ProfileRoomStatCard';
import ProfileUsername from '../components/profile/ProfileUsername';
import { db } from '../firebase';
import { useAuth } from '../state/authState';

const Profile = () => {
  const authUser = useAuth((s) => s.authUser);
  const [data, setData] = useState<{
    createdRooms: number;
    activeRooms: number;
  }>({ createdRooms: 0, activeRooms: 0 });

  useEffect(() => {
    const unsub = db
      .collection('dashrooms')
      .doc(authUser?.uid)
      .onSnapshot((qs) => {
        const state = { activeRooms: 0, createdRooms: 0 };
        const qsData = qs.data();
        const rooms = Object.values({ ...qsData });
        state.activeRooms = rooms.length;
        state.createdRooms = rooms.reduce((acc, curr) => {
          if (curr.admin === authUser?.username) return (acc += 1);
          else return acc;
        }, 0);
        setData(state);
      });
    return unsub;
  }, [authUser]);

  return (
    <Box w="90%" mx="auto" p="4" d="flex" justifyContent="space-around">
      <Box w="40%">
        <Box
          w="100%"
          display="flex"
          flexDir="column"
          alignItems="center"
          mt="3"
        >
          <Box
            boxSize="18rem"
            d="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Image
              boxSize=""
              src="https://bit.ly/prosper-baba"
              alt="Segun Adebayo"
              borderRadius="full"
            />
          </Box>
          <ProfileUsername username={authUser?.username} />
          <Text>{authUser?.email}</Text>
          <Box
            w="100%"
            d="flex"
            alignItems="center"
            justifyContent="space-between"
            mt="4"
            h="36"
          >
            <ProfileRoomStatCard
              text="Rooms Created"
              count={data.activeRooms}
            />
            <ProfileRoomStatCard
              text="Rooms Created"
              count={data.createdRooms}
            />
          </Box>
        </Box>
      </Box>
      <Box w="60%">
        <ProfileEdit />
      </Box>
    </Box>
  );
};

export default Profile;
