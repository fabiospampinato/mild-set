
/* MAIN */

const isWeakReferable = (() => {

  const SYMBOLS_ARE_WEAK_REFERABLE = (() => { // They weren't supported from the beginning

    try {

      new WeakSet ().add ( Symbol () );

      return true;

    } catch {

      return false;

    }

  })();

  return ( value: unknown ): value is WeakKey => {

    if ( value === null ) return false;

    return typeof value === 'object' || typeof value === 'function' || ( SYMBOLS_ARE_WEAK_REFERABLE && typeof value === 'symbol' && !Symbol.keyFor ( value ) );

  };

})();

/* EXPORT */

export {isWeakReferable};
