import { useState } from 'react';
import { IconButton } from '@chakra-ui/button';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input';
import { Box } from '@chakra-ui/layout';
import { FiSend } from 'react-icons/fi';

import { db } from '../../firebase';

interface RoomChatInputProps {
  sender: string;
  roomId: string;
}

const RoomChatInput: React.FC<RoomChatInputProps> = ({ sender, roomId }) => {
  const [msg, setMsg] = useState('');

  const sendMessage = async () => {
    if (msg.trim() === '') return;
    try {
      await db
        .collection('roomMessages')
        .doc(roomId)
        .collection('messages')
        .add({
          msg,
          sender,
        });
      setMsg('');
    } catch (err) {
      console.log('error in sending message');
    }
  };

  return (
    <Box h="10%" display="flex" alignItems="center" justifyContent="center">
      <Box w="94%">
        <InputGroup size="md">
          <Input
            variant="filled"
            placeholder="Message..."
            py="1"
            size="md"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyUp={(e) => {
              if (e.code === 'Enter') sendMessage();
            }}
            bg="blackAlpha.200"
          />
          <InputRightElement width="4.5rem">
            <IconButton
              size="sm"
              aria-label="Search database"
              variant="unstyled"
              onClick={sendMessage}
              icon={
                <FiSend
                  style={{
                    fontSize: '1.75em',
                    color: 'teal',
                    marginLeft: '0.2rem',
                  }}
                />
              }
            />
          </InputRightElement>
        </InputGroup>
      </Box>
    </Box>
  );
};

export default RoomChatInput;
