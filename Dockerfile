FROM docker.io/library/node:lts-alpine AS build
WORKDIR /app

# Install Dependencies
COPY src/package.json src/package-lock.json ./
RUN npm install

# Copy Project
COPY src ./

# Build the `monitor.ts`
RUN npm run build:monitor

# Build
RUN npm run build

# Copy build result to a new image.
# This saves a lot of disk space.
FROM docker.io/library/node:lts-alpine AS production
WORKDIR /app

# Copy build
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output#automatically-copying-traced-files
COPY --from=build /app/.next/standalone/ /app/
COPY --from=build /app/.next/static/ /app/.next/static/
COPY --from=build /app/public/ /app/public/

# Copy `monitor.js`
COPY --from=build /app/build /app/

# Install Linux packages
RUN apk add --no-cache \
    dpkg \
    dumb-init \
    iptables \
    ip6tables \
    kmod \
    iptables-legacy \
    wireguard-tools

# Use iptables-legacy
RUN update-alternatives --install /usr/sbin/iptables iptables /usr/sbin/iptables-legacy 10 --slave /usr/sbin/iptables-restore iptables-restore /usr/sbin/iptables-legacy-restore --slave /usr/sbin/iptables-save iptables-save /usr/sbin/iptables-legacy-save
RUN update-alternatives --install /usr/sbin/ip6tables ip6tables /usr/sbin/ip6tables-legacy 10 --slave /usr/sbin/ip6tables-restore ip6tables-restore /usr/sbin/ip6tables-legacy-restore --slave /usr/sbin/ip6tables-save ip6tables-save /usr/sbin/ip6tables-legacy-save

# Run Web UI
ENTRYPOINT ["dumb-init", "--"]
CMD ["/bin/sh", "-c", "node server.js & node monitor.js & wait"]