import type { DockerComposePsResult } from "docker-compose";

export type WORKSPACE = {
    workspace: string,
    readme: string,
    specification: string,
    services: DockerComposePsResult["services"]
}