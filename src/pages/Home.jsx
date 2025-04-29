import {
  Center,
  Heading,
  HStack,
  Image,
  VStack,
  Box,
  Spinner,
  useToast,
  Text,
  Button,
  SimpleGrid,
  Badge,
  useColorModeValue,
  Avatar,
  Flex,
  Divider,
  IconButton,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
} from "@chakra-ui/react";
import { useCallback, useContext, useEffect, useState } from "react";
import Nav from "../components/Nav";
import Posts from "../components/Posts";
import ProfileCard from "../components/ProfileCard";
import AuthContext from "../context/AuthContext";
import PostService from "../services/PostService";
import UserService from "../services/UserService";
import svg from "../svgs/undraw_no_data_re_kwbl.svg";
import { motion } from "framer-motion";
import { FiUserPlus, FiUserMinus, FiRefreshCw } from "react-icons/fi";

function Home() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [followingStatus, setFollowingStatus] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const toast = useToast();

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const subtleText = useColorModeValue("gray.600", "gray.400");
  const hoverBg = useColorModeValue("gray.50", "gray.700");

  const fetchAllData = useCallback(async () => {
    const postService = new PostService();
    const userService = new UserService();
    try {
      setIsLoading(true);
      setError(null);

      if (user?.id) {
        // Fetch posts from users you follow
        const postsResult = await postService.getAllByUserFollowing(
          user.id,
          localStorage.getItem("token")
        );
        setPosts(postsResult.data);

        // Fetch all users (excluding current user)
        const usersResult = await userService.getAll(
          localStorage.getItem("token")
        );
        const otherUsers = usersResult.data.filter((u) => u.id !== user.id);
        setUsers(otherUsers);

        // Check follow status for each user
        const statusMap = {};
        for (const userItem of otherUsers) {
          const status = await userService.isFollowing(
            user.id,
            userItem.id,
            localStorage.getItem("token")
          );
          statusMap[userItem.id] = status.data;
        }
        setFollowingStatus(statusMap);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error.message);
      setError(error.message);
      toast({
        title: "Error loading data",
        description: "Could not fetch data. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, toast]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAllData();
    setIsRefreshing(false);
    toast({
      title: "Feed refreshed",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "top-right",
    });
  };

  const handleFollow = async (userIdToFollow) => {
    const userService = new UserService();
    try {
      if (followingStatus[userIdToFollow]) {
        await userService.unfollowUser(
          user.id,
          userIdToFollow,
          localStorage.getItem("token")
        );
        toast({
          title: "Unfollowed successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      } else {
        await userService.followUser(
          user.id,
          userIdToFollow,
          localStorage.getItem("token")
        );
        toast({
          title: "Followed successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      }
      // Update follow status locally for immediate UI feedback
      setFollowingStatus((prev) => ({
        ...prev,
        [userIdToFollow]: !prev[userIdToFollow],
      }));
      // Refresh posts after follow/unfollow
      const postService = new PostService();
      const postsResult = await postService.getAllByUserFollowing(
        user.id,
        localStorage.getItem("token")
      );
      setPosts(postsResult.data);
    } catch (error) {
      toast({
        title: "Operation failed",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const MotionBox = motion(Box);

  return (
    <>
      <Nav />
      <Box maxW="1200px" mx="auto" px={{ base: 2, md: 4 }}>
        <HStack
          align="start"
          spacing={{ base: 0, md: 4 }}
          pt={8}
          position="relative"
        >
          {/* Left Sidebar - Profile Card */}
          <Box
            position={{ base: "static", lg: "sticky" }}
            top="20"
            w={{ base: "100%", md: "300px" }}
            display={{ base: "none", md: "block" }}
            pr={{ base: 0, md: 4 }}
          >
            <ProfileCard
              userName={user?.fullName || "User"}
              userId={user?.id}
              onUpdate={fetchAllData}
            />

            {/* Suggested Users Section */}
            <Box
              mt={6}
              p={4}
              bg={cardBg}
              borderRadius="lg"
              border="1px solid"
              borderColor={borderColor}
              boxShadow="sm"
              position={{ base: "relative", xl: "fixed" }}
              alignItems={{ base: "center", xl: "flex-end" }}
              justifyContent={{ base: "center", xl: "flex-end" }}
              width={"20%"}
              right={{ xl: 12 }}
              top={{ base: 4, xl: 52 }}
              zIndex={1}
            >
              <Flex justify="space-between" align="center" mb={4}>
                <Heading size="md">Discover People</Heading>
                <IconButton
                  icon={<FiRefreshCw />}
                  size="sm"
                  variant="ghost"
                  onClick={handleRefresh}
                  isLoading={isRefreshing}
                  aria-label="Refresh suggestions"
                />
              </Flex>

              <Divider mb={4} />

              <SimpleGrid columns={1} spacing={3}>
                {isLoading
                  ? Array(3)
                      .fill(0)
                      .map((_, idx) => (
                        <Flex key={idx} align="center" p={2}>
                          <SkeletonCircle size="10" mr={3} />
                          <SkeletonText noOfLines={2} flex="1" spacing="2" />
                        </Flex>
                      ))
                  : users.slice(0, 5).map((userItem) => (
                      <Box
                        key={userItem.id}
                        p={2}
                        borderRadius="md"
                        _hover={{ bg: hoverBg }}
                        transition="background 0.2s"
                      >
                        <Flex justify="space-between" align="center">
                          <Flex align="center">
                            <Avatar
                              name={userItem.fullName}
                              src={userItem.avatar}
                              size="sm"
                              mr={3}
                            />
                            <Box>
                              <Text fontWeight="600" fontSize="sm">
                                {userItem.fullName}
                              </Text>
                              <Text fontSize="xs" color={subtleText}>
                                @
                                {userItem.username ||
                                  userItem.email.split("@")[0]}
                              </Text>
                            </Box>
                          </Flex>
                          <Button
                            size="xs"
                            variant={
                              followingStatus[userItem.id] ? "outline" : "solid"
                            }
                            colorScheme={
                              followingStatus[userItem.id] ? "gray" : "blue"
                            }
                            leftIcon={
                              followingStatus[userItem.id] ? (
                                <FiUserMinus />
                              ) : (
                                <FiUserPlus />
                              )
                            }
                            onClick={() => handleFollow(userItem.id)}
                          >
                            {followingStatus[userItem.id]
                              ? "Following"
                              : "Follow"}
                          </Button>
                        </Flex>
                      </Box>
                    ))}
              </SimpleGrid>
            </Box>
          </Box>

          {/* Main Content Area */}
          <Box flex={1} maxW={{ base: "100%", md: "480px" }} mx="auto">
            {isLoading ? (
              <Center minH="50vh">
                <VStack spacing={4}>
                  <Spinner
                    size="xl"
                    thickness="4px"
                    color="blue.500"
                    emptyColor="gray.200"
                  />
                  <Text color={subtleText}>Loading your feed...</Text>
                </VStack>
              </Center>
            ) : error ? (
              <Center minH="50vh">
                <VStack spacing={4} textAlign="center" p={4}>
                  <Heading size="md" color="red.500">
                    Error loading data
                  </Heading>
                  <Text color={subtleText}>{error}</Text>
                  <Button
                    colorScheme="blue"
                    onClick={fetchAllData}
                    leftIcon={<FiRefreshCw />}
                  >
                    Retry
                  </Button>
                </VStack>
              </Center>
            ) : posts.length === 0 ? (
              <MotionBox
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Center minH="70vh" p={4}>
                  <VStack spacing={6} textAlign="center">
                    <Image
                      src={svg}
                      h={{ base: "40vh", md: "50vh" }}
                      alt="No posts found"
                      opacity={0.8}
                    />
                    <VStack>
                      <Heading size="lg">Your feed is empty</Heading>
                      <Text color={subtleText} maxW="md">
                        Follow more users or create your first post to get
                        started!
                      </Text>
                      <Button
                        colorScheme="blue"
                        mt={4}
                        onClick={() =>
                          document.getElementById("create-post")?.focus()
                        }
                      >
                        Create Post
                      </Button>
                    </VStack>
                  </VStack>
                </Center>
              </MotionBox>
            ) : (
              <>
                <Flex justify="flex-end" mb={4}>
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<FiRefreshCw />}
                    onClick={handleRefresh}
                    isLoading={isRefreshing}
                  >
                    Refresh Feed
                  </Button>
                </Flex>
                <Posts posts={posts} onPostUpdate={fetchAllData} />
              </>
            )}
          </Box>
        </HStack>
      </Box>
    </>
  );
}

export default Home;
