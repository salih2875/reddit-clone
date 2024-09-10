import { Button, Flex, Image, Text } from "@chakra-ui/react";
import React, { use, useEffect } from "react";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth, firestore } from "../../../firebase/clientApp";
import { User } from "firebase/auth";
import { addDoc, doc, setDoc } from "firebase/firestore";
import firebase from "firebase/compat/app";

const OAuthButtons: React.FC = () => {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
  const createUserDocument = async (user: User) => {
    const userDocRef = doc(firestore, "users", user.uid);
    await setDoc(userDocRef, JSON.parse(JSON.stringify(user)));
  };

  useEffect(() => {
    if (user) {
      createUserDocument(user.user);
    }
  }, [user]);

  return (
    <Flex direction="column" width="100%" mb={4}>
      <Button
        variant="oauth"
        mb={2}
        isLoading={loading}
        onClick={() => signInWithGoogle()}
      >
        <Image src="/images/googlelogo.png" height="20px" mr={4} />
        Continue with google
      </Button>
      <Button variant="oauth">Other Button</Button>
      {error && <Text>error.message);</Text>}
    </Flex>
  );
};
export default OAuthButtons;
