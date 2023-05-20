# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/engine/reference/builder/

ARG NODE_VERSION=18.16.0
ARG WORKDIR=/app

################################################################################
# Use node image for base image for all stages
FROM node:${NODE_VERSION}-alpine AS base

# Include the ARG instruction to use the argument in this stage
ARG WORKDIR

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

# Set working directory for all build stages
WORKDIR ${WORKDIR}

################################################################################
FROM base AS dev

# Download additional development dependencies before starting in development mode.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

# Copy the source files into the image
COPY . .

# Disable Next.js telemetry data about general usage
ENV NEXT_TELEMETRY_DISABLED 1

# Use development node environment
ENV NODE_ENV development

# Run the application in development mode
CMD npm run dev

################################################################################
# Rebuild the source code only when needed
FROM base AS build

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage bind mounts to package.json and package-lock.json to avoid having to copy them
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# Copy the rest of the source files into the image
COPY . .

# Download additional production dependencies before building.
# https://nextjs.org/docs/messages/sharp-missing-in-production
RUN npm install sharp

# Disable Next.js telemetry data about general usage
ENV NEXT_TELEMETRY_DISABLED 1

# Run the build script
RUN npm run build

################################################################################
# Production image, copy all the files and run next
FROM base AS prod

# Include the ARG instruction to use the argument in this stage
ARG WORKDIR

# Use production node environment
ENV NODE_ENV production

# Disable Next.js telemetry data about general usage
ENV NEXT_TELEMETRY_DISABLED 1

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=build --chown=node:node ${WORKDIR}/.next/standalone ./
COPY --from=build --chown=node:node ${WORKDIR}/.next/static ./.next/static
COPY --from=build ${WORKDIR}/public ./public

# Run the application as a non-root user.
USER node

# Expose the port that the application listens on
EXPOSE 3000

# Run the application
CMD node server.js
