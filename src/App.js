import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Input,
  SkeletonText,
  Text,
} from "@chakra-ui/react";
import { FaLocationArrow, FaTimes } from "react-icons/fa";

import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useRef, useState } from "react";

const center = { lat: 48.8584, lng: 2.2945 };

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAolXVBph__8LXk-JukgnxDUI4LPDQAsxQ",
    libraries: ["places"],
  });

  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef();
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destiantionRef = useRef();

  if (!isLoaded) {
    return <SkeletonText />;
  }

  async function calculateRoute() {
    if (originRef.current.value === "" || destiantionRef.current.value === "") {
      return;
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destiantionRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    originRef.current.value = "";
    destiantionRef.current.value = "";
  }

  return (
    <Flex
      position="relative"
      flexDirection="column"
      alignItems="center"
      h="100vh"
      w="100%"
    >
      <div class="container">
        <header class="head">
          <nav class="navbar navbar-expand-lg navbar-light custom-nav">
            <a class="navbar-brand d-flex align-items-center" href="#">
              <span>
                <img src="Graviti Logo.webp" alt="" />
              </span>
            </a>
          </nav>
        </header>
      </div>
      <Flex>
        <Box
          borderRadius="lg"
          m={16}
          bgColor="white"
          shadow="base"
          minW="100vh"
          zIndex="1"
          position="absolute"
          left={0}
          p={16}
        >
          <HStack spacing={2} justifyContent="space-between">
            <Box flexGrow={1} mt={4}>
              <h6>Origin</h6>
              <Autocomplete>
                <Input
                  mt={2}
                  type="text"
                  placeholder="Select"
                  ref={originRef}
                />
              </Autocomplete>
            </Box>
          </HStack>
          <HStack spacing={2} justifyContent="space-between">
            <Box flexGrow={1} mt={4}>
              <h6>Destination</h6>
              <Autocomplete>
                <Input
                  mt={2}
                  type="text"
                  placeholder="Select"
                  ref={destiantionRef}
                />
              </Autocomplete>
            </Box>
          </HStack>
          <HStack>
            <ButtonGroup mt={4}>
              <Button borderRadius={20} colorScheme="blue" type="submit" onClick={calculateRoute}>
                Calculate Route
              </Button>
              <IconButton
                aria-label="center back"
                icon={<FaTimes />}
                onClick={clearRoute}
              />
            </ButtonGroup>
          </HStack>
          <HStack spacing={4} mt={2} justifyContent="space-between">
            <Text>Distance: {distance}
            </Text>
            <Text>Duration: {duration}
            </Text>
            <IconButton
              aria-label="center back"
              icon={<FaLocationArrow />}
              isRound
              onClick={() => {
                map.panTo(center);
                map.setZoom(15);
              }}
            />
          </HStack>
        </Box>
        <Box position="absolute" right={0} p={16} h="100%" w="50%">
          {/* Google Map Box */}
          <GoogleMap
            center={center}
            zoom={15}
            mapContainerStyle={{ width: "100%", height: "100%" }}
            options={{
              zoomControl: false,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
            onLoad={(map) => setMap(map)}
          >
            <Marker position={center} />
            {directionsResponse && (
              <DirectionsRenderer directions={directionsResponse} />
            )}
          </GoogleMap>
        </Box>
      </Flex>
    </Flex>
  );
}

export default App;
