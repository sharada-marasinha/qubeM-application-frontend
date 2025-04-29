import {
  Box,
  useColorModeValue,
  Stack,
  Button,
  Flex,
  Divider,
  useBreakpointValue,
  Tooltip,
  Icon,
} from "@chakra-ui/react";
import { useContext } from "react";
import {
  BiHome,
  BiSearch,
  BiBell,
  BiEnvelope,
  BiBookmark,
  BiListUl,
  BiUser,
} from "react-icons/bi";
import { RiQuillPenLine } from "react-icons/ri";
import AuthContext from "../context/AuthContext";
import AddPost from "../pages/AddPost";
import NavItem from "./NavItem";

function Nav() {
  const { user } = useContext(AuthContext);
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const navBg = useColorModeValue("white", "gray.800");
  const navBorderColor = useColorModeValue("gray.200", "gray.700");
  const navShadow = useColorModeValue("lg", "dark-lg");

  return (
    <Box
      as="nav"
      position="fixed"
      bottom={{ base: 0, lg: "unset" }}
      left={0}
      right={0}
      top={{ lg: 0 }}
      zIndex="sticky"
      w={{ base: "100%", lg: "72" }}
      px={{ base: 2, lg: 4 }}
      borderTop={{ base: "1px solid", lg: "none" }}
      borderColor={navBorderColor}
      bg={{ base: navBg, lg: "transparent" }}
    >
      <Flex
        direction={{ base: "row", lg: "column" }}
        justify={{ base: "space-around", lg: "flex-start" }}
        align="center"
        h="full"
        maxW={{ lg: "72" }}
        mx="auto"
      >
        {/* Desktop Logo - Top of sidebar */}
        {!isMobile && (
          <Box w="full" px={4} py={6}>
            <Icon as={RiQuillPenLine} boxSize={8} color="blue.500" />
            VERTERA
          </Box>
        )}

        <Stack
          direction={{ base: "row", lg: "column" }}
          spacing={{ base: 0, lg: 2 }}
          w="full"
          px={{ base: 0, lg: 2 }}
        >
          <NavItem
            description={"Home"}
            icon={<BiHome size="24px" />}
            path={"/home"}
            isMobile={isMobile}
          />
          <NavItem
            description={"Explore"}
            icon={<BiSearch size="24px" />}
            path={"/explore"}
            isMobile={isMobile}
          />
          {!isMobile && (
            <>
              <NavItem
                description={"Notifications"}
                icon={<BiBell size="24px" />}
                path={"/notifications"}
                isMobile={isMobile}
              />
              <NavItem
                description={"Messages"}
                icon={<BiEnvelope size="24px" />}
                path={"/messages"}
                isMobile={isMobile}
              />
              <NavItem
                description={"Bookmarks"}
                icon={<BiBookmark size="24px" />}
                path={"/bookmarks"}
                isMobile={isMobile}
              />
              <NavItem
                description={"Lists"}
                icon={<BiListUl size="24px" />}
                path={"/lists"}
                isMobile={isMobile}
              />
            </>
          )}
          <NavItem
            description={"Profile"}
            icon={<BiUser size="24px" />}
            path={`/profile/${user.id}`}
            isMobile={isMobile}
          />

          {!isMobile && (
            <>
              <Divider my={2} opacity={0.5} />
              <AddPost />
            </>
          )}
        </Stack>

        {/* Mobile-only add post button */}
        {isMobile && (
          <Tooltip label="Create post" placement="top" hasArrow>
            <Box
              position="absolute"
              top="-16px"
              left="50%"
              transform="translateX(-50%)"
            >
              <AddPost isMobile />
            </Box>
          </Tooltip>
        )}
      </Flex>
    </Box>
  );
}

export default Nav;
