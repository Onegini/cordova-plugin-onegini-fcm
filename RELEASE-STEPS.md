The following steps must be executed to create a release:

1. Update the release notes
2. Update the version number in the `plugin.xml`
3. Commit & push the version update to GitHub
4. Merge the development branch to master.
5. Remove the Onegini NPM registry from your `~/.npmrc` file. We must release to the public NPM repo and not the Onegini repo.
6. Perform NPM login (`npm login`) with the `onegininpm` account.
7. Publish the NPM package using the tool `np`. execute `np` to trigger an NPM release. In case you are not releasing from master you need to append `--any-branch` to the np command.
8. Draft a new GitHub release
9. Update the version number in the `plugin.xml` and `package.json` files for the next development iteration (bump the version and append `-SNAPSHOT`)
