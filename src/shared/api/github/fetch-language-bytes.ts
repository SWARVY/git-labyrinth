import { Octokit } from "octokit";

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

  const { user } = await octokit.graphql<GraphQLResponse>(LANGUAGE_BYTES_QUERY, { login });

  const langBytes = new Map<string, number>();

  for (const repo of user.repositories.nodes) {
    for (const edge of repo.languages.edges) {
      const name = edge.node.name;
      langBytes.set(name, (langBytes.get(name) ?? 0) + edge.size);
    }
  }

  return Object.fromEntries(langBytes);
}
