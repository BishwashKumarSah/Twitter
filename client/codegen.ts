import type { CodegenConfig } from "@graphql-codegen/cli";

const localhostUri = "http://localhost:8000/graphql";
const AWSHostURL = "https://d9uq3x3zwuy4x.cloudfront.net/";

const config: CodegenConfig = {
  overwrite: true,
  schema: `${localhostUri}`,
  documents: "graphql/**/*.{tsx,ts}",
  generates: {
    "gql/": {
      preset: "client",
      plugins: [],
    },
  },
};

export default config;
