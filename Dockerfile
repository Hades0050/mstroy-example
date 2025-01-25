FROM node:22.10.0-alpine3.20 as installer
WORKDIR /app
# ENV NODE_ENV=production 
ENV GENERATE_SOURCEMAP=false
COPY ["package.json","yarn.lock","./"]
RUN ["yarn", "install"]
COPY . .
RUN ["yarn", "run","build"]
COPY . .


FROM node:22.10-slim
COPY --from=installer  /app /app 
WORKDIR /app 
# EXPOSE 3010:3010
# CMD  ["yarn", "json-server","-h", "10.249.254.8", "-p" ,"3010", "mock/db.json","--static","./dist"]
CMD  ["yarn", "json-server", "mock/db.json","--static","./dist"]


