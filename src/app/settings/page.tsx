/* eslint-disable @next/next/no-img-element */
'use client';
import { CustomInput } from "@/components";
import { User } from "@/interfaces";
import { useUser } from "@/store";
import { Box, Container, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from "@/config/firebase";
import { doc, updateDoc } from "firebase/firestore";

export default function Page() {
  const { user } = useUser();
  const [localUser, setLocalUser] = useState<User>(user);
  const [imageFile, setImageFile] = useState<File | null>(null); // State to hold the selected image file

  useEffect(() => {
    setLocalUser(user);
  }, [user]);

  const setName = (name: string) => setLocalUser({ ...localUser, username: name });

  // Function to handle image upload
  const handleImageUpload = async () => {
    if (!imageFile) return;

    
    try {
      const storageRef = ref(storage, `profileImages/${user.id}`);

      await uploadBytes(storageRef, imageFile);
      const downloadURL = await getDownloadURL(storageRef);
      
      setLocalUser({ ...localUser, profileImage: downloadURL });
      
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, { profileImageURL: downloadURL });
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleImageInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setImageFile(file);
    }
  };

  return (
    <Box display='flex' alignItems='center' justifyContent='center' height='calc(90vh - 30px)'>
      <Container backgroundColor='gray.background' style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: 10, padding: 15 }}>
        <Stack spacing={4}>
          <Text color='dark.grpBtn' fontWeight={600} >Hello, {localUser.username}!</Text>
          <CustomInput placeholder='Name' value={localUser.username} setValue={setName} />


          <CustomInput placeholder='Email' value={localUser.email} setValue={() => {}} isDisabled={true} />

          <input type='file' accept='image/*' onChange={handleImageInputChange} />

          <button onClick={handleImageUpload}>Upload Image</button>
          {localUser.profileImage && (
            <img src={localUser.profileImage} alt='Profile' style={{ maxWidth: '200px', marginTop: '10px' }} />
          )}
        </Stack>
      </Container>
    </Box>
  )
}
