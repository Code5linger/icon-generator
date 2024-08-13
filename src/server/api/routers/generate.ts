import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import OpenAI from "openai";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { env } from "~/env.mjs";

const openai = new OpenAI({
  apiKey: env.DALLE_API_KEY,
});

// DALL-E Api

// image_url = response.data[0].url;

// DALL-E Api

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

      // const chatCompletion = await openai.images.generate({
      //   model: "dall-e-3",
      //   prompt: input.prompt,
      //   n: 1,
      //   size: "1024x1024",
      // });

      const response = await openai.images.generate({
        model: "dall-e-3",
        // prompt: input.prompt,
        prompt: "a white siamese cat",
        n: 1,
        size: "1024x1024",
      });

      const url = response.data[0]?.url;

      return {
        imageUrl: url,
      };
    }),
});
