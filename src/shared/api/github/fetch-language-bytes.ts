import { Octokit } from "octokit";
import { getSupportedLanguageKeys } from "@shared/constants/jobs";

const LANGUAGE_BYTES_QUERY = `
  query ($login: String!) {
    user(login: $login) {
      repositories(
        first: 100
        ownerAffiliations: OWNER
        orderBy: { field: UPDATED_AT, direction: DESC }
      ) {
        nodes {
          languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
            edges {
              size
              node { name }
            }
          }
        }
      }
    }
  }
`;

interface GraphQLResponse {
  user: {
    repositories: {
      nodes: Array<{
        languages: {
          edges: Array<{
            size: number;
            node: { name: string };
          }>;
        };
      }>;
    };
  };
}

export async function fetchLanguageBytes(
  accessToken: string,
  login: string,
): Promise<Record<string, number>> {
  const octokit = new Octokit({ auth: accessToken });

  const { user } = await octokit.graphql<GraphQLResponse>(
    LANGUAGE_BYTES_QUERY,
    { login },
  );

  // Map GitHub language names to our job keys
  const LANGUAGE_TO_JOB_KEY: Record<string, string> = {
    TypeScript: "typescript",
    JavaScript: "javascript",
    Python: "python",
    Java: "java",
    Kotlin: "kotlin",
    Swift: "swift",
    "C++": "c++",
    "C#": "csharp",
    Go: "go",
    Rust: "rust",
    PHP: "php",
    Ruby: "ruby",
    // Aliases
    TSX: "typescript",
    JSX: "javascript",
  };

  const supportedKeys = new Set(getSupportedLanguageKeys());
  const langBytes = new Map<string, number>();

  for (const repo of user.repositories.nodes) {
    for (const edge of repo.languages.edges) {
      const jobKey = LANGUAGE_TO_JOB_KEY[edge.node.name];

      // Only include languages that are supported
      if (jobKey && supportedKeys.has(jobKey)) {
        langBytes.set(jobKey, (langBytes.get(jobKey) ?? 0) + edge.size);
      }
    }
  }

  return Object.fromEntries(langBytes);
}
