import dynamic from "next/dynamic";
import { useSnapshot } from "valtio";
import Hotkeys from "react-hot-keys";
import { Play } from "phosphor-react";

import type { NextPage } from "next";
import { compileCode, state } from "../../state";
import Button from "../../components/Button";
import Box from "../../components/Box";

const HooksEditor = dynamic(() => import("../../components/HooksEditor"), {
  ssr: false,
});

const LogBox = dynamic(() => import("../../components/LogBox"), {
  ssr: false,
});

const Home: NextPage = () => {
  const snap = useSnapshot(state);
  return (
    <>
      <main style={{ display: "flex", flex: 1, position: "relative" }}>
        <HooksEditor />
        {snap.files[snap.active]?.name?.split(".")?.[1].toLowerCase() ===
          "c" && (
          <Hotkeys
            keyName="command+b,ctrl+b"
            onKeyDown={() =>
              !snap.compiling && snap.files.length && compileCode(snap.active)
            }
          >
            <Button
              variant="primary"
              uppercase
              disabled={!snap.files.length}
              isLoading={snap.compiling}
              onClick={() => compileCode(snap.active)}
              css={{
                position: "absolute",
                bottom: "$4",
                left: "$4",
                alignItems: "center",
                display: "flex",
                cursor: "pointer",
              }}
            >
              <Play weight="bold" size="16px" />
              Compile to Wasm
            </Button>
          </Hotkeys>
        )}
      </main>
      <Box
        css={{
          display: "flex",
          background: "$mauve1",
          position: "relative",
        }}
      >
        <LogBox
          title="Development Log"
          clearLog={() => (state.logs = [])}
          logs={snap.logs}
        />
      </Box>
    </>
  );
};

export default Home;
