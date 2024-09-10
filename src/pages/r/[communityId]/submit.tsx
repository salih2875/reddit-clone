import { communityState } from "@/src/atoms/communitiesAtom";
import About from "@/src/components/Community/About";
import PageContent from "@/src/components/Layout/PageContent";
import NewPostForm from "@/src/components/Posts/NewPostForm";
import { auth } from "@/src/firebase/clientApp";
import useCommunityData from "@/src/hooks/useCommunityData";
import { Box, Text } from "@chakra-ui/react";
import { userAgent } from "next/server";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";

type submitProps = {};

const SubmitPostPage: React.FC<submitProps> = () => {
  const [user] = useAuthState(auth);
  // const setCommunityStateValue = useRecoilValue(communityState);
  const { communityStateValue } = useCommunityData();

  console.log("COMMUNITY", communityStateValue);
  return (
    <PageContent>
      <>
        <Box p="14px 0px" borderColor="white">
          <Text>Create post</Text>
        </Box>
        {user && (
          <NewPostForm
            user={user}
            communityImageURL={communityStateValue.currentCommunity?.imageURL}
          />
        )}
      </>
      <>
        {communityStateValue.currentCommunity && (
          <About communityData={communityStateValue.currentCommunity} />
        )}
      </>
    </PageContent>
  );
};
export default SubmitPostPage;
