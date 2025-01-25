import { Button, Container, Flex, HStack, Link, Text } from '@chakra-ui/react';
import { ColorModeButton } from './ui/color-mode';

const navbar = () => {
  return (
    <Container maxW={"90vw"} px={4} paddingTop={"2vh"}>
        <Flex
        h={16}
        alignItems={"center"}
        justifyContent={"space-between"}
        flexDir={{
            base:"column",
            sm:"row"
        }}
        >
        <Text
        fontSize={{ base: "22", sm: "28"}}
        fontWeight={"bold"}
        textTransform={"uppercase"}
        textAlign={"center"}
        color={{base: "black", _dark: "white"}}
        >
        Universitas Gunadarma
        </Text>

        <HStack justifyContent={"space-evenly"} minW={"50%"} hideBelow={"md"} fontWeight={"bold"}>
            <Link href=''>
            <Text color={{base: "black", _dark: "white"}}>Pendaftaran</Text>
            </Link>
            <Link href=''>
            <Text color={{base: "black", _dark: "white"}}>List Mahasiswa</Text>
            </Link>
            <Link href=''>
            <Text color={{base: "black", _dark: "white"}}>Akun</Text>
            </Link>
            <Link href=''>
            <Text color={{base: "black", _dark: "white"}}>Asisten</Text>
            </Link>
        </HStack>

        <HStack alignItems={"center"}>
            {location.pathname !== "/" && ( // Show the Home button only if not on the root route
              <Link href={"/"}>
                <Button bg={"green.400"}>Home</Button>
              </Link>
            )}
            <Link href={"/about"}>
            <Button bg={"purple.400"}>About</Button>
            </Link>
            <ColorModeButton></ColorModeButton>

        </HStack>

        </Flex>
    </Container>
  )
}

export default navbar
