FROM node:18-alpine as builder

ENV NODE_OPTIONS="--max_old_space_size=4096"

WORKDIR /build
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn
RUN yarn set version 4.3.1
RUN yarn install

COPY . .

ARG VITE_ENV
ARG VITE_API_URL
ARG VITE_VOTING_API_URL
ARG VITE_IPFS_NODE_URL
ARG VITE_IPFS_UPLOAD_URL
ARG VITE_APP_HOST_URL
ARG VITE_POLL_APP_URL
ARG VITE_RARIME_EXTERNAL_BASE_URL
ARG VITE_PROPOSAL_STATE_CONTRACT
ARG VITE_BIO_PASSPORT_VOTING_CONTRACT
ARG VITE_ID_CARD_VOTING_CONTRACT
ARG VITE_REOWN_ID

RUN yarn build

FROM nginx:1.20.2-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /build/dist /usr/share/nginx/html
