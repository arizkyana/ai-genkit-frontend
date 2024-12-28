import { Box, TextField, colors } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { AITheme } from "./providers/AITheme";
import styled from "@emotion/styled";

import axios from "axios";
import { ChangeEvent, FormEvent, useCallback, useState } from "react";

const StyledBox = styled(Box)`
  & {
    /* background-color: ${colors.grey[100]}; */
    max-width: 600px;
    margin: 0 auto;
    height: 100vh;
    position: relative;

    display: flex;
    flex-direction: column;
  }
`;

const App = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [text, setText] = useState<string>();
  const [textHistory, setTextHistory] = useState<string[]>([]);
  const [result, setResult] = useState<string[]>([]);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (text) {
        setTextHistory([...textHistory, text]);
      }

      try {
        setLoading(true);
        const response = await axios.post("http://localhost:3000/ai/text", {
          text,
        });
        setResult([...result, response.data.data]);
      } catch (error) {
      } finally {
        setLoading(false);
        setText("");
      }
    },
    [text]
  );

  const handleChangeMessage = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setText(value);
    },
    []
  );

  return (
    <AITheme>
      <StyledBox>
        <Box
          flex={1}
          p={3}
          sx={{
            overflowY: "scroll",
            overflowX: "hidden",
          }}
        >
          {textHistory?.map((item) => (
            <Box
              color={colors.brown[800]}
              bgcolor={colors.grey[100]}
              p={2}
              maxWidth={"max-content"}
              display={"inline-block"}
              borderRadius={2}
              mb={2}
            >
              {item}
            </Box>
          ))}
          {result?.map((item) => (
            <Box
              color={colors.brown[800]}
              bgcolor={"#fff"}
              p={2}
              maxWidth={"max-content"}
              display={"inline-block"}
              borderRadius={2}
              mb={2}
            >
              {item}
            </Box>
          ))}
        </Box>
        <Box
          component={"form"}
          onSubmit={handleSubmit}
          sx={{
            py: 3,
            background: "#fff",
            borderRadius: 3,
          }}
        >
          <TextField
            id="outlined-multiline-static"
            label="Message"
            multiline
            rows={4}
            sx={{
              width: "100%",
            }}
            onChange={handleChangeMessage}
            value={text}
          />
          <Box
            py={2}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <LoadingButton
              disableElevation
              loading={loading}
              type="submit"
              variant="contained"
            >
              Submit
            </LoadingButton>
          </Box>
        </Box>
      </StyledBox>
    </AITheme>
  );
};

export default App;
