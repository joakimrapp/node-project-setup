module.exports = ( relativetestspath ) => {
	const path = require( 'path' );
	const callerpath = path.resolve( require( 'stack-trace' ).get()[ 1 ].getFileName() );
	const projectpath = path.resolve( process.mainModule.paths.slice( -2, -1 ).pop() );
	const testspath = path.resolve( projectpath, relativetestspath );
	const relativepath = callerpath.replace( testspath, '.' ).replace( '.test.js', '' ).replace( /\\/g, '/' );
	const required = require( path.resolve( projectpath, relativepath ) );
	return ( setup = () => {} ) => {
		const assert = require( 'assert' );
		let data;
		before( () => Promise.resolve( setup( required ) ).then( ( result ) => ( data = result ) ) );
		const recursive = ( tests ) => tests.forEach( ( { title, tests, test, extra } ) => tests ?
			( extra ? describe[ extra ] : describe )( title, () => recursive( tests ) ) :
			( extra ? it[ extra ] : it )( title, () => Promise.resolve( test( assert, required, data ) ) ) );
		const pub = ( tests = [], ptr = [] ) => ( {
			describe: new Proxy( ( extra, arr = [] ) => ( title ) => pub( arr, [ ...ptr, tests.concat( { title, tests: arr, extra } ) ] ),
				{ get: ( target, extra ) => target( extra ), apply: ( target, thisArg, args ) => target()( ...args ) } ),
			it: new Proxy( ( extra ) => ( title, test ) => {
				tests.push( { title, test, extra } );
				return pub( tests, ptr );
			}, { get: ( target, extra ) => target( extra ), apply: ( target, thisArg, args ) => target()( ...args ) } ),
			done: () => ptr.length ? pub( ptr.pop(), ptr ) : describe( `file: ${relativepath}`, () => recursive( tests ) )
		} );
		return pub();
	};
};
