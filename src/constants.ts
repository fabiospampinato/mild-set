
/* MAIN */

const SUPPORTS_SYMBOLS_AS_WEAKSET_KEYS = ((): boolean => {

  try {

    new WeakSet ().add ( Symbol () );

    return true;

  } catch {

    return false;

  }

})();

/* EXPORT */

export {SUPPORTS_SYMBOLS_AS_WEAKSET_KEYS};
