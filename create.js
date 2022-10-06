var fs = require('fs');

var param1 = process.argv[2];
var blockName = process.argv[3];

if (param1 === "block") {

	if (!fs.existsSync("src/twig/blocks")){
    	fs.mkdirSync("src/twig/blocks");
	}
	fs.mkdirSync("src/twig/blocks/"+blockName);
	
	var crFile = "src/twig/blocks/"+blockName+"/"+blockName;


	fs.writeFile(crFile+".scss", "", function(err) {
	    if(err) throw err;
	    console.log(".scss file was created!");
	});

	fs.writeFile(crFile+".twig", "", function(err) {
	    if(err) throw err;
	    console.log(".twig file was created!");
	});


	var addStr = "@import '../../twig/blocks/" + blockName + "/" + blockName + "';";
	fs.appendFileSync('src/scss/connection/_blocks.scss', '\n' + addStr);

}

// > node create.js block