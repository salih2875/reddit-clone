import React from "react";
import { Tabitem } from "./NewPostForm";
import { Flex, Text } from "@chakra-ui/react";

type TabItemProps = {
  item: Tabitem;
  selected: boolean;
  setSelectedTab: (value: string) => void;
};

const TabItem: React.FC<TabItemProps> = ({
  item,
  selected,
  setSelectedTab,
}) => {
  return (
    <Flex
      align="center"
      justify="center"
      flexGrow={1}
      p="14px 0px"
      cursor="pointer"
      _hover={{ bg: "gray.300" }}
      borderBottom="4px"
      // TODO: make it linear-gradient          
      borderBottomColor={selected ? "blue.500" : "gray.200"}
      onClick={() => setSelectedTab(item.title)}
    >
      <Text fontSize="10pt">{item.title}</Text>
    </Flex>
  );
};
export default TabItem;
