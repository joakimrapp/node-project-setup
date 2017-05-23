const path = require( 'path' );
const fs = require( 'fs' );
const packagjsonepath = path.resolve( __dirname, '../../../../../package.json' );
if( fs.existsSync( packagjsonepath ) ) {
	const packagejson = require( packagjsonepath );
	Object.assign( packagejson.scripts, require( '../../config/package.json' ).scripts );
	fs.writeFileSync( packagjsonepath, JSON.stringify( packagejson, undefined, '\t' ), 'utf-8' );
}
