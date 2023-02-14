
/* IMPORT */

import {SUPPORTS_SYMBOLS_AS_WEAKSET_KEYS} from './constants';

/* IMPORT */

const isWeakReferrable = ( value: unknown ): value is object => {

  if ( value === null ) return false;

  const type = typeof value;

  return type === 'object' || type === 'function' || ( SUPPORTS_SYMBOLS_AS_WEAKSET_KEYS && type === 'symbol' );

};

/* EXPORT */

export {isWeakReferrable};
