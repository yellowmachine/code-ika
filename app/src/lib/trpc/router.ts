// lib/trpc/router.ts
import type { Context } from '$lib/trpc/context';
import { initTRPC } from '@trpc/server';
import {z} from 'zod'
import { getStates, upWorkspace, downWorkspace, saveWorkspace, deleteWorkspace } from '$lib/ika';

export const t = initTRPC.context<Context>().create();

export const router = t.router({
  up: t.procedure.input(
    z.object({workspace: z.string()})
  ).query(async ({ input }) => {
    await upWorkspace(input.workspace)
    const ps = await getStates()
    return {
        success: true,
        data: ps
    };
  }),
  down: t.procedure.input(
    z.object({workspace: z.string()})
  ).query(async ({ input }) => {
    await downWorkspace(input.workspace)
    const ps = await getStates()
    return {
        success: true,
        data: ps
    };
  }),
  delete: t.procedure.input(
    z.object({workspace: z.string()})
  ).query(async ({ input }) => {
    await deleteWorkspace(input.workspace)
    const ps = await getStates()
    return {
        success: true,
        data: ps
    };
  }),
  save: t.procedure.input(
    z.object({workspace: z.string(), readme: z.string(), specification: z.string()})
  ).query(async ({ input }) => {
    await saveWorkspace(input.workspace, input.readme, input.specification)
    const ps = await getStates()
    return {
        success: true,
        data: ps
    };
  })
});

export type Router = typeof router;

