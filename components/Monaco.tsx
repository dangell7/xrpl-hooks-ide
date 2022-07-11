import Editor, { loader, EditorProps, Monaco } from "@monaco-editor/react";
import type monaco from "monaco-editor";
import { useTheme } from "next-themes";
import { FC, MutableRefObject, ReactNode } from "react";
import { Flex } from ".";
import dark from "../theme/editor/amy.json";
import light from "../theme/editor/xcode_default.json";

export type MonacoProps = EditorProps & {
  id?: string;
  rootProps?: object;
  overlay?: ReactNode;
  editorRef?: MutableRefObject<monaco.editor.IStandaloneCodeEditor>;
  monacoRef?: MutableRefObject<typeof monaco>;
};

loader.config({
  paths: {
    vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.30.1/min/vs",
  },
});

const Monaco: FC<MonacoProps> = ({
  id,
  path = `file:///${id}`,
  className = id,
  language = "json",
  overlay,
  editorRef,
  monacoRef,
  beforeMount,
  rootProps,
  ...rest
}) => {
  const { theme } = useTheme();
  const setTheme = (monaco: Monaco) => {
    monaco.editor.defineTheme("dark", dark as any);
    monaco.editor.defineTheme("light", light as any);
  };
  return (
    <Flex fluid column style={{ position: "relative" }} {...rootProps}>
      <Editor
        className={className}
        language={language}
        path={path}
        beforeMount={monaco => {
          beforeMount?.(monaco);

          setTheme(monaco);
        }}
        theme={theme === "dark" ? "dark" : "light"}
        {...rest}
      />
      {overlay && (
        <Flex css={{ position: "absolute", bottom: 0, right: 0 }}>
          {overlay}
        </Flex>
      )}
    </Flex>
  );
};

export default Monaco;
