# fndr-web

Web interface for [`fndr`](https://github.com/whatl3y/fndr) to manage your accounts stored in the [Jupiter blockchain](https://gojupiter.tech/) in a browser instead of the CLI.

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
$ # build app (also run this after making changes to source code)
$ npm run build
$
$ # run containers with mapped volumes to your local machine so you can
$ # see changes to your app without rebuilding the container
$ # each change.
$ docker-compose -f docker-compose.dev.yml up
```

## Development

I'd love for you to contribute to the project! Use the steps below to pull down the source code and build, and feel free to create PRs as you'd like.

All PRs need to passing tests that test any additions or changes to existing code.

# Tips w/ cryptocurrency

I love FOSS (free and open source software) and for the most part don't want to charge for the software I build. It does however take a good bit of time keeping up with feature requests and bug fixes, so if you have the desire and ability to send me a free coffee, it would be greatly appreciated!

- Bitcoin (BTC): `3D779dP5SZo4szHivWHyFd6J2ESumwDmph`
- Ethereum (ETH and ERC-20 tokens): `0xF3ffa9706b3264EDd1DAa93D5F5D70C8f71fAc99`
- Stellar (XLM): `GACH6YMYFZ574FSGCV7IJXTGETEQL3DLQK64Z6DFGD57PZL5RH6LYOJT`
- Jupiter (JUP) mainnet: `JUP-TUWZ-4B8Z-9REP-2YVH5`
