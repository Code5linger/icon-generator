import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import OpenAI from "openai";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { env } from "process";
// API --
const openai = new OpenAI({
  // apiKey: process.env.OPENAI_API_KEY,
  apiKey: env
});

const chatCompletion = await openai.chat.completions.create({
  messages: [{ role: "user", content: "Say this is a test" }],
  model: "gpt-4o-mini",
});

// API --

export const generateRouter = createTRPCRouter({
  generateIcon: protectedProcedure
    .input(
      z.object({
        prompt: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { count } = await ctx.prisma.user.updateMany({
        where: {
          id: ctx.session.user.id,
          credits: {
            gte: 1,
          },
        },
        data: {
          credits: {
            decrement: 1,
          },
        },
      });

      if (count <= 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You do not have enough credits (T_T)",
        });
      }

      return {
        message: "Success",
      };
    }),
});
