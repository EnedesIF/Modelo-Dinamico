import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "../shared/const";
import { getGroupWorkspace, getOrCreateActivity, getPublicGroupProgress, getTeacherDashboard, registerGroup, saveGroupWorkspace, updateActivity } from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";

const contractSchema = z.object({
  decisionMaker: z.string().min(2).max(180),
  decision: z.string().min(8).max(2000),
  deadline: z.string().min(2).max(180),
  alternatives: z.string().min(8).max(2000),
  criteria: z.string().min(8).max(2000),
  constraints: z.string().min(2).max(2000),
  consequence: z.string().min(8).max(2000),
});
const memberSchema = z.object({ name: z.string().min(3).max(160), email: z.string().email().max(320), phone: z.string().min(8).max(40) });

function toTrpcError(error: unknown) {
  return new TRPCError({ code: "BAD_REQUEST", message: error instanceof Error ? error.message : "Não foi possível concluir esta operação." });
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  collaboration: router({
    activity: publicProcedure.query(async () => getOrCreateActivity()),
    registerGroup: publicProcedure.input(z.object({ name: z.string().min(3).max(120), members: z.array(memberSchema).min(1).max(10) })).mutation(async ({ input }) => {
      try { return await registerGroup(input); } catch (error) { throw toTrpcError(error); }
    }),
    workspace: publicProcedure.input(z.object({ accessCode: z.string().min(8).max(24) })).query(async ({ input }) => {
      try { return await getGroupWorkspace(input.accessCode); } catch (error) { throw toTrpcError(error); }
    }),
    groupProgress: publicProcedure.input(z.object({ accessCode: z.string().min(8).max(24) })).query(async ({ input }) => {
      try { return await getPublicGroupProgress(input.accessCode); } catch (error) { throw toTrpcError(error); }
    }),
    saveWorkspace: publicProcedure.input(z.object({ accessCode: z.string().min(8).max(24), document: z.unknown() })).mutation(async ({ input }) => {
      try { return await saveGroupWorkspace(input.accessCode, input.document as never); } catch (error) { throw toTrpcError(error); }
    }),
    teacherDashboard: protectedProcedure.query(async ({ ctx }) => {
      try { return await getTeacherDashboard(ctx.user.id, ctx.user.role === "admin"); } catch (error) { throw toTrpcError(error); }
    }),
    updateActivity: protectedProcedure.input(z.object({ title: z.string().min(3).max(180), guidelines: z.string().min(8).max(5000), contract: contractSchema, goals: z.array(z.string().min(3).max(240)).length(4), isActive: z.boolean() })).mutation(async ({ ctx, input }) => {
      try { return await updateActivity(ctx.user.id, ctx.user.role === "admin", input); } catch (error) { throw toTrpcError(error); }
    }),
  }),
});

export type AppRouter = typeof appRouter;
