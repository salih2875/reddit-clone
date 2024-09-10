import { Button, Flex, Link, Text } from "@chakra-ui/react";
import React from "react";

const CommunityNotFound: React.FC = () => {
  return (
    <Flex
      direction="column"
      justifyContent="center"
      alignItems="center"
      minHeight="60vh"
    >
      {" "}
      <Text mb={3} fontWeight={600}>
        Community not found
      </Text>
      <Text width="50%">
        There aren’t any communities on Reddit with that name. Double-check the
        community name or try searching for similar communities.
      </Text>
      <Link href="/">
        <Button mt={4}>Browse other communities</Button>
      </Link>
    </Flex>
  );
};
export default CommunityNotFound;
