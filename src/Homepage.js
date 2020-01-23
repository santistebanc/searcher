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
      searcherInstance.search(val, 50).then(res => setSuggestions(res));
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
        <Box flex={1} width={7 / 10}>
          <Input value={searchInput} onChange={handleInputChange} />
        </Box>
        <Input
          variant="button"
          flexShrink={1}
          flexBasis="2em"
          minWidth="auto"
          type="submit"
          value="Search"
          backgroundColor="primary"
        />
      </Flex>
      <Flex flexDirection="column">
        {suggestions.map((suggestion, i) => (
          <Text key={i}>{suggestion.text}</Text>
        ))}
      </Flex>
    </Box>
  );
};
