#!/usr/bin/env node

const path = require("path");
const fs = require("fs-extra");
const yargs = require("yargs");
const execa = require("execa");

const Mustache = require("mustache");
const Listr = require("listr");
const prompts = require("prompts");

const app = {
  name: "create-typescript-app",
  version: "1.0.0-beta.1",
  repo_url: "https://github.com/Template-generator/create-typescript-app",
  developer: "Kamontat Chantrachirathumrong <kamontat_c@hotmail.com>",
  when: +new Date()
};

const argv = yargs
  .scriptName(app.name)
  .version(app.version)
  .strict()
  .command("$0 <app-name...>", `Create typescript application.`, yargs => {
    return yargs
      .option("to-dir", { alias: "P", desc: "Instead of create in current folder, use this.", type: "string" })
      .option("space-replace", { desc: "this replacement will replace spaces", default: "-" })
      .option("current", { alias: "C", desc: "Create application to current folder", type: "string" })
      .positional("app-name", { desc: "Application name, can be capital, and space name", type: "string" });
  })
  .epilogue(`Copyright 2018 by ${app.developer} (${app.repo_url})`).argv;

const fixture = fs.realpathSync(path.join(__dirname, "fixtures"));
const rootpath = argv.toDir || ".";

const name = argv.appName.join(" ");
const filename = name.replace(" ", argv.spaceReplace).toLowerCase();

const filepath = argv.current ? rootpath : path.join(rootpath, filename);

(async () => {
  const response = await prompts(
    [
      {
        type: "text",
        name: "name",
        message: "Application name",
        initial: filename
      },
      {
        type: "text",
        name: "version",
        message: "Application version",
        initial: "1.0.0"
      },
      {
        type: "text",
        name: "description",
        message: "Application description"
      },
      {
        type: "text",
        name: "filename",
        message: "Application file name",
        initial: filename
      },
      {
        type: "text",
        name: "repository_url",
        message: "Repository url",
        initial: ""
      },
      {
        type: "text",
        name: "author_name",
        message: "Author name"
      },
      {
        type: "text",
        name: "author_surname",
        message: "Author surname"
      },
      {
        type: "text",
        name: "author_email",
        message: "Author email"
      },
      {
        type: "toggle",
        name: "git",
        message: "Do you want git init?",
        initial: true,
        active: "yes",
        inactive: "no"
      },
      {
        type: "toggle",
        name: "yarn",
        message: "Do you want run yarn install?",
        initial: true,
        active: "yes",
        inactive: "no"
      }
    ],
    {
      onCancel: () => {
        console.log("You cancel prompt commands");

        process.exit(1);
      }
    }
  );

  const progress = new Listr();

  progress.add({
    title: `Creating folder at ${filepath}`,
    task: async () => {
      await fs.copy(fixture, filepath);
    }
  });

  progress.add({
    title: "Compiling Package json",
    task: async ctx => {
      const pjson = path.join(filepath, "package.json");
      if (!ctx.content) ctx.content = {};
      if (!ctx.path) ctx.path = {};

      const content = await fs.readFile(pjson);
      ctx.path.pjson = pjson;
      ctx.content.pjson = content.toString();
    }
  });

  progress.add({
    title: "Compiling Webpack",
    task: async ctx => {
      const webpack = path.join(filepath, "webpack.config.js");
      if (!ctx.content) ctx.content = {};
      if (!ctx.path) ctx.path = {};

      const content = await fs.readFile(webpack);
      ctx.path.webpack = webpack;
      ctx.content.webpack = content.toString();
    }
  });

  progress.add({
    title: "Update package.json file",
    task: ctx => {
      const finalPjson = Mustache.render(ctx.content.pjson, ctx.data);
      return fs.outputFile(ctx.path.pjson, finalPjson);
    }
  });

  progress.add({
    title: "Update webpack.config.js file",
    task: ctx => {
      const finalWebpack = Mustache.render(ctx.content.webpack, ctx.data);
      return fs.outputFile(ctx.path.webpack, finalWebpack);
    }
  });

  progress.add({
    title: "Install git command to folder",
    enabled: ctx => ctx.data.git === true,
    task: () => execa("git", ["init", filepath])
  });

  progress.add({
    title: "Install dependencies by yarn",
    enabled: ctx => ctx.data.yarn === true,
    task: () => execa("yarn", ["install", "--cwd", filepath])
  });

  const data = {
    realname: name,
    name: response.name,
    version: response.version,
    description: response.description,
    filename: response.filename,
    repository_url: response.repository_url,
    author: {
      name: response.author_name,
      surname: response.author_surname,
      email: response.author_email
    },
    git: response.git,
    yarn: response.yarn,
    app: app
  };

  progress.run({
    data: data
  });
})();
