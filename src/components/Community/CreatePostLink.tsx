import { authModalState } from "@/src/atoms/authModalAtom";
import { auth } from "@/src/firebase/clientApp";
import { Button, Flex, Icon, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { GoPlus } from "react-icons/go";
import { useSetRecoilState } from "recoil";

const CreatePostLink: React.FC = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const setAuthModalState = useSetRecoilState(authModalState);

  const onClick = () => {
    if (!user) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }
    const { communityId } = router.query;
    router.push(`/r/${communityId}/submit`);
  };
  return (
    <Button
      mr={3}
      mt={4}
      color="black"
      bg="white"
      variant="outline"
      onClick={onClick}
    >
      <Icon as={GoPlus} fontSize="30px" />
      <Text>Create a post</Text>
    </Button>
  );
};
export default CreatePostLink;
