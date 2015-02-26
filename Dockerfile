# docker logio harvester
FROM node:0.10-onbuild
MAINTAINER Gerome Chardon <gerome.chardon@gmail.com>

ENTRYPOINT ["/usr/src/app/index.js"]
CMD []