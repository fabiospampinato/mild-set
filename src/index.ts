
/* IMPORT */

import {isWeakReferable} from './utils';

/* MAIN */

class MildSet<V> {

  /* VARIABLES */

  #strong = new Set<V> ();
  #weak = new WeakSet<any> ();
  #size = 0;

  #finalizationRegistry = new FinalizationRegistry ( () => this.#size -= 1 );
  #finalizationTokens = new WeakMap<WeakKey, object> ();

  /* CONSTRUCTOR */

  constructor ( entries?: readonly V[] | null ) {

    if ( entries ) {

      for ( const value of entries ) {

        this.add ( value );

      }

    }

  }

  /* GETTER API */

  get size () {

    return this.#size;

  }

  /* API */

  add ( value: V ): this {

    const hasValue = this.has ( value );

    if ( !hasValue ) {

      this.#size += 1;

    }

    if ( isWeakReferable ( value ) ) {

      this.#weak.add ( value );

      if ( !hasValue ) {

        const token = {};

        this.#finalizationRegistry.register ( value, token, token );
        this.#finalizationTokens.set ( value, token );

      }

    } else {

      this.#strong.add ( value );

    }

    return this;

  }

  delete ( value: V ): boolean {

    const hasValue = this.has ( value );

    if ( !hasValue ) return false;

    this.#size -= 1;

    if ( isWeakReferable ( value ) ) {

      const token = this.#finalizationTokens.get ( value );

      if ( token ) {

        this.#finalizationRegistry.unregister ( token );
        this.#finalizationTokens.delete ( value );

      }

      return this.#weak.delete ( value );

    } else {

      return this.#strong.delete ( value );

    }

  }

  has ( value: V ): boolean {

    if ( isWeakReferable ( value ) ) {

      return this.#weak.has ( value );

    } else {

      return this.#strong.has ( value );

    }

  }

}

/* EXPORT */

export default MildSet;
