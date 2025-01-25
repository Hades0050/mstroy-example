FROM node:22.10.0-alpine3.20 AS installer
WORKDIR /app
ENV GENERATE_SOURCEMAP=false
COPY ["package.json","yarn.lock","./"]
RUN ["yarn", "install"]
COPY . .
RUN ["yarn", "run","build"]
COPY . .


FROM nginx:stable-alpine AS release
COPY --from=installer /app/dist /usr/share/nginx/html
EXPOSE 80
ENTRYPOINT ["nginx","-g","daemon off;"]




