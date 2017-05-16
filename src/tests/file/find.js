const path = require( 'path' );
module.exports = ( steps = 1 ) => {
	const callerpath = process.resolve( require( 'stack-trace' ).get()[ 1 + steps ].getFileName() );
	const projectpath = process.resolve( process.mainModule.paths.slice( -2, -1 ) );
	const testpath = path.resolve( projectpath, 'test/file' );
	const relativepath = callerpath.replace( testpath, './' ).replace( '.test.js', '' ).replace( /\\/g, '/' );
};
