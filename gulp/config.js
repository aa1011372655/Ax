'use strict';

const path = require("path");

// base dir name
const base = "docs/app";

const config = {};

config.path = {
	base : path.resolve('./')+'/',
	pub  : path.resolve('./')+'/dest/',
	dest : path.resolve('./')+'/docs/',
	js   : path.resolve('./')+'/'+base+"",
	css  : path.resolve('./')+'/'+base+"/styles/",
	jsl  : path.resolve('./')+'/'+base+"/scripts/libs/",
	tmp  : path.resolve('./')+'/tmp/'
};

config.filter = {
	js : [
		"**/*.js",
		"!**/require*.js"
	]
};

config.rjs = {
	appDir : config.path.js,
	baseUrl: './',
	dir : config.path.tmp,

	paths:{
		"text":"scripts/plugins/require-text.min",

		"route" : "route",
		"struct":"scripts/libs/struct.min",
		"aix":"scripts/libs/aix.min",

		"sh_main":"scripts/libs/sh_main.min",
		"sh_js":"scripts/libs/sh_javascript.min"
	},

	shim : {
		aix : {
			deps : ["struct"],
			exports : "aix"
		},
		sh_js : {
			deps : ["sh_main"]
		},
	},

	modules :[
	  {
      name: "route",
      include : [
				'aix',
				'struct',
				'text',
				'sh_main',
				'sh_js'
      ]
    }
	],

	optimize : "none",
	// optimize : "uglify2",
	useStrict : true
};

config.eslintConfig = {
	parserOptions:{
		ecmaVersion : 5
	},
	rules: {
		'strict': 2,
		'no-proto': 2,
		'no-new-wrappers' : 2
	},
	globals: [
		'struct',
		'requirejs',
		'define',
		'require',
		'module'
	],
	env:{
		browser : true
	}
};

config.result = (result) =>{
	// Called for each ESLint result. 
	if(result.errorCount){
	  console.log(`ESLint result: ${result.filePath}`);
	  console.log((`# Errors: ${result.errorCount}`).red);
	  for(let i=0,msg; i<result.messages.length;i++){
	    msg = result.messages[i];
	    console.log((`   Line:${msg.line}   Column: ${msg.column}`).yellow);
	    console.log((` - ${msg.message}`).red);
	  }
	}
};

module.exports = config;