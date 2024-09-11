import { Post } from "@/src/atoms/postAtom";
import { firestore } from "@/src/firebase/clientApp";
import usePosts from "@/src/hooks/usePosts";
import {
  Flex,
  Link,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
} from "@chakra-ui/react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";

const Recommendations: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const getCommunityRecommendations = async () => {
    setLoading(true);
    try {
      const postQuery = query(
        collection(firestore, "posts"),
        orderBy("createdAt", "desc"),
        limit(5)
      );
      const postDocs = await getDocs(postQuery);
      const posts = postDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPosts(posts as Post[]);
    } catch (error) {
      console.log("getCommunityRecommendations error ", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getCommunityRecommendations();
  }, []);

  return (
    <Flex direction="column" bg="gray.100" borderRadius={8} maxWidth="300px">
      <Flex align="flex-end" p="6px 10px" height="50px" fontWeight={500}>
        Recent Posts
      </Flex>
      <Flex direction="column">
        {loading ? (
          <Stack mt={2} p={3}>
            <Flex justify="space-between" align="center">
              <SkeletonCircle size="10" />
              <Skeleton height="10px" width="70%" />
            </Flex>
            <Flex justify="space-between" align="center">
              <SkeletonCircle size="10" />
              <Skeleton height="10px" width="70%" />
            </Flex>
            <Flex justify="space-between" align="center">
              <SkeletonCircle size="10" />
              <Skeleton height="10px" width="70%" />
            </Flex>
          </Stack>
        ) : (
          <>
            {posts.map((item) => {
              return (
                <>
                  <Link key={item.id} href={`/r/${item.communityId}`}>
                    <Flex
                      align="center"
                      direction="column"
                      fontSize="10pt"
                      fontWeight={700}
                      p="0px 12px"
                    >
                      <Flex width="100%">
                        <span
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.communityId}
                        </span>
                      </Flex>
                    </Flex>
                  </Link>
                  <Link
                    key={item.id}
                    href={`/r/${item.communityId}/comments/${item.id}`}
                  >
                    <Flex
                      align="center"
                      direction="column"
                      fontSize="10pt"
                      borderBottom="1px solid"
                      borderColor="gray.400"
                      p="10px 12px"
                    >
                      <Flex width="100%">
                        <span
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.title}
                        </span>
                      </Flex>
                    </Flex>
                  </Link>
                </>
              );
            })}
          </>
        )}
      </Flex>
    </Flex>
  );
};
export default Recommendations;
