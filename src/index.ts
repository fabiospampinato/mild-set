
/* IMPORT */

import {isWeakReferrable} from './utils';

/* MAIN */

class MildSet<V> {

  /* VARIABLES */

  #strong = new Set<V> ();
  #weak = new WeakSet<any> ();

  /* CONSTRUCTOR */

  constructor ( entries?: readonly V[] | null ) {

    if ( entries ) {

      for ( const value of entries ) {

        this.add ( value );

      }

    }

  }

  /* API */

  add ( value: V ): this {

    if ( isWeakReferrable ( value ) ) {

      this.#weak.add ( value );

    } else {

      this.#strong.add ( value );

    }

    return this;

  }

  delete ( value: V ): boolean {

    if ( isWeakReferrable ( value ) ) {

      return this.#weak.delete ( value );

    } else {

      return this.#strong.delete ( value );

    }

  }

  has ( value: V ): boolean {

    if ( isWeakReferrable ( value ) ) {

      return this.#weak.has ( value );

    } else {

      return this.#strong.has ( value );

    }

  }

}

/* EXPORT */

export default MildSet;
