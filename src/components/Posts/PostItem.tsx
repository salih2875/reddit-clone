import { communityState } from "@/src/atoms/communitiesAtom";
import { Post } from "@/src/atoms/postAtom";
import useCommunityData from "@/src/hooks/useCommunityData";
import {
  Flex,
  Icon,
  Stack,
  Text,
  Image,
  Skeleton,
  Spinner,
  Alert,
  AlertIcon,
  Link,
} from "@chakra-ui/react";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BsChat, BsDot } from "react-icons/bs";
import { FaReddit } from "react-icons/fa";
import { IoIosBookmark } from "react-icons/io";
import {
  IoArrowDownCircleOutline,
  IoArrowDownCircleSharp,
  IoArrowRedoOutline,
  IoArrowUpCircleOutline,
  IoArrowUpCircleSharp,
  IoBookmarkOutline,
} from "react-icons/io5";

type PostItemProps = {
  post: Post;
  userIsCreator: boolean;
  userVoteValue?: number;
  onVote: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    eventpost: Post,
    vote: number,
    communityId: string
  ) => void;
  onDeletePost: (post: Post) => Promise<boolean>;
  onSelectPost?: (post: Post) => void;
  homePage?: boolean;
};

const PostItem: React.FC<PostItemProps> = ({
  post,
  userVoteValue,
  userIsCreator,
  onVote,
  onDeletePost,
  onSelectPost,
  homePage,
}) => {
  const [loadingImage, setLoadingImage] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const { communityStateValue } = useCommunityData();
  const router = useRouter();
  const singlePostPage = !onSelectPost;

  const [error, setError] = useState(false);
  const handleDelete = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    setLoadingDelete(true);
    try {
      const success = await onDeletePost(post);
      if (!success) {
        throw new Error("Failed to delete post");
      }
      console.log("Post was successfully deleted");
      if (singlePostPage) {
        router.push(`/r/${post.communityId}`);
      }
    } catch (error: any) {
      setError(error.message);
    }
    setLoadingDelete(false);
  };
  return (
    <>
      <Flex
        direction="column"
        border="1px solid"
        bg="white"
        borderColor="white"
        borderRadius={singlePostPage ? "4px 4px 0px 4px" : "4px"}
        _hover={{
          bg: singlePostPage ? "none" : "gray.100",
          // borderColor: singlePostPage ? "none" : "gray.500",
        }}
        cursor={singlePostPage ? "unset" : "pointer"}
        onClick={() => onSelectPost && onSelectPost(post)}
      >
        {error && (
          <Alert status="error">
            <AlertIcon />
            <Text>{error}</Text>
          </Alert>
        )}
        <Flex direction="column" width="100%">
          <Stack spacing={1} p="10px">
            <Stack direction="row" spacing={0.6} align="center" fontSize="9pt">
              {homePage && (
                <>
                  {post.communityImageURL ? (
                    <Image
                      src={post.communityImageURL}
                      borderRadius="full"
                      mr={2}
                      boxSize="18px"
                    />
                  ) : (
                    <Icon
                      as={FaReddit}
                      fontSize="18pt"
                      mr={1}
                      color="blue.500"
                    />
                  )}
                  <Link href={`r/${post.communityId}`}>
                    <Text
                      fontWeight={700}
                      _hover={{ textDecoration: "underline" }}
                      onClick={(event) => event.stopPropagation()}
                    >{`r/${post.communityId}`}</Text>
                  </Link>
                  <Icon as={BsDot} color="gray.500" />
                </>
              )}

              {!homePage && (
                <Text fontWeight={700} fontSize="12px" pr={1}>
                  u/{post.creatorDisplayName}{" "}
                </Text>
              )}

              <Text>
                {moment(new Date(post.createdAt?.seconds * 1000)).fromNow()}
              </Text>
            </Stack>
          </Stack>
        </Flex>

        <Text fontSize="12pt" fontWeight={600} p={2}>
          {post.title}
        </Text>
        <Text fontSize="10pt" p={2}>
          {post.body}
        </Text>
        {post.imageURL && (
          <Flex justify="center" align="center" p={2}>
            {loadingImage && (
              <Skeleton height="200px" width="100%" borderRadius={4} />
            )}
            <Image
              src={post.imageURL}
              maxHeight="460px"
              alt="Post Image"
              display={loadingImage ? "none" : "unset"}
              onLoad={() => setLoadingImage(false)}
            />
          </Flex>
        )}
        <Flex direction="row" align="center" p={1} width="30%">
          <Icon
            as={
              userVoteValue === 1
                ? IoArrowUpCircleSharp
                : IoArrowUpCircleOutline
            }
            color={userVoteValue === 1 ? "brand.100" : "gray.400"}
            fontSize={22}
            onClick={(event) => onVote(event, post, 1, post.communityId)}
            cursor="pointer"
            pr={1}
          />
          <Text fontSize="9pt">{post.voteStatus}</Text>
          <Icon
            as={
              userVoteValue === -1
                ? IoArrowDownCircleSharp
                : IoArrowDownCircleOutline
            }
            color={userVoteValue === -1 ? "#4379ff" : "gray.400"}
            fontSize={22}
            onClick={(event) => onVote(event, post, -1, post.communityId)}
            cursor="pointer"
            pl={1}
          />
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            cursor="pointer"
          >
            <Icon as={BsChat} mr={2} />
            <Text fontSize="9pt">{post.numberOfComments}</Text>
          </Flex>
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            cursor="pointer"
          >
            <Icon as={IoArrowRedoOutline} mr={2} />
            <Text fontSize="9pt">Share</Text>
          </Flex>
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            cursor="pointer"
          >
            <Icon as={IoBookmarkOutline} mr={2} />
            <Text fontSize="9pt">Save</Text>
          </Flex>
          {userIsCreator && (
            <Flex
              align="center"
              p="8px 10px"
              borderRadius={4}
              _hover={{ bg: "gray.200" }}
              cursor="pointer"
              onClick={handleDelete}
            >
              {loadingDelete ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <Icon as={AiOutlineDelete} mr={2} />
                  <Text fontSize="9pt">Delete</Text>
                </>
              )}
            </Flex>
          )}
        </Flex>
      </Flex>
    </>
  );
};
export default PostItem;
