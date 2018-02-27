# typesmith-testing

This repository holds some pipelines for [typesmith](http://www.github.com/bbor/typesmith). They're intended as testbeds for use in developing typesmith and [mixtape](http://www.github.com/bbor/mixtape).
You can try them out yourself, or use them as examples to see different ways you can set up a typesmith pipeline.

## Get set up

Eventually, all these modules will move to `npm`, so getting set up to run the pipelines will be as easy as running `npm install`.

For now, you have to:

1.  Install node.js and npm.

1.  Clone this repository. Open a command prompt in the root of this repository, and run `npm install` to install its dependencies.

1.  Repeat the previous step for the `typesmith` repository, for the repository of each typesmith plugin you want to use, and for the `mixtape` repository.

1.  Open a command prompt at the root of this `typesmith-testing` repository. Use `npm link` to create a link to the `typesmith` repository and to each other typesmith plugin. For example:

    ```
    > npm link ../typesmith
    > npm link ../typesmith-read-json
    ...
    ```

1.  Go to the `typesmith-mixdown` repository, and use `npm link` to create a link from there to the `mixtape` repository. For example:

    ```
    > npm link ../mixtape
    ```

Now you should be able to run the test pipelines.

## Run a pipeline

Each pipeline has its own script under `./lib`. You can call `node.js` to run each on on its own -- for example:

```
> node ./lib/typesmith-testing-nodejs.js
```

Or, you can use one of the `.bat` scripts at the root of this repository.

-   `nodejs` pipeline: This pipeline gets the JSON version of the nodejs documentation, adds its data to the typesmith database, makes a few minor alterations, and calls `mixtape` to generate output. You can see a sample of the output [here](http://bbor.github.io/mixtape/demo-nodejs/misc_About_this_Documentation.html).

-	`webster` pipeline: This pipeline uses the text of Noah Webster's Unabridged English Dictionary from the Gutenberg Project. The typeahead search and toc work with over 100,000 word records! (Flexible sorting is yet to come. :)

-   `lua` and `flow` pipelines: These pipelines run the documentation for the Stingray Lua API and the Flow visual programming nodes through `mixtape`. (In progress).

