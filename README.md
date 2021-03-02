# fndr-web

Web interface for [`fndr`](https://github.com/whatl3y/fndr) to manage your accounts stored in the [Jupiter blockchain](https://gojupiter.tech/) in a browser instead of the CLI.

Today we only support the Jupiter connector with this UI, but will support others down the road.

## Requirements

- [Docker and Docker Compose](https://docs.docker.com/get-docker/)
- [Node.js](https://nodejs.org/en/) LTS (_only if you're doing development_)

## Install & Run

If the container starts up as expected, you should be able to access the web server in a browser at `http://localhost:8000`

```sh
$ git clone https://github.com/whatl3y/fndr-web
$ cd fndr-web
$ npm install
$
$ # run tests
$ npm test
$
$ # build app (also runs after making changes to source code)
$ npm run build
$
$ # file required to exist at a minimum, see below for more information
$ cp .env_sample .env
$
$ # run containers with mapped volumes to your local machine so you can
$ # see changes to your app without rebuilding the container each change.
$ docker-compose -f docker-compose.dev.yml up
```

## Environment Variables

You can add/update variables to your `.env` that you created before to setup some runtime configuration to use in your app. Most should be relatively intuitive as their name suggests, but if not let us know and we can add additional documentation here.

## Deploy

There's a `Dockerfile` to allow you to build the container and deploy in any infrastructure or orchestration engine you'd like to use. However, for a really simple deployment that isn't supporting tons of users, you can just deploy using the normal docker compose config.

The `docker-compose.dev.yml` config used above maps your local machine's file system build folder to a volume in the container to ease development when making changes. It also starts the app using nodemon to listen for file changes to also make development easier. If you want to deploy `fndr-web` to production/a public URL, it's recommended to use the normal `docker-compose.yml` configuration to ensure the build and execution is entirely inside the container.

```sh
$ # no need to specify a file w/ `-f` since docker-compose.yml is the default
$ docker-compose up
```

## fndr Config Import

With `fndr` in the CLI, you can run `$ fndr file` to get the location of your configuration for the current connector. Assuming you're already using the `jupiter` connector, you can upload this file to the UI on initial app load and start managing the same accounts you're already managing from the CLI interface in this web interface.

## Development

I'd love for you to contribute to the project! Use the steps above to pull down the source code, build, and run, and feel free to create PRs as you'd like.

All PRs need to passing tests for additions to and changes to existing code.

# Tips w/ cryptocurrency

I love FOSS (free and open source software) and for the most part don't want to charge for the software I build. It does however take a good bit of time keeping up with feature requests and bug fixes, so if you have the desire and ability to send me a free coffee, it would be greatly appreciated!

- Bitcoin (BTC): `3D779dP5SZo4szHivWHyFd6J2ESumwDmph`
- Ethereum (ETH and ERC-20 tokens): `0xF3ffa9706b3264EDd1DAa93D5F5D70C8f71fAc99`
- Stellar (XLM): `GACH6YMYFZ574FSGCV7IJXTGETEQL3DLQK64Z6DFGD57PZL5RH6LYOJT`
- Jupiter (JUP) mainnet: `JUP-TUWZ-4B8Z-9REP-2YVH5`
