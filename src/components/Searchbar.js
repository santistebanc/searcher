import React, { useState, useMemo } from "react";
import { Box, Flex, Text } from "rebass";
import { Input } from "@rebass/forms";
import searcher from "./searcher";

export default () => {
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const searcherInstance = useMemo(() => new searcher(), []);
  const handleInputChange = e => {
    const val = e.target.value;
    setSearchInput(val);
    if (val.length > 0) {
      searcherInstance.search(val, 5).then(res => setSuggestions(res));
    } else {
      searcherInstance.cancel();
    }
  };
  const handleSubmit = async e => {
    e.preventDefault();
  };
  return (
    <Box as="form" onSubmit={handleSubmit}>
      <Flex>
        <Box width={7 / 10}>
          <Input
            sx={{
              width: "100%",
              height: "100%"
            }}
            value={searchInput}
            onChange={handleInputChange}
          />
        </Box>
        <Box width={3 / 10}>
            hu
          <Input
            sx={{
              width: "100%",
              height: "100%"
            }}
            type="submit"
            value="Search"
          />
        </Box>
      </Flex>
      <Flex flexDirection="column">
        {suggestions.map(suggestion => (
          <Text>{suggestion.text}</Text>
        ))}
      </Flex>
    </Box>
  );
};
