/*
 * Copyright by LunaSec (owned by Refinery Labs, Inc)
 *
 * Licensed under the Business Source License v1.1
 * (the "License"); you may not use this file except in compliance with the
 * License. You may obtain a copy of the License at
 *
 * https://github.com/lunasec-io/lunasec/blob/master/licenses/BSL-LunaTrace.txt
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import {
  Github_Repositories_Constraint,
  Github_Repositories_On_Conflict,
  Github_Repositories_Update_Column,
  Organizations_Insert_Input,
  Projects_Constraint,
  Projects_Insert_Input,
  Projects_On_Conflict,
  Projects_Update_Column,
} from '../hasura-api/generated';
import { ListReposAccessibleToInstallationResponseType } from '../types/github';

export type OrganizationInputLookup = Record<string, Organizations_Insert_Input>;

function getExistingProjects(orgLookup: OrganizationInputLookup, orgName: string) {
  const existingOrg = orgLookup[orgName];
  if (!existingOrg || !existingOrg.projects) {
    return [];
  }
  return existingOrg.projects.data;
}

export function lunatraceOrgsFromGithubOrgs(
  installationId: number,
  installationData: ListReposAccessibleToInstallationResponseType
): OrganizationInputLookup {
  const {
    data: { repositories },
  } = installationData;

  console.log(`[installId: ${installationId}] Collected installation data: ${repositories.map((repo) => repo.name)}`);

  return repositories.reduce((orgLookup, repo) => {
    const orgName = repo.owner.login;
    const organizationId = repo.owner.id;
    const repoName = repo.name;
    const repoId = repo.id;
    const gitUrl = repo.git_url;
    const gitOwnerType = repo.owner.type;

    const repoOnConflict: Github_Repositories_On_Conflict = {
      constraint: Github_Repositories_Constraint.GithubRepositoriesGithubIdKey,
      update_columns: [Github_Repositories_Update_Column.GitUrl, Github_Repositories_Update_Column.ApiResponse],
    };

    const project: Projects_Insert_Input = {
      name: repoName,
      github_repositories: {
        data: [
          {
            github_id: repoId,
            git_url: gitUrl,
            api_response: repo,
          },
        ],
        on_conflict: repoOnConflict,
      },
    };

    const projectOnConflict: Projects_On_Conflict = {
      constraint: Projects_Constraint.ProjectsNameOrganizationIdKey,
      update_columns: [Projects_Update_Column.Repo],
    };

    const orgData: Organizations_Insert_Input = {
      name: orgName,
      installation_id: installationId,
      github_id: organizationId,
      github_owner_type: gitOwnerType,
      projects: {
        data: [...getExistingProjects(orgLookup, orgName), project],
        on_conflict: projectOnConflict,
      },
    };

    return {
      ...orgLookup,
      [orgName]: orgData,
    };
  }, {} as OrganizationInputLookup);
}
