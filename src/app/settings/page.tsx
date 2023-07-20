'use client';
/* eslint-disable @next/next/no-img-element */
import { CustomButton, CustomInput, LoadingButton } from "@/components";
import { User } from "@/interfaces";
import { useUser } from "@/store";
import { Box, Container, Flex, Stack, Text, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from "@/config/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { EditIcon } from "@chakra-ui/icons";

export default function Page() {
  const { user } = useUser();
  const toast = useToast();
  const [localUser, setLocalUser] = useState<User>(user);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    setLocalUser(user);
  }, [user]);

  const setName = (name: string) => setLocalUser({ ...localUser, username: name });

  const handleImageUpload = async () => {
    if (!imageFile) return;

    try {
      const storageRef = ref(storage, `profileImages/${user.id}`);
      await uploadBytes(storageRef, imageFile);
      const downloadURL = await getDownloadURL(storageRef);

      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, { profileImageURL: downloadURL });

      setLocalUser({ ...localUser, profileImageURL: downloadURL });
    } catch (error) {
      toast({
        description: 'Erro ao realizar upload de imagem',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const handleImageInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setImageFile(file);
  
      // Create a FileReader instance
      const reader = new FileReader();
  
      // Listen for the load event to get the data URL after reading the file
      reader.onload = () => {
        const dataURL = reader.result;
        // Update the localUser with the new data URL
        setLocalUser({ ...localUser, profileImageURL: dataURL as string });
      };
  
      // Read the selected file as data URL
      reader.readAsDataURL(file);
    }
  };
  

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await handleImageUpload();
      
      await updateDoc(doc(db, 'users', user.id), {
        username: localUser.username
      });

      toast({
        description: 'Informações salvas com sucess!',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        description: 'Erro ao salvar novas configurações',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
    setIsLoading(false);
  };

  return (
    <Box display='flex' alignItems='center' justifyContent='center' height='calc(90vh - 30px)'>
      <Container backgroundColor='gray.background' style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: 10, padding: 15 }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <div
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            style={{ position: 'relative' }}
          >
            {localUser.profileImageURL && (
              <img
                src={localUser.profileImageURL}
                alt='Profile'
                height={100}
                width={100}
                style={{ borderRadius: '50%' }}
              />
            )}
            {isHovering && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  background: 'rgba(0, 0, 0, 0.5)',
                  borderRadius: '50%',
                }}
              >
                <label htmlFor='imageInput'>
                  <EditIcon color='white' boxSize={8} cursor='pointer' />
                </label>
              </div>
            )}
          </div>
          <Stack spacing={4}>
            <Text color='dark.grpBtn' fontWeight={600} >Hello, {localUser.username}!</Text>
            <CustomInput placeholder='Name' value={localUser.username} setValue={setName} />
            <CustomInput placeholder='Email' value={localUser.email} setValue={() => {}} isDisabled={true} />
            <input
              type='file'
              id='imageInput'
              accept='image/*'
              style={{ display: 'none' }}
              onChange={handleImageInputChange}
            />
            <LoadingButton isLoading={isLoading} text='Save' onClick={handleSave} />
          </Stack>
        </div>
      </Container>
    </Box>
  )
}
