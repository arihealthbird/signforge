# SignForge production image.
#
# Build-time (NEXT_PUBLIC_*) values are inlined into the client bundle, so they
# must be set as ARGs here, not in the running container. Server-only values
# (NOVITA_API_KEY, AI_BASE_URL, AI_MODEL) are read from the environment at
# request time and can be set at runtime.

FROM node:20-alpine AS base
WORKDIR /app

# ---- Build ----
FROM base AS build
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1

# Client-side configuration, baked in at build time.
ARG NEXT_PUBLIC_GIPHY_API_KEY
ARG NEXT_PUBLIC_SCENE_MEDIA_BASE
ENV NEXT_PUBLIC_GIPHY_API_KEY=$NEXT_PUBLIC_GIPHY_API_KEY
ENV NEXT_PUBLIC_SCENE_MEDIA_BASE=$NEXT_PUBLIC_SCENE_MEDIA_BASE

RUN npm run build

# ---- Run ----
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# The full node_modules set is copied so `next start` can load next.config.ts.
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/next.config.ts ./next.config.ts

EXPOSE 3000

CMD ["npm", "run", "start"]
