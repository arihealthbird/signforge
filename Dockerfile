# SignForge production image.
#
# NEXT_PUBLIC_* values are inlined into the client bundle at build time, so they
# are build arguments. Server-only values (THEO_API_KEY, THEO_BASE_URL,
# THEO_MODE) are read from the environment at request time: set them when you
# run the container.

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
COPY --from=build --chown=node:node /app/package.json ./package.json
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/.next ./.next
COPY --from=build --chown=node:node /app/public ./public
COPY --from=build --chown=node:node /app/next.config.ts ./next.config.ts

USER node
EXPOSE 3000

# Run Next directly rather than through npm, so the process receives stop signals.
CMD ["node_modules/.bin/next", "start"]
