import React, { useContext } from "react";
import {
  Card,
  CardHeader,
  Box,
  Flex,
  Avatar,
  Heading,
  Text,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  IconButton,
  useToast,
  Badge,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDownIcon, SettingsIcon } from "@chakra-ui/icons";
import AuthContext from "../context/AuthContext";

function ProfileCard({ userName, userImage, userId }) {
  const { logout } = useContext(AuthContext);
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    navigate("/login");
  };

  const handleProfileClick = () => {
    navigate(`/profile/${userId}`);
  };

  return (
    <Flex
      position={{ base: "relative", xl: "fixed" }}
      alignItems={{ base: "center", xl: "flex-end" }}
      justifyContent={{ base: "center", xl: "flex-end" }}
      width={"100%"}
      right={{ xl: 12 }}
      top={{ base: 4, xl: 12 }}
      zIndex={1}
    >
      <Card
        w={{ base: "md", xl: "sm" }}
        boxShadow="lg"
        borderRadius="xl"
        bg="whiteAlpha.900"
      >
        <CardHeader>
          <HStack justifyContent={"space-between"} alignItems={"center"}>
            <Flex
              gap="4"
              alignItems="center"
              cursor="pointer"
              onClick={handleProfileClick}
            >
              <Avatar
                name={userName}
                src={userImage}
                size="md"
                border="2px solid"
                borderColor="blue.400"
              />
              <Box>
                <Text fontSize="sm" color="gray.500">
                  Logged in as:
                </Text>
                <Heading size="sm">{userName}</Heading>
                <Badge colorScheme="green" fontSize="0.6em">
                  Online
                </Badge>
              </Box>
            </Flex>

            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<ChevronDownIcon />}
                variant="ghost"
                colorScheme="blue"
              />
              <MenuList>
                <MenuItem
                  icon={<SettingsIcon />}
                  onClick={() => navigate("/settings")}
                >
                  Settings
                </MenuItem>
                <MenuItem onClick={() => navigate(`/profile/${userId}`)}>
                  My Profile
                </MenuItem>
                <MenuDivider />
                <MenuItem color="red.500" onClick={handleLogout}>
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </CardHeader>
      </Card>
    </Flex>
  );
}

export default ProfileCard;
