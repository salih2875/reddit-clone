import { auth, firestore } from "@/src/firebase/clientApp";
import useDirectory from "@/src/hooks/useDirectory";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Icon,
  Input,
  MenuItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { Server } from "http";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { BsEye, BsFillPersonFill } from "react-icons/bs";
import { CiGlobe } from "react-icons/ci";
import { FaLock } from "react-icons/fa";
import { GrAdd } from "react-icons/gr";

type CreateCommunityModalProps = {
  open: boolean;
  handleClose: () => void;
};

const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({
  open,
  handleClose,
}) => {
  const [user] = useAuthState(auth);
  const [communityName, setCommunityName] = useState("");
  const [communityDescription, setCommunityDescription] = useState("");
  const [charsRemaining, setCharsRemaining] = useState(21);
  const [descCharsRemaining, setDescCharsRemaining] = useState(500);
  const [communityType, setCommunityType] = useState("public");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toggleMenuOpen } = useDirectory();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 21) return;
    setCommunityName(event.target.value);
    setCharsRemaining(21 - event.target.value.length);
  };

  const handleDescChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 500) return;
    setCommunityDescription(event.target.value);
    setDescCharsRemaining(500 - event.target.value.length);
  };
  const onCommunityTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCommunityType(event.target.name);
  };
  const handleCreateCommunity = async () => {
    if (error) setError("");
    const format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (format.test(communityName) || communityName.length < 3) {
      setError(
        "Name should be between 3-21 characters, and only letters, numbers and underscore are allowed"
      );
      return;
    }
    setLoading(true);

    try {
      const communityDocRef = doc(firestore, "communities", communityName);
      await runTransaction(firestore, async (transaction) => {
        const communityDoc = await transaction.get(communityDocRef);
        if (communityDoc.exists()) {
          throw new Error(`r/${communityName} is already taken`);
          return;
        }
        transaction.set(communityDocRef, {
          creatorId: user?.uid,
          createdAt: serverTimestamp(),
          numberOfMembers: 1,
          privacy: communityType,
        });
        transaction.set(
          doc(firestore, `users/${user?.uid}/communitySnippets`, communityName),
          {
            communityId: communityName,
            isModerator: true,
          }
        );
      });
      handleClose();
      toggleMenuOpen();
      router.push(`r/${communityName}`);
    } catch (error: any) {
      console.log("handleCreateCommunity error", error);
      setError(error.message);
    }

    setLoading(false);
  };

  return (
    <>
      <Modal isOpen={open} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            flexDirection="column"
            fontSize="15"
            padding={3}
          >
            Modal Title
          </ModalHeader>
          <Box pl={3} pr={3}>
            <ModalCloseButton />
            <ModalBody display="flex" flexDirection="column" padding="10px 0px">
              <Text fontWeight={600} fontSize={15}>
                Name
              </Text>
              <Text fontSize={11} color="gray.500">
                A name and description help people understand what your
                community is all about
              </Text>
              <Text
                position="relative"
                top="28px"
                left="5px"
                width="20px"
                color="gray.400"
              >
                r/
              </Text>
              <Input
                position="relative"
                value={communityName}
                size="sm"
                pl="22px"
                onChange={handleChange}
              />
              <Text
                fontSize="9pt"
                color={charsRemaining === 0 ? "red" : "gray.500"}
              >
                {charsRemaining} Characters remaining
              </Text>

              <Text
                fontWeight={15}
                fontSize={13}
                position="relative"
                top="20px"
                left="5px"
                width="67px"
              >
                Description
              </Text>
              <Input
                position="relative"
                value={communityDescription}
                size="lg"
                pl="5px"
                height={100}
                pt="15px"
                textAlign="justify"
                onChange={handleDescChange}
                width="auto"
                fontSize="14px"
              />
              <Text
                fontSize="9pt"
                color={charsRemaining === 0 ? "red" : "gray.500"}
              >
                {descCharsRemaining} Characters remaining
              </Text>
              <Text fontSize="9pt" color="red" pt={1}>
                {error}
              </Text>
              <Box mt={4} mb={4}>
                <Text fontWeight={600} fontSize={15}>
                  Community type
                </Text>
                <Stack spacing={2}>
                  <Checkbox
                    name="public"
                    isChecked={communityType === "public"}
                    onChange={onCommunityTypeChange}
                  >
                    <Flex align="center">
                      <Icon
                        as={CiGlobe}
                        color="gray.500"
                        mr={1}
                        boxSize="20px"
                      />
                      <Flex direction="column">
                        <Text fontSize="10pt" mr={1}>
                          Public
                        </Text>
                        <Text fontSize="8pt" color="gray.500">
                          Anyone can view and contribute
                        </Text>
                      </Flex>
                    </Flex>
                  </Checkbox>
                  <Checkbox
                    name="restricted"
                    isChecked={communityType === "restricted"}
                    onChange={onCommunityTypeChange}
                  >
                    <Flex align="center">
                      <Icon as={BsEye} color="gray.500" mr={1} boxSize="20px" />
                      <Flex direction="column">
                        <Text fontSize="10pt" mr={1}>
                          Restricted
                        </Text>
                        <Text fontSize="8pt" color="gray.500">
                          Anyone can view, but only approved users can
                          contribute
                        </Text>
                      </Flex>
                    </Flex>
                  </Checkbox>
                  <Checkbox
                    name="private"
                    isChecked={communityType === "private"}
                    onChange={onCommunityTypeChange}
                  >
                    <Flex align="center">
                      <Icon
                        as={FaLock}
                        color="gray.500"
                        mr={1}
                        boxSize="20px"
                      />
                      <Flex direction="column">
                        <Text fontSize="10pt" mr={1}>
                          Private
                        </Text>
                        <Text fontSize="8pt" color="gray.500">
                          Only approved users can view and contribute
                        </Text>
                      </Flex>
                    </Flex>
                  </Checkbox>
                </Stack>
              </Box>
            </ModalBody>
          </Box>

          <ModalFooter bg="gray.100" borderRadius="0px 0px 10px 10px">
            <Button
              variant="outline"
              height="30px"
              mr={3}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              height="30px"
              onClick={handleCreateCommunity}
              isLoading={loading}
            >
              Create Community
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default CreateCommunityModal;
