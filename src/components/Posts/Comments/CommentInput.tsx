import { Flex, Textarea, Button, Text } from "@chakra-ui/react";
import { User } from "firebase/auth";
import { comment } from "postcss";
import React from "react";
import AuthButtons from "../../Navbar/RightContent/AuthButtons";

type CommentInputProps = {
  commentText: string;
  setCommentText: (value: string) => void;
  user: User;
  createLoading: boolean;
  onCreateComment: (commentText: string) => void;
};

const CommentInput: React.FC<CommentInputProps> = ({
  commentText,
  setCommentText,
  user,
  createLoading,
  onCreateComment,
}) => {
  return (
    <Flex direction="column" position="relative">
      {user ? (
        <>
          <Textarea
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            placeholder="Add a comment"
            fontSize="10pt"
            borderRadius={20}
            minHeight="120px"
            pb={10}
            _placeholder={{ color: "gray.500" }}
            _focus={{
              outline: "none",
              //   bg: "white",
              border: "1px solid white",
            }}
          />
          <Flex
            position="relative"
            left="1px"
            right={0.1}
            bottom="1px"
            justify="flex-end"
            // bg="white"
            p="6px 8px"
            borderRadius="20px 20px 20px 20px"
          >
            <Button
              height="26px"
              disabled={!comment.length}
              isLoading={createLoading}
              onClick={() => onCreateComment(commentText)}
            >
              Comment
            </Button>
          </Flex>
        </>
      ) : (
        <Flex
          align="center"
          justify="space-between"
          borderRadius={2}
          border="1px solid"
          borderColor="gray.100"
          p={4}
        >
          <Text fontWeight={600}>Log in or sign up to leave a comment</Text>
          <AuthButtons />
        </Flex>
      )}
    </Flex>
  );
};
export default CommentInput;
